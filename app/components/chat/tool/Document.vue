<script setup lang="ts">
import { useTimeoutFn } from '@vueuse/core'

interface DocumentToolInput {
  title?: string
  content?: string
}

const props = defineProps<{
  invocation: DocumentUIToolInvocation
}>()

const toast = useToast()

const parsedInput = computed(() => props.invocation.input as DocumentToolInput | undefined)

const hasInitialized = ref(false)
const docTitle = ref(props.invocation.output?.title ?? parsedInput.value?.title ?? 'Untitled Document')
const content = ref(props.invocation.output?.content ?? '')

watch(
  () => props.invocation.output,
  (out) => {
    if (!out || hasInitialized.value) return
    hasInitialized.value = true
    if (out.title) docTitle.value = out.title
    if (out.content) content.value = out.content
  },
  { immediate: true }
)

const isReady = computed(
  () => props.invocation.state === 'output-available' && Boolean(props.invocation.output?.content)
)
const isError = computed(() => props.invocation.state === 'output-error')

const streamingTitle = computed(() => {
  const title = parsedInput.value?.title
  return typeof title === 'string' && title.trim() ? title : 'Drafting document…'
})

const streamingPreview = computed(() =>
  typeof parsedInput.value?.content === 'string' ? parsedInput.value.content : ''
)

const errorText = computed(() =>
  typeof props.invocation.errorText === 'string' && props.invocation.errorText
    ? props.invocation.errorText
    : 'Failed to generate the document. Please try again.'
)

function getMarkdown(): string {
  const title = docTitle.value.trim()
  if (!title) return content.value
  return content.value.trimStart().startsWith('# ')
    ? content.value
    : `# ${title}\n\n${content.value}`
}

function downloadMarkdown() {
  const slug = docTitle.value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'document'

  const blob = new Blob([getMarkdown()], { type: 'text/markdown;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${slug}.md`
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)

  toast.add({
    title: 'Downloaded .md',
    icon: 'i-lucide-download',
    color: 'primary',
    duration: 2500
  })
}

const copyIcon = ref('i-lucide-copy')
const { start: resetCopyIcon } = useTimeoutFn(
  () => {
    copyIcon.value = 'i-lucide-copy'
  },
  2500,
  { immediate: false }
)

async function copyMarkdown() {
  try {
    await navigator.clipboard.writeText(getMarkdown())
    copyIcon.value = 'i-lucide-copy-check'
    toast.add({
      title: 'Copied Markdown to clipboard',
      icon: 'i-lucide-check',
      color: 'primary',
      duration: 2500
    })
    resetCopyIcon()
  } catch {
    toast.add({
      title: 'Failed to copy',
      icon: 'i-lucide-x',
      color: 'error'
    })
  }
}

const editorMounted = ref(false)
onMounted(() => {
  editorMounted.value = true
})
</script>

<template>
  <div class="rounded-xl border border-default bg-elevated/50 overflow-hidden my-5">
    <!-- Top Header -->
    <div class="flex items-center justify-between gap-2 px-4 py-3 border-b border-default">
      <div class="flex items-center gap-2 min-w-0">
        <div class="size-7 shrink-0 rounded-md flex items-center justify-center bg-primary/10 text-primary">
          <UIcon class="size-4" name="i-lucide-file-pen-line" />
        </div>
        <span class="text-sm font-medium truncate">{{ docTitle }}</span>
      </div>

      <div class="flex items-center gap-1.5 shrink-0">
        <UButton
          :disabled="!isReady"
          :icon="copyIcon"
          color="neutral"
          label="Copy"
          size="xs"
          variant="ghost"
          @click="copyMarkdown"
        />

        <UButton
          :disabled="!isReady"
          color="neutral"
          icon="i-lucide-download"
          label="Download .md"
          size="xs"
          variant="subtle"
          @click="downloadMarkdown"
        />
      </div>
    </div>

    <!-- Ready: Client-Only Editor with Matching SSR Fallback -->
    <div v-if="isReady">
      <ChatDocumentEditor v-if="editorMounted" v-model="content" />

      <div v-else class="h-[70vh] p-6 space-y-3">
        <USkeleton class="h-8 w-full" />
        <USkeleton class="h-5 w-1/3" />
        <USkeleton class="h-4 w-full" />
        <USkeleton class="h-4 w-5/6" />
        <USkeleton class="h-4 w-2/3" />
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="isError" class="p-4">
      <UAlert
        :description="errorText"
        color="error"
        icon="i-lucide-triangle-alert"
        title="Document generation failed"
        variant="subtle"
      />
    </div>

    <!-- Streaming / Loading State -->
    <div v-else class="p-5 space-y-3">
      <div class="flex items-center gap-2 text-sm text-muted">
        <UIcon class="size-4 animate-spin text-primary shrink-0" name="i-lucide-loader-circle" />
        <span class="font-medium text-highlighted truncate">{{ streamingTitle }}</span>
      </div>

      <div
        v-if="streamingPreview"
        class="rounded-lg border border-default bg-muted/30 p-4 max-h-64 overflow-y-auto text-sm whitespace-pre-wrap text-muted font-mono"
      >
        {{ streamingPreview }}
      </div>
      <div v-else class="space-y-2.5 pt-1">
        <USkeleton class="h-4 w-full" />
        <USkeleton class="h-4 w-5/6" />
        <USkeleton class="h-4 w-2/3" />
      </div>
    </div>
  </div>
</template>
