import { adminHandlers } from './admin'
import { authHandlers } from './auth'
import { bookingHandlers } from './bookings'
import { catalogHandlers } from './catalog'
import { holdHandlers } from './holds'
import { paymentHandlers } from './payments'
import { quoteHandlers } from './quote'
import { ticketHandlers } from './tickets'

export const handlers = [
  ...authHandlers,
  ...catalogHandlers,
  ...holdHandlers,
  ...quoteHandlers,
  ...bookingHandlers,
  ...paymentHandlers,
  ...ticketHandlers,
  ...adminHandlers,
]
