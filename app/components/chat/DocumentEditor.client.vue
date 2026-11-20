<script setup lang="ts">
import type { EditorCustomHandlers } from '@nuxt/ui'
import type { Editor } from '@tiptap/core'
import { TaskList, TaskItem } from '@tiptap/extension-list'
import { TableKit } from '@tiptap/extension-table'
import { CellSelection } from '@tiptap/pm/tables'
import { CodeBlockShiki } from 'tiptap-extension-code-block-shiki'
import { useEditorSuggestions } from '~/composables/useEditorSuggestions'
import { useEditorToolbar } from '~/composables/useEditorToolbar'

const content = defineModel<string>({ required: true })

const customHandlers = {
  table: {
    canExecute: (editor: Editor) => editor.can().insertTable({ rows: 3, cols: 3, withHeaderRow: true }),
    execute: (editor: Editor) => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }),
    isActive: (editor: Editor) => editor.isActive('table')
  }
} satisfies EditorCustomHandlers

const { items: suggestionItems } = useEditorSuggestions(customHandlers)
const { toolbarItems, bubbleToolbarItems, getTableToolbarItems } = useEditorToolbar(customHandlers)

const extensions = [
  CodeBlockShiki.configure({
    defaultTheme: 'material-theme',
    themes: {
      light: 'material-theme-lighter',
      dark: 'material-theme-palenight'
    }
  }),
  TableKit,
  TaskList,
  TaskItem
]
</script>

<template>
  <ClientOnly>
    <UEditor
      v-slot="{ editor }"
      v-model="content"
      content-type="markdown"
      :extensions="extensions"
      :starter-kit="{ codeBlock: false, link: { openOnClick: false } }"
      :handlers="customHandlers"
      placeholder="Write, type '/' for commands..."
      class="w-full flex flex-col h-[70vh]"
      :ui="{
        content: 'flex-1 min-h-0 overflow-y-auto px-4 sm:px-10 py-6',
        base: 'max-w-4xl mx-auto min-h-full focus:outline-none'
      }"
    >
      <UEditorToolbar
        :editor="editor"
        :items="toolbarItems"
        class="shrink-0 border-b border-muted px-4 sm:px-8 py-2 bg-muted/40 overflow-x-auto"
      />

      <UEditorToolbar
        :editor="editor"
        :items="bubbleToolbarItems"
        layout="bubble"
        :should-show="({ view, state }) => {
          if (state.selection instanceof CellSelection) return false
          return view.hasFocus() && !state.selection.empty
        }"
      >
        <template #link>
          <EditorLinkPopover :editor="editor" />
        </template>
      </UEditorToolbar>

      <UEditorToolbar
        :editor="editor"
        :items="getTableToolbarItems(editor)"
        layout="bubble"
        :should-show="({ editor, view }) => {
          return editor.state.selection instanceof CellSelection && view.hasFocus()
        }"
      />

      <UEditorSuggestionMenu
        :editor="editor"
        :items="suggestionItems"
      />
    </UEditor>
  </ClientOnly>
</template>
