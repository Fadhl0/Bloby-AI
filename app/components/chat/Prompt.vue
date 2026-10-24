<script setup lang="ts">
import type { ChatStatus } from 'ai'

withDefaults(defineProps<{
  status?: ChatStatus
  error?: Error
  files?: FileWithStatus[]
  uploading?: boolean
  disabled?: boolean
  /** Opens the file picker. */
  open: () => void
}>(), {
  status: 'ready',
  error: undefined,
  files: () => []
})

const emit = defineEmits<{
  submit: [event: Event]
  stop: []
  reload: []
  remove: [id: string]
}>()

const input = defineModel<string>({ default: '' })
</script>

<template>
  <UChatPrompt
    v-model="input"
    :status="status"
    :error="error"
    :disabled="uploading || disabled"
    color="primary"
    variant="subtle"
    :ui="{ base: ['px-1.5', 'outline-red-100'] }"
    @submit="emit('submit', $event)"
  >
    <template v-if="files.length > 0" #header>
      <ChatFiles :files="files" @remove="emit('remove', $event)" />
    </template>

    <template #footer>
      <ChatPromptMenu :open="open" />

      <div class="flex items-center gap-1">
        <ModelSelect />

        <UChatPromptSubmit
          :status="status"
          :disabled="uploading || disabled"
          :color="(uploading || disabled) ? 'neutral' : 'primary'"
          :variant="(uploading || disabled) ? 'outline' : 'solid'"
          :class="[uploading || disabled? 'cursor-not-allowed' : 'cursor-pointer']"
          size="sm"
          @stop="emit('stop')"
          @reload="emit('reload')"
        />
      </div>
    </template>
  </UChatPrompt>
</template>
