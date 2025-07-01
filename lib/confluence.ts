/* eslint-disable @typescript-eslint/no-explicit-any */
import { headers as globalHeaders, auth, getSpace, getLabel } from '@/lib/utils'
import { JSDOM } from 'jsdom'
import { parse } from 'node-html-parser'

// List of Confluence space keys to skip when fetching use cases.
// These are spaces that are not relevant for analytics.
const spacesToSkip = [
  'SI',
  'CIO',
  'TSP1',
  'ECO',
  'DS',
  'PER',
  '~63f5382640328c12e4ec6c20',
  '~61543a9b289a54006ac2ed8a',
]

// List of specific Confluence page IDs to skip.
// These are pages that should not be included in the analytics.
const idsToSkip = ['2663710966', '2238677016', '1909424187', '3191668764']

// Base URL for the Confluence API, loaded from environment variables.
const BASE_URL = process.env.BASE_URL!
// const V1_BASE_URL = process.env.V1_BASE_URL!;

/**
 * Fetches all use cases from Confluence that have the 'iab-use-case' label.
 * Filters out use cases from unwanted spaces and with unwanted IDs.
 * Returns a simplified list of use case objects containing only id and title.
 *
 * @returns Array of use case objects with id and title.
 */
export async function getAllUseCases() {
  // Get the label object for 'iab-use-case'
  const label = await getLabel('iab-use-case')
  // Build the API URL to fetch all pages with this label
  const url = `${BASE_URL}labels/${label.id}/pages?limit=250&body-format=storage`

  // Fetch the pages from the API
  const response = await fetch(url, {
    headers: { ...globalHeaders, ...(auth || {}) },
    method: 'GET',
  })
  const data = await response.json()

  type UseCase = {
    id: string
    title: string
    _links: {
      edituiv2: string
    }
  }

  // Filter out use cases from unwanted spaces or with unwanted IDs,
  // then map to a simplified object with only id and title.
  return (data.results as UseCase[])
    .filter((useCase: UseCase) => {
      // Extract the space key from the edit URL
      const spaceKey = useCase._links.edituiv2.split('/')[2]
      return !spacesToSkip.includes(spaceKey) && !idsToSkip.includes(useCase.id)
    })
    .map((uc: UseCase) => ({
      id: uc.id,
      title: uc.title,
    }))
}

/**
 * Fetches detailed information for a single use case page by its ID.
 * Parses the page content to extract author, customer, date, checkboxes, and space.
 * Each use case page may contain multiple tables, each representing a use case entry.
 *
 * @param pageId - The Confluence page ID.
 * @returns Array of parsed use case details for each table found in the page.
 */
export async function fetchUseCaseDetails(pageId: string) {
  // Build the API URL to fetch the page content in editor format, including labels
  const url = `${BASE_URL}pages/${pageId}?body-format=editor&include-labels=true`
  // Fetch the page content from the API
  const response = await fetch(url, {
    headers: { ...globalHeaders, ...(auth || {}) },
    method: 'GET',
    // Remove any 'headers' property from auth to avoid conflicts
    ...Object.fromEntries(
      Object.entries(auth).filter(([key]) => key !== 'headers'),
    ),
  })

  // Parse the raw JSON response
  const raw = await response.json()
  // Get the space ID and resolve the space name
  const spaceId = raw.spaceId
  const spaceName = await getSpace(spaceId)

  // Parse the HTML content of the page to extract tables
  const dom = new JSDOM(raw.body.editor.value)
  const tables = Array.from(dom.window.document.querySelectorAll('table'))

  // For each table found, parse its content and extract relevant fields
  return tables.map((table, index) => {
    // Parse the table HTML to a structured format
    const parsed = parse((table as Element).outerHTML)
    // Extract the author name from the structured text
    const authorName = parsed.structuredText
      .split('\n')
      .find((line) => line.includes('Your name:'))
      ?.replace(/Your name:/, '')
      .trim()
    // Extract the customer name from the structured text
    const customerName = parsed.structuredText
      .split('\n')
      .find((line) => line.includes('Customer:'))
      ?.replace(/Customer:/, '')
      .trim()
    // Extract the date from the structured text
    const date = parsed.structuredText
      .split('\n')
      .find((line) => line.includes('Date:'))
      ?.replace(/Date:/, '')
      .trim()

    // Return a structured object for this use case entry
    return {
      id: raw.id,
      title: raw.title,
      number_in_parent: index + 1, // Index of the table within the page
      author_name: authorName || '',
      customer_name: customerName || '',
      date: date || '',
      checkboxes: extractCheckboxes(parsed), // Array of checked checkbox labels
      space: spaceName,
      _links: {
        edituiv2: raw._links.edituiv2,
      },
    }
  })
}

/**
 * Extracts the text content of all checked checkboxes from a parsed HTML root.
 * Used to determine the status categories for a use case (e.g., Accepted, In Review).
 *
 * @param root - The parsed HTML root node.
 * @returns Array of checkbox label strings.
 */
function extractCheckboxes(root: any): string[] {
  // Find all list items with the 'checked' class (checked checkboxes)
  const checked = root.querySelectorAll('li.checked')
  // Return their trimmed text content as an array of strings
  return checked.map((li: any) => li.textContent.trim())
}
