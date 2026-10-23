import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Label } from '@/components/ui/Input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/RadioGroup'
import type { QuizQuestion } from '@/domain/quiz'

interface QuizQuestionCardProps {
  question: QuizQuestion
  index: number
  total: number
  selectedOptionIndex: number | undefined
  onSelect: (optionIndex: number) => void
}

export function QuizQuestionCard({ question, index, total, selectedOptionIndex, onSelect }: QuizQuestionCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Question {index + 1} / {total}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-base font-medium text-ink">{question.question}</p>

        <RadioGroup
          className="mt-4 space-y-3"
          value={selectedOptionIndex !== undefined ? String(selectedOptionIndex) : undefined}
          onValueChange={(value) => onSelect(Number(value))}
        >
          {question.options.map((option, optionIndex) => {
            const inputId = `${question.id}-option-${optionIndex}`
            return (
              <div
                key={optionIndex}
                className="flex items-center gap-3 rounded-lg border border-line px-3 py-2.5 hover:bg-slate-50"
              >
                <RadioGroupItem value={String(optionIndex)} id={inputId} />
                <Label htmlFor={inputId} className="mb-0 flex-1 cursor-pointer text-sm font-normal text-ink">
                  {option}
                </Label>
              </div>
            )
          })}
        </RadioGroup>
      </CardContent>
    </Card>
  )
}
