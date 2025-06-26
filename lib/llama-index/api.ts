const LLAMA_CLOUD_API_BASE = 'https://api.cloud.llamaindex.ai/api/v1';

/**
 * Interface for the response from the LlamaIndex upload endpoint
 */
interface UploadResponse {
  job_id: string;
  status: string;
}

/**
 * Interface for the response from the LlamaIndex job status endpoint
 */
interface JobStatusResponse {
  job_id: string;
  status: string;
  created_at: string;
  updated_at: string;
}

/**
 * Interface for the response from the LlamaIndex markdown result endpoint
 */
interface MarkdownResultResponse {
  job_id: string;
  result: string;
}

/**
 * Uploads a PDF file to LlamaIndex for parsing
 * @param fileBuffer ArrayBuffer containing the PDF file
 * @param fileName Name of the PDF file
 * @param apiKey LlamaIndex API key
 * @returns Job ID for the parsing job
 */
export async function uploadPdfForParsing(
  fileBuffer: ArrayBuffer,
  fileName: string,
  apiKey: string
): Promise<string> {
  try {
    const formData = new FormData();
    
    // Create a Blob from the ArrayBuffer
    const blob = new Blob([fileBuffer], { type: 'application/pdf' });
    
    // Add the file to the form data
    formData.append('upload_file', blob, fileName);

    const response = await fetch(`${LLAMA_CLOUD_API_BASE}/files`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Accept': 'application/json',
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Upload error response:', errorText);
      throw new Error(`Upload failed with status: ${response.status}. Details: ${errorText}`);
    }

    const data = await response.json() as UploadResponse;
    return data.job_id;
  } catch (error) {
    console.error('Error uploading PDF for parsing:', error);
    throw error;
  }
}

/**
 * Checks the status of a parsing job
 * @param jobId Job ID from the upload step
 * @param apiKey LlamaIndex API key
 * @returns Job status response
 */
export async function checkParsingJobStatus(
  jobId: string,
  apiKey: string
): Promise<JobStatusResponse> {
  try {
    const response = await fetch(`${LLAMA_CLOUD_API_BASE}/parsing/job/${jobId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Status check error response:', errorText);
      throw new Error(`Status check failed with status: ${response.status}. Details: ${errorText}`);
    }

    return await response.json() as JobStatusResponse;
  } catch (error) {
    console.error('Error checking parsing job status:', error);
    throw error;
  }
}

/**
 * Retrieves the markdown result of a completed parsing job
 * @param jobId Job ID from the upload step
 * @param apiKey LlamaIndex API key
 * @returns Markdown result
 */
export async function getParsingJobMarkdownResult(
  jobId: string,
  apiKey: string
): Promise<string> {
  try {
    const response = await fetch(`${LLAMA_CLOUD_API_BASE}/parsing/job/${jobId}/result/markdown`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Result retrieval error response:', errorText);
      throw new Error(`Result retrieval failed with status: ${response.status}. Details: ${errorText}`);
    }

    const data = await response.json() as MarkdownResultResponse;
    return data.result;
  } catch (error) {
    console.error('Error retrieving parsing job result:', error);
    throw error;
  }
}

/**
 * Polls a parsing job until it completes or fails
 * @param jobId Job ID from the upload step
 * @param apiKey LlamaIndex API key
 * @param maxAttempts Maximum number of polling attempts
 * @param intervalMs Interval between polling attempts in milliseconds
 * @returns Job status
 */
export async function pollParsingJobUntilComplete(
  jobId: string,
  apiKey: string,
  maxAttempts: number = 30,
  intervalMs: number = 2000
): Promise<JobStatusResponse> {
  let attempts = 0;
  
  while (attempts < maxAttempts) {
    const status = await checkParsingJobStatus(jobId, apiKey);
    
    if (status.status === 'completed') {
      return status;
    }
    
    if (status.status === 'failed') {
      throw new Error('Parsing job failed');
    }
    
    // Wait before the next poll
    await new Promise(resolve => setTimeout(resolve, intervalMs));
    attempts++;
  }
  
  throw new Error('Parsing job timed out');
}

/**
 * Complete workflow to parse a PDF file and get the markdown result
 * @param fileBuffer ArrayBuffer containing the PDF file
 * @param fileName Name of the PDF file
 * @param apiKey LlamaIndex API key
 * @returns Markdown result
 */
export async function parsePdfToMarkdown(
  fileBuffer: ArrayBuffer,
  fileName: string,
  apiKey: string
): Promise<string> {
  // Upload the PDF
  const jobId = await uploadPdfForParsing(fileBuffer, fileName, apiKey);
  
  // Poll until the job is complete
  await pollParsingJobUntilComplete(jobId, apiKey);
  
  // Get the markdown result
  return await getParsingJobMarkdownResult(jobId, apiKey);
}
