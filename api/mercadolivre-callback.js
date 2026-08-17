import { cookie, exchangeAuthorizationCode, parseCookies, redirectUri, setTokenCookies } from './lib/mercadolivre.js'

export default async function handler(request, response) {
  const code = String(request.query.code || '')
  const state = String(request.query.state || '')
  const cookies = parseCookies(request)
  const expectedState = cookies.ml_state
  if (!code || !state || !expectedState || state !== expectedState) {
    console.warn('[mercadolivre-callback] validacao de estado falhou', {
      hasCode: Boolean(code),
      hasState: Boolean(state),
      hasExpectedState: Boolean(expectedState),
      stateMatches: Boolean(state && expectedState && state === expectedState),
    })
    return response.redirect(302, '/?ml=auth-error')
  }
  try {
    const token = await exchangeAuthorizationCode(code, redirectUri(request), cookies.ml_verifier)
    setTokenCookies(response, token)
    const current = response.getHeader('Set-Cookie') || []
    response.setHeader('Set-Cookie', [...current, cookie('ml_state', '', { maxAge: 0 }), cookie('ml_verifier', '', { maxAge: 0 })])
    return response.redirect(302, '/?ml=connected')
  } catch (error) {
    console.error('[mercadolivre-callback] troca de token falhou', {
      message: error instanceof Error ? error.message : String(error),
    })
    return response.redirect(302, '/?ml=auth-error')
  }
}
