import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useAuth } from '@/auth/AuthContext'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { EmptyState, ErrorState, LoadingState } from '@/components/shared/States'
import { useQuizQuery } from '@/hooks/useCourse'
import { useQuizAttempts, useSubmitQuizAttempt } from '@/hooks/useQuiz'
import * as quizService from '@/services/quizService'
import { cn, formatPercent } from '@/lib/utils'
import { ROUTES } from '@/routes'
import { QuizQuestionCard } from '@/features/quiz/QuizQuestionCard'
import { QuizResultSummary } from '@/features/quiz/QuizResultSummary'
import type { QuizAnswer, QuizAttempt } from '@/domain/quiz'
import type { SubmitQuizResult } from '@/services/quizService'

type Mode = 'taking' | 'result' | null

export function QuizPage() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const traineeId = user?.id

  const quizQuery = useQuizQuery(id)
  const attemptsQuery = useQuizAttempts(traineeId, id)
  const submitMutation = useSubmitQuizAttempt(traineeId ?? '', quizQuery.data?.dayId ?? '', id ?? '')

  const [mode, setMode] = useState<Mode>(null)
  const [answers, setAnswers] = useState<QuizAnswer[]>([])
  const [startedAt, setStartedAt] = useState<string>('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [displayedResult, setDisplayedResult] = useState<{ attempt: QuizAttempt; attemptsRemaining: number } | null>(
    null,
  )

  const quiz = quizQuery.data
  const attempts = attemptsQuery.data ?? []
  const maxAttemptsReached = Boolean(quiz && attempts.length >= quiz.maxAttempts)

  useEffect(() => {
    if (!quiz || !traineeId || attemptsQuery.isLoading || maxAttemptsReached || mode !== null) return

    const draft = quizService.getQuizDraft(traineeId, quiz)
    if (draft) {
      setAnswers(draft.answers)
      setStartedAt(draft.startedAt)
      setMode('taking')
      return
    }

    const passedAttempts = attempts.filter((a) => a.passed)
    const bestPassed = passedAttempts.length
      ? passedAttempts.reduce((best, a) => (a.scorePercent > best.scorePercent ? a : best))
      : null

    if (bestPassed) {
      setDisplayedResult({ attempt: bestPassed, attemptsRemaining: quiz.maxAttempts - attempts.length })
      setMode('result')
      return
    }

    let cancelled = false
    quizService.startAttempt(traineeId, quiz, quiz.dayId).then((draftResult) => {
      if (cancelled) return
      setAnswers(draftResult.answers)
      setStartedAt(draftResult.startedAt)
      setMode('taking')
    })
    return () => {
      cancelled = true
    }
  }, [quiz, traineeId, attempts, attemptsQuery.isLoading, maxAttemptsReached, mode])

  if (quizQuery.isLoading || attemptsQuery.isLoading) return <LoadingState label="Loading quiz…" />
  if (quizQuery.isError) {
    return (
      <ErrorState
        message={quizQuery.error instanceof Error ? quizQuery.error.message : 'Unable to load this quiz.'}
        onRetry={() => quizQuery.refetch()}
      />
    )
  }
  if (attemptsQuery.isError) {
    return (
      <ErrorState
        message={attemptsQuery.error instanceof Error ? attemptsQuery.error.message : 'Unable to load your attempts.'}
        onRetry={() => attemptsQuery.refetch()}
      />
    )
  }
  if (!quiz) {
    return <ErrorState message="This quiz could not be found." />
  }
  if (!traineeId) {
    return <ErrorState message="You must be signed in to take this quiz." />
  }

  const backLink = (
    <Link
      to={ROUTES.learningDay(quiz.dayId)}
      className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-ink"
    >
      <ArrowLeft className="h-4 w-4" /> Back to Day
    </Link>
  )

  if (maxAttemptsReached) {
    const bestOrLast =
      attempts.filter((a) => a.passed).sort((a, b) => b.scorePercent - a.scorePercent)[0] ??
      [...attempts].sort((a, b) => b.attemptNumber - a.attemptNumber)[0]

    return (
      <div className="mx-auto max-w-3xl space-y-6">
        {backLink}
        <EmptyState
          title="Maximum attempts reached"
          description={
            bestOrLast
              ? `Your best result was ${bestOrLast.correctCount} / ${bestOrLast.totalQuestions} (${formatPercent(bestOrLast.scorePercent)}). You have used all ${quiz.maxAttempts} attempts for "${quiz.title}".`
              : `You have used all ${quiz.maxAttempts} attempts for "${quiz.title}".`
          }
        />
      </div>
    )
  }

  if (mode === 'result' && displayedResult) {
    const canRetake = attempts.length < quiz.maxAttempts

    return (
      <div className="mx-auto max-w-3xl space-y-6">
        {backLink}
        <h1 className="text-2xl font-bold text-ink">{quiz.title}</h1>
        <QuizResultSummary
          quiz={quiz}
          attempt={displayedResult.attempt}
          attemptsRemaining={displayedResult.attemptsRemaining}
          canRetake={canRetake}
          onRetake={() => {
            setDisplayedResult(null)
            setAnswers([])
            setCurrentIndex(0)
            setMode(null)
          }}
        />
      </div>
    )
  }

  if (mode !== 'taking') {
    return <LoadingState label="Preparing quiz…" />
  }

  const questions = quiz.questions
  const currentQuestion = questions[currentIndex]
  const isLastQuestion = currentIndex === questions.length - 1
  const answeredQuestionIds = new Set(answers.map((a) => a.questionId))
  const unansweredCount = questions.length - answeredQuestionIds.size

  const handleSelect = (optionIndex: number) => {
    setAnswers((prev) => {
      const next = prev.filter((a) => a.questionId !== currentQuestion.id)
      next.push({ questionId: currentQuestion.id, selectedOptionIndex: optionIndex })
      quizService.saveQuizDraft(traineeId, quiz, next, startedAt)
      return next
    })
  }

  const handleSubmit = () => {
    submitMutation.mutate(answers, {
      onSuccess: (result: SubmitQuizResult) => {
        setDisplayedResult({ attempt: result, attemptsRemaining: result.attemptsRemaining })
        setMode('result')
      },
    })
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {backLink}
      <h1 className="text-2xl font-bold text-ink">{quiz.title}</h1>

      <Card>
        <CardHeader>
          <CardTitle>Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-2">
            {questions.map((question, index) => {
              const answered = answeredQuestionIds.has(question.id)
              const isCurrent = index === currentIndex
              return (
                <button
                  key={question.id}
                  type="button"
                  onClick={() => setCurrentIndex(index)}
                  aria-label={`Go to question ${index + 1}${answered ? ' (answered)' : ' (unanswered)'}`}
                  className={cn(
                    'h-3 w-3 rounded-full border-2 transition-colors',
                    answered ? 'border-brand-600 bg-brand-600' : 'border-slate-300 bg-white',
                    isCurrent && 'ring-2 ring-brand-300 ring-offset-1',
                  )}
                />
              )
            })}
          </div>
          {unansweredCount > 0 && (
            <p className="mt-3 text-xs text-muted">
              {unansweredCount} question{unansweredCount === 1 ? '' : 's'} unanswered.
            </p>
          )}
        </CardContent>
      </Card>

      <QuizQuestionCard
        question={currentQuestion}
        index={currentIndex}
        total={questions.length}
        selectedOptionIndex={answers.find((a) => a.questionId === currentQuestion.id)?.selectedOptionIndex}
        onSelect={handleSelect}
      />

      {submitMutation.isError && (
        <div role="alert" className="rounded-lg border border-danger-500/30 bg-danger-50 px-3 py-2 text-sm text-danger-600">
          {submitMutation.error instanceof Error ? submitMutation.error.message : 'Unable to submit your quiz.'}
        </div>
      )}

      <div className="flex items-center justify-between">
        <Button
          variant="secondary"
          onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
          disabled={currentIndex === 0}
        >
          Previous
        </Button>

        {isLastQuestion ? (
          <Button onClick={handleSubmit} disabled={submitMutation.isPending}>
            {submitMutation.isPending ? 'Submitting…' : 'Submit Quiz'}
          </Button>
        ) : (
          <Button onClick={() => setCurrentIndex((i) => Math.min(questions.length - 1, i + 1))}>Next</Button>
        )}
      </div>
    </div>
  )
}
