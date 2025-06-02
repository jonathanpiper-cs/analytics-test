import type { Facet, Facets } from '@/types'

const authors: Facet = {
  index: 'author_name',
  label: 'Author',
}
const customers: Facet = {
  index: 'customer_name',
  label: 'Customer',
}
const spaces: Facet = {
  index: 'space',
  label: 'Space',
}

export const FACETS: Facets = {
  authors,
  customers,
  spaces,
}
