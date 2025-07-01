import { NextResponse } from 'next/server'
import { getAllUseCases, fetchUseCaseDetails } from '@/lib/confluence'
import { groupAndAnalyzeUseCasesByFacet } from '@/lib/analyze'

/**
 * API Route Handler: GET /api/[facet]/all
 *
 * This route fetches all use cases from Confluence, retrieves detailed information for each,
 * groups and analyzes them by the requested facet (e.g., authors, customers, spaces), and returns
 * the analysis along with the raw use case data.
 *
 * @param request - The incoming HTTP request object.
 * @param params - An object containing the dynamic route parameter 'facet'.
 * @returns JSON response with analysis and use case data, or an error message.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ facet: string }> },
) {
  // Await the facet parameter from the dynamic route
  const { facet } = await params
  try {
    // Fetch all use cases with the 'iab-use-case' label, filtering out unwanted spaces/IDs
    const rawUseCases = await getAllUseCases()

    // For each use case, fetch detailed information (author, customer, checkboxes, etc.)
    const detailedUseCases = await Promise.all(
      rawUseCases.map((uc) => fetchUseCaseDetails(uc.id)),
    )

    // Flatten the array in case each use case returns multiple entries (e.g., multiple tables per page)
    const flatCases = detailedUseCases.flat()

    // Group and analyze the use cases by the requested facet (author, customer, or space)
    const analysis = groupAndAnalyzeUseCasesByFacet(flatCases, facet)

    // Return the analysis and all use case data as a JSON response
    return NextResponse.json(
      { success: true, ...analysis, useCases: flatCases },
      { status: 200 },
    )
  } catch (error) {
    // Log and return an error response if anything fails
    console.error(error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch use cases' },
      { status: 500 },
    )
  }
}
