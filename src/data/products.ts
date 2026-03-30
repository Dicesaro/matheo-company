export interface Product {
  id: number
  name: string
  category: string
  brand: string
  image: string // Featured image for catalog
  images: string[] // All images for detail page
  description: string
  longDescription: string
  features: string[]
  benefits: string[]
  specifications: { label: string; value: string }[]
  price?: number
  originalPrice?: number
  discount?: number
  rating: number
  featured?: boolean
  workMaterials?: string[] // PMKNSH
}

const Productos: Product[] = [
  {
    id: 700114,
    name: '',
    category: '',
    brand: '',
    image: '',
    images: ['', ''],
    description: '',
    longDescription: '',
    features: ['', '', '', '', ''],
    benefits: ['', '', '', ''],
    specifications: [
      { label: '', value: '' },
      { label: '', value: '' },
      { label: '', value: '' },
      { label: '', value: '' },
      { label: '', value: '' },
      { label: '', value: '' },
      { label: '', value: '' },
    ],
    rating: 5.0,
    featured: false,
    workMaterials: ['P', 'M', 'K', 'S', 'H'],
  },
]

console.log(Productos)

export const categories = [
  'Herramientas de Medición',
  'Herramientas de Corte',
  'Herramientas Manuales',
  'Herramientas Eléctricas',
  'Accesorios',
  'Equipos de Soldadura',
  'Instrumentos de Precisión',
  'Insertos de Carburo',
  'Brocas',
]

export const brands = [
  'Bosch',
  'Mitutoyo',
  'Makita',
  'Truper',
  'Dasqua',
  'Völkel',
  'Blue Master',
  'Vertex',
  'Dormer',
  'Sandvik',
  'BWIN',
]
