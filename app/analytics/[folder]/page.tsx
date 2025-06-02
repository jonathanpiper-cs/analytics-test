'use client'
import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { hexToHSL, LABELS } from '@/lib/utils'
import NivoTheme from '@/lib/nivoTheme'
import { ResponsiveBar } from '@nivo/bar'
import type { UseCasesByFacet, FacetData, UseCase, GraphDatum } from '@/types'
import { getUseCasesByFacet } from '@/lib/analyze'
import { FACETS } from '@/lib/facets'

export default function Page() {
  const params = useParams()
  const facet = params.folder as string
  console.log('Facet:', facet)
  const facetIndex = FACETS[facet as keyof typeof FACETS]?.index || ''
  const facetLabel = FACETS[facet as keyof typeof FACETS]?.label || ''
  console.log('Facet Index:', facetIndex)
  console.log('Facet Label:', facetLabel)

  const [data, setData] = useState<UseCasesByFacet>({
    facet: facet,
    success: false,
    analysis: [],
    useCases: [],
  })
  const [loading, setLoading] = useState(true)
  const [graphData, setGraphData] = useState<GraphDatum[]>([])

  useEffect(() => {
    if (!facet) return
    const fetchData = async () => {
      const data = await getUseCasesByFacet(facet)
      setData(data)
      console.log(data)
      const graph = data.analysis.map((facetInstance: FacetData) => ({
        [facetLabel]: facetInstance[facetIndex as keyof typeof facetInstance],
        ...Object.fromEntries(
          Object.keys(facetInstance.byCategory).flatMap((category) => [
            [category, facetInstance.byCategory[category]],
            [
              `${category}Color`,
              `${hexToHSL(LABELS[category as keyof typeof LABELS]?.color || '#000000')}`,
            ],
          ]),
        ),
      }))
      console.log(graph)
      setGraphData(graph)
      console.log('Fetched data:', data)
      setLoading(false)
    }
    fetchData()
  }, [facet, facetLabel, facetIndex])

  return (
    <div className="m-8 flex w-[90%] flex-col place-self-center">
      {loading ? (
        <div>
          <p className="text-2xl font-bold">🤔 Loading...</p>
        </div>
      ) : !data ? (
        <div>
          <p className="text-2xl font-bold">🤔 No data found</p>
        </div>
      ) : (
        <>
          <h1 className="place-self-start text-4xl font-bold">
            Use Cases by{' '}
            {facet in FACETS
              ? FACETS[facet as keyof typeof FACETS].label
              : facet}
          </h1>
          <div className="-mt-8 h-dvh max-h-[1000px] min-h-[400px] w-full">
            <ResponsiveBar
              theme={NivoTheme}
              data={graphData}
              indexBy={facetLabel}
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
