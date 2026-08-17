import { describe, expect, it } from 'vitest'
import type { SourceOffer } from '../types'
import { calculateDifference, isEquivalent } from './matching'

const base: SourceOffer = { id: '1', productName: 'Dior Sauvage EDT', canonicalName: 'Dior Sauvage', volumeMl: 100, supplier: 'A', price: 500, priceBrl: 500, currency: 'BRL', url: '#', updatedAt: '' }

describe('equivalência de ofertas', () => {
  it('aceita nomes normalizados com o mesmo volume', () => expect(isEquivalent(base, { ...base, id: '2', productName: 'Dior Sauvage Eau de Toilette 100ml' })).toBe(true))
  it('rejeita frascos de volumes diferentes', () => expect(isEquivalent(base, { ...base, id: '2', volumeMl: 50 })).toBe(false))
  it('calcula diferença absoluta e percentual', () => expect(calculateDifference(500, 750)).toEqual({ amount: 250, percent: 50 }))
})
