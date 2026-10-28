<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'
import { useTimeoutFn } from '@vueuse/core'

const props = defineProps<{
  invocation: HumanizerUIToolInvocation
}>()

const toast = useToast()

const draft = ref<string>(props.invocation.output?.humanized ?? '')

watch(
  () => props.invocation.output?.humanized,
  (next) => {
    if (typeof next === 'string') draft.value = next
  }
)

const isReady = computed(
  () => props.invocation.state === 'output-available' && !!props.invocation.output?.humanized
)
const isError = computed(() => props.invocation.state === 'output-error')

const originalText = computed(() => {
  const input = props.invocation.input
  if (input && typeof input === 'object' && 'text' in input) {
    return String((input as { text?: unknown }).text ?? '')
  }
  return ''
})
const showOriginal = ref(false)

const wordCount = computed(() => {
  const t = draft.value.trim()
  return t ? t.split(/\s+/).length : 0
})
const charCount = computed(() => draft.value.length)

const statusMessage = computed(() => {
  switch (props.invocation.state) {
    case 'input-streaming':
    case 'input-available':
      return 'Rewriting your text…'
    default:
      return 'Preparing…'
  }
})

const errorText = computed(() =>
  typeof props.invocation.errorText === 'string' && props.invocation.errorText
    ? props.invocation.errorText
    : 'Please try again.'
)

function download(ext: 'md' | 'txt') {
  const mime = ext === 'md' ? 'text/markdown' : 'text/plain'
  const blob = new Blob([draft.value], { type: `${mime};charset=utf-8` })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `humanized-${Date.now()}.${ext}`
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)

  toast.add({
    title: `Downloaded .${ext}`,
    icon: 'i-lucide-download',
    color: 'primary',
    duration: 2500
  })
}

const copyIcon = ref<string>('i-lucide-copy')

const { start } = useTimeoutFn(() => {
  copyIcon.value = 'i-lucide-copy'
}, 2500, { immediate: false })

async function copy() {
  try {
    await navigator.clipboard.writeText(draft.value)
    copyIcon.value = 'i-lucide-copy-check'
    toast.add({
      title: 'Copied to clipboard',
      icon: 'i-lucide-check',
      color: 'primary',
      duration: 2500
    })
    start()
  } catch {
    toast.add({
      title: 'Failed to copy',
      icon: 'i-lucide-x',
      color: 'error'
    })
  }
}

const items: DropdownMenuItem[] = [
  {
    label: 'Download as .md',
    icon: 'i-lucide-file-text',
    onSelect: () => download('md')
  },
  {
    label: 'Download as .txt',
    icon: 'i-lucide-file-type',
    onSelect: () => download('txt')
  }
]
</script>

<template>
  <div class="rounded-xl border border-default bg-elevated/50 overflow-hidden my-5">
    <!-- Header -->
    <div class="flex items-center justify-between gap-2 px-4 py-3 border-b border-default">
      <div class="flex items-center gap-2 min-w-0">
        <div class="size-7 shrink-0 rounded-md flex items-center justify-center">
          <UIcon name="i-lucide-bot" class="size-6 bg-linear-to-br from-primary-200 via-primary-500 to-primary-300" />
        </div>
        <span class="text-sm font-medium truncate">Humanizer</span>
        <UBadge
          v-if="isReady"
          color="neutral"
          variant="subtle"
          size="sm"
          class="hidden sm:inline-flex"
        >
          {{ wordCount }} {{ wordCount === 1 ? 'word' : 'words' }} · {{ charCount }} chars
        </UBadge>
      </div>

      <UButton
        v-if="isReady"
        :icon="copyIcon"
        label="Copy"
        size="xs"
        color="neutral"
        variant="ghost"
        @click="copy"
      />
    </div>

    <!-- Ready: editable output -->
    <div v-if="isReady" class="p-4 space-y-3">
      <UTextarea
        v-model="draft"
        :rows="10"
        autoresize
        placeholder="Humanized text…"
        class="w-full font-mono text-sm"
      />

      <div class="flex flex-wrap items-center gap-2">
        <UFieldGroup>
          <UButton
            color="neutral"
            variant="subtle"
            label="Download"
            icon="i-lucide-download"
            @click="download('txt')"
          />
          <UDropdownMenu :items="items">
            <UButton
              color="neutral"
              variant="subtle"
              icon="i-lucide-chevron-down"
            />
          </UDropdownMenu>
        </UFieldGroup>

        <div class="flex-1" />

        <UButton
          v-if="originalText"
          :icon="showOriginal ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'"
          :label="showOriginal ? 'Hide original' : 'Show original'"
          size="sm"
          color="neutral"
          variant="ghost"
          @click="showOriginal = !showOriginal"
        />
      </div>

      <div
        v-if="showOriginal && originalText"
        class="rounded-lg border border-default bg-muted/50 p-3 text-xs"
      >
        <div class="text-muted mb-1 uppercase tracking-wide text-[10px] font-medium">
          Original
        </div>
        <pre class="whitespace-pre-wrap wrap-break-word font-mono text-muted">{{ originalText }}</pre>
      </div>
    </div>

    <!-- Error state -->
    <div v-else-if="isError" class="p-4">
      <UAlert
        color="error"
        variant="subtle"
        icon="i-lucide-triangle-alert"
        title="Humanizer failed"
        :description="errorText"
      />
    </div>

    <!-- Loading state -->
    <div v-else class="flex items-center justify-center py-12">
      <div class="text-center space-y-2">
        <UIcon
          name="i-lucide-loader-circle"
          class="size-6 animate-spin text-primary mx-auto"
        />
        <div class="text-sm text-muted">
          {{ statusMessage }}
        </div>
      </div>
    </div>
  </div>
</template>
