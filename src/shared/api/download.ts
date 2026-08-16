import type { AxiosResponse } from 'axios'

export function extractFilename(contentDisposition: string | undefined, fallback: string): string {
  if (!contentDisposition) return fallback

  const utf8Match = /filename\*=UTF-8''([^;]+)/i.exec(contentDisposition)
  if (utf8Match?.[1]) return decodeURIComponent(utf8Match[1])

  const quotedMatch = /filename="((?:[^"\\]|\\.)*)"/i.exec(contentDisposition)
  if (quotedMatch?.[1]) return quotedMatch[1].replace(/\\(.)/g, '$1')

  const plainMatch = /filename=([^;]+)/i.exec(contentDisposition)
  if (plainMatch?.[1]) return plainMatch[1].trim()

  return fallback
}

export function downloadBlob(response: AxiosResponse<Blob>, fallbackFilename: string): void {
  const filename = extractFilename(response.headers['content-disposition'], fallbackFilename)
  const url = URL.createObjectURL(response.data)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
