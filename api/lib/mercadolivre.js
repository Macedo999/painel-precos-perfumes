import crypto from 'node:crypto'

const TOKEN_ENDPOINT = 'https://api.mercadolibre.com/oauth/token'

export function configured() {
  return Boolean(process.env.MERCADO_LIVRE_CLIENT_ID && process.env.MERCADO_LIVRE_CLIENT_SECRET)
}

export function redirectUri(request) {
  if (process.env.MERCADO_LIVRE_REDIRECT_URI) return process.env.MERCADO_LIVRE_REDIRECT_URI
  const host = request.headers['x-forwarded-host'] || request.headers.host
  const protocol = request.headers['x-forwarded-proto'] || 'https'
  return `${protocol}://${host}/api/mercadolivre-callback`
}

export function parseCookies(request) {
  return Object.fromEntries(String(request.headers.cookie || '').split(';').map((part) => {
    const index = part.indexOf('=')
    if (index < 0) return ['', '']
    return [part.slice(0, index).trim(), decodeURIComponent(part.slice(index + 1).trim())]
  }).filter(([key]) => key))
}

export function cookie(name, value, options = {}) {
  const parts = [`${name}=${encodeURIComponent(value)}`, 'Path=/', 'Secure', 'HttpOnly', 'SameSite=Lax']
  if (options.maxAge !== undefined) parts.push(`Max-Age=${options.maxAge}`)
  return parts.join('; ')
}

export function randomState() {
  return crypto.randomBytes(24).toString('hex')
}

export function pkcePair() {
  const verifier = crypto.randomBytes(48).toString('base64url')
  const challenge = crypto.createHash('sha256').update(verifier).digest('base64url')
  return { verifier, challenge }
}

export function setTokenCookies(response, token) {
  const expiresAt = Date.now() + Number(token.expires_in || 21600) * 1000
  response.setHeader('Set-Cookie', [
    cookie('ml_access', token.access_token, { maxAge: Number(token.expires_in || 21600) }),
    cookie('ml_refresh', token.refresh_token, { maxAge: 60 * 60 * 24 * 180 }),
    cookie('ml_expires', String(expiresAt), { maxAge: 60 * 60 * 24 * 180 }),
  ])
}

async function exchange(body) {
  const response = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: { accept: 'application/json', 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(body),
    signal: AbortSignal.timeout(15000),
  })
  const result = await response.json()
  if (!response.ok) throw new Error(result.message || result.error || 'Falha na autorização do Mercado Livre')
  return result
}

export function exchangeAuthorizationCode(code, uri, verifier) {
  const body = {
    grant_type: 'authorization_code',
    client_id: process.env.MERCADO_LIVRE_CLIENT_ID,
    client_secret: process.env.MERCADO_LIVRE_CLIENT_SECRET,
    code,
    redirect_uri: uri,
  }
  if (verifier) body.code_verifier = verifier
  return exchange(body)
}

export async function refreshAccessToken(request, response) {
  const refreshToken = parseCookies(request).ml_refresh
  if (!refreshToken || !configured()) return null
  const token = await exchange({
    grant_type: 'refresh_token',
    client_id: process.env.MERCADO_LIVRE_CLIENT_ID,
    client_secret: process.env.MERCADO_LIVRE_CLIENT_SECRET,
    refresh_token: refreshToken,
  })
  setTokenCookies(response, token)
  return token.access_token
}

export async function validAccessToken(request, response) {
  const cookies = parseCookies(request)
  if (cookies.ml_access && Number(cookies.ml_expires) > Date.now() + 60_000) return cookies.ml_access
  return refreshAccessToken(request, response)
}
