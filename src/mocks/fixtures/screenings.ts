import type { ScreeningDetail, ShowtimeGroup } from '@/entities/screening'

import { cinemas } from './cinemas'
import { movies } from './movies'

const paperLanterns = movies[0]!
const lastReel = movies[1]!
const meridianBay = cinemas[0]!

export const screeningDetails: Record<string, ScreeningDetail> = {
  'screening-1': {
    id: 'screening-1',
    movie: {
      id: paperLanterns.id,
      title: paperLanterns.title,
      ageRating: paperLanterns.ageRating,
      posterUrl: paperLanterns.posterUrl,
    },
    cinema: { id: meridianBay.id, code: meridianBay.code, name: meridianBay.name },
    auditoriumName: 'Screen 3',
    startsAt: '2026-10-15T19:30:00+07:00',
    basePriceVnd: 100_000,
    status: 'SCHEDULED',
  },
}

export function buildShowtimes(date: string): ShowtimeGroup[] {
  const isWednesday = new Date(date).getDay() === 3

  return cinemas.map((cinema) => ({
    cinema: { id: cinema.id, code: cinema.code, name: cinema.name, address: cinema.address },
    movies: [
      {
        movie: {
          id: paperLanterns.id,
          title: paperLanterns.title,
          ageRating: paperLanterns.ageRating,
          posterUrl: paperLanterns.posterUrl,
        },
        formats: [
          {
            screenType: '2D',
            subtitle: 'VI',
            screenings: [
              {
                id: 'screening-1',
                startsAt: `${date}T19:30:00+07:00`,
                endsAt: `${date}T21:41:00+07:00`,
                auditoriumName: 'Screen 3',
                basePriceVnd: 100_000,
                availableSeats: 42,
                totalSeats: 96,
                soldOut: false,
                activeDiscount: isWednesday
                  ? { code: 'MARQUEE_WEDNESDAY', label: 'Marquee Wednesdays', percent: 30 }
                  : null,
              },
            ],
          },
        ],
      },
      {
        movie: {
          id: lastReel.id,
          title: lastReel.title,
          ageRating: lastReel.ageRating,
          posterUrl: lastReel.posterUrl,
        },
        formats: [
          {
            screenType: '2D',
            subtitle: 'EN',
            screenings: [
              {
                id: 'screening-2',
                startsAt: `${date}T21:00:00+07:00`,
                endsAt: `${date}T22:58:00+07:00`,
                auditoriumName: 'Screen 1',
                basePriceVnd: 100_000,
                availableSeats: 0,
                totalSeats: 88,
                soldOut: true,
                activeDiscount: null,
              },
            ],
          },
        ],
      },
    ],
  }))
}
