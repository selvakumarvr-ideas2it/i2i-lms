/**
 * Removes the 8 demo trainees (trainee01..trainee08@ideas2it.com, seeded by
 * seed-demo-trainees.ts) and every row of their data — Progress, ProgressByDay,
 * QuizAttempts, GithubSubmissions, AssignmentSubmissions, Evaluations, Activity,
 * Notifications, and their Users table row. The admin user and any real trainees you've
 * added since are never touched — this only ever targets the exact demo trainee ids
 * from ../../src/data/seed/users.seed.ts.
 *
 * Defaults to a DRY RUN (reports what it would delete, deletes nothing). Pass
 * --confirm to actually delete: `npm run delete:demo -- --confirm`.
 */
import { getTableClient, TABLE_NAMES } from '../src/repositories/tableClientFactory'
import { TRAINEES } from '../../src/data/seed/users.seed'

const CONFIRM = process.argv.includes('--confirm')
const CONCURRENCY = 16

interface Key {
  partitionKey: string
  rowKey: string
}

/** Deletes `keys` from `tableName` with bounded concurrency, tolerating already-gone rows. */
async function deleteKeys(tableName: string, keys: Key[]): Promise<number> {
  if (keys.length === 0) return 0
  if (!CONFIRM) return keys.length

  const client = await getTableClient(tableName)
  let nextIndex = 0
  let deleted = 0

  async function worker() {
    while (nextIndex < keys.length) {
      const key = keys[nextIndex++]!
      try {
        await client.deleteEntity(key.partitionKey, key.rowKey)
        deleted++
      } catch (err: unknown) {
        if ((err as { statusCode?: number }).statusCode !== 404) throw err
      }
    }
  }

  await Promise.all(Array.from({ length: Math.min(CONCURRENCY, keys.length) }, worker))
  return deleted
}

async function keysForPartition(tableName: string, partitionKey: string): Promise<Key[]> {
  const client = await getTableClient(tableName)
  const keys: Key[] = []
  for await (const entity of client.listEntities<{ partitionKey: string; rowKey: string }>({
    queryOptions: { filter: `PartitionKey eq '${partitionKey}'` },
  })) {
    keys.push({ partitionKey: entity.partitionKey, rowKey: entity.rowKey })
  }
  return keys
}

async function main() {
  console.log(CONFIRM ? 'Deleting demo trainees and their data...' : 'DRY RUN — pass --confirm to actually delete. Reporting what would be removed:')

  const totals: Record<string, number> = {
    Progress: 0,
    ProgressByDay: 0,
    QuizAttempts: 0,
    GithubSubmissions: 0,
    AssignmentSubmissions: 0,
    Evaluations: 0,
    Activity: 0,
    Notifications: 0,
    Users: 0,
  }

  for (const trainee of TRAINEES) {
    const progressKeys = await keysForPartition(TABLE_NAMES.progress, trainee.id)
    // ProgressByDay is the inverse index (PK=dayId, RK=traineeId) — derive its keys
    // from the trainee's own Progress rows rather than scanning every day partition.
    const progressByDayKeys = progressKeys.map((k) => ({ partitionKey: k.rowKey, rowKey: k.partitionKey }))

    totals.Progress! += await deleteKeys(TABLE_NAMES.progress, progressKeys)
    totals.ProgressByDay! += await deleteKeys(TABLE_NAMES.progressByDay, progressByDayKeys)
    totals.QuizAttempts! += await deleteKeys(TABLE_NAMES.quizAttempts, await keysForPartition(TABLE_NAMES.quizAttempts, trainee.id))
    totals.GithubSubmissions! += await deleteKeys(TABLE_NAMES.githubSubmissions, await keysForPartition(TABLE_NAMES.githubSubmissions, trainee.id))
    totals.AssignmentSubmissions! += await deleteKeys(
      TABLE_NAMES.assignmentSubmissions,
      await keysForPartition(TABLE_NAMES.assignmentSubmissions, trainee.id),
    )
    totals.Evaluations! += await deleteKeys(TABLE_NAMES.evaluations, await keysForPartition(TABLE_NAMES.evaluations, trainee.id))
    totals.Activity! += await deleteKeys(TABLE_NAMES.activity, await keysForPartition(TABLE_NAMES.activity, trainee.id))
    totals.Notifications! += await deleteKeys(TABLE_NAMES.notifications, await keysForPartition(TABLE_NAMES.notifications, trainee.id))
    totals.Users! += await deleteKeys(TABLE_NAMES.users, [{ partitionKey: 'USER', rowKey: trainee.id }])

    console.log(`  ${CONFIRM ? 'deleted' : 'would delete'} data for ${trainee.email}`)
  }

  console.log(`\n${CONFIRM ? 'Deleted' : 'Would delete'} (${TRAINEES.length} trainees):`)
  for (const [table, count] of Object.entries(totals)) {
    console.log(`  ${table}: ${count}`)
  }
  if (!CONFIRM) {
    console.log('\nNo changes made. Re-run with --confirm to actually delete.')
  }
}

main().catch((err) => {
  console.error('\nDeleting demo trainees failed:', err)
  process.exitCode = 1
})
