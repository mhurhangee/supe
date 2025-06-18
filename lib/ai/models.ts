import { openai } from '@ai-sdk/openai'

export const models = {
  nano: openai.responses('gpt-4.1-nano'),
  mini: openai.responses('gpt-4.1-mini'),
  turbo: openai.responses('gpt-4.1'),
  reasoning: openai.responses('o4-mini'),
}
