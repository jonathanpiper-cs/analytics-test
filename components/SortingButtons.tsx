import { sortGraphData } from '@/lib/utils'

export function SortingButtons({
  facetLabel,
  facetIndex,
  graphData,
  setGraphData,
}: {
  facetLabel: string
  facetIndex: string
  graphData: Record<string, string | number>[]
  setGraphData: (data: Record<string, string | number>[]) => void
}) {
  return (
    <div className="">
      <p>Sort by:</p>
      <div className="z-10 flex items-center justify-items-start gap-4">
        {/* Sort by facet value (e.g., author, customer, space) */}
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
        {/* Sort by total count */}
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
  )
}
