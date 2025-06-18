import { openai } from '@ai-sdk/openai'

const web_search_preview = openai.tools.webSearchPreview({
  searchContextSize: 'high',
  userLocation: {
    type: 'approximate',
    country: 'GB',
    region: 'Hampshire',
  },
})

export const tools = {
  web_search_preview,
}
