import { getOpsToken } from '@/lib/utils'

import { tool } from 'ai'
import { z } from 'zod'

export const textSearch = tool({
  description: 'Search for patents by text or keyword.',
  inputSchema: z.object({
    query: z.string().describe('Free text or keywords to search for in patents.'),
  }),
  execute: async input => {
    const { query } = input
    const token = await getOpsToken()

    const url = `https://ops.epo.org/3.2/rest-services/published-data/search/full-cycle?q=txt=${encodeURIComponent(query)}&Range=1-3`
    const res = await fetch(url, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
    if (!res.ok) throw new Error('OPS request failed')
    const data = await res.json()

    return { data }
  },
})
