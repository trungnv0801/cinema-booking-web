import type { BookingDetail } from '@/entities/booking/api/bookings'

export const sampleBooking: BookingDetail = {
  code: 'BK-7K2X',
  publicId: 'booking-1',
  status: 'PAID',
  screening: {
    id: 'screening-1',
    movieTitle: 'Paper Lanterns',
    cinemaName: 'Halcyon Cinemas Meridian Bay',
    auditoriumName: 'Screen 3',
    startsAt: '2026-10-15T19:30:00+07:00',
  },
  items: [
    {
      seatLabel: 'D5',
      seatType: 'VIP',
      ticketTypeCode: 'STUDENT',
      finalPriceVnd: 91_000,
      discountLabel: 'Marquee Wednesdays',
    },
  ],
  subtotalVnd: 260_000,
  discountVnd: 78_000,
  totalVnd: 182_000,
  holdExpiresAt: '2026-10-15T19:34:12+07:00',
  createdAt: '2026-10-15T19:24:12+07:00',
  payment: {
    method: 'PAYBRIDGE',
    status: 'PAID',
    providerTxnNo: '14536892',
    completedAt: '2026-10-15T19:26:00+07:00',
  },
  tickets: [{ code: 'TK-4X9K-2201', seatLabel: 'D5', status: 'VALID' }],
}
