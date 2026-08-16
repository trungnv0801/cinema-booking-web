export const queryKeys = {
  movies: {
    all: ['movies'] as const,
    list: (params: unknown) => ['movies', 'list', params] as const,
    detail: (slug: string) => ['movies', 'detail', slug] as const,
  },
  cinemas: {
    all: ['cinemas'] as const,
  },
  ticketTypes: {
    all: ['ticket-types'] as const,
  },
  showtimes: {
    list: (params: unknown) => ['showtimes', params] as const,
  },
  screenings: {
    detail: (id: string) => ['screenings', id] as const,
    seats: (id: string) => ['screenings', id, 'seats'] as const,
  },
  holds: {
    detail: (holdGroup: string) => ['holds', holdGroup] as const,
  },
  bookings: {
    all: ['bookings'] as const,
    list: (params: unknown) => ['bookings', 'list', params] as const,
    detail: (code: string) => ['bookings', 'detail', code] as const,
  },
  payments: {
    status: (publicId: string) => ['payments', publicId, 'status'] as const,
  },
  tickets: {
    list: (scope: string, params: unknown) => ['tickets', 'list', scope, params] as const,
    detail: (code: string) => ['tickets', 'detail', code] as const,
  },
  pos: {
    screenings: (params: unknown) => ['pos', 'screenings', params] as const,
    shift: ['pos', 'shift'] as const,
    lookup: (params: unknown) => ['pos', 'lookup', params] as const,
  },
  checkIn: {
    stats: (screeningId: string) => ['check-in', screeningId, 'stats'] as const,
    log: (screeningId: string) => ['check-in', screeningId, 'log'] as const,
  },
  admin: {
    movies: {
      list: (params: unknown) => ['admin', 'movies', 'list', params] as const,
      detail: (id: string) => ['admin', 'movies', 'detail', id] as const,
    },
    cinemas: {
      list: ['admin', 'cinemas'] as const,
    },
    auditoriums: {
      list: (cinemaId: string) => ['admin', 'cinemas', cinemaId, 'auditoriums'] as const,
    },
    seatMap: (auditoriumId: string) => ['admin', 'auditoriums', auditoriumId, 'seat-map'] as const,
    screenings: {
      list: (params: unknown) => ['admin', 'screenings', params] as const,
    },
    pricing: {
      ticketTypes: ['admin', 'pricing', 'ticket-types'] as const,
      seatTypes: ['admin', 'pricing', 'seat-types'] as const,
      discountRules: ['admin', 'pricing', 'discount-rules'] as const,
    },
    bookings: {
      list: (params: unknown) => ['admin', 'bookings', 'list', params] as const,
      detail: (code: string) => ['admin', 'bookings', 'detail', code] as const,
    },
    refundRequests: {
      list: (params: unknown) => ['admin', 'refund-requests', params] as const,
    },
    reports: {
      daily: (params: unknown) => ['admin', 'reports', 'daily', params] as const,
    },
    staff: {
      list: (params: unknown) => ['admin', 'staff', params] as const,
    },
    auditLogs: {
      list: (params: unknown) => ['admin', 'audit-logs', params] as const,
    },
  },
}
