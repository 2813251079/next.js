import { Suspense } from 'react'
import { cachedDelay, DebugRenderKind, uncachedIO } from '../shared'
import { connection } from 'next/server'

// This page only uses searchParams and headers.
// Parts of it should be prefetchable dynamically

type AnySearchParams = { [key: string]: string | string[] | undefined }

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<AnySearchParams>
}) {
  return (
    <main>
      <DebugRenderKind />
      <Suspense fallback={<div style={{ color: 'grey' }}>Loading 1...</div>}>
        <PrefetchableDynamic searchParams={searchParams} />
      </Suspense>
    </main>
  )
}

async function PrefetchableDynamic({
  searchParams,
}: {
  searchParams: Promise<AnySearchParams>
}) {
  const { searchParam } = await searchParams
  await cachedDelay(500, ['/search-params', searchParam])
  return (
    <div style={{ border: '1px solid blue', padding: '1em' }}>
      <div id="search-param-value">{`Search param: ${searchParam}`}</div>
      <Suspense fallback={<div style={{ color: 'grey' }}>Loading 2...</div>}>
        <Dynamic />
      </Suspense>
    </div>
  )
}

async function Dynamic() {
  await uncachedIO()
  await connection()
  return (
    <div style={{ border: '1px solid tomato', padding: '1em' }}>
      <div id="dynamic-content">Dynamic content</div>
    </div>
  )
}
