import { getTableClient, TABLE_NAMES } from '../tableClientFactory'
import type { QuizAttemptRepository } from '../interfaces'
import type { QuizAnswer, QuizAttempt } from '../../../../src/domain/quiz'

interface QuizAttemptEntity {
  partitionKey: string
  rowKey: string
  id: string
  quizId: string
  traineeId: string
  attemptNumber: number
  answersJson: string
  correctCount: number
  totalQuestions: number
  scorePercent: number
  passed: boolean
  startedAt: string
  completedAt?: string
}

function rowKeyFor(quizId: string, attemptNumber: number): string {
  return `${quizId}_${String(attemptNumber).padStart(3, '0')}`
}

function toEntity(attempt: QuizAttempt): QuizAttemptEntity {
  const entity: QuizAttemptEntity = {
    partitionKey: attempt.traineeId,
    rowKey: rowKeyFor(attempt.quizId, attempt.attemptNumber),
    id: attempt.id,
    quizId: attempt.quizId,
    traineeId: attempt.traineeId,
    attemptNumber: attempt.attemptNumber,
    answersJson: JSON.stringify(attempt.answers),
    correctCount: attempt.correctCount,
    totalQuestions: attempt.totalQuestions,
    scorePercent: attempt.scorePercent,
    passed: attempt.passed,
    startedAt: attempt.startedAt,
  }
  if (attempt.completedAt != null) entity.completedAt = attempt.completedAt
  return entity
}

function fromEntity(entity: QuizAttemptEntity): QuizAttempt {
  return {
    id: entity.id,
    quizId: entity.quizId,
    traineeId: entity.traineeId,
    attemptNumber: entity.attemptNumber,
    answers: JSON.parse(entity.answersJson) as QuizAnswer[],
    correctCount: entity.correctCount,
    totalQuestions: entity.totalQuestions,
    scorePercent: entity.scorePercent,
    passed: entity.passed,
    startedAt: entity.startedAt,
    completedAt: entity.completedAt ?? null,
  }
}

export function createTableQuizAttemptRepository(): QuizAttemptRepository {
  return {
    async listForTraineeQuiz(traineeId, quizId) {
      const client = await getTableClient(TABLE_NAMES.quizAttempts)
      const results: QuizAttempt[] = []
      for await (const entity of client.listEntities<QuizAttemptEntity>({
        queryOptions: { filter: `PartitionKey eq '${traineeId}' and quizId eq '${quizId}'` },
      })) {
        results.push(fromEntity(entity))
      }
      return results.sort((a, b) => a.attemptNumber - b.attemptNumber)
    },

    async create(attempt) {
      const client = await getTableClient(TABLE_NAMES.quizAttempts)
      await client.upsertEntity(toEntity(attempt), 'Replace')
      return attempt
    },
  }
}
