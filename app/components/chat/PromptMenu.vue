<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'

const props = defineProps<{
  open: () => void
}>()

const { loggedIn } = useUserSession()
const { reasoning } = useChatSettings()

defineShortcuts({
  meta_u: {
    usingInput: true,
    handler: () => {
      if (loggedIn.value) {
        props.open()
      }
    }
  }
})

const items = computed<DropdownMenuItem[][]>(() => [[{
  label: 'Add files (.md, .txt)',
  icon: 'i-lucide-paperclip',
  kbds: ['meta', 'U'],
  disabled: !loggedIn.value,
  description: loggedIn.value ? undefined : 'Login required',
  onSelect: () => props.open()
}], [{
  label: 'Extended thinking',
  icon: 'i-lucide-brain',
  type: 'checkbox',
  checked: reasoning.value,
  onUpdateChecked: (checked: boolean) => {
    reasoning.value = checked
  },
  onSelect: (e: Event) => e.preventDefault()
}]])
</script>

<template>
  <UDropdownMenu
    :items="items"
    :content="{ side: 'top', align: 'start', alignOffset: -4 }"
    :ui="{ content: 'w-52' }"
    size="sm"
  >
    <UTooltip text="Add files, enable thinking mode.">
      <UButton
        icon="i-lucide-plus"
        color="neutral"
        variant="ghost"
        size="sm"
        aria-label="Open prompt menu"
        class="data-[state=open]:bg-elevated"
      />
    </UTooltip>
  </UDropdownMenu>
</template>
