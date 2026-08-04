import { useEffect } from 'react'

/**
 * Sets the browser tab title and meta description for the current page.
 * Basic but genuinely useful SEO — Google uses these for search snippets,
 * and browsers/WhatsApp/Facebook use them for link previews.
 */
export default function useDocumentTitle(title, description) {
  useEffect(() => {
    const fullTitle = `${title} | BrightSmile Dental Care`
    document.title = fullTitle

    if (description) {
      let meta = document.querySelector('meta[name="description"]')
      if (!meta) {
        meta = document.createElement('meta')
        meta.setAttribute('name', 'description')
        document.head.appendChild(meta)
      }
      meta.setAttribute('content', description)
    }
  }, [title, description])
}