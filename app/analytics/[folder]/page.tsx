'use client'
import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { hexToHSL, LABELS, sortGraphData } from '@/lib/utils'
import NivoTheme from '@/lib/nivoTheme'
import { ResponsiveBar } from '@nivo/bar'
import type { UseCasesByFacet, FacetData, UseCase } from '@/types'
import { getUseCasesByFacet } from '@/lib/analyze'
import { FACETS } from '@/lib/facets'

export default function Page() {
  const params = useParams()
  const facet = params.folder as string
  const facetIndex = FACETS[facet as keyof typeof FACETS]?.index || ''
  const facetLabel = FACETS[facet as keyof typeof FACETS]?.label || ''

  const [data, setData] = useState<UseCasesByFacet>({
    facet: facet,
    success: false,
    analysis: [],
    useCases: [],
  })

  const [loading, setLoading] = useState(true)
  const [graphData, setGraphData] = useState<Record<string, string | number>[]>(
    [],
  )

  useEffect(() => {
    if (!facet) return
    const fetchData = async () => {
      const data = await getUseCasesByFacet(facet)
      setData(data)
      if (data) {
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

  useEffect(() => {
    if (graphData) {
      console.log('data!', graphData)
    }
  }, [graphData])

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
          <div className="">
            <p>Sort by:</p>
            <div className="z-10 flex items-center justify-items-start gap-4">
              <div className="flex items-center gap-2">
                <p className="inline">{facetLabel}</p>
                <button
                  type="button"
                  className="rounded-md bg-blue-500 p-2 text-white hover:bg-blue-600"
                  onClick={() => {
                    setGraphData(sortGraphData(graphData, facetIndex, 'asc'))
                  }}
                >
                  ↑
                </button>
                <button
                  type="button"
                  className="rounded-md bg-blue-500 p-2 text-white hover:bg-blue-600"
                  onClick={() => {
                    setGraphData(sortGraphData(graphData, facetIndex, 'desc'))
                  }}
                >
                  ↓
                </button>
              </div>
              <div>|</div>
              <div className="flex items-center gap-2">
                <p className="inline">Count</p>
                <button
                  type="button"
                  className="rounded-md bg-blue-500 p-2 text-white hover:bg-blue-600"
                  onClick={() => {
                    setGraphData(sortGraphData(graphData, 'total', 'asc'))
                  }}
                >
                  ↑
                </button>
                <button
                  type="button"
                  className="rounded-md bg-blue-500 p-2 text-white hover:bg-blue-600"
                  onClick={() => {
                    setGraphData(sortGraphData(graphData, 'total', 'desc'))
                  }}
                >
                  {' '}
                  ↓
                </button>
              </div>
            </div>
          </div>
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
