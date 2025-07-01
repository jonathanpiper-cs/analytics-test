'use client'
import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { hexToHSL, LABELS, sortGraphData } from '@/lib/utils'
import NivoTheme from '@/lib/nivoTheme'
import { ResponsiveBar } from '@nivo/bar'
import type { UseCasesByFacet, FacetData, UseCase } from '@/types'
import { getUseCasesByFacet } from '@/lib/analyze'
import { FACETS } from '@/lib/facets'
import { SortingButtons } from '@/components/SortingButtons'

/**
 * Analytics Page Component
 *
 * This page displays use case analytics grouped by a dynamic facet (author, customer, or space).
 * It fetches the relevant data, renders a horizontal bar chart (Nivo), and provides sorting controls.
 * Below the chart, it lists all use cases for each facet value.
 */
export default function Page() {
  // Get the dynamic route parameter (facet) from the URL
  const params = useParams()
  const facet = params.folder as string
  // Get the property key and label for the current facet from the FACETS config
  const facetIndex = FACETS[facet as keyof typeof FACETS]?.index || ''
  const facetLabel = FACETS[facet as keyof typeof FACETS]?.label || ''

  // State for the fetched analytics data
  const [data, setData] = useState<UseCasesByFacet>({
    facet: facet,
    success: false,
    analysis: [],
    useCases: [],
  })

  // Loading state for async data fetching
  const [loading, setLoading] = useState(true)
  // State for the graph data (used by Nivo bar chart)
  const [graphData, setGraphData] = useState<Record<string, string | number>[]>(
    [],
  )

  /**
   * Fetch analytics data for the current facet when the facet changes.
   * The data is sorted by the facet index (e.g., author name) in ascending order by default.
   * The graph data is prepared for the Nivo bar chart, including color mapping.
   */
  useEffect(() => {
    if (!facet) return
    const fetchData = async () => {
      const data = await getUseCasesByFacet(facet)
      setData(data)
      if (data) {
        // Prepare the graph data for the bar chart
        const graph = sortGraphData(
          data.analysis.map((facetInstance: FacetData) => {
            return {
              [facetIndex]:
                facetInstance[facetIndex as keyof typeof facetInstance] ||
                'No data',
              ...Object.fromEntries(
                Object.keys(facetInstance.byCategory).flatMap((category) => [
                  [category, facetInstance.byCategory[category]],
                  [
                    `${category}Color`,
                    `${hexToHSL(LABELS[category as keyof typeof LABELS]?.color || '#000000')}`,
                  ],
                ]),
              ),
            }
          }),
          facetIndex,
          'asc',
        )

        setGraphData(graph)
        setLoading(false)
      }
    }
    fetchData()
  }, [facet, facetLabel, facetIndex])

  return (
    <div className="m-8 flex w-[90%] flex-col place-self-center">
      {/* Show loading state while fetching data */}
      {loading ? (
        <div>
          <p className="text-2xl font-bold">🤔 Loading...</p>
        </div>
      ) : !data ? (
        // Show a message if no data is found
        <div>
          <p className="text-2xl font-bold">🤔 No data found</p>
        </div>
      ) : (
        <>
          {/* Page title with the current facet label */}
          <h1 className="place-self-start text-4xl font-bold">
            Use Cases by{' '}
            {facet in FACETS
              ? FACETS[facet as keyof typeof FACETS].label
              : facet}
          </h1>
          {/* Sorting controls for the bar chart */}
          <SortingButtons
            facetLabel={facetLabel}
            facetIndex={facetIndex}
            graphData={graphData}
            setGraphData={setGraphData}
          />
          {/* Horizontal bar chart visualization using Nivo */}
          <div className="-pt-8 h-dvh max-h-[1000px] min-h-[400px] w-full">
            <ResponsiveBar
              theme={NivoTheme}
              data={graphData || []}
              indexBy={facetIndex}
              keys={[
                'accepted',
                'included',
                'inReview',
                'rejected',
                'unprocessed',
              ]}
              labelSkipHeight={16}
              labelSkipWidth={16}
              labelTextColor="inherit:darker(1.4)"
              margin={{
                bottom: 60,
                left: 160,
                right: 110,
                top: 60,
              }}
              onClick={() => {}}
              onMouseEnter={() => {}}
              onMouseLeave={() => {}}
              padding={0.2}
              // Use the color for each bar from the graph data
              colors={({
                id,
                data,
              }: {
                id: string | number
                data: Record<string, string | number>
              }) => String(data[`${id}Color`])}
              layout="horizontal"
              animate={false}
            />
          </div>
          {/* List of all use cases for each facet value */}
          <div className="place-self-start">
            {data.analysis?.map((facetInstance, index) => (
              <div key={index} className="mb-8">
                <h1 className="mb-2 text-xl font-bold">
                  {String(facetInstance[facetIndex as keyof FacetData]) ||
                    'No customer name provided'}
                </h1>
                {facetInstance.cases.map((useCase: UseCase, caseIndex) => (
                  <div key={`${index}-${caseIndex}`}>
                    <h2>{useCase.title}</h2>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
