import { ComponentProps } from 'react'
import { LinkAccordion } from '../components/link-accordion'

export default function Page() {
  return (
    <main>
      <h1>Page 1</h1>
      <ul>
        <li>
          cookies
          <ul>
            <li>
              <DebugLinkAccordion href="/cookies" prefetch={true} />
            </li>
            <li>
              <DebugLinkAccordion
                href="/cookies"
                prefetch="unstable_forceStale"
              />
            </li>
            <li>
              <DebugLinkAccordion href="/cookies" prefetch={null} />
            </li>
          </ul>
        </li>
        <li>
          <DebugLinkAccordion href="/error-after-cookies" prefetch={true} />
        </li>
        <li>
          <DebugLinkAccordion href="/sync-io-after-cookies" prefetch={true} />
        </li>
        <li>
          <DebugLinkAccordion href="/cookies-only" prefetch={true} />
        </li>
        <li>
          search params
          <ul>
            <li>
              <DebugLinkAccordion
                href="/search-params?searchParam=123"
                prefetch={true}
              />
            </li>
            <li>
              <DebugLinkAccordion
                href="/search-params?searchParam=456"
                prefetch={true}
              />
            </li>
          </ul>
        </li>
        <li>
          dynamic params
          <ul>
            <li>
              <DebugLinkAccordion href="/dynamic-params/123" prefetch={true} />
            </li>
            <li>
              <DebugLinkAccordion href="/dynamic-params/456" prefetch={true} />
            </li>
          </ul>
        </li>
        <li>
          <DebugLinkAccordion href="/fully-static" prefetch={true} />
        </li>
      </ul>
    </main>
  )
}

function DebugLinkAccordion({
  href,
  prefetch,
}: Omit<ComponentProps<typeof LinkAccordion>, 'children'>) {
  const prefetchKind = (() => {
    switch (prefetch) {
      case false:
        return 'disabled'
      case null:
      case 'auto':
        return 'auto'
      case true:
        return 'dynamic'
      case 'unstable_forceStale':
        return 'full'
      default:
        prefetch satisfies never
    }
  })()
  return (
    <LinkAccordion href={href} prefetch={prefetch}>
      {href} ({prefetchKind})
    </LinkAccordion>
  )
}
