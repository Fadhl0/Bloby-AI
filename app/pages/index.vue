<script setup lang="ts">
const { loggedIn, openInPopup } = useUserSession()
const showLoginNotice = ref(false)

watch(loggedIn, (value) => {
  if (value) showLoginNotice.value = false
})

const input = ref('')
const loading = ref(false)
const chatId = crypto.randomUUID()

const { user } = useUserSession()

const greeting = computed(() => {
  const hour = new Date().getHours()
  let timeGreeting = 'Good evening'
  if (hour < 12) timeGreeting = 'Good morning'
  else if (hour < 18) timeGreeting = 'Good afternoon'

  const name = user.value?.name?.split(' ')[0] || user.value?.name

  return name ? `${timeGreeting}, ${name}` : `${timeGreeting}`
})

const {
  dropzoneRef,
  dragging,
  open,
  files,
  uploading,
  uploadedFiles,
  removeFile,
  clearFiles
} = useFileUploadWithStatus(chatId)

const { csrf, headerName } = useCsrf()

async function createChat(prompt: string) {
  if (!loggedIn.value) {
    showLoginNotice.value = true
    return
  }

  input.value = prompt
  loading.value = true

  const parts: Array<{ type: string, text?: string, mediaType?: string, url?: string }> = [{ type: 'text', text: prompt }]

  if (uploadedFiles.value.length > 0) {
    parts.push(...uploadedFiles.value)
  }

  const chat = await $fetch('/api/chats', {
    method: 'POST',
    headers: { [headerName]: csrf },
    body: {
      id: chatId,
      message: {
        role: 'user',
        parts
      }
    }
  })

  refreshNuxtData('chats')
  navigateTo(`/chat/${chat?.id}`)
}

async function onSubmit() {
  if (!loggedIn.value) {
    showLoginNotice.value = true
    return // keep their typed text so they can send it after logging in
  }

  await createChat(input.value)
  clearFiles()
}

const quickChats = [
  'Who are you?',
  'Give me 5 practical productivity habits',
  'Why learn coding in the age of AI?'
]

const config = useRuntimeConfig()
</script>

<template>
  <UDashboardPanel
    id="home"
    class="min-h-0"
    :ui="{ body: 'p-0 sm:p-0' }"
  >
    <template #header>
      <Navbar />
    </template>

    <template #body>
      <div ref="dropzoneRef" class="flex flex-1">
        <DragDropOverlay :show="dragging" />

        <UContainer class="flex-1 flex flex-col justify-center gap-4 sm:gap-6 py-8">
          <Bloby />
          <h1 class="text-3xl sm:text-4xl text-highlighted font-bold">
            {{ greeting }}
          </h1>

          <ChatPrompt
            v-model="input"
            :disabled="loading"
            :files="files"
            :uploading="uploading"
            :open="open"
            class="[view-transition-name:chat-prompt]"
            @submit="onSubmit"
            @remove="removeFile"
          />

          <div class="flex flex-wrap gap-2">
            <UButton
              v-for="quickChat in quickChats"
              :key="quickChat"
              :label="quickChat"
              size="sm"
              color="neutral"
              variant="outline"
              class="rounded-full"
              @click="createChat(quickChat)"
            />
          </div>
        </UContainer>

        <UModal
          :open="showLoginNotice"
          title="Login Required"
          close-icon="i-lucide-x"
          :close="{
            color: 'error',
            variant: 'ghost',
            onClick: () => showLoginNotice = false
          }"
        >
          <template #body>
            <div class="h-48 m-4 flex justify-center flex-col content-center">
              <UChatMessage
                id="login-notice"
                role="assistant"
                class="w-fit mx-auto"
                :parts="[{ type: 'text', text: `Please log in before using ${config.public.name}.` }]"
              />
              <UButton
                label="Login with GitHub"
                icon="i-simple-icons-github"
                color="neutral"
                class="text-center w-fit mx-auto"
                @click="openInPopup('/auth/github')"
              />
            </div>
          </template>
        </UModal>
      </div>
    </template>
  </UDashboardPanel>
</template>
