import { Agent } from '@mastra/core/agent'

import { models, systemPrompts } from '@/lib/ai'

export const generalAgent = new Agent({
  name: 'General Agent',
  instructions: systemPrompts.basic,
  model: models.mini,
})
