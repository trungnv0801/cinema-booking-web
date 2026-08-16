import { http, HttpResponse } from 'msw'

import { cinemas } from '../fixtures/cinemas'
import { movies, movieSummaries } from '../fixtures/movies'
import { buildShowtimes, screeningDetails } from '../fixtures/screenings'
import { buildSeatMap } from '../fixtures/seat-map'
import { ticketTypes } from '../fixtures/ticket-types'
import { API_BASE, problem } from '../problem'

export const catalogHandlers = [
  http.get(`${API_BASE}/movies`, ({ request }) => {
    const url = new URL(request.url)
    const q = url.searchParams.get('q')?.trim().toLowerCase()
    const status = url.searchParams.get('status')
    const items = movieSummaries
      .filter((movie) =>
        status ? movie.status === status : q ? true : movie.status === 'NOW_SHOWING',
      )
      .filter((movie) => (q ? movie.title.toLowerCase().includes(q) : true))

    return HttpResponse.json({
      items,
      page: 0,
      size: 20,
      totalItems: items.length,
      totalPages: 1,
      hasNext: false,
    })
  }),

  http.get(`${API_BASE}/movies/:slug`, ({ params }) => {
    const movie = movies.find((m) => m.slug === params.slug)
    if (!movie) return problem({ status: 404, code: 'NOT_FOUND', title: 'Movie not found' })
    return HttpResponse.json(movie)
  }),

  http.get(`${API_BASE}/cinemas`, () => HttpResponse.json(cinemas)),

  http.get(`${API_BASE}/showtimes`, ({ request }) => {
    const url = new URL(request.url)
    const date = url.searchParams.get('date') ?? new Date().toISOString().slice(0, 10)
    return HttpResponse.json(buildShowtimes(date))
  }),

  http.get(`${API_BASE}/screenings/:id`, ({ params }) => {
    const screening = screeningDetails[params.id as string]
    if (!screening) return problem({ status: 404, code: 'NOT_FOUND', title: 'Screening not found' })
    return HttpResponse.json(screening)
  }),

  http.get(`${API_BASE}/screenings/:id/seats`, ({ params }) => {
    return HttpResponse.json(buildSeatMap(params.id as string), {
      headers: { 'Cache-Control': 'no-store' },
    })
  }),

  http.get(`${API_BASE}/ticket-types`, () => HttpResponse.json(ticketTypes)),
]
