/* eslint-disable @typescript-eslint/no-explicit-any */
import { headers as globalHeaders, auth, getSpace, getLabel } from '@/lib/utils'
import { JSDOM } from 'jsdom'
import { parse } from 'node-html-parser'

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
const idsToSkip = ['2663710966', '2238677016', '1909424187', '3191668764']

const BASE_URL = process.env.BASE_URL!
// const V1_BASE_URL = process.env.V1_BASE_URL!;

export async function getAllUseCases() {
  const label = await getLabel('iab-use-case')
  // console.log('Label:', label);
  const url = `${BASE_URL}labels/${label.id}/pages?limit=250&body-format=storage`

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

  return (data.results as UseCase[])
    .filter((useCase: UseCase) => {
      const spaceKey = useCase._links.edituiv2.split('/')[2]
      return !spacesToSkip.includes(spaceKey) && !idsToSkip.includes(useCase.id)
    })
    .map((uc: UseCase) => ({
      id: uc.id,
      title: uc.title,
    }))
}

export async function fetchUseCaseDetails(pageId: string) {
  const url = `${BASE_URL}pages/${pageId}?body-format=editor&include-labels=true`
  const response = await fetch(url, {
    headers: { ...globalHeaders, ...(auth || {}) },
    method: 'GET',
    ...Object.fromEntries(
      Object.entries(auth).filter(([key]) => key !== 'headers'),
    ),
  })

  const raw = await response.json()
  const spaceId = raw.spaceId
  const spaceName = await getSpace(spaceId)

  const dom = new JSDOM(raw.body.editor.value)
  const tables = Array.from(dom.window.document.querySelectorAll('table'))

  return tables.map((table, index) => {
    const parsed = parse((table as Element).outerHTML)
    const authorName = parsed.structuredText
      .split('\n')
      .find((line) => line.includes('Your name:'))
      ?.replace(/Your name:/, '')
      .trim()
    const customerName = parsed.structuredText
      .split('\n')
      .find((line) => line.includes('Customer:'))
      ?.replace(/Customer:/, '')
      .trim()
    const date = parsed.structuredText
      .split('\n')
      .find((line) => line.includes('Date:'))
      ?.replace(/Date:/, '')
      .trim()

    return {
      id: raw.id,
      title: raw.title,
      number_in_parent: index + 1,
      author_name: authorName || '',
      customer_name: customerName || '',
      date: date || '',
      checkboxes: extractCheckboxes(parsed),
      space: spaceName,
    }
  })
}

function extractCheckboxes(root: any): string[] {
  const checked = root.querySelectorAll('li.checked')
  return checked.map((li: any) => li.textContent.trim())
}
