<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useLocalSchedule } from '../composables/useLocalSchedule'
import { useCalendar } from '../composables/useCalendar'
import { ArrowDownTrayIcon, PencilSquareIcon } from '@heroicons/vue/24/solid'

const props = defineProps(['config']) // config not strictly needed anymore but kept for compat
const emit = defineEmits(['edit'])

const { lessons, getDaySchedule } = useLocalSchedule()
const { generateICS, downloadICS } = useCalendar()

const weekDays = ['Понеділок', 'Вівторок', 'Середа', 'Четвер', 'П\'ятниця']

// Prepare display data for next 2 weeks relative to today? 
// Or just show standard weekly schedule since it's school mode.
// Let's show Standard Weekly Schedule for manual mode, it's more common for schools.
// BUT to keep "Export to Calendar" working, we need dates.
// Strategy: Display "This Week" by mapping static weekdays to real dates.

const getRealDate = (dayName: string) => {
  const dayMap: Record<string, number> = { 'Понеділок': 1, 'Вівторок': 2, 'Середа': 3, 'Четвер': 4, 'П\'ятниця': 5 }
  const targetDay = dayMap[dayName] || 1
  
  const d = new Date()
  const currentDay = d.getDay() || 7 // 1-7
  
  // Calculate difference to get to target day in current week
  const diff = targetDay - currentDay
  d.setDate(d.getDate() + diff)
  
  return d.toLocaleDateString('uk-UA', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

const displayDays = computed(() => {
  return weekDays.map(day => {
    const dayLessons = getDaySchedule(day)
    if (dayLessons.length === 0) return null
    
    return {
      date: getRealDate(day),
      dayName: day,
      isToday: new Date().toLocaleDateString('uk-UA', { weekday: 'long' }).toLowerCase() === day.toLowerCase(),
      lessons: dayLessons
    }
  }).filter(Boolean)
})

const exportToCalendar = () => {
  if (lessons.value.length === 0) return
  
  // Generate events for next 2 weeks based on weekly schedule
  const events = []
  
  // 2 weeks loop
  for (let week = 0; week < 2; week++) {
    const baseDate = new Date()
    baseDate.setDate(baseDate.getDate() + (week * 7)) // Shift week
    
    // For each configured lesson
    lessons.value.forEach(l => {
       const dayMap: Record<string, number> = { 'Понеділок': 1, 'Вівторок': 2, 'Середа': 3, 'Четвер': 4, 'П\'ятниця': 5 }
       const targetDay = dayMap[l.day]
       if (!targetDay) return

       const currentDay = baseDate.getDay() || 7
       const d = new Date(baseDate)
       d.setDate(d.getDate() + (targetDay - currentDay))

       // dateStr is YYYY-MM-DD, but Calendar helper probably wants DD.MM.YYYY
       const dateFormatted = d.toLocaleDateString('uk-UA', { day: '2-digit', month: '2-digit', year: 'numeric' })
       
       // Use dynamic times from useLocalSchedule
       const dayLessons = getDaySchedule(l.day)
       const currentLesson = dayLessons.find(dl => dl.id === l.id)
       const timeS = currentLesson?.timeStart || l.timeStart
       const timeE = currentLesson?.timeEnd || l.timeEnd

       events.push({
         date: dateFormatted,
         timeStart: timeS,
         timeEnd: timeE,
         discipline: l.subject,
         type: 'Урок',
         teacher: l.teacher,
         cabinet: l.cabinet,
         group: 'Мій Клас'
       })
    })
  }

  const icsContent = generateICS(events as any)
  downloadICS(`school_schedule.ics`, icsContent)
}
</script>

<template>
  <div>
    <!-- Controls -->
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-slate-500 font-medium text-sm uppercase tracking-wider">Мій Розклад</h2>
      <button @click="exportToCalendar" :disabled="!lessons.length" class="flex items-center gap-2 bg-indigo-600 text-white text-xs font-bold px-3 py-2 rounded-full shadow hover:bg-indigo-700 transition disabled:opacity-50">
        <ArrowDownTrayIcon class="w-4 h-4" />
        Календар
      </button>
    </div>

    <div v-if="lessons.length === 0" class="text-center py-12 text-slate-400 bg-white rounded-xl border border-dashed border-slate-300">
      <p class="mb-4">Розклад порожній</p>
      <button @click="emit('edit')" class="text-blue-600 font-bold hover:underline flex items-center justify-center gap-1 mx-auto">
        <PencilSquareIcon class="w-4 h-4" /> Додати уроки
      </button>
    </div>

    <!-- Schedule List -->
    <div v-else class="space-y-6">
      <div v-for="day in displayDays" :key="day!.dayName" class="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div class="flex items-baseline gap-2 mb-3 sticky top-16 bg-slate-50/95 backdrop-blur py-2 z-0">
          <span class="text-lg font-bold text-slate-800">
            {{ day!.dayName }}
          </span>
          <span class="text-xs font-semibold text-slate-400 bg-slate-200 px-2 py-0.5 rounded-md">
            {{ day!.date }}
          </span>
        </div>

        <div class="space-y-3">
          <div v-for="lesson in day!.lessons" :key="lesson.id" class="bg-white p-4 rounded-xl shadow-sm border border-slate-100 relative group overflow-hidden">
            <div class="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-400 to-indigo-500"></div>
            
            <div class="flex justify-between items-start mb-1 pl-3">
              <h3 class="font-bold text-slate-800 leading-tight">{{ lesson.subject }}</h3>
              <span class="text-xs font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded border border-slate-100 whitespace-nowrap ml-2">
                {{ lesson.timeStart }} - {{ lesson.timeEnd }}
              </span>
            </div>

            <div class="pl-3 text-sm text-slate-500 space-y-1">
              <div v-if="lesson.teacher" class="flex items-center gap-1">
                <span class="text-indigo-600">👤</span>
                {{ lesson.teacher }}
              </div>
              <div v-if="lesson.cabinet" class="flex items-center gap-1 text-slate-400 text-xs">
                <span>📍</span> Кабінет {{ lesson.cabinet }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
