import { cookies } from 'next/headers'
import { Suspense } from 'react'
import { cachedDelay, DebugRenderKind } from '../shared'

// This page only uses cookies.
// It should be completely prefetchable with a dynamic prefetch

export default async function Page() {
  return (
    <main>
      <DebugRenderKind />
      <Suspense fallback={<div style={{ color: 'grey' }}>Loading 1...</div>}>
        <PrefetchableDynamic />
      </Suspense>
    </main>
  )
}

async function PrefetchableDynamic() {
  const cookieStore = await cookies()
  const cookieValue = cookieStore.get('testCookie')?.value ?? null
  await cachedDelay(500, ['/cookies', cookieStore.get('user-agent')?.value])
  return (
    <div style={{ border: '1px solid blue', padding: '1em' }}>
      <div id="cookie-value">{`Cookie: ${cookieValue}`}</div>
    </div>
  )
}
