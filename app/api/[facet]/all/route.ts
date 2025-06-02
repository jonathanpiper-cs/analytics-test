import { NextResponse } from 'next/server'
import { getAllUseCases, fetchUseCaseDetails } from '@/lib/confluence'
import { groupAndAnalyzeUseCasesByFacet } from '@/lib/analyze'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ facet: string }> },
) {
  const { facet } = await params
  try {
    const rawUseCases = await getAllUseCases()
    const detailedUseCases = await Promise.all(
      rawUseCases.map((uc) => fetchUseCaseDetails(uc.id)),
    )

    const flatCases = detailedUseCases.flat()
    const analysis = groupAndAnalyzeUseCasesByFacet(flatCases, facet)

    return NextResponse.json(
      { success: true, ...analysis, useCases: flatCases },
      { status: 200 },
    )
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch use cases' },
      { status: 500 },
    )
  }
}
