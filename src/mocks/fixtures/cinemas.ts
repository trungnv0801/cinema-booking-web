import type { Cinema } from '@/shared/types/domain'

export const cinemas: Cinema[] = [
  {
    id: 'cinema-mb',
    code: 'MB',
    name: 'Halcyon Cinemas Meridian Bay',
    address: '12 Harbor View Blvd, Meridian Bay',
    district: 'Meridian Bay',
    latitude: 21.03,
    longitude: 105.79,
  },
  {
    id: 'cinema-bl',
    code: 'BL',
    name: 'Halcyon Cinemas Brookline',
    address: '48 Elm Street, Brookline',
    district: 'Brookline',
    latitude: 21.05,
    longitude: 105.82,
  },
  {
    id: 'cinema-ef',
    code: 'EF',
    name: 'Halcyon Cinemas Eastford',
    address: '9 Ashwood Road, Eastford',
    district: 'Eastford',
    latitude: 21.01,
    longitude: 105.76,
  },
]
