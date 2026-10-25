<script setup lang="ts">
interface QuizQuestion {
  question: string
  options: string[]
  correctIndex: number
}

const props = defineProps<{
  quiz: {
    title?: string
    questions: QuizQuestion[]
  }
}>()

const toast = useToast()

const LETTERS = 'ABCDEF'

const questions = computed(() => props.quiz.questions)
const total = computed(() => questions.value.length)
const title = computed(() => props.quiz.title?.trim() || 'Quiz')

const current = ref(0)
const finished = ref(false)
const answers = ref<(number | null)[]>(questions.value.map(() => null))

const question = computed(() => questions.value[current.value])
const selected = computed(() => answers.value[current.value] ?? null)
const isAnswered = computed(() => selected.value !== null)
const isCorrect = computed(() => selected.value === question.value?.correctIndex)
const isLast = computed(() => current.value === total.value - 1)

const score = computed(() =>
  answers.value.filter((a, i) => a !== null && a === questions.value[i]?.correctIndex).length
)
const unanswered = computed(() => answers.value.filter(a => a === null).length)
const percent = computed(() => (total.value ? Math.round((score.value / total.value) * 100) : 0))

const verdict = computed(() => {
  if (percent.value >= 80) return { label: 'Excellent work', color: 'success' as const }
  if (percent.value >= 50) return { label: 'Good effort', color: 'primary' as const }
  return { label: 'Keep practicing', color: 'warning' as const }
})

// Full class names so Tailwind can see them
const scoreTextClass = {
  success: 'text-success',
  primary: 'text-primary',
  warning: 'text-warning'
}

function select(index: number) {
  // Answers are locked once chosen so the score can't be changed by going back
  if (isAnswered.value) return
  answers.value[current.value] = index
}

function goTo(index: number) {
  if (index >= 0 && index < total.value) current.value = index
}

function finish() {
  finished.value = true
}

function restart() {
  answers.value = questions.value.map(() => null)
  current.value = 0
  finished.value = false
}

function reviewQuestion(index: number) {
  current.value = index
  finished.value = false
}

function optionStyle(index: number) {
  if (!isAnswered.value) {
    return { color: 'neutral' as const, variant: 'outline' as const, icon: undefined }
  }
  if (index === question.value?.correctIndex) {
    return { color: 'success' as const, variant: 'subtle' as const, icon: 'i-lucide-circle-check' }
  }
  if (index === selected.value) {
    return { color: 'error' as const, variant: 'subtle' as const, icon: 'i-lucide-circle-x' }
  }
  return { color: 'neutral' as const, variant: 'ghost' as const, icon: undefined }
}

function dotClass(index: number) {
  const answer = answers.value[index]
  const state = answer === null
    ? 'bg-accented text-muted'
    : answer === questions.value[index]?.correctIndex
      ? 'bg-success text-inverted'
      : 'bg-error text-inverted'
  const ring = index === current.value ? 'ring-2 ring-primary' : ''
  return ['size-6 rounded-full text-xs font-medium transition focus-visible:outline-2 focus-visible:outline-primary', state, ring]
}

function dotLabel(index: number) {
  const answer = answers.value[index]
  const status = answer === null
    ? 'not answered'
    : answer === questions.value[index]?.correctIndex ? 'correct' : 'incorrect'
  return `Question ${index + 1}, ${status}`
}

function reviewStatus(index: number): 'skipped' | 'correct' | 'wrong' {
  const answer = answers.value[index]
  if (answer === null) return 'skipped'
  return answer === questions.value[index]?.correctIndex ? 'correct' : 'wrong'
}

function reviewLine(index: number) {
  const q = questions.value[index]
  const answer = answers.value[index]
  const right = q?.options[q.correctIndex] ?? ''
  if (answer === null) return `Not answered · Correct: ${right}`
  if (answer === q?.correctIndex) return `Your answer: ${right}`
  return `Your answer: ${q?.options[answer!] ?? ''} · Correct: ${right}`
}

function download() {
  downloadQuizHtml(props.quiz)
  toast.add({
    title: 'Quiz downloaded',
    description: 'Open the HTML file in any browser.',
    icon: 'i-lucide-download',
    color: 'success'
  })
}
</script>

