import type { Comparison, SourceOffer } from '../types'

const updatedAt = '2026-08-17T13:42:00-03:00'

const ml: SourceOffer[] = [
  { id: 'ml-1', productName: 'Libre EDP Yves Saint Laurent 90ml', canonicalName: 'Yves Saint Laurent Libre', volumeMl: 90, supplier: 'Beleza Premium', price: 829.9, currency: 'BRL', priceBrl: 829.9, url: 'https://lista.mercadolivre.com.br/libre-90ml', updatedAt },
  { id: 'ml-2', productName: 'Perfume YSL Libre Feminino 90 ml', canonicalName: 'Yves Saint Laurent Libre', volumeMl: 90, supplier: 'Maison Beauty', price: 879, currency: 'BRL', priceBrl: 879, url: 'https://lista.mercadolivre.com.br/libre-90ml', updatedAt },
  { id: 'ml-3', productName: 'Yves Saint Laurent Libre Eau de Parfum 90ml', canonicalName: 'Yves Saint Laurent Libre', volumeMl: 90, supplier: 'Época Cosméticos', price: 915.5, currency: 'BRL', priceBrl: 915.5, url: 'https://lista.mercadolivre.com.br/libre-90ml', updatedAt },
  { id: 'ml-4', productName: 'Dior Sauvage EDT 100ml Original', canonicalName: 'Dior Sauvage', volumeMl: 100, supplier: 'Perfume Shop', price: 729.9, currency: 'BRL', priceBrl: 729.9, url: 'https://lista.mercadolivre.com.br/dior-sauvage-100ml', updatedAt },
  { id: 'ml-5', productName: 'Sauvage Dior Masculino 100 ml', canonicalName: 'Dior Sauvage', volumeMl: 100, supplier: 'Fragrance House', price: 789, currency: 'BRL', priceBrl: 789, url: 'https://lista.mercadolivre.com.br/dior-sauvage-100ml', updatedAt },
  { id: 'ml-6', productName: 'Perfume Dior Sauvage Eau de Toilette 100ml', canonicalName: 'Dior Sauvage', volumeMl: 100, supplier: 'Beauty Box', price: 849.9, currency: 'BRL', priceBrl: 849.9, url: 'https://lista.mercadolivre.com.br/dior-sauvage-100ml', updatedAt },
  { id: 'ml-7', productName: 'Good Girl Carolina Herrera 80ml EDP', canonicalName: 'Carolina Herrera Good Girl', volumeMl: 80, supplier: 'Classe A Perfumes', price: 689.9, currency: 'BRL', priceBrl: 689.9, url: 'https://lista.mercadolivre.com.br/good-girl-80ml', updatedAt },
  { id: 'ml-8', productName: 'Carolina Herrera Good Girl 80 ml', canonicalName: 'Carolina Herrera Good Girl', volumeMl: 80, supplier: 'Divina Beleza', price: 749, currency: 'BRL', priceBrl: 749, url: 'https://lista.mercadolivre.com.br/good-girl-80ml', updatedAt },
  { id: 'ml-9', productName: 'Good Girl Eau de Parfum 80ml', canonicalName: 'Carolina Herrera Good Girl', volumeMl: 80, supplier: 'Perfumaria Brasil', price: 799.9, currency: 'BRL', priceBrl: 799.9, url: 'https://lista.mercadolivre.com.br/good-girl-80ml', updatedAt },
]

const sources: SourceOffer[] = [
  { id: 'cnp-1', productName: 'Yves Saint Laurent Libre EDP', canonicalName: 'Yves Saint Laurent Libre', volumeMl: 90, supplier: 'Cellshop', price: 755000, currency: 'PYG', priceBrl: 538.4, url: 'https://www.comprasparaguai.com.br/', updatedAt },
  { id: 'cnp-2', productName: 'Yves Saint Laurent Libre EDP', canonicalName: 'Yves Saint Laurent Libre', volumeMl: 90, supplier: 'Shopping China', price: 108, currency: 'USD', priceBrl: 589.7, url: 'https://www.comprasparaguai.com.br/', updatedAt },
  { id: 'cnp-3', productName: 'Dior Sauvage EDT', canonicalName: 'Dior Sauvage', volumeMl: 100, supplier: 'Madrid Center', price: 690000, currency: 'PYG', priceBrl: 492.1, url: 'https://www.comprasparaguai.com.br/', updatedAt },
  { id: 'cnp-4', productName: 'Carolina Herrera Good Girl EDP', canonicalName: 'Carolina Herrera Good Girl', volumeMl: 80, supplier: 'Mega Eletrônicos', price: 89, currency: 'USD', priceBrl: 486.3, url: 'https://www.comprasparaguai.com.br/', updatedAt },
]

export const demoComparisons: Comparison[] = sources.map((source) => ({
  source,
  marketplace: ml.filter((offer) => offer.canonicalName === source.canonicalName && offer.volumeMl === source.volumeMl),
}))
