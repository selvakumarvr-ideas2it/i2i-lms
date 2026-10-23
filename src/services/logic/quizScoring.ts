import type { Quiz, QuizAnswer } from '@/domain/quiz'

export interface QuizScoreResult {
  correctCount: number
  totalQuestions: number
  scorePercent: number
  passed: boolean
}

export function scoreQuiz(quiz: Quiz, answers: QuizAnswer[]): QuizScoreResult {
  const totalQuestions = quiz.questions.length
  const correctCount = quiz.questions.reduce((count, question) => {
    const answer = answers.find((a) => a.questionId === question.id)
    return answer && answer.selectedOptionIndex === question.correctOptionIndex ? count + 1 : count
  }, 0)

  const scorePercent = totalQuestions === 0 ? 0 : Math.round((correctCount / totalQuestions) * 100)
  const passed = scorePercent >= quiz.passingScorePercent

  return { correctCount, totalQuestions, scorePercent, passed }
}
