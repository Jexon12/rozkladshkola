import { ref, onMounted } from 'vue'

export interface Lesson {
    id: string
    day: string
    number: number
    timeStart: string
    timeEnd: string
    subject: string
    teacher?: string
    cabinet?: string
}

const STORAGE_KEY = 'school_schedule_data'

export function useLocalSchedule() {
    const lessons = ref<Lesson[]>([])

    // Reactive Bell Schedule
    const bellSchedule = ref([
        { start: '08:30', end: '09:15' },
        { start: '09:25', end: '10:10' },
        { start: '10:25', end: '11:10' },
        { start: '11:25', end: '12:10' },
        { start: '12:20', end: '13:05' },
        { start: '13:15', end: '14:00' },
        { start: '14:10', end: '14:55' },
        { start: '15:05', end: '15:50' },
    ])

    const TIMES_KEY = 'school_bell_schedule'

    const loadLessons = () => {
        // Load Lessons
        const rawLessons = localStorage.getItem(STORAGE_KEY)
        if (rawLessons) {
            try {
                lessons.value = JSON.parse(rawLessons)
            } catch (e) {
                console.error('Failed to parse schedule', e)
                lessons.value = []
            }
        }

        // Load Times
        const rawTimes = localStorage.getItem(TIMES_KEY)
        if (rawTimes) {
            try {
                bellSchedule.value = JSON.parse(rawTimes)
            } catch (e) {
                console.error('Failed to parse times', e)
            }
        }
    }

    const saveLessons = () => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(lessons.value))
    }

    const saveBellSchedule = () => {
        localStorage.setItem(TIMES_KEY, JSON.stringify(bellSchedule.value))
    }

    const addLesson = (lesson: Omit<Lesson, 'id'>) => {
        const newLesson = {
            ...lesson,
            id: crypto.randomUUID()
        }
        lessons.value.push(newLesson)
        saveLessons()
    }

    const updateLesson = (updatedLesson: Lesson) => {
        const index = lessons.value.findIndex(l => l.id === updatedLesson.id)
        if (index !== -1) {
            lessons.value[index] = updatedLesson
            saveLessons()
        }
    }

    const removeLesson = (id: string) => {
        lessons.value = lessons.value.filter(l => l.id !== id)
        saveLessons()
    }

    const clearSchedule = () => {
        lessons.value = []
        saveLessons()
    }

    const exportConfig = () => {
        return JSON.stringify({
            lessons: lessons.value,
            times: bellSchedule.value
        }, null, 2)
    }

    const importConfig = (json: string) => {
        try {
            const data = JSON.parse(json)

            if (Array.isArray(data)) {
                lessons.value = data
                saveLessons()
                return true
            }

            if (data.lessons && Array.isArray(data.lessons)) {
                lessons.value = data.lessons
                saveLessons()

                if (data.times && Array.isArray(data.times)) {
                    bellSchedule.value = data.times
                    saveBellSchedule()
                }
                return true
            }
        } catch (e) {
            console.error('Import failed', e)
        }
        return false
    }

    const getDaySchedule = (dayName: string) => {
        return lessons.value
            .filter(l => l.day === dayName)
            .sort((a, b) => a.number - b.number)
            .map(l => {
                const times = bellSchedule.value[l.number - 1] || { start: '00:00', end: '00:00' }
                return {
                    ...l,
                    timeStart: times.start,
                    timeEnd: times.end
                }
            })
    }

    onMounted(() => {
        loadLessons()
    })

    return {
        lessons,
        bellSchedule,
        saveBellSchedule,
        addLesson,
        updateLesson,
        removeLesson,
        clearSchedule,
        exportConfig,
        importConfig,
        getDaySchedule,
        loadLessons
    }
}
