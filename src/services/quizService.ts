import { logActivity } from '@/services/activityService'
import { apiFetch } from '@/services/http'
import type { Quiz, QuizAnswer, QuizAttempt } from '@/domain/quiz'

function draftKey(traineeId: string, quizId: string) {
  return `pbi-accelerator:quiz-draft:${traineeId}:${quizId}`
}

export interface QuizDraft {
  startedAt: string
  answers: QuizAnswer[]
  /** See hashQuizContent — lets a stale draft from before a content rewrite be detected and discarded. */
  contentHash: string
}

/**
 * A cheap, deterministic fingerprint of a quiz's actual question content (not just its
 * id). Course content gets re-seeded from time to time — same quiz id, entirely
 * different questions/options/answer keys. Without this, a trainee's in-progress
 * localStorage draft from before a re-seed would silently get replayed against the new
 * content: `selectedOptionIndex: 2` from the old "Question 4" landing on whatever
 * unrelated question now sits at that same position, showing up as answers the trainee
 * never actually picked.
 */
export function hashQuizContent(quiz: Quiz): string {
  const signature = quiz.questions
    .map((q) => `${q.id}:${q.question}:${q.options.join('|')}:${q.correctOptionIndex}`)
    .join(';')
  let hash = 0
  for (let i = 0; i < signature.length; i++) {
    hash = (Math.imul(31, hash) + signature.charCodeAt(i)) | 0
  }
  return hash.toString(36)
}

export function getQuizDraft(traineeId: string, quiz: Quiz): QuizDraft | null {
  try {
    const raw = window.localStorage.getItem(draftKey(traineeId, quiz.id))
    if (!raw) return null
    const draft = JSON.parse(raw) as QuizDraft
    if (draft.contentHash !== hashQuizContent(quiz)) {
      // Stale draft from before this quiz's content was re-seeded — discard rather
      // than risk replaying answers against questions that no longer mean the same thing.
      clearQuizDraft(traineeId, quiz.id)
      return null
    }
    return draft
  } catch {
    return null
  }
}

export function saveQuizDraft(traineeId: string, quiz: Quiz, answers: QuizAnswer[], startedAt: string) {
  const draft: QuizDraft = { startedAt, answers, contentHash: hashQuizContent(quiz) }
  window.localStorage.setItem(draftKey(traineeId, quiz.id), JSON.stringify(draft))
}

export function clearQuizDraft(traineeId: string, quizId: string) {
  window.localStorage.removeItem(draftKey(traineeId, quizId))
}

export async function getAttempts(traineeId: string, quizId: string): Promise<QuizAttempt[]> {
  return apiFetch(`/api/trainees/${traineeId}/quizzes/${quizId}/attempts`)
}

export async function startAttempt(traineeId: string, quiz: Quiz, dayId: string): Promise<QuizDraft> {
  const existing = getQuizDraft(traineeId, quiz)
  if (existing) return existing
  await logActivity(traineeId, 'QUIZ_STARTED', dayId)
  const draft: QuizDraft = { startedAt: new Date().toISOString(), answers: [], contentHash: hashQuizContent(quiz) }
  window.localStorage.setItem(draftKey(traineeId, quiz.id), JSON.stringify(draft))
  return draft
}

export interface SubmitQuizResult extends QuizAttempt {
  attemptsRemaining: number
}

export async function submitAttempt(
  traineeId: string,
  dayId: string,
  quizId: string,
  answers: QuizAnswer[],
): Promise<SubmitQuizResult> {
  const result = await apiFetch<SubmitQuizResult>(`/api/trainees/${traineeId}/quizzes/${quizId}/attempts`, {
    method: 'POST',
    body: JSON.stringify({ dayId, answers }),
  })
  clearQuizDraft(traineeId, quizId)
  return result
}
