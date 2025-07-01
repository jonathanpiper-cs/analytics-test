import { NextResponse } from 'next/server'
import { FACETS } from '@/lib/facets'
import type { Facet, UseCase as OriginalUseCase } from '@/types'

/**
 * Extended UseCase type to allow for additional dynamic properties.
 */
type UseCase = OriginalUseCase & {
  [key: string]: unknown
}

/**
 * Fetches use case data grouped by the specified facet from the API.
 * Calls the internal API endpoint for the given facet (e.g., 'authors', 'customers', 'spaces'),
 * and returns the grouped use case data along with facet metadata.
 *
 * @param facet - The facet to group by (e.g., 'authors', 'customers', 'spaces').
 * @returns The grouped use case data and facet metadata, or an error response.
 */
export async function getUseCasesByFacet(facet: string) {
  try {
    // Call the internal API endpoint for the given facet
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SELF_HOST}/api/${facet}/all`,
      {
        method: 'GET',
      },
    )
    // Parse the JSON response
    const data = await res.json()
    // Attach the facet metadata from the FACETS config
    return { ...data, facet: FACETS[facet as keyof typeof FACETS] as Facet }
  } catch (error) {
    // Log and return an error response if anything fails
    console.error(error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch use cases' },
      { status: 500 },
    )
  }
}

/**
 * Counts the number of use cases in each checkbox status category.
 * Iterates through the array of use cases and counts how many have each status
 * (Accepted, Included in Prd, In Review, Rejected) checked.
 *
 * @param cases - Array of use cases.
 * @returns An object with counts for accepted, included, inReview, and rejected.
 */
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

/**
 * Gets the property key/index for a given facet from the FACETS config.
 * This is used to determine which property of the use case object to group by.
 *
 * @param facet - The facet name (e.g., 'authors', 'customers', 'spaces').
 * @returns The property key/index string for the facet.
 */
function getFacetIndex(facet: string) {
  const string = FACETS[facet as keyof typeof FACETS]?.index || ''
  return string
}

/**
 * Groups use cases by the specified facet and analyzes their status breakdown.
 * For each unique value of the facet (e.g., each author, customer, or space),
 * groups the use cases, counts the number in each status category, and calculates
 * the percentage of processed use cases (those with any status checked).
 *
 * @param useCases - Array of use cases.
 * @param facet - The facet to group by (e.g., 'authors', 'customers', 'spaces').
 * @returns An object containing an array of analysis results for each facet value.
 */
export function groupAndAnalyzeUseCasesByFacet(
  useCases: UseCase[],
  facet: string,
) {
  // Group use cases by the facet value (e.g., author name, customer name, space name)
  const byFacet: Record<string, UseCase[]> = {}

  useCases.forEach((uc) => {
    const facetValue = uc[getFacetIndex(facet)] as string
    if (!byFacet[facetValue]) byFacet[facetValue] = []
    byFacet[facetValue].push(uc)
  })

  // For each group, analyze the breakdown by status and calculate summary stats
  const analysis = Object.entries(byFacet).map(([facetValue, cases]) => {
    const { accepted, included, inReview, rejected } = explodeCheckboxes(cases)

    return {
      [getFacetIndex(facet)]: facetValue, // The facet value (e.g., author name)
      cases, // All use cases for this facet value
      total: cases.length, // Total number of use cases in this group
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

  // Return the analysis array
  return { analysis }
}
