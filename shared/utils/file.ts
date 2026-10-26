export interface FileWithStatus {
  file: File
  id: string
  previewUrl: string
  status: 'uploading' | 'uploaded' | 'error'
  uploadedUrl?: string
  uploadedPathname?: string
  error?: string
}

export const FILE_UPLOAD_CONFIG = {
  maxSize: '8MB',
  types: ['text/plain', 'text/markdown'],
  acceptPattern: '.txt,.md,text/plain,text/markdown,text/x-markdown'
} as const

export function getFileIcon(mimeType: string, fileName?: string): string {
  if (mimeType === 'text/markdown' || fileName?.endsWith('.md')) {
    return 'i-lucide-file-code'
  }
  if (mimeType === 'text/plain' || fileName?.endsWith('.txt')) {
    return 'i-lucide-file-text'
  }
  return 'i-lucide-file'
}

export function removeRandomSuffix(filename: string): string {
  return filename.replace(/^(.+)-[a-zA-Z0-9]+(\.[^.]+)$/, '$1$2')
}
