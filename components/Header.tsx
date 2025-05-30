'use client'

export function Header() {
  return (
    <header className="bg-gray-800 p-4 text-white">
      <h1 className="text-4xl font-bold">IAB Use Case Analytics</h1>
      <p className="text-lg">
        Explore use cases categorized by{' '}
        <a href="/analytics/authors" className="font-bold">
          Author
        </a>{' '}
        |{' '}
        <a href="/analytics/customers" className="font-bold">
          Customer
        </a>{' '}
        |{' '}
        <a href="/analytics/spaces" className="font-bold">
          Confluence Space
        </a>
      </p>
    </header>
  )
}
