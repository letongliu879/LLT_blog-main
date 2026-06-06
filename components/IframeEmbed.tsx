'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

interface IframeEmbedProps {
  src: string
  minHeight?: number
  title?: string
}

const MAX_IFRAME_HEIGHT = 6000

const getDocumentHeight = (doc: Document) => {
  const bodyHeight = Math.max(doc.body?.scrollHeight ?? 0, doc.body?.offsetHeight ?? 0)
  const rootHeight = Math.max(
    doc.documentElement?.scrollHeight ?? 0,
    doc.documentElement?.offsetHeight ?? 0
  )
  const viewportHeight = doc.defaultView?.innerHeight ?? doc.documentElement?.clientHeight ?? 0

  const rootContentHeight = Math.abs(rootHeight - viewportHeight) <= 24 ? 0 : rootHeight

  return Math.max(bodyHeight, rootContentHeight)
}

export default function IframeEmbed({ src, minHeight = 600, title }: IframeEmbedProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [height, setHeight] = useState(minHeight)
  const latestHeightRef = useRef(minHeight)

  useEffect(() => {
    latestHeightRef.current = minHeight
    setHeight(minHeight)
  }, [minHeight])

  const setNextHeight = useCallback(
    (nextHeight: number) => {
      const safeHeight = Math.min(Math.max(Math.ceil(nextHeight), minHeight), MAX_IFRAME_HEIGHT)
      if (safeHeight !== latestHeightRef.current) {
        latestHeightRef.current = safeHeight
        setHeight(safeHeight)
      }
    },
    [minHeight]
  )

  const adjustHeight = useCallback(() => {
    const iframe = iframeRef.current
    if (!iframe) return
    try {
      const doc = iframe.contentDocument || iframe.contentWindow?.document
      if (doc) {
        setNextHeight(getDocumentHeight(doc))
      }
    } catch {
      setNextHeight(minHeight)
    }
  }, [minHeight, setNextHeight])

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      const iframe = iframeRef.current
      if (!iframe || event.source !== iframe.contentWindow) return
      const payload = event.data
      if (!payload || payload.type !== 'iframe-height') return
      const reportedHeight = Number(payload.height)
      if (!Number.isFinite(reportedHeight) || reportedHeight <= 0) return
      const measuredHeight = (() => {
        try {
          const doc = iframe.contentDocument || iframe.contentWindow?.document
          return doc ? getDocumentHeight(doc) : reportedHeight
        } catch {
          return reportedHeight
        }
      })()

      const maxTrustedHeight = measuredHeight > 0 ? measuredHeight + 320 : reportedHeight
      const nextHeight = Math.min(reportedHeight, maxTrustedHeight)

      setNextHeight(Math.max(nextHeight, measuredHeight))
    }

    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [setNextHeight])

  useEffect(() => {
    const iframe = iframeRef.current
    if (!iframe) return

    let resizeObserver: ResizeObserver | null = null
    let animationFrameId = 0

    const observeDocument = () => {
      try {
        const doc = iframe.contentDocument || iframe.contentWindow?.document
        if (!doc?.body || !doc.documentElement) return
        resizeObserver = new ResizeObserver(() => adjustHeight())
        resizeObserver.observe(doc.body)
        resizeObserver.observe(doc.documentElement)
      } catch {
        resizeObserver = null
      }
    }

    const onLoad = () => {
      adjustHeight()
      observeDocument()
      animationFrameId = window.requestAnimationFrame(() => adjustHeight())
    }

    iframe.addEventListener('load', onLoad)

    return () => {
      iframe.removeEventListener('load', onLoad)
      if (resizeObserver) {
        resizeObserver.disconnect()
      }
      if (animationFrameId) {
        window.cancelAnimationFrame(animationFrameId)
      }
    }
  }, [adjustHeight])

  const resolvedTitle =
    title ||
    src
      .replace(/.*\//, '')
      .replace(/\.html$/, '')
      .replace(/-/g, ' ')

  return (
    <iframe
      ref={iframeRef}
      src={src}
      title={resolvedTitle}
      width="100%"
      height={height}
      loading="lazy"
      scrolling="no"
      style={{ border: 'none', borderRadius: '12px', display: 'block', overflow: 'hidden' }}
    />
  )
}
