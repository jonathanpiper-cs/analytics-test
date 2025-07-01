export const headers = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
}

/**
 * Authentication headers for API requests, using Basic Auth with credentials from environment variables.
 */
export const auth = {
  ...headers,
  Authorization:
    'Basic ' +
    Buffer.from(process.env.EMAIL + ':' + process.env.API_TOKEN).toString(
      'base64',
    ),
}

/**
 * Fetches a label object from the API by its name.
 * @param name - The name of the label to fetch.
 * @returns The label object from the API.
 */
export async function getLabel(name: string) {
  const url = `${process.env.V1_BASE_URL!}label?name=${name}`
  const response = await fetch(url, { headers: auth })
  const data = await response.json()
  return data.label
}

/**
 * Fetches the name of a Confluence space by its ID.
 * @param id - The space ID.
 * @returns The name of the space.
 */
export async function getSpace(id: string) {
  const url = `${process.env.BASE_URL!}spaces/${id}`
  const response = await fetch(url, { headers: auth })
  const data = await response.json()
  return data.name
}

/**
 * Converts a hex color string to an HSL color string.
 * @param H - The hex color string (e.g., "#fff" or "#ffffff").
 * @returns The HSL color string.
 */
export function hexToHSL(H: string) {
  // Convert hex to RGB first
  let r: number = 0
  let g: number = 0
  let b: number = 0
  if (H.length == 4) {
    r = parseInt(H[1] + H[1], 16)
    g = parseInt(H[2] + H[2], 16)
    b = parseInt(H[3] + H[3], 16)
  } else if (H.length == 7) {
    r = parseInt(H[1] + H[2], 16)
    g = parseInt(H[3] + H[4], 16)
    b = parseInt(H[5] + H[6], 16)
  }
  // Then to HSL
  r /= 255
  g /= 255
  b /= 255
  const cmin = Math.min(r, g, b),
    cmax = Math.max(r, g, b),
    delta = cmax - cmin
  let h = 0,
    s = 0,
    l = 0

  if (delta == 0) h = 0
  else if (cmax == r) h = ((g - b) / delta) % 6
  else if (cmax == g) h = (b - r) / delta + 2
  else h = (r - g) / delta + 4

  h = Math.round(h * 60)

  if (h < 0) h += 360

  l = (cmax + cmin) / 2
  s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1))
  s = +(s * 100).toFixed(1)
  l = +(l * 100).toFixed(1)

  return 'hsl(' + h + ',' + s + '%,' + l + '%)'
}

/**
 * Label definitions for use case status categories, including legend text and color.
 */
export const LABELS = {
  accepted: { legend: 'Accepted', color: '#6a9a23' },
  included: { legend: 'Included in PRD', color: '#dcdfe4' },
  inReview: { legend: 'In Review', color: '#fedec8' },
  rejected: { legend: 'Rejected', color: '#fdd0ec' },
  unprocessed: { legend: 'Unprocessed', color: '#7d818a' },
}

/**
 * Sorts an array of graph data objects by a given facet and direction.
 * @param rawData - The array of data objects to sort.
 * @param facet - The key to sort by.
 * @param direction - 'asc' for ascending, 'desc' for descending.
 * @returns The sorted array of data objects.
 */
export const sortGraphData = (
  rawData: Record<string, string | number>[],
  facet: string,
  direction: 'asc' | 'desc' = 'asc',
) => {
  const data = [...rawData]
  data.sort((a, b) => {
    const aFacetValue = a[facet] as string
    const bFacetValue = b[facet] as string
    if (aFacetValue > bFacetValue) {
      return direction === 'asc' ? -1 : 1
    }
    if (aFacetValue < bFacetValue) {
      return direction === 'asc' ? 1 : -1
    }
    return 0
  })
  console.log('Sorted data:', data)
  return data
}
