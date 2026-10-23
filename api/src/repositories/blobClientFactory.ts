import { BlobServiceClient, type ContainerClient } from '@azure/storage-blob'
import { DefaultAzureCredential } from '@azure/identity'

const connectionString = process.env.STORAGE_CONNECTION_STRING
const accountName = process.env.STORAGE_ACCOUNT_NAME

let serviceClient: BlobServiceClient | null = null

function getServiceClient(): BlobServiceClient {
  if (serviceClient) return serviceClient

  if (connectionString) {
    serviceClient = BlobServiceClient.fromConnectionString(connectionString)
  } else {
    if (!accountName) {
      throw new Error('Set STORAGE_CONNECTION_STRING (local/Azurite) or STORAGE_ACCOUNT_NAME (deployed) in app settings.')
    }
    serviceClient = new BlobServiceClient(`https://${accountName}.blob.core.windows.net`, new DefaultAzureCredential())
  }
  return serviceClient
}

const containerClients = new Map<string, ContainerClient>()

/** Returns a cached ContainerClient, creating the container (private access) on first use. */
export async function getContainerClient(containerName: string): Promise<ContainerClient> {
  const cached = containerClients.get(containerName)
  if (cached) return cached

  const client = getServiceClient().getContainerClient(containerName)
  await client.createIfNotExists()
  containerClients.set(containerName, client)
  return client
}

export const CONTAINER_NAMES = {
  courseContent: process.env.COURSE_CONTENT_CONTAINER ?? 'course-content',
  datasets: process.env.DATASETS_CONTAINER ?? 'datasets',
} as const
