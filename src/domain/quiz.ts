export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD'

export interface QuizQuestion {
  id: string
  quizId: string
  question: string
  options: [string, string, string, string]
  correctOptionIndex: 0 | 1 | 2 | 3
  explanation: string
  difficulty: Difficulty
  topic: string
}

export interface Quiz {
  id: string
  dayId: string
  title: string
  passingScorePercent: number
  maxAttempts: number
  questions: QuizQuestion[]
}

export interface QuizAnswer {
  questionId: string
  selectedOptionIndex: number
}

export interface QuizAttempt {
  id: string
  quizId: string
  traineeId: string
  attemptNumber: number
  answers: QuizAnswer[]
  correctCount: number
  totalQuestions: number
  scorePercent: number
  passed: boolean
  startedAt: string
  completedAt: string | null
}
