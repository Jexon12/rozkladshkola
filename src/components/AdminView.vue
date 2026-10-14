<script setup lang="ts">
import { ref, computed } from 'vue'
import { useLocalSchedule, type Lesson } from '../composables/useLocalSchedule'
import { TrashIcon, PlusIcon, ClockIcon, PencilSquareIcon, XMarkIcon, CheckIcon } from '@heroicons/vue/24/outline'

const { lessons, bellSchedule, saveBellSchedule, addLesson, updateLesson, removeLesson } = useLocalSchedule()

const days = ['Понеділок', 'Вівторок', 'Середа', 'Четвер', 'П\'ятниця']
const selectedDay = ref('Понеділок')
const showTimeEditor = ref(false)
const editingId = ref<string | null>(null)

const newLesson = ref({
  number: 1,
  subject: '',
  teacher: '',
  cabinet: ''
})

const currentDayLessons = computed(() => {
  return lessons.value
    .filter(l => l.day === selectedDay.value)
    .sort((a, b) => a.number - b.number)
    .map(l => ({
      ...l,
      timeStart: bellSchedule.value[l.number - 1]?.start || '??:??',
      timeEnd: bellSchedule.value[l.number - 1]?.end || '??:??'
    }))
})

const saveLesson = () => {
  if (!newLesson.value.subject) return
  
  const time = bellSchedule.value[newLesson.value.number - 1] || { start: '00:00', end: '00:00' }

  if (editingId.value) {
    updateLesson({
      id: editingId.value,
      day: selectedDay.value,
      number: newLesson.value.number,
      timeStart: time.start,
      timeEnd: time.end,
      subject: newLesson.value.subject,
      teacher: newLesson.value.teacher,
      cabinet: newLesson.value.cabinet
    })
    editingId.value = null
  } else {
    addLesson({
      day: selectedDay.value,
      number: newLesson.value.number,
      timeStart: time.start,
      timeEnd: time.end,
      subject: newLesson.value.subject,
      teacher: newLesson.value.teacher,
      cabinet: newLesson.value.cabinet
    })
  }

  // Reset form
  newLesson.value.subject = ''
  newLesson.value.teacher = ''
  newLesson.value.cabinet = ''
  
  // Only increment if adding new lesson
  if (!editingId.value && newLesson.value.number < 8) newLesson.value.number++
}

const editLesson = (lesson: Lesson) => {
  editingId.value = lesson.id
  newLesson.value.number = lesson.number
  newLesson.value.subject = lesson.subject
  newLesson.value.teacher = lesson.teacher || ''
  newLesson.value.cabinet = lesson.cabinet || ''
}

const cancelEdit = () => {
  editingId.value = null
  newLesson.value.subject = ''
  newLesson.value.teacher = ''
  newLesson.value.cabinet = ''
}

const updateTimes = () => {
  saveBellSchedule()
  showTimeEditor.value = false
}
</script>

