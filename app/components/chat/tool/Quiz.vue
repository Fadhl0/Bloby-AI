<script setup lang="ts">
defineProps<{
  invocation: QuizUIToolInvocation
}>()
</script>

<template>
  <ChatQuizWidget
    v-if="invocation.state === 'output-available'"
    :quiz="invocation.output"
  />
  <UAlert
    v-else-if="invocation.state === 'output-error'"
    color="error"
    variant="subtle"
    title="Couldn't generate the quiz"
    :description="invocation.errorText"
  />
  <UCard v-else class="my-2 max-w-2xl">
    <div class="space-y-3">
      <USkeleton class="h-5 w-1/2" />
      <USkeleton class="h-4 w-full" />
      <USkeleton class="h-4 w-3/4" />
    </div>
  </UCard>
</template>