<template>
  <UCard class="my-2 max-sm:w-full md:w-2xl" :ui="{ body: 'space-y-5' }">
    <template #header>
      <div class="flex items-start justify-between gap-3">
        <div class="min-w-0 select-none">
          <h3 class="truncate font-semibold text-highlighted" dir="auto">
            {{ title }}
          </h3>
          <p class="text-sm text-muted">
            <template v-if="finished">
              Results
            </template>
            <template v-else>
              Question {{ current + 1 }} of {{ total }}
            </template>
          </p>
        </div>

        <UTooltip text="Download quiz as HTML">
          <UButton
            icon="i-lucide-download"
            color="neutral"
            variant="ghost"
            size="sm"
            aria-label="Download quiz as HTML"
            @click="download"
          />
        </UTooltip>
      </div>
    </template>

    <!-- Quiz -->
    <template v-if="!finished && question">
      <UProgress :model-value="current + 1" :max="total" size="xs" />

      <div class="flex flex-wrap gap-1.5" role="group" aria-label="Question navigation">
        <button
          v-for="(_, i) in questions"
          :key="i"
          type="button"
          :class="[dotClass(i), 'select-none']"
          :aria-label="dotLabel(i)"
          :aria-current="i === current ? 'step' : undefined"
          @click="goTo(i)"
        >
          {{ i + 1 }}
        </button>
      </div>

      <p class="text-base font-medium text-highlighted" dir="auto">
        {{ question.question }}
      </p>

      <div class="space-y-2" role="group" aria-label="Answer choices">
        <UButton
          v-for="(option, i) in question.options"
          :key="`${current}-${i}`"
          block
          size="lg"
          class="justify-start whitespace-normal text-left"
          :color="optionStyle(i).color"
          :variant="optionStyle(i).variant"
          :trailing-icon="optionStyle(i).icon"
          :aria-pressed="selected === i"
          @click="select(i)"
        >
          <span class="inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-elevated text-xs font-semibold text-highlighted">
            {{ LETTERS[i] }}
          </span>
          <span class="flex-1" dir="auto">{{ option }}</span>
        </UButton>
      </div>

      <div aria-live="polite">
        <UAlert
          v-if="isAnswered"
          variant="subtle"
          :color="isCorrect ? 'success' : 'error'"
          :icon="isCorrect ? 'i-lucide-circle-check' : 'i-lucide-circle-x'"
          :title="isCorrect ? 'Correct!' : 'Not quite'"
          :description="isCorrect ? undefined : `Correct answer: ${LETTERS[question.correctIndex]}. ${question.options[question.correctIndex]}`"
        />
      </div>
    </template>

    <!-- Results -->
    <template v-else>
      <div class="space-y-3 text-center">
        <p class="text-5xl font-semibold" :class="scoreTextClass[verdict.color]">
          {{ score }}<span class="text-2xl text-muted"> / {{ total }}</span>
        </p>
        <p class="text-muted">
          {{ percent }}% · {{ verdict.label }}
        </p>
        <UProgress :model-value="percent" :color="verdict.color" />
        <p v-if="unanswered" class="text-sm text-muted">
          {{ unanswered }} unanswered {{ unanswered === 1 ? 'question was' : 'questions were' }} counted as incorrect.
        </p>
      </div>

      <ul class="divide-y divide-default overflow-hidden rounded-lg border border-default">
        <li v-for="(q, i) in questions" :key="i">
          <button
            type="button"
            class="flex w-full items-start gap-3 p-3 text-left transition hover:bg-elevated focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary"
            @click="reviewQuestion(i)"
          >
            <UIcon
              v-if="reviewStatus(i) === 'correct'"
              name="i-lucide-circle-check"
              class="mt-0.5 size-5 shrink-0 text-success"
            />
            <UIcon
              v-else-if="reviewStatus(i) === 'wrong'"
              name="i-lucide-circle-x"
              class="mt-0.5 size-5 shrink-0 text-error"
            />
            <UIcon
              v-else
              name="i-lucide-circle-dashed"
              class="mt-0.5 size-5 shrink-0 text-muted"
            />

            <span class="min-w-0 flex-1">
              <span class="block text-sm font-medium text-highlighted" dir="auto">
                {{ i + 1 }}. {{ q.question }}
              </span>
              <span class="mt-1 block text-xs text-muted" dir="auto">
                {{ reviewLine(i) }}
              </span>
            </span>
          </button>
        </li>
      </ul>
    </template>

    <template #footer>
      <div v-if="!finished" class="flex items-center justify-between gap-2 select-none">
        <UButton
          color="neutral"
          variant="outline"
          icon="i-lucide-arrow-left"
          :disabled="current === 0"
          @click="goTo(current - 1)"
        >
          Previous
        </UButton>

        <UButton
          v-if="!isLast"
          trailing-icon="i-lucide-arrow-right"
          @click="goTo(current + 1)"
        >
          Next
        </UButton>
        <UButton
          v-else
          trailing-icon="i-lucide-flag"
          @click="finish"
        >
          Finish
        </UButton>
      </div>

      <div v-else class="flex justify-end select-none">
        <UButton
          color="neutral"
          variant="outline"
          icon="i-lucide-rotate-ccw"
          @click="restart"
        >
          Retake quiz
        </UButton>
      </div>
    </template>
  </UCard>
</template>
