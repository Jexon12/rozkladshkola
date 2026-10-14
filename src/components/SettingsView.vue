<script setup lang="ts">
import { ref } from 'vue'
import { useLocalSchedule } from '../composables/useLocalSchedule'
import { ArrowDownTrayIcon, ArrowUpTrayIcon, DocumentDuplicateIcon } from '@heroicons/vue/24/outline'

const { exportConfig, importConfig, clearSchedule } = useLocalSchedule()
const emit = defineEmits(['close'])

const fileInput = ref<HTMLInputElement | null>(null)
const importMessage = ref('')

const handleExport = () => {
  const json = exportConfig()
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'school_schedule.json'
  a.click()
  URL.revokeObjectURL(url)
}

const triggerImport = () => {
  fileInput.value?.click()
}

const handleFile = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    const success = importConfig(e.target?.result as string)
    if (success) {
      importMessage.value = 'Розклад успішно завантажено!'
      setTimeout(() => {
        importMessage.value = ''
        emit('close')
      }, 2000)
    } else {
      importMessage.value = 'Помилка формату файлу'
    }
  }
  reader.readAsText(file)
}
</script>

<template>
  <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
    <h2 class="text-2xl font-bold mb-6 text-slate-800">Налаштування</h2>

    <div class="space-y-4">
      <div class="p-4 bg-blue-50 rounded-xl border border-blue-100">
        <h3 class="font-bold text-blue-800 mb-2 flex items-center gap-2">
          <DocumentDuplicateIcon class="w-5 h-5" />
          Поділитися розкладом
        </h3>
        <p class="text-xs text-blue-600 mb-4">
          Налаштуйте розклад і надішліть файл другу, щоб він не вводив все вручну.
        </p>

        <div class="grid grid-cols-2 gap-3">
          <button @click="handleExport" class="bg-white border border-blue-200 text-blue-700 font-bold py-2 px-3 rounded-lg shadow-sm hover:bg-blue-50 flex items-center justify-center gap-2 text-sm">
            <ArrowDownTrayIcon class="w-4 h-4" /> Скачати
          </button>
          <button @click="triggerImport" class="bg-blue-600 text-white font-bold py-2 px-3 rounded-lg shadow-sm hover:bg-blue-700 flex items-center justify-center gap-2 text-sm">
            <ArrowUpTrayIcon class="w-4 h-4" /> Відкрити
          </button>
          <input ref="fileInput" type="file" accept=".json" class="hidden" @change="handleFile">
        </div>
        <p v-if="importMessage" class="text-sm text-green-600 font-bold mt-2 text-center">{{ importMessage }}</p>
      </div>

      <div class="border-t pt-4">
        <button @click="clearSchedule" class="w-full text-red-500 text-sm hover:bg-red-50 p-2 rounded transition">
          Очистити весь розклад
        </button>
      </div>
    </div>
  </div>
</template>