<template>
  <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-slate-800">Редагування</h2>
      
      <button @click="showTimeEditor = !showTimeEditor" class="text-blue-600 bg-blue-50 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 hover:bg-blue-100">
        <ClockIcon class="w-4 h-4" /> Дзвоники
      </button>
    </div>

    <!-- Time Editor -->
    <div v-if="showTimeEditor" class="mb-8 bg-indigo-50 p-4 rounded-xl border border-indigo-100 animate-in slide-in-from-top-2">
      <h3 class="font-bold text-indigo-800 mb-3 text-sm uppercase tracking-wide">Налаштування часу</h3>
      <div class="grid grid-cols-2 gap-x-4 gap-y-2 mb-4">
        <div v-for="(slot, idx) in bellSchedule" :key="idx" class="flex items-center gap-2">
           <span class="text-xs font-bold w-4 text-indigo-400">{{ idx + 1 }}.</span>
           <input v-model="slot.start" type="time" class="text-sm p-1 rounded border border-indigo-200 w-20 text-center">
           <span class="text-gray-400">-</span>
           <input v-model="slot.end" type="time" class="text-sm p-1 rounded border border-indigo-200 w-20 text-center">
        </div>
      </div>
      <button @click="updateTimes" class="w-full bg-indigo-600 text-white font-bold py-2 rounded shadow hover:bg-indigo-700 text-sm">
        Зберегти розклад дзвоників
      </button>
    </div>

    <!-- Day Selector -->
    <div class="flex overflow-x-auto gap-2 mb-6 pb-2 no-scrollbar">
      <button v-for="day in days" :key="day" @click="selectedDay = day"
        class="px-4 py-2 rounded-full whitespace-nowrap transition text-sm font-medium border"
        :class="selectedDay === day ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'">
        {{ day }}
      </button>
    </div>

    <!-- Add/Edit Form -->
    <div class="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6 transition-all duration-300" :class="{'ring-2 ring-blue-200': editingId}">
      <h3 class="font-bold text-slate-700 mb-3 flex items-center gap-2">
        <span v-if="editingId" class="text-blue-600">✎ Редагування уроку</span>
        <span v-else>+ Додати урок</span>
      </h3>
      <div class="grid grid-cols-1 gap-3">
        <div class="grid grid-cols-2 gap-2">
           <div>
            <label class="text-xs text-slate-500 block mb-1">№ Уроку</label>
            <select v-model="newLesson.number" class="w-full p-2 rounded border border-slate-300">
              <option v-for="(time, idx) in bellSchedule" :key="idx" :value="idx + 1">
                {{ idx + 1 }} ({{ time.start }})
              </option>
            </select>
           </div>
           <div>
             <label class="text-xs text-slate-500 block mb-1">Кабінет</label>
             <input v-model="newLesson.cabinet" type="text" placeholder="Напр. 101" class="w-full p-2 rounded border border-slate-300">
           </div>
        </div>
        
        <input v-model="newLesson.subject" type="text" placeholder="Предмет (Математика)" class="w-full p-2 rounded border border-slate-300">
        <input v-model="newLesson.teacher" type="text" placeholder="Вчитель (Шевченко Т.Г.)" class="w-full p-2 rounded border border-slate-300">
        
        <div class="flex gap-2">
          <button @click="saveLesson" :disabled="!newLesson.subject" 
            class="flex-1 text-white font-bold py-2 rounded shadow transition flex justify-center items-center gap-2 disabled:opacity-50"
            :class="editingId ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'">
            <component :is="editingId ? CheckIcon : PlusIcon" class="w-5 h-5" />
            {{ editingId ? 'Зберегти' : 'Додати' }}
          </button>
          <button v-if="editingId" @click="cancelEdit" class="px-4 py-2 rounded border border-slate-300 text-slate-500 hover:bg-slate-100 font-medium">
             <XMarkIcon class="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>

    <!-- Current List -->
    <div class="space-y-3">
      <div v-if="currentDayLessons.length === 0" class="text-center text-slate-400 py-4">
        Уроків немає
      </div>
      <div v-for="lesson in currentDayLessons" :key="lesson.id" class="flex items-center justify-between bg-white border border-slate-100 p-3 rounded-lg shadow-sm group">
        <div class="flex items-center gap-3">
          <span class="font-bold text-slate-400 w-6">{{ lesson.number }}</span>
          <div>
            <div class="font-bold text-slate-800">{{ lesson.subject }}</div>
            <div class="text-xs text-slate-500">
              <span v-if="lesson.teacher">{{ lesson.teacher }}</span>
              <span v-if="lesson.cabinet" class="ml-2 bg-slate-100 px-1 rounded text-slate-400">{{ lesson.cabinet }}</span>
            </div>
          </div>
        </div>
        <div class="flex gap-1">
          <button @click="editLesson(lesson)" class="text-blue-400 hover:text-blue-600 p-2 rounded hover:bg-blue-50 transition" title="Редагувати">
            <PencilSquareIcon class="w-5 h-5" />
          </button>
          <button @click="removeLesson(lesson.id)" class="text-red-400 hover:text-red-600 p-2 rounded hover:bg-red-50 transition" title="Видалити">
            <TrashIcon class="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
