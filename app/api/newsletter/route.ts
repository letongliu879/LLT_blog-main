import { NextResponse } from 'next/server'
import siteMetadata from '@/data/siteMetadata'

export const dynamic = 'force-dynamic'

const provider = siteMetadata.newsletter?.provider
const buttondownApiRoute = 'https://api.buttondown.email/v1/subscribers'
const siteMetadataButtondownUsername = (
  siteMetadata.newsletter as { buttondownUsername?: string } | undefined
)?.buttondownUsername
const buttondownUsername =
  process.env.NEXT_PUBLIC_BUTTONDOWN_USERNAME?.trim() || siteMetadataButtondownUsername?.trim()
const buttondownEmbedRoute = buttondownUsername
  ? `https://buttondown.com/api/emails/embed-subscribe/${buttondownUsername}`
  : null
const fallbackUrl =
  process.env.NEXT_PUBLIC_NEWSLETTER_FALLBACK_URL?.trim() ||
  (buttondownUsername ? `https://buttondown.com/${buttondownUsername}` : undefined) ||
  (siteMetadata.email
    ? `mailto:${siteMetadata.email}?subject=${encodeURIComponent('Newsletter Subscription')}`
    : undefined)

function hasApiKey() {
  return Boolean(process.env.BUTTONDOWN_API_KEY)
}

function canUseEmbedMode() {
  return Boolean(buttondownEmbedRoute)
}

function getProviderConfigError() {
  if (!provider) {
    return 'Newsletter provider is disabled.'
  }

  if (provider !== 'buttondown') {
    return `Newsletter provider "${provider}" is not supported by this route.`
  }

  if (!hasApiKey() && !canUseEmbedMode()) {
    return 'Newsletter is not configured yet. Missing BUTTONDOWN_API_KEY or NEXT_PUBLIC_BUTTONDOWN_USERNAME.'
  }

  return null
}

function toErrorResponse(error: string, status = 503) {
  return NextResponse.json({ error, fallbackUrl }, { status })
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

async function getProviderMessage(response: Response) {
  try {
    const payload = await response.json()
    if (typeof payload === 'string') {
      return payload
    }

    if (Array.isArray(payload?.detail)) {
      return payload.detail
        .map((item) => {
          if (typeof item === 'string') {
            return item
          }

          if (item?.msg && typeof item.msg === 'string') {
            return item.msg
          }

          return ''
        })
        .filter(Boolean)
        .join('; ')
    }

    if (payload?.detail && typeof payload.detail === 'string') {
      return payload.detail
    }

    if (payload?.error && typeof payload.error === 'string') {
      return payload.error
    }

    if (payload?.message && typeof payload.message === 'string') {
      return payload.message
    }

    return ''
  } catch {
    return ''
  }
}

function mapProviderError(status: number, providerMessage: string) {
  const normalized = providerMessage.toLowerCase()

  if (status === 409 || (status === 400 && normalized.includes('already'))) {
    return { status: 409, error: '你已订阅，无需重复操作。' }
  }

  if (status === 400) {
    return { status: 400, error: 'Please enter a valid email address.' }
  }

  if (status === 422) {
    return { status: 400, error: providerMessage || 'Please enter a valid email address.' }
  }

  if (status === 401 || status === 403) {
    return {
      status: 503,
      error: 'Newsletter service is temporarily unavailable. Please use the fallback link.',
    }
  }

  if (status === 429) {
    return { status: 429, error: 'Too many requests. Please try again in a minute.' }
  }

  return {
    status: 502,
    error: providerMessage || 'Unable to subscribe right now. Please try again later.',
  }
}

function parseEmbedStatus(html: string) {
  const authBlockMatch = html.match(
    /<script id="subscriber_facing_authentication" type="application\/json">([\s\S]*?)<\/script>/i
  )

  if (!authBlockMatch) {
    return null
  }

  try {
    const payload = JSON.parse(authBlockMatch[1])
    return typeof payload?.status === 'string' ? payload.status : null
  } catch {
    return null
  }
}

async function subscribeViaApi(email: string) {
  const response = await fetch(buttondownApiRoute, {
    method: 'POST',
    headers: {
      Authorization: `Token ${process.env.BUTTONDOWN_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email_address: email }),
    cache: 'no-store',
  })

  if (response.ok) {
    return NextResponse.json({ message: '订阅成功，请去邮箱点确认链接。' }, { status: 201 })
  }

  const providerMessage = await getProviderMessage(response)
  const mappedError = mapProviderError(response.status, providerMessage)
  return toErrorResponse(mappedError.error, mappedError.status)
}

async function subscribeViaEmbed(email: string) {
  if (!buttondownEmbedRoute) {
    return toErrorResponse('Newsletter is not configured yet.', 503)
  }

  const response = await fetch(buttondownEmbedRoute, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({ email }),
    cache: 'no-store',
  })

  const html = await response.text()
  const embedStatus = parseEmbedStatus(html)

  if (!response.ok) {
    return toErrorResponse('Unable to subscribe right now. Please try again later.', 502)
  }

  if (embedStatus === 'email_address_confirmed' || embedStatus === 'email_address_unconfirmed') {
    return NextResponse.json({ message: '订阅成功，请去邮箱点确认链接。' }, { status: 201 })
  }

  return NextResponse.json(
    {
      message: '订阅请求已提交，请去邮箱点确认链接。',
    },
    { status: 201 }
  )
}

export async function GET() {
  const configError = getProviderConfigError()

  if (configError) {
    return toErrorResponse(configError, 503)
  }

  return NextResponse.json(
    {
      message: 'Newsletter service is ready.',
      provider,
      mode: hasApiKey() ? 'api' : 'embed',
      fallbackUrl,
    },
    { status: 200 }
  )
}

export async function POST(request: Request) {
  const configError = getProviderConfigError()

  if (configError) {
    return toErrorResponse(configError, 503)
  }

  let payload: { email?: string }

  try {
    payload = await request.json()
  } catch {
    return toErrorResponse('Request body must be valid JSON.', 400)
  }

  const email = payload?.email?.trim() || ''
  if (!email) {
    return toErrorResponse('Email is required.', 400)
  }

  if (!isValidEmail(email)) {
    return toErrorResponse('Please enter a valid email address.', 400)
  }

  if (hasApiKey()) {
    return subscribeViaApi(email)
  }

  return subscribeViaEmbed(email)
}
