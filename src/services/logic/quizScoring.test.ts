import { describe, expect, it } from 'vitest'
import { scoreQuiz } from './quizScoring'
import type { Quiz } from '@/domain/quiz'

const quiz: Quiz = {
  id: 'quiz-day-1',
  dayId: 'day-1',
  title: 'Day 1 Quiz',
  passingScorePercent: 70,
  maxAttempts: 3,
  questions: [
    { id: 'q1', quizId: 'quiz-day-1', question: 'Q1', options: ['a', 'b', 'c', 'd'], correctOptionIndex: 0, explanation: '', difficulty: 'EASY', topic: 'x' },
    { id: 'q2', quizId: 'quiz-day-1', question: 'Q2', options: ['a', 'b', 'c', 'd'], correctOptionIndex: 1, explanation: '', difficulty: 'EASY', topic: 'x' },
    { id: 'q3', quizId: 'quiz-day-1', question: 'Q3', options: ['a', 'b', 'c', 'd'], correctOptionIndex: 2, explanation: '', difficulty: 'EASY', topic: 'x' },
    { id: 'q4', quizId: 'quiz-day-1', question: 'Q4', options: ['a', 'b', 'c', 'd'], correctOptionIndex: 3, explanation: '', difficulty: 'EASY', topic: 'x' },
    { id: 'q5', quizId: 'quiz-day-1', question: 'Q5', options: ['a', 'b', 'c', 'd'], correctOptionIndex: 0, explanation: '', difficulty: 'EASY', topic: 'x' },
  ],
}

describe('scoreQuiz', () => {
  it('scores a perfect attempt as 100% and passed', () => {
    const answers = quiz.questions.map((q) => ({ questionId: q.id, selectedOptionIndex: q.correctOptionIndex }))
    const result = scoreQuiz(quiz, answers)
    expect(result).toEqual({ correctCount: 5, totalQuestions: 5, scorePercent: 100, passed: true })
  })

  it('fails an attempt below the passing score', () => {
    const answers = [
      { questionId: 'q1', selectedOptionIndex: 0 },
      { questionId: 'q2', selectedOptionIndex: 0 },
      { questionId: 'q3', selectedOptionIndex: 0 },
      { questionId: 'q4', selectedOptionIndex: 0 },
      { questionId: 'q5', selectedOptionIndex: 0 },
    ]
    const result = scoreQuiz(quiz, answers)
    expect(result.correctCount).toBe(2)
    expect(result.scorePercent).toBe(40)
    expect(result.passed).toBe(false)
  })

  it('treats an unanswered question as incorrect', () => {
    const answers = [{ questionId: 'q1', selectedOptionIndex: 0 }]
    const result = scoreQuiz(quiz, answers)
    expect(result.correctCount).toBe(1)
    expect(result.totalQuestions).toBe(5)
  })

  it('passes exactly at the passing threshold', () => {
    const answers = [
      { questionId: 'q1', selectedOptionIndex: 0 },
      { questionId: 'q2', selectedOptionIndex: 1 },
      { questionId: 'q3', selectedOptionIndex: 2 },
      { questionId: 'q4', selectedOptionIndex: 3 },
      { questionId: 'q5', selectedOptionIndex: 1 },
    ]
    const result = scoreQuiz({ ...quiz, passingScorePercent: 80 }, answers)
    expect(result.scorePercent).toBe(80)
    expect(result.passed).toBe(true)
  })
})
