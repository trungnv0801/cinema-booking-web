import type { TicketDetail } from '@/entities/ticket/api'

export const sampleTicket: TicketDetail = {
  code: 'TK-4X9K-2201',
  status: 'VALID',
  qrToken: 'eyJ0IjoiNGE5ay0yMjAxIiwic2lnIjoiLi4uIn0',
  movie: {
    title: 'Paper Lanterns',
    ageRating: '16+',
    posterUrl: 'https://picsum.photos/seed/paper-lanterns/400/600',
  },
  cinema: { name: 'Halcyon Cinemas Meridian Bay', address: '12 Harbor View Blvd, Meridian Bay' },
  auditoriumName: 'Screen 3',
  seatLabel: 'D5',
  seatType: 'VIP',
  ticketType: {
    code: 'STUDENT',
    name: 'Student Ticket',
    requiresProof: true,
    proofNote: 'Show a student ID at the counter',
  },
  startsAt: '2026-10-15T19:30:00+07:00',
  bookingCode: 'BK-7K2X',
  checkedInAt: null,
}
