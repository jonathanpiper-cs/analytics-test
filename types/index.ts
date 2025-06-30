export type ByCategory = Record<string, number>

export type UseCase = {
  title: string
  space: string
  checkboxes: string[]
  number_in_parent: number
  author_name: string
  customer_name: string
  date: string
  _links: {
    edituiv2: string
  }
}

export type Facets = {
  authors: Facet
  customers: Facet
  spaces: Facet
}

export type Facet = {
  index: string
  label: string
}

export type FacetData = {
  byCategory: ByCategory
  cases: UseCase[]
}

export type UseCasesByFacet = {
  facet: string
  useCases: UseCase[]
  success: boolean
  analysis: FacetData[]
}
