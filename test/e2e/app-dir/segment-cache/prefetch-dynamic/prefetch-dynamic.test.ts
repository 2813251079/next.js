import { nextTestSetup } from 'e2e-utils'
import type * as Playwright from 'playwright'
import { createRouterAct } from '../router-act'

describe('<Link prefetch={true}> (dynamic)', () => {
  const { next, isNextDev } = nextTestSetup({
    files: __dirname,
  })
  if (isNextDev) {
    it('disabled in development', () => {})
    return
  }

  it('includes dynamic params', async () => {
    // Test that the link only prefetches the static part of the target page
    let page: Playwright.Page
    const browser = await next.browser('/', {
      beforePageLoad(p: Playwright.Page) {
        page = p
      },
    })
    const act = createRouterAct(page)

    // Reveal the link to trigger a dynamic prefetch for one value of the dynamic param
    await act(async () => {
      const linkToggle = await browser.elementByCss(
        'input[data-link-accordion="/dynamic-params/123"]'
      )
      await linkToggle.click()
    }, [
      // Should allow reading dynamic params
      {
        includes: 'Param: 123',
      },
      // Should not prefetch the dynamic content
      {
        includes: 'Dynamic content',
        block: 'reject',
      },
    ])

    // Reveal the link to trigger a dynamic prefetch for a different value of the dynamic param
    await act(async () => {
      const linkToggle = await browser.elementByCss(
        'input[data-link-accordion="/dynamic-params/456"]'
      )
      await linkToggle.click()
    }, [
      // Should allow reading dynamic params
      {
        includes: 'Param: 456',
      },
      // Should not prefetch the dynamic content
      {
        includes: 'Dynamic content',
        block: 'reject',
      },
    ])

    // Navigate to the page
    await act(
      async () => {
        await browser.elementByCss('a[href="/dynamic-params/123"]').click()
      },
      {
        // Now the dynamic content should be fetched
        includes: 'Dynamic content',
      }
    )
    expect(await browser.elementById('param-value').text()).toEqual(
      'Param: 123'
    )
    expect(await browser.elementById('dynamic-content').text()).toEqual(
      'Dynamic content'
    )

    await browser.back()

    // Reveal the link to the second page again. It should not be prefetched again
    await act(async () => {
      const linkToggle = await browser.elementByCss(
        'input[data-link-accordion="/dynamic-params/456"]'
      )
      await linkToggle.click()
    }, 'no-requests')

    // Navigate to the other page
    await act(
      async () => {
        await browser.elementByCss('a[href="/dynamic-params/456"]').click()
      },
      {
        // Now the dynamic content should be fetched
        includes: 'Dynamic content',
      }
    )
    expect(await browser.elementById('param-value').text()).toEqual(
      'Param: 456'
    )
    expect(await browser.elementById('dynamic-content').text()).toEqual(
      'Dynamic content'
    )
  })

  it('includes search params', async () => {
    // Test that the link only prefetches the static part of the target page
    let page: Playwright.Page
    const browser = await next.browser('/', {
      beforePageLoad(p: Playwright.Page) {
        page = p
      },
    })
    const act = createRouterAct(page)

    // Reveal the link to trigger a dynamic prefetch for one value of the search param
    await act(async () => {
      const linkToggle = await browser.elementByCss(
        'input[data-link-accordion="/search-params?searchParam=123"]'
      )
      await linkToggle.click()
    }, [
      // Should allow reading search params
      {
        includes: 'Search param: 123',
      },
      // Should not prefetch the dynamic content
      {
        includes: 'Dynamic content',
        block: 'reject',
      },
    ])

    // Reveal the link to trigger a dynamic prefetch for a different value of the search param
    await act(async () => {
      const linkToggle = await browser.elementByCss(
        'input[data-link-accordion="/search-params?searchParam=456"]'
      )
      await linkToggle.click()
    }, [
      // Should allow reading search params
      {
        includes: 'Search param: 456',
      },
      // Should not prefetch the dynamic content
      {
        includes: 'Dynamic content',
        block: 'reject',
      },
    ])

    // Navigate to the page
    await act(
      async () => {
        await browser
          .elementByCss('a[href="/search-params?searchParam=123"]')
          .click()
      },
      {
        // Now the dynamic content should be fetched
        includes: 'Dynamic content',
      }
    )
    expect(await browser.elementById('search-param-value').text()).toEqual(
      'Search param: 123'
    )
    expect(await browser.elementById('dynamic-content').text()).toEqual(
      'Dynamic content'
    )

    await browser.back()

    // Reveal the link to the second page again. It should not be prefetched again
    await act(async () => {
      const linkToggle = await browser.elementByCss(
        'input[data-link-accordion="/search-params?searchParam=456"]'
      )
      await linkToggle.click()
    }, 'no-requests')

    // Navigate to the other page
    await act(
      async () => {
        await browser
          .elementByCss('a[href="/search-params?searchParam=456"]')
          .click()
      },
      {
        // Now the dynamic content should be fetched
        includes: 'Dynamic content',
      }
    )
    expect(await browser.elementById('search-param-value').text()).toEqual(
      'Search param: 456'
    )
    expect(await browser.elementById('dynamic-content').text()).toEqual(
      'Dynamic content'
    )
  })

  it('includes cookies', async () => {
    // Test that the link only prefetches the static part of the target page
    let page: Playwright.Page
    const browser = await next.browser('/', {
      beforePageLoad(p: Playwright.Page) {
        page = p
      },
    })
    // Clear cookies after the test. This currently doesn't happen automatically.
    await using _ = defer(() => browser.deleteCookies())

    const act = createRouterAct(page)

    await browser.addCookie({ name: 'testCookie', value: 'initialValue' })

    // Reveal the link to trigger a dynamic prefetch for the initial cookie value
    await act(async () => {
      const linkToggle = await browser.elementByCss(
        'input[data-link-accordion="/cookies"]'
      )
      await linkToggle.click()
    }, [
      // Should allow reading cookies
      {
        includes: 'Cookie: initialValue',
      },
      // Should not prefetch the dynamic content
      {
        includes: 'Dynamic content',
        block: 'reject',
      },
    ])

    // Navigate to the page
    await act(
      async () => {
        await browser.elementByCss('a[href="/cookies"]').click()
      },
      {
        // Now the dynamic content should be fetched
        includes: 'Dynamic content',
      }
    )
    expect(await browser.elementById('cookie-value').text()).toEqual(
      'Cookie: initialValue'
    )
    expect(await browser.elementById('dynamic-content').text()).toEqual(
      'Dynamic content'
    )

    // Update the cookie via a server action.
    // This should cause the client cache to be dropped,
    // so the page should get prefetched again when the link becomes visible
    await browser.elementByCss('input[name="cookie"]').type('updatedValue')
    await browser.elementByCss('[type="submit"]').click()

    // Go back to the previous page
    await browser.back()

    // Reveal the link again to trigger a dynamic prefetch for the new value of the cookie
    await act(async () => {
      const linkToggle = await browser.elementByCss(
        'input[data-link-accordion="/cookies"]'
      )
      await linkToggle.click()
    }, [
      // Should allow reading dynamic params
      {
        includes: 'Cookie: updatedValue',
      },
      // Should not prefetch the dynamic content
      {
        includes: 'Dynamic content',
        block: 'reject',
      },
    ])

    // Navigate to the page
    await act(
      async () => {
        await browser.elementByCss('a[href="/cookies"]').click()
      },
      {
        // Now the dynamic content should be fetched
        includes: 'Dynamic content',
      }
    )

    expect(await browser.elementById('cookie-value').text()).toEqual(
      'Cookie: updatedValue'
    )
    expect(await browser.elementById('dynamic-content').text()).toEqual(
      'Dynamic content'
    )
  })
})

function defer(callback: () => Promise<void>) {
  return {
    [Symbol.asyncDispose]: callback,
  }
}
