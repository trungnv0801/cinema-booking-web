const DIGIT_X = [46, 96, 150]

export function TicketStubArt({ code }: { code: string }) {
  return (
    <svg viewBox="0 0 220 120" fill="none">
      <path
        d="M8 20h94l-6 10 6 10-6 10 6 10-6 10 6 10-6 10 6 10H8z"
        fill="var(--color-primary)"
        stroke="var(--color-border-strong)"
      />
      <path
        d="M212 20h-94l6 10-6 10 6 10-6 10 6 10-6 10 6 10-6 10h94z"
        fill="var(--color-primary)"
        stroke="var(--color-border-strong)"
      />
      {code.split('').map((digit, index) => (
        <text
          key={index}
          x={DIGIT_X[index]}
          y="76"
          fill={index === 1 ? 'var(--color-fg-muted)' : 'var(--color-accent)'}
          fontSize="42"
          fontWeight="700"
        >
          {digit}
        </text>
      ))}
    </svg>
  )
}
