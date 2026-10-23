import { CheckCircle2, XCircle } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { cn, formatPercent } from '@/lib/utils'
import type { Quiz, QuizAttempt } from '@/domain/quiz'

interface QuizResultSummaryProps {
  quiz: Quiz
  attempt: QuizAttempt
  attemptsRemaining: number
  canRetake: boolean
  onRetake: () => void
}

export function QuizResultSummary({ quiz, attempt, attemptsRemaining, canRetake, onRetake }: QuizResultSummaryProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Quiz Completed</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <Badge tone={attempt.passed ? 'success' : 'danger'}>{attempt.passed ? 'Passed' : 'Not Passed'}</Badge>
            <p className="text-sm font-semibold text-ink">
              Score: {attempt.correctCount} / {attempt.totalQuestions} ({formatPercent(attempt.scorePercent)})
            </p>
          </div>
          <p className="text-sm text-muted">Passing score: {quiz.passingScorePercent}%</p>

          {!attempt.passed && (
            <p className="text-sm text-muted">
              {attemptsRemaining > 0
                ? `You have ${attemptsRemaining} attempt${attemptsRemaining === 1 ? '' : 's'} remaining.`
                : 'You have used all of your attempts for this quiz.'}
            </p>
          )}

          {canRetake && (
            <Button onClick={onRetake} variant="secondary">
              Retake Quiz
            </Button>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Answer Review</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {quiz.questions.map((question, index) => {
            const answer = attempt.answers.find((a) => a.questionId === question.id)
            const selectedIndex = answer?.selectedOptionIndex
            const isCorrect = selectedIndex === question.correctOptionIndex

            return (
              <div key={question.id} className="border-b border-line pb-5 last:border-b-0 last:pb-0">
                <div className="flex items-start gap-2">
                  {isCorrect ? (
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success-500" aria-hidden />
                  ) : (
                    <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-danger-500" aria-hidden />
                  )}
                  <p className="text-sm font-medium text-ink">
                    {index + 1}. {question.question}
                  </p>
                </div>

                <div className="mt-2 space-y-1 pl-6 text-sm">
                  <p className={cn('text-muted', !isCorrect && 'text-danger-600')}>
                    Your answer:{' '}
                    {selectedIndex !== undefined ? question.options[selectedIndex] : 'Not answered'}
                  </p>
                  {!isCorrect && (
                    <p className="text-success-700">Correct answer: {question.options[question.correctOptionIndex]}</p>
                  )}
                  <p className="mt-1 text-muted">{question.explanation}</p>
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>
    </div>
  )
}
