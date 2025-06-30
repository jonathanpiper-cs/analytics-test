import { NextResponse } from 'next/server'
import { FACETS } from '@/lib/facets'
import type { Facet, UseCase as OriginalUseCase } from '@/types'

type UseCase = OriginalUseCase & {
  [key: string]: unknown
}

export async function getUseCasesByFacet(facet: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SELF_HOST}/api/${facet}/all`,
      {
        method: 'GET',
      },
    )
    const data = await res.json()
    return { ...data, facet: FACETS[facet as keyof typeof FACETS] as Facet }
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch use cases' },
      { status: 500 },
    )
  }
}

const explodeCheckboxes = (cases: UseCase[]) => {
  const accepted = cases.filter((c) => c.checkboxes.includes('Accepted')).length
  const included = cases.filter((c) =>
    c.checkboxes.includes('Included in Prd'),
  ).length
  const inReview = cases.filter((c) =>
    c.checkboxes.includes('In Review'),
  ).length
  const rejected = cases.filter((c) => c.checkboxes.includes('Rejected')).length
  return {
    accepted,
    included,
    inReview,
    rejected,
  }
}

function getFacetIndex(facet: string) {
  const string = FACETS[facet as keyof typeof FACETS]?.index || ''
  return string
}

export function groupAndAnalyzeUseCasesByFacet(
  useCases: UseCase[],
  facet: string,
) {
  const byFacet: Record<string, UseCase[]> = {}

  useCases.forEach((uc) => {
    const facetValue = uc[getFacetIndex(facet)] as string
    if (!byFacet[facetValue]) byFacet[facetValue] = []
    byFacet[facetValue].push(uc)
  })

  const analysis = Object.entries(byFacet).map(([facetValue, cases]) => {
    const { accepted, included, inReview, rejected } = explodeCheckboxes(cases)

    return {
      [getFacetIndex(facet)]: facetValue,
      cases,
      total: cases.length,
      byCategory: {
        total: cases.length,
        unprocessed: Math.max(
          cases.length - (accepted + included + inReview + rejected),
          0,
        ),
        accepted,
        included,
        inReview,
        rejected,
      },
      percentProcessed: Math.round(
        ((accepted + included + inReview + rejected) / cases.length) * 100,
      ),
    }
  })

  return { analysis }
}
