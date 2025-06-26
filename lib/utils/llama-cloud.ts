const LLAMA_API_BASE = 'https://api.cloud.llamaindex.ai/api/v1/parsing'

type JobStatus = 'PENDING' | 'SUCCESS' | 'ERROR' | 'PARTIAL_SUCCESS' | 'CANCELLED'

export async function uploadFile(file: File, apiKey: string) {
  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch(`${LLAMA_API_BASE}/upload`, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: formData,
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(`Upload failed: ${data.detail || response.statusText}`)
  }

  if (!data.id) {
    throw new Error('No job ID returned from upload')
  }

  return data.id
}

export async function checkJobStatus(jobId: string, apiKey: string): Promise<JobStatus> {
  const response = await fetch(`${LLAMA_API_BASE}/job/${jobId}`, {
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(`Status check failed: ${data.detail || response.statusText}`)
  }

  return data.status
}

export async function getMarkdownResult(jobId: string, apiKey: string) {
  const response = await fetch(`${LLAMA_API_BASE}/job/${jobId}/result/markdown`, {
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(`Failed to get results: ${data.detail || response.statusText}`)
  }

  if (!data.markdown) {
    throw new Error('No markdown content returned in results')
  }

  return data.markdown
}

export async function statusUpdate(jobId: string, apiKey: string) {
  // Step 2: Poll for job completion
  let status: JobStatus
  let attempts = 0
  const maxAttempts = 120 // Maximum 120 seconds of polling
  let waitTime = 1000 // Start with 1 second wait

  do {
    status = await checkJobStatus(jobId, apiKey)

    if (status === 'ERROR') {
      throw new Error('Parsing job failed')
    }

    if (status === 'CANCELLED') {
      throw new Error('Parsing job was cancelled')
    }

    if (status === 'PENDING') {
      await new Promise(resolve => setTimeout(resolve, waitTime))
      attempts++
      // Exponential backoff with a maximum of 5 seconds
      waitTime = Math.min(waitTime * 1.5, 5000)
    }

    if (attempts >= maxAttempts) {
      throw new Error('Parsing timeout after 120 seconds')
    }
  } while (status === 'PENDING')

  if (status !== 'SUCCESS' && status !== 'PARTIAL_SUCCESS') {
    throw new Error(`Unexpected job status: ${status}`)
  }

  return status
}

export async function parseFile(file: File, apiKey: string) {
  const jobId = await uploadFile(file, apiKey)
  await statusUpdate(jobId, apiKey)
  const content = await getMarkdownResult(jobId, apiKey)
  return content
}
