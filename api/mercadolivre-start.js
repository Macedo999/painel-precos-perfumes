import { configured, cookie, pkcePair, randomState, redirectUri } from './lib/mercadolivre.js'

export default function handler(request, response) {
  if (!configured()) return response.redirect(302, '/?ml=missing-config')
  const state = randomState()
  const { verifier, challenge } = pkcePair()
  const uri = redirectUri(request)
  response.setHeader('Set-Cookie', [cookie('ml_state', state, { maxAge: 600 }), cookie('ml_verifier', verifier, { maxAge: 600 })])
  const authorize = new URL('https://auth.mercadolivre.com.br/authorization')
  authorize.searchParams.set('response_type', 'code')
  authorize.searchParams.set('client_id', process.env.MERCADO_LIVRE_CLIENT_ID)
  authorize.searchParams.set('redirect_uri', uri)
  authorize.searchParams.set('state', state)
  authorize.searchParams.set('code_challenge', challenge)
  authorize.searchParams.set('code_challenge_method', 'S256')
  return response.redirect(302, authorize.toString())
}
