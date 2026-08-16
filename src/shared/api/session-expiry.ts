type SessionExpiredHandler = () => void

let handler: SessionExpiredHandler | null = null

export function onSessionExpired(next: SessionExpiredHandler): void {
  handler = next
}

export function notifySessionExpired(): void {
  handler?.()
}
