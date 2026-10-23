import { randomUUID } from 'node:crypto'
import { scoreQuiz } from '../../../src/services/logic/quizScoring'
import { HttpError } from '../auth/requireRole'
import { notFound } from '../http/respond'
import type { ProgressService } from './progressService'
import type { Repositories } from '../repositories/interfaces'
import type { QuizAnswer, QuizAttempt } from '../../../src/domain/quiz'

export interface SubmitQuizResult extends QuizAttempt {
  attemptsRemaining: number
}

export function createQuizService(repos: Repositories, progressService: ProgressService) {
  return {
    getAttempts(traineeId: string, quizId: string): Promise<QuizAttempt[]> {
      return repos.quizAttempts.listForTraineeQuiz(traineeId, quizId)
    },

    async submitAttempt(traineeId: string, dayId: string, quizId: string, answers: QuizAnswer[]): Promise<SubmitQuizResult> {
      const quiz = await repos.courseContent.getQuiz(quizId)
      if (!quiz) notFound(`Quiz not found: ${quizId}`)

      const priorAttempts = await repos.quizAttempts.listForTraineeQuiz(traineeId, quizId)
      if (priorAttempts.length >= quiz.maxAttempts) {
        throw new HttpError(400, `Maximum attempts (${quiz.maxAttempts}) reached for this quiz`)
      }

      const result = scoreQuiz(quiz, answers)
      const now = new Date().toISOString()
      const attempt: QuizAttempt = {
        id: randomUUID(),
        quizId,
        traineeId,
        attemptNumber: priorAttempts.length + 1,
        answers,
        correctCount: result.correctCount,
        totalQuestions: result.totalQuestions,
        scorePercent: result.scorePercent,
        passed: result.passed,
        startedAt: now,
        completedAt: now,
      }

      await repos.quizAttempts.create(attempt)
      await progressService.recordQuizResult(traineeId, dayId, result.scorePercent, attempt.attemptNumber)
      await repos.activity.append({
        id: randomUUID(),
        traineeId,
        type: 'QUIZ_COMPLETED',
        dayId,
        metadata: { scorePercent: result.scorePercent, passed: result.passed },
        timestamp: now,
      })

      return { ...attempt, attemptsRemaining: Math.max(0, quiz.maxAttempts - attempt.attemptNumber) }
    },
  }
}

export type QuizService = ReturnType<typeof createQuizService>
