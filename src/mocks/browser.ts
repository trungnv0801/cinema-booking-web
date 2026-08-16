import { setupWorker } from 'msw/browser'

import { handlers } from './handlers'
import { applyMockSessionOverride } from './session'

applyMockSessionOverride()

export const worker = setupWorker(...handlers)
