export type ByCategory = Record<string, number>
// export type SpaceData = {
//   space: string
//   byCategory: ByCategory
//   cases: UseCase[]
// }
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
// export type UseCasesBySpaceResponse = {
//   useCases: UseCase[]
//   success: boolean
//   data: {
//     analysis: SpaceData[]
//   } | null
// }

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

// export type CustomerData = {
//   customer_name: string
//   cases: UseCase[]
//   byCategory: ByCategory
// }
// export type UseCasesByCustomerResponse = {
//   useCases: UseCase[]
//   success: boolean
//   data: {
//     analysis: CustomerData[]
//   } | null
// }
// export type AuthorData = {
//   author: string
//   cases: UseCase[]
//   byCategory: ByCategory
// }
// export type UseCasesByAuthorResponse = {
//   useCases: UseCase[]
//   success: boolean
//   data: {
//     analysis: AuthorData[]
//   } | null
// }
export type GraphDatum = {
  [key: string]: string | number
}
