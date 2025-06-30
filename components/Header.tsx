'use client'

import Link from 'next/link'

export function Header() {
  return (
    <header className="bg-gray-800 p-4 text-white">
      <h1 className="text-4xl font-bold">IAB Use Case Analytics</h1>
      <p className="text-lg">
        Explore use cases categorized by{' '}
        <Link href="/analytics/authors" className="font-bold">
          Author
        </Link>{' '}
        |{' '}
        <Link href="/analytics/customers" className="font-bold">
          Customer
        </Link>{' '}
        |{' '}
        <Link href="/analytics/spaces" className="font-bold">
          Confluence Space
        </Link>
      </p>
    </header>
  )
}
