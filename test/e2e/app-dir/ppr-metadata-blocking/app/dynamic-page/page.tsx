import { headers } from 'next/headers'

// Dynamic usage in page, wrapped with Suspense boundary
export default function Page() {
  return (
    <div>
      <h1>Dynamic Page</h1>
      <SubComponent />
    </div>
  )
}

async function SubComponent() {
  await headers()
  return <div>Dynamic Headers</div>
}

export async function generateMetadata() {
  return {
    title: `dynamic page`,
  }
}
