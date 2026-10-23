import { getContainerClient } from '../blobClientFactory'

async function streamToString(readable: NodeJS.ReadableStream): Promise<string> {
  const chunks: Buffer[] = []
  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
  }
  return Buffer.concat(chunks).toString('utf-8')
}

export async function readJson<T>(containerName: string, blobPath: string): Promise<T | null> {
  const container = await getContainerClient(containerName)
  const blob = container.getBlobClient(blobPath)
  if (!(await blob.exists())) return null

  const download = await blob.download()
  if (!download.readableStreamBody) return null
  const text = await streamToString(download.readableStreamBody)
  return JSON.parse(text) as T
}

export async function writeJson(containerName: string, blobPath: string, value: unknown): Promise<void> {
  const container = await getContainerClient(containerName)
  const block = container.getBlockBlobClient(blobPath)
  const content = JSON.stringify(value, null, 2)
  await block.upload(content, Buffer.byteLength(content), {
    blobHTTPHeaders: { blobContentType: 'application/json' },
  })
}
