<script setup lang="ts">
import { ref } from 'vue'
import ScheduleView from './components/ScheduleView.vue'
import SettingsView from './components/SettingsView.vue'
import AdminView from './components/AdminView.vue'
import { CalendarDaysIcon, Cog6ToothIcon, PencilSquareIcon } from '@heroicons/vue/24/solid'

const currentView = ref('schedule')

const toggleView = (view: string) => {
  currentView.value = view
}

const openAdmin = () => currentView.value = 'admin'
const closeAdmin = () => currentView.value = 'schedule'
</script>

<template>
  <div class="min-h-screen bg-slate-50 text-slate-900 font-sans pb-20">
    <header class="bg-blue-600 text-white p-4 shadow-lg sticky top-0 z-50 transition-colors duration-300">
      <div class="max-w-md mx-auto flex justify-between items-center">
        <h1 class="text-xl font-bold tracking-wide flex items-center gap-2">
          📅 <span>Мій Клас</span>
        </h1>
        <div class="flex gap-2">
           <button @click="currentView = 'admin'" :class="currentView === 'admin' ? 'bg-blue-700' : 'bg-blue-500'" class="p-2 rounded-full hover:bg-blue-400 transition" title="Редагувати">
             <PencilSquareIcon class="w-6 h-6" />
           </button>
           <button @click="currentView = currentView === 'settings' ? 'schedule' : 'settings'" :class="currentView === 'settings' ? 'bg-blue-700' : 'bg-blue-500'" class="p-2 rounded-full hover:bg-blue-400 transition" title="Налаштування">
             <Cog6ToothIcon v-if="currentView === 'schedule' || currentView === 'admin'" class="w-6 h-6" />
             <CalendarDaysIcon v-else class="w-6 h-6" />
           </button>
        </div>
      </div>
    </header>

    <main class="max-w-md mx-auto p-4">
      <div v-if="currentView === 'settings'">
        <SettingsView @close="currentView = 'schedule'" />
      </div>
      
      <div v-else-if="currentView === 'admin'">
        <AdminView />
      </div>
      
      <div v-else>
        <ScheduleView @edit="openAdmin" />
      </div>
    </main>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
