'use client'
import React, { useState, useEffect } from 'react'
import { hexToHSL, LABELS, NivoTheme } from '@/lib/utils'
import { ResponsiveBar } from '@nivo/bar'
import { NextResponse } from 'next/server'
import type { UseCasesByCustomerResponse } from '@/types'

async function getUseCasesByCustomer() {
  try {
    const res = await fetch('http://localhost:3000/api/customers/all', {
      method: 'GET',
    })
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
  const [data, setData] = useState<UseCasesByCustomerResponse>({
    success: false,
    data: null,
    useCases: [],
  })
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const fetchData = async () => {
      const data = await getUseCasesByCustomer()
      setData(data)
      setLoading(false)
    }
    fetchData()
  }, [])

  // useEffect(() => {
  // 	console.log(
  // 		data?.data?.analysis.map((customer) => ({
  // 			"customer": customer.customer_name,
  // 			...Object.fromEntries(
  // 				Object.keys(customer.byCategory).flatMap((category) => [
  // 					[
  // 						category,
  // 						customer.byCategory[category]
  // 					],
  // 					[
  // 						`${category}Color`,
  // 						`${hexToHSL(LABELS[category as keyof typeof LABELS]?.color || '#000000')}`
  // 					]
  // 				])
  // 			)
  // 		}))
  // 	);
  // }, [data]);

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
          <h1 className="place-self-start text-4xl font-bold">
            Use Cases by Customer
          </h1>
          <div className="-mt-8 h-dvh max-h-[1000px] min-h-[400px] w-full">
            <ResponsiveBar
              theme={NivoTheme}
              data={data.data.analysis.map((customer) => ({
                'Customer Name':
                  customer.customer_name || 'No customer name provided',
                ...Object.fromEntries(
                  Object.keys(customer.byCategory).flatMap((category) => [
                    [category, customer.byCategory[category]],
                    [
                      `${category}Color`,
                      `${hexToHSL(LABELS[category as keyof typeof LABELS]?.color || '#000000')}`,
                    ],
                  ]),
                ),
              }))}
              indexBy="Customer Name"
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
            {data?.data.analysis?.map((customer, customerIdx) => (
              <div key={customerIdx} className="mb-8">
                <h1 className="mb-2 text-xl font-bold">
                  {customer.customer_name || 'No customer name provided'}
                </h1>
                {customer.cases.map((useCase, caseIdx) => (
                  <div key={`${customerIdx}-${caseIdx}`}>
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
