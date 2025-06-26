/**
 * Gets an environment variable and validates that it exists
 * @param key The environment variable key
 * @param errorMessage Optional custom error message
 * @returns The environment variable value
 * @throws Error if the environment variable is not set
 */
export function getRequiredEnvVar(
  key: string,
  errorMessage?: string
): string {
  const value = process.env[key];
  
  if (!value) {
    throw new Error(
      errorMessage || `${key} environment variable is not set`
    );
  }
  
  return value;
}

/**
 * Gets the LlamaIndex Cloud API key from environment variables
 * @returns The LlamaIndex Cloud API key
 * @throws Error if the API key is not set
 */
export function getLlamaCloudApiKey(): string {
  return getRequiredEnvVar('LLAMA_CLOUD_API_KEY');
}
