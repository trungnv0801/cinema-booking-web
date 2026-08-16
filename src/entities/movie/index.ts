import { useQuery } from '@tanstack/react-query'

import { movieListOptions } from './api'

export {
  getMovie,
  getMovies,
  type MovieDetail,
  movieDetailOptions,
  movieListOptions,
  type MovieListParams,
  type MovieSummary,
} from './api'

export function useMovieSearch(query: string) {
  const q = query.trim()
  return useQuery({ ...movieListOptions({ q, size: 6 }), enabled: q.length >= 2 })
}
