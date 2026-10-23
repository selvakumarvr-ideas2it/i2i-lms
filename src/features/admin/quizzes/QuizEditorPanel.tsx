import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { useAuth } from '@/auth/AuthContext'
import { Button } from '@/components/ui/Button'
import { FieldError, Input, Label, Textarea } from '@/components/ui/Input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/RadioGroup'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select'
import { useUpdateQuiz } from '@/hooks/useCourseAdmin'
import type { Difficulty, Quiz, QuizQuestion } from '@/domain/quiz'

function createBlankQuestion(quizId: string): QuizQuestion {
  return {
    id: `${quizId}-q${Date.now()}`,
    quizId,
    question: '',
    options: ['', '', '', ''],
    correctOptionIndex: 0,
    explanation: '',
    difficulty: 'EASY',
    topic: '',
  }
}

export function QuizEditorPanel({ quiz }: { quiz: Quiz }) {
  const { user } = useAuth()
  const isReadOnly = user?.role === 'MANAGER'
  const updateQuiz = useUpdateQuiz()
  const [questions, setQuestions] = useState<QuizQuestion[]>(quiz.questions)
  const [passingScorePercent, setPassingScorePercent] = useState(quiz.passingScorePercent)
  const [maxAttempts, setMaxAttempts] = useState(quiz.maxAttempts)
  const [showSaved, setShowSaved] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(null)

  function updateQuestion(index: number, patch: Partial<QuizQuestion>) {
    setQuestions((prev) => prev.map((question, i) => (i === index ? { ...question, ...patch } : question)))
  }

  function updateOption(index: number, optionIndex: number, value: string) {
    setQuestions((prev) =>
      prev.map((question, i) => {
        if (i !== index) return question
        const options = [...question.options] as [string, string, string, string]
        options[optionIndex] = value
        return { ...question, options }
      }),
    )
  }

  function addQuestion() {
    setQuestions((prev) => [...prev, createBlankQuestion(quiz.id)])
  }

  function removeQuestion(index: number) {
    setQuestions((prev) => prev.filter((_, i) => i !== index))
  }

  function handleSave() {
    if (questions.length === 0) {
      setValidationError('Add at least one question before saving.')
      return
    }
    if (questions.some((question) => !question.question.trim() || question.options.some((option) => !option.trim()))) {
      setValidationError('Every question needs question text and all 4 options filled in.')
      return
    }
    setValidationError(null)
    updateQuiz.mutate(
      { id: quiz.id, patch: { passingScorePercent, maxAttempts, questions } },
      {
        onSuccess: () => {
          setShowSaved(true)
          setTimeout(() => setShowSaved(false), 2000)
        },
      },
    )
  }

  return (
    <div className="space-y-6">
      {isReadOnly && <p className="text-sm text-muted">Manager access is read-only — editing is disabled.</p>}
      <fieldset disabled={isReadOnly} className="contents">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor={`${quiz.id}-passing`}>Passing Score (%)</Label>
          <Input
            id={`${quiz.id}-passing`}
            type="number"
            min={0}
            max={100}
            value={passingScorePercent}
            onChange={(event) => setPassingScorePercent(Number(event.target.value))}
          />
        </div>
        <div>
          <Label htmlFor={`${quiz.id}-attempts`}>Max Attempts</Label>
          <Input
            id={`${quiz.id}-attempts`}
            type="number"
            min={1}
            value={maxAttempts}
            onChange={(event) => setMaxAttempts(Number(event.target.value))}
          />
        </div>
      </div>

      <div className="space-y-4">
        {questions.map((question, index) => (
          <div key={question.id} className="rounded-lg border border-line p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-semibold text-ink">Question {index + 1}</p>
              <Button type="button" variant="ghost" size="sm" onClick={() => removeQuestion(index)}>
                <Trash2 className="h-4 w-4" /> Remove
              </Button>
            </div>

            <div className="space-y-3">
              <div>
                <Label htmlFor={`${question.id}-text`}>Question</Label>
                <Textarea
                  id={`${question.id}-text`}
                  value={question.question}
                  onChange={(event) => updateQuestion(index, { question: event.target.value })}
                />
              </div>

              <div>
                <Label>Options (select the correct one)</Label>
                <RadioGroup
                  value={String(question.correctOptionIndex)}
                  onValueChange={(value) =>
                    updateQuestion(index, { correctOptionIndex: Number(value) as 0 | 1 | 2 | 3 })
                  }
                  className="space-y-2"
                >
                  {question.options.map((option, optionIndex) => (
                    <div key={optionIndex} className="flex items-center gap-2">
                      <RadioGroupItem value={String(optionIndex)} id={`${question.id}-opt-${optionIndex}`} />
                      <Input
                        aria-label={`Option ${optionIndex + 1}`}
                        value={option}
                        onChange={(event) => updateOption(index, optionIndex, event.target.value)}
                      />
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div>
                <Label htmlFor={`${question.id}-explanation`}>Explanation</Label>
                <Textarea
                  id={`${question.id}-explanation`}
                  value={question.explanation}
                  onChange={(event) => updateQuestion(index, { explanation: event.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <Label>Difficulty</Label>
                  <Select
                    value={question.difficulty}
                    onValueChange={(value) => updateQuestion(index, { difficulty: value as Difficulty })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EASY">Easy</SelectItem>
                      <SelectItem value="MEDIUM">Medium</SelectItem>
                      <SelectItem value="HARD">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor={`${question.id}-topic`}>Topic</Label>
                  <Input
                    id={`${question.id}-topic`}
                    value={question.topic}
                    onChange={(event) => updateQuestion(index, { topic: event.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Button type="button" variant="secondary" size="sm" onClick={addQuestion}>
        <Plus className="h-3.5 w-3.5" /> Add Question
      </Button>

      <FieldError>{validationError ?? undefined}</FieldError>

      <div className="flex items-center gap-3 border-t border-line pt-4">
        <Button type="button" onClick={handleSave} disabled={updateQuiz.isPending}>
          {updateQuiz.isPending ? 'Saving…' : 'Save Quiz'}
        </Button>
        {showSaved && <span className="text-sm font-medium text-success-700">Saved</span>}
        {updateQuiz.isError && (
          <span className="text-sm font-medium text-danger-600">
            {updateQuiz.error instanceof Error ? updateQuiz.error.message : 'Unable to save quiz.'}
          </span>
        )}
      </div>
      </fieldset>
    </div>
  )
}
