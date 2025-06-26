import { NextRequest, NextResponse } from 'next/server';

const LLAMA_API_BASE = 'https://api.cloud.llamaindex.ai/api/v1/parsing';

type JobStatus = 'PENDING' | 'SUCCESS' | 'ERROR' | 'PARTIAL_SUCCESS' | 'CANCELLED';

async function uploadFile(file: File, apiKey: string) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${LLAMA_API_BASE}/upload`, {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: formData,
  });

  const data = await response.json();
  console.log('Upload response:', data);
  
  if (!response.ok) {
    throw new Error(`Upload failed: ${data.detail || response.statusText}`);
  }

  if (!data.id) {
    throw new Error('No job ID returned from upload');
  }

  return data.id;
}

async function checkJobStatus(jobId: string, apiKey: string): Promise<JobStatus> {
  const response = await fetch(`${LLAMA_API_BASE}/job/${jobId}`, {
    headers: {
      'accept': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
  });

  const data = await response.json();
  console.log('Status response:', data);

  if (!response.ok) {
    throw new Error(`Status check failed: ${data.detail || response.statusText}`);
  }

  return data.status;
}

async function getMarkdownResult(jobId: string, apiKey: string) {
  const response = await fetch(`${LLAMA_API_BASE}/job/${jobId}/result/markdown`, {
    headers: {
      'accept': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
  });

  const data = await response.json();
  console.log('Result response:', data);

  if (!response.ok) {
    throw new Error(`Failed to get results: ${data.detail || response.statusText}`);
  }

  if (!data.markdown) {
    throw new Error('No markdown content returned in results');
  }

  return data.markdown;
}

export async function POST(request: NextRequest) {
  try {

    const apiKey = process.env.LLAMA_CLOUD_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'LlamaIndex API key not configured' },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    console.log('Uploading file to LlamaIndex:', { filename: file.name });

    // Step 1: Upload file and get job ID
    const jobId = await uploadFile(file, apiKey);
    console.log('Upload successful, job ID:', jobId);

    // Step 2: Poll for job completion
    let status: JobStatus;
    let attempts = 0;
    const maxAttempts = 120; // Maximum 120 seconds of polling

    do {
      status = await checkJobStatus(jobId, apiKey);
      console.log('Job status:', status);
      
      if (status === 'ERROR') {
        throw new Error('Parsing job failed');
      }

      if (status === 'CANCELLED') {
        throw new Error('Parsing job was cancelled');
      }
      
      if (status === 'PENDING') {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
        attempts++;
      }

      if (attempts >= maxAttempts) {
        throw new Error('Parsing timeout after 120 seconds');
      }
    } while (status === 'PENDING');

    if (status === 'PARTIAL_SUCCESS') {
      console.warn('Job completed with parti    al success');
    }

    if (status !== 'SUCCESS' && status !== 'PARTIAL_SUCCESS') {
      throw new Error(`Unexpected job status: ${status}`);
    }

    // Step 3: Get markdown result
    console.log('Getting markdown result...');
    const content = await getMarkdownResult(jobId, apiKey);
    console.log('Got content, length:', content.length);

    return NextResponse.json({ content });

  } catch (error) {
    console.error('Parsing error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to parse document' },
      { status: 500 }
    );
  }
}