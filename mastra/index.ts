import { Mastra } from '@mastra/core/mastra'

import { generalAgent } from './agents/general-agent'
import { weatherAgent } from './agents/weather-agent'

const ENV = process.env.NODE_ENV || 'development'

export const mastra = new Mastra({
  agents: {
    weatherAgent,
    generalAgent,
  },
  server: {
    // Disable CORS for development
    cors:
      ENV === 'development'
        ? {
            origin: '*',
            allowMethods: ['*'],
            allowHeaders: ['*'],
          }
        : undefined,
  },
})
