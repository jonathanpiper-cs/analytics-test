'use client'
import React, { useState, useEffect } from 'react'
import { ResponsivePie } from '@nivo/pie'
import { NextResponse } from 'next/server'
import { LABELS } from '@/lib/utils'
import type { UseCasesBySpaceResponse } from '@/types'

async function getUseCasesBySpace() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SELF_HOST}/api/spaces/all`,
      {
        method: 'GET',
      },
    )
    const data = await res.json()
    return data
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch use cases' },
      { status: 500 },
    )
  }
}

export default function Page() {
  const [data, setData] = useState<UseCasesBySpaceResponse>({
    success: false,
    data: null,
    useCases: [],
  })
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const fetchData = async () => {
      const data = await getUseCasesBySpace()
      setData(data)
      setLoading(false)
    }
    fetchData()
  }, [])

  return (
    <div className="m-8 flex w-[90%] flex-col place-self-center">
      {loading ? (
        <div>
          <p className="text-2xl font-bold">🤔 Loading...</p>
        </div>
      ) : !data.data ? (
        <div>
          <p className="text-2xl font-bold">🤔 No data found</p>
        </div>
      ) : (
        <>
          <h1 className="text-4xl font-bold">Use Cases by Space</h1>
          <div className="grid grid-cols-3 gap-4">
            {data?.data?.analysis?.map((space, index) => (
              <div key={index}>
                <h2>{space.space}</h2>
                <div className="h-96">
                  {
                    <ResponsivePie
                      //   theme={NivoTheme}
                      data={Object.keys(space.byCategory).map((category) => ({
                        id: LABELS[category as keyof typeof LABELS].legend,
                        label: LABELS[category as keyof typeof LABELS].legend,
                        value: space.byCategory[category],
                        color: LABELS[category as keyof typeof LABELS].color,
                      }))}
                      margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
                      colors={{ datum: 'data.color' }}
                      innerRadius={0.5}
                      padAngle={0.6}
                      cornerRadius={2}
                      activeOuterRadiusOffset={8}
                      arcLinkLabelsSkipAngle={10}
                      arcLinkLabelsTextColor="#dddddd"
                      arcLinkLabelsThickness={2}
                      arcLinkLabelsColor={{ from: 'color' }}
                      arcLabelsSkipAngle={10}
                      arcLabelsTextColor={{
                        from: 'color',
                        modifiers: [['darker', 2]],
                      }}
                      legends={[
                        {
                          anchor: 'bottom',
                          direction: 'row',
                          translateY: 56,
                          itemWidth: 100,
                          itemHeight: 18,
                          symbolShape: 'circle',
                        },
                      ]}
                    />
                  }
                </div>
              </div>
            ))}
          </div>
          <div className="place-self-start">
            {data?.data.analysis?.map((space, spaceIdx) => (
              <div key={spaceIdx} className="mb-8">
                <h1 className="mb-2 text-xl font-bold">{space.space}</h1>
                {space.cases.map((useCase, caseIdx) => (
                  <div key={`${spaceIdx}-${caseIdx}`}>
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
