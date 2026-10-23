import { TableClient } from '@azure/data-tables'
import { DefaultAzureCredential } from '@azure/identity'

const connectionString = process.env.STORAGE_CONNECTION_STRING
const accountName = process.env.STORAGE_ACCOUNT_NAME

const clients = new Map<string, TableClient>()

/**
 * Returns a cached TableClient for the given table, creating the table on first use.
 * Local dev (Azurite) authenticates via STORAGE_CONNECTION_STRING; a real deployment
 * omits that setting and uses the Function App's system-assigned Managed Identity via
 * DefaultAzureCredential instead — no account keys are ever held in app settings.
 */
export async function getTableClient(tableName: string): Promise<TableClient> {
  const cached = clients.get(tableName)
  if (cached) return cached

  let client: TableClient
  if (connectionString) {
    client = TableClient.fromConnectionString(connectionString, tableName, { allowInsecureConnection: true })
  } else {
    if (!accountName) {
      throw new Error('Set STORAGE_CONNECTION_STRING (local/Azurite) or STORAGE_ACCOUNT_NAME (deployed) in app settings.')
    }
    client = new TableClient(`https://${accountName}.table.core.windows.net`, tableName, new DefaultAzureCredential())
  }

  await client.createTable().catch((err: { statusCode?: number }) => {
    if (err.statusCode !== 409) throw err // 409 = table already exists, ignore
  })

  clients.set(tableName, client)
  return client
}

export const TABLE_NAMES = {
  progress: 'Progress',
  progressByDay: 'ProgressByDay',
  quizAttempts: 'QuizAttempts',
  githubSubmissions: 'GithubSubmissions',
  assignmentSubmissions: 'AssignmentSubmissions',
  evaluations: 'Evaluations',
  activity: 'Activity',
  notifications: 'Notifications',
  users: 'Users',
} as const
