import { Suspense } from 'react'
import { cachedDelay, DebugRenderKind, uncachedIO } from '../../shared'
import { connection } from 'next/server'

// This page only uses params and headers.
// Parts of it should be prefetchable dynamically

type Params = { id: string }

export default async function Page({ params }: { params: Promise<Params> }) {
  return (
    <main>
      <DebugRenderKind />
      <Suspense fallback={<div style={{ color: 'grey' }}>Loading 1...</div>}>
        <PrefetchableDynamic params={params} />
      </Suspense>
    </main>
  )
}

async function PrefetchableDynamic({ params }: { params: Promise<Params> }) {
  const { id } = await params
  await cachedDelay(500, ['/dynamic-params/[id]', id])
  return (
    <div style={{ border: '1px solid blue', padding: '1em' }}>
      <div id="param-value">{`Param: ${id}`}</div>
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
