import React, { useState, useEffect } from 'react';
import { Download, Plus, Trash2, GripHorizontal } from 'lucide-react';
import {
    DndContext,
    closestCenter,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
    defaultDropAnimationSideEffects
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import html2canvas from 'html2canvas';

// Утилита для генерации пастельного цвета на основе названия предмета
const getSubjectColor = (subject) => {
    if (!subject) return '#f1f5f9';
    let hash = 0;
    for (let i = 0; i < subject.length; i++) {
        hash = subject.charCodeAt(i) + ((hash << 5) - hash);
    }
    const h = Math.abs(hash % 360);
    return `hsla(${h}, 70%, 90%, 1)`; // Пастельные тона для светлой темы
};

const CLASSES = ['Все классы', '5-клас', '6-клас', '7-клас', '8-А клас', '8-Б клас', '9 клас'];
const DAYS = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница'];
const TIME_SLOTS = [
    '08:20 - 09:05',
    '09:15 - 10:00',
    '10:20 - 11:05',
    '11:20 - 12:05',
    '12:20 - 13:05',
    '13:15 - 14:00',
    '14:10 - 14:55',
    '15:05 - 15:50'
];

const INITIAL_DATA = {
    '5-клас': {
        'Понедельник': [{ name: 'Укр.мова', teacher: 'УМ' }, { name: 'Укр.мова', teacher: 'УМ' }, { name: 'Математика', teacher: 'М' }, { name: 'Англ.мова', teacher: 'АМ' }, { name: 'Фіз.культ.', teacher: 'СЗ' }, { name: 'Драмат. і театр', teacher: 'АЗ' }],
        'Вторник': [{ name: 'Інформатика(I)', teacher: 'ІН' }, { name: 'Укр.мова', teacher: 'УМ' }, { name: 'Англ.мова', teacher: 'АМ' }, { name: 'Укр.літ.', teacher: 'УМ' }, { name: 'Зар.літ', teacher: 'КБ' }, { name: 'STEM', teacher: 'ІСТ' }],
        'Среда': [{ name: 'Здор.,безп.та добр.', teacher: 'Б' }, { name: 'Пізнаємо природу', teacher: 'ІСТ' }, { name: 'Математика', teacher: 'М' }, { name: 'Математика', teacher: 'М' }, { name: 'Фіз.культ.', teacher: 'СЗ' }, { name: 'Історія', teacher: 'Г' }, { name: 'Інформатика(II)', teacher: 'ІН' }],
        'Четверг': [{ name: 'Пізнаємо природу', teacher: 'ІСТ' }, { name: 'Укр.мова', teacher: 'УМ' }, { name: 'Мистецтво', teacher: 'ІСТ' }, { name: 'Фіз.культ.', teacher: 'СЗ' }, { name: 'Етика', teacher: 'ІСТ' }, { name: 'Історія', teacher: 'Г' }],
        'Пятница': [{ name: 'Англ.мова', teacher: 'АМ' }, { name: 'Зар.літ', teacher: 'КБ' }, { name: 'Математика', teacher: 'М' }, { name: 'Математика', teacher: 'М' }, { name: 'Укр.літ.', teacher: 'УМ' }, { name: 'Технології', teacher: 'ТП' }, { name: 'Технології', teacher: 'ТП' }]
    },
    '6-клас': {
        'Понедельник': [{ name: 'Математика', teacher: 'М' }, { name: 'Фіз.культ.', teacher: 'СЗ' }, { name: 'Географія', teacher: 'Г' }, { name: 'Пізнаємо природу', teacher: 'ІСТ' }, { name: 'Англ.мова', teacher: 'АМ' }, { name: 'Англ.мова', teacher: 'АМ' }, { name: 'STEM', teacher: 'ІСТ' }, { name: 'Драмат. і театр', teacher: 'АЗ' }],
        'Вторник': [{ name: 'Укр.мова', teacher: 'М' }, { name: 'Укр.мова', teacher: 'М' }, { name: 'Укр.літ.', teacher: 'М' }, { name: 'Зар.літ', teacher: 'КБ' }, { name: 'Математика', teacher: 'М' }, { name: 'Англ.мова', teacher: 'АМ' }, { name: 'STEM', teacher: 'АМ' }],
        'Среда': [{ name: 'Англ.мова', teacher: 'АМ' }, { name: 'Математика', teacher: 'М' }, { name: 'Здор.,безп.та добр.', teacher: 'Б' }, { name: 'Фіз.культура', teacher: 'СЗ' }, { name: 'Історія', teacher: 'Г' }, { name: 'Інформатика(I)', teacher: 'ІН' }],
        'Четверг': [{ name: 'Географія', teacher: 'Г' }, { name: 'Математика', teacher: 'М' }, { name: 'Математика', teacher: 'М' }, { name: 'Громад.освіта', teacher: 'Г' }, { name: 'Фіз.культ.', teacher: 'СЗ' }, { name: 'Мистецтво', teacher: 'ІСТ' }, { name: 'Інформатика(II)', teacher: 'ІН' }, { name: 'Виховна година', teacher: '' }],
        'Пятница': [{ name: 'Історія', teacher: 'Г' }, { name: 'Укр.мова', teacher: 'АМ' }, { name: 'Укр.мова', teacher: 'АМ' }, { name: 'Технології', teacher: 'ТП' }, { name: 'Технології', teacher: 'ТП' }, { name: 'Зар.літ', teacher: 'КБ' }, { name: 'Етика', teacher: 'ІСТ' }]
    },
    '7-клас': {
        'Понедельник': [{ name: 'Інформатика(I)', teacher: 'ІН' }, { name: 'Алгебра', teacher: 'М' }, { name: 'Укр.мова', teacher: 'УМ' }, { name: 'Фіз.культура', teacher: 'СЗ' }, { name: 'Укр.літ.', teacher: 'УМ' }, { name: 'Фізика', teacher: 'КБ' }, { name: 'Географія', teacher: 'Г' }, { name: 'STEM', teacher: 'ІСТ' }],
        'Вторник': [{ name: 'Зар.літ', teacher: 'КБ' }, { name: 'Англ.мова', teacher: 'АМ' }, { name: 'Історія Укр.', teacher: 'Г' }, { name: 'Мистецтво', teacher: 'ІСТ' }, { name: 'Біологія', teacher: 'Б' }, { name: 'Всесв.істор.', teacher: 'Г' }, { name: 'Хімія', teacher: 'Г' }],
        'Среда': [{ name: 'Інформатика(II)', teacher: 'ІН' }, { name: 'Фіз.культ.', teacher: 'СЗ' }, { name: 'Англ.мова', teacher: 'АМ' }, { name: 'Фізика', teacher: 'КБ' }, { name: 'Алгебра', teacher: 'М' }, { name: 'Геометрія', teacher: 'КБ' }, { name: 'Здор.,безп.та добр.', teacher: 'Б' }, { name: 'Виховна година', teacher: 'ІСТ' }],
        'Четверг': [{ name: 'Біологія', teacher: 'Б' }, { name: 'Англ.мова', teacher: 'АМ' }, { name: 'Фіз.культ.', teacher: 'СЗ' }, { name: 'Укр.мова', teacher: 'УМ' }, { name: 'Історія Укр', teacher: 'Г' }, { name: 'Укр.мова', teacher: 'УМ' }, { name: 'STEM', teacher: 'ІСТ' }],
        'Пятница': [{ name: 'Алгебра', teacher: 'М' }, { name: 'Геометрія', teacher: 'М' }, { name: 'Драмат. і театр', teacher: 'АЗ' }, { name: 'Географія', teacher: 'Г' }, { name: 'Зар.літ', teacher: 'КБ' }, { name: 'Технології', teacher: 'Б' }, { name: 'Укр.літ.', teacher: 'УМ' }]
    },
    '8-А клас': {
        'Понедельник': [{ name: 'Англ.мова', teacher: 'АМ' }, { name: 'Алгебра', teacher: 'ІСТ' }, { name: 'Геометрія', teacher: 'ІН' }, { name: 'Інформатика', teacher: 'ІН' }, { name: 'Фізика', teacher: 'КБ' }, { name: 'Історія України', teacher: 'Г' }, { name: 'Фіз.культура', teacher: 'СЗ' }, { name: 'STEM', teacher: 'М' }],
        'Вторник': [{ name: 'Географія', teacher: 'Г' }, { name: 'Заруб.літ', teacher: 'КБ' }, { name: 'Алгебра', teacher: 'ІН' }, { name: 'Хімія', teacher: 'Г' }, { name: 'Укр.мова', teacher: 'УМ' }, { name: 'Укр.літ.', teacher: 'УМ' }, { name: 'Біологія', teacher: 'Б' }],
        'Среда': [{ name: 'Геометрія', teacher: 'М' }, { name: 'Інформатика', teacher: 'ІН' }, { name: 'Історія України', teacher: 'Г' }, { name: 'Англ.мова', teacher: 'АМ' }, { name: 'Фізика', teacher: 'КБ' }, { name: 'Здор.,безп.та добр.', teacher: 'Б' }, { name: 'Фіз.культура', teacher: 'СЗ' }],
        'Четверг': [{ name: 'Фіз.культура', teacher: 'СЗ' }, { name: 'Всесв.істор.', teacher: 'Г' }, { name: 'Біологія', teacher: 'Б' }, { name: 'Підприєм. і фін.грам.', teacher: 'ІСТ' }, { name: 'Англ.мова', teacher: 'АМ' }, { name: 'Алгебра', teacher: 'М' }, { name: 'Укр.мова', teacher: 'УМ' }],
        'Пятница': [{ name: 'Зар.літ', teacher: 'КБ' }, { name: 'Технології', teacher: 'ТП' }, { name: 'Хімія', teacher: 'Г' }, { name: 'Укр.мова', teacher: 'УМ' }, { name: 'Географія', teacher: 'Г' }, { name: 'Мистецтво', teacher: 'ІСТ' }, { name: 'Драмат. і театр', teacher: 'АЗ' }]
    },
    '8-Б клас': {
        'Понедельник': [{ name: 'Фіз.культ', teacher: 'СЗ' }, { name: 'Історія Укр.', teacher: 'Г' }, { name: 'Англ.мова', teacher: 'АМ' }, { name: 'Фізика', teacher: 'КБ' }, { name: 'Хімія', teacher: 'Г' }, { name: 'Алгебра', teacher: 'УМ' }, { name: 'STEM', teacher: 'М' }, { name: 'Драмат. і театр', teacher: 'АЗ' }],
        'Вторник': [{ name: 'Підприєм. і фін.грам.', teacher: 'ІСТ' }, { name: 'Геометрія', teacher: 'ІН' }, { name: 'Заруб.літ.', teacher: 'КБ' }, { name: 'Укр.мова', teacher: 'УМ' }, { name: 'Укр.мова', teacher: 'АМ' }, { name: 'Біологія', teacher: 'Б' }, { name: 'Інформатика(I)', teacher: 'ІН' }, { name: 'Інформатика(I)', teacher: 'ІН' }],
        'Среда': [{ name: 'Фізика', teacher: 'КБ' }, { name: 'Географія', teacher: 'Г' }, { name: 'Алгебра', teacher: 'ІН' }, { name: 'Всесв.історія', teacher: 'Г' }, { name: 'Англ.мова', teacher: 'АМ' }, { name: 'Фіз.культ.', teacher: 'СЗ' }, { name: 'STEM', teacher: 'КБ' }],
        'Четверг': [{ name: 'Геометрія', teacher: 'М' }, { name: 'Біологія', teacher: 'Б' }, { name: 'Хімія', teacher: 'Г' }, { name: 'Англ.мова', teacher: 'АМ' }, { name: 'Алгебра', teacher: 'М' }, { name: 'Фіз.культ.', teacher: 'СЗ' }, { name: 'Громад.освіта', teacher: 'Г' }],
        'Пятница': [{ name: 'Мистецтво', teacher: 'ІСТ' }, { name: 'Технології', teacher: 'ТП' }, { name: 'Зар.літ.', teacher: 'КБ' }, { name: 'Укр.мова', teacher: 'УМ' }, { name: 'Укр.літ.', teacher: 'АМ' }, { name: 'Географія', teacher: 'Г' }, { name: 'Інформатика(II)', teacher: 'ІН' }, { name: 'Інформатика(II)', teacher: 'ІН' }]
    },
    '9 клас': {
        'Понедельник': [{ name: 'Географія', teacher: 'Г' }, { name: 'Інформ/Англ', teacher: 'ІН/АМ' }, { name: 'Фізика', teacher: 'КБ' }, { name: 'Істор.України', teacher: 'Г' }, { name: 'Алгебра', teacher: 'ІСТ' }, { name: 'Фіз.культ', teacher: 'СЗ' }, { name: 'Інформатика', teacher: 'ІН' }],
        'Вторник': [{ name: 'Укр.мова(I) / Англ.мова(II)', teacher: 'УМ/АМ' }, { name: 'Хімія', teacher: 'Г' }, { name: 'Укр.мова(II) / Інформатика(I)', teacher: 'УМ/ІСТ' }, { name: 'Геометрія', teacher: 'М' }, { name: 'Правознавство', teacher: 'Г' }, { name: 'Заруб.літ', teacher: 'КБ' }, { name: 'Укр.літ', teacher: 'УМ' }, { name: 'Особиста гідність', teacher: 'ІСТ' }],
        'Среда': [{ name: 'Всесв.історія', teacher: 'Г' }, { name: 'Фізика', teacher: 'КБ' }, { name: 'Фізика', teacher: 'КБ' }, { name: 'Біологія', teacher: 'Б' }, { name: 'Алгебра', teacher: 'ІН' }, { name: 'Інформ(II) / Англ.мова(I)', teacher: 'М/АМ' }, { name: 'Інформатика(II)', teacher: 'М' }],
        'Четверг': [{ name: 'Укр.мова(I) / Англ.мова(II)', teacher: 'УМ/АМ' }, { name: 'Фіз.культ', teacher: 'СЗ' }, { name: 'Укр.мова(II) / Інформатика(I)', teacher: 'УМ/ІСТ' }, { name: 'Геометрія', teacher: 'М' }, { name: 'Біологія', teacher: 'Б' }, { name: 'Осн. здоров’я', teacher: 'Б' }, { name: 'Фінансова гр.', teacher: 'АМ' }, { name: 'Виховна година', teacher: 'Г' }],
        'Пятница': [{ name: 'Фіз.культ', teacher: 'СЗ' }, { name: 'Хімія', teacher: 'Г' }, { name: 'Труд.навчання', teacher: 'ТП' }, { name: 'Заруб.літ', teacher: 'КБ' }, { name: 'Мистецтво', teacher: 'ІСТ' }, { name: 'Укр.літ', teacher: 'УМ' }, { name: 'Історія України', teacher: 'Г' }, { name: 'Хореографія', teacher: 'АЗ' }]
    }
};

const DraggableSubject = ({ name }) => {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useSortable({
        id: `bank::${name}`,
        data: { type: 'bank', name }
    });
    const style = {
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0.5 : 1,
        backgroundColor: getSubjectColor(name)
    };
    return (
        <div ref={setNodeRef} style={style} className="bank-item" {...attributes} {...listeners}>
            {name}
        </div>
    );
};

const SubjectBank = () => {
    const allSubjects = new Set();
    Object.values(INITIAL_DATA).forEach(cls => {
        Object.values(cls).forEach(day => {
            day.forEach(lesson => {
                if (lesson.name) allSubjects.add(lesson.name);
            });
        });
    });
    const sortedSubjects = Array.from(allSubjects).sort();

    return (
        <div className="subject-bank-container">
            <div className="subject-bank-title">
                <GripHorizontal size={18} />
                <span>Банк предметов (перетащите в расписание)</span>
            </div>
            <div className="subject-bank-grid">
                <SortableContext items={sortedSubjects.map(s => `bank::${s}`)} strategy={verticalListSortingStrategy}>
                    {sortedSubjects.map(name => (
                        <DraggableSubject key={name} name={name} />
                    ))}
                </SortableContext>
            </div>
        </div>
    );
};

const SortableLesson = ({ id, lesson }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging, isOver } = useSortable({ id });
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        backgroundColor: isOver ? 'rgba(37, 99, 235, 0.1)' : getSubjectColor(lesson?.name),
        border: isOver ? '2px solid var(--accent)' : '1px solid rgba(0, 0, 0, 0.05)',
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 10 : 1,
        boxShadow: isOver ? '0 0 15px rgba(37, 99, 235, 0.3)' : '0 2px 4px rgba(0, 0, 0, 0.02)'
    };
    return (
        <div ref={setNodeRef} style={style} className="lesson-card" {...attributes} {...listeners}>
            <div className="lesson-name">{lesson?.name || 'Пусто'}</div>
            <div className="lesson-teacher">{lesson?.teacher || ''}</div>
        </div>
    );
};

const SingleGrid = ({ cls, schedule, updateLesson }) => {
    return (
        <div className="schedule-wrapper">
            <h2 style={{ textAlign: 'center', marginBottom: '1rem', fontFamily: 'var(--font-header)' }}>
                Розклад уроків: {cls}
            </h2>
            <div className="schedule-grid">
                <div className="grid-header">Время</div>
                {DAYS.map(day => (
                    <div key={day} className="grid-header">{day}</div>
                ))}

                {TIME_SLOTS.map((slot, timeIndex) => (
                    <React.Fragment key={slot}>
                        <div className="grid-header" style={{ fontSize: '0.8rem', borderBottom: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {slot}
                        </div>
                        {DAYS.map(day => {
                            const lesson = schedule[cls]?.[day]?.[timeIndex];
                            if (!lesson) return <div key={`${cls}:${day}:${timeIndex}`} className="day-column" />;
                            return (
                                <div key={`${cls}:${day}:${timeIndex}`} className="day-column">
                                    <div className="lesson-slot">
                                        <SortableContext items={[lesson.id]} strategy={verticalListSortingStrategy}>
                                            <SortableLesson id={lesson.id} lesson={lesson} />
                                        </SortableContext>
                                        {updateLesson && (
                                            <div className="edit-inputs" style={{ marginTop: '5px' }}>
                                                <input
                                                    value={lesson.name || ''}
                                                    onChange={(e) => updateLesson(cls, day, timeIndex, 'name', e.target.value)}
                                                    placeholder="Предмет"
                                                    style={{
                                                        width: '100%',
                                                        background: 'transparent',
                                                        border: 'none',
                                                        borderBottom: '1px solid var(--glass-border)',
                                                        color: 'white',
                                                        fontSize: '0.7rem',
                                                        textAlign: 'center'
                                                    }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

const DroppableCell = ({ id, lesson, cls, day, timeIndex, updateLesson, isDragging }) => {
    const { setNodeRef, isOver } = useSortable({ id });

    const style = {
        backgroundColor: isOver ? 'rgba(37, 99, 235, 0.2)' : getSubjectColor(lesson?.name),
        border: isOver ? '2px solid var(--accent)' : '0.5px solid #e2e8f0',
        transition: 'all 0.2s ease',
        position: isOver ? 'relative' : 'static',
        zIndex: isOver ? 10 : 'auto'
    };

    return (
        <div
            ref={setNodeRef}
            className={`compact-cell ${isOver ? 'is-over' : ''}`}
            style={style}
        >
            <div style={{ pointerEvents: isDragging ? 'none' : 'auto', display: 'flex', flexDirection: 'column', width: '100%' }}>
                <input
                    value={lesson?.name || ''}
                    readOnly={isDragging}
                    onChange={(e) => updateLesson(cls, day, timeIndex, 'name', e.target.value)}
                    className="compact-input"
                    placeholder="Предмет"
                    style={{ fontWeight: 'bold', fontSize: '0.75rem' }}
                />
                <input
                    value={lesson?.teacher || ''}
                    readOnly={isDragging}
                    onChange={(e) => updateLesson(cls, day, timeIndex, 'teacher', e.target.value)}
                    className="compact-input"
                    placeholder="Учитель"
                    style={{ fontSize: '0.65rem', opacity: 0.8 }}
                />
            </div>
        </div>
    );
};

const CompactBoard = ({ schedule, updateLesson, currentActiveId }) => {
    const classList = CLASSES.slice(1);

    return (
        <div id="compact-schedule-board" className="compact-board">
            <div className="print-header">
                <h1>Розклад уроків</h1>
                <div className="print-meta">
                    <span>II СЕМЕСТР 2025 / 2026 НАВЧАЛЬНОГО РОКУ</span>
                </div>
            </div>

            {DAYS.map(day => {
                // Собираем все ID ячеек для этого дня, чтобы SortableContext о них знал
                const dayCellIds = [];
                classList.forEach(cls => {
                    TIME_SLOTS.forEach((_, timeIndex) => {
                        dayCellIds.push(`${cls}::${day}::${timeIndex}`);
                    });
                });

                return (
                    <div key={day} className="compact-day-section">
                        <div className="compact-day-title">{day}</div>
                        <SortableContext items={dayCellIds} strategy={verticalListSortingStrategy}>
                            <div className="compact-grid">
                                <div className="compact-cell header">Урок</div>
                                {classList.map(cls => (
                                    <div key={cls} className="compact-cell header">{cls}</div>
                                ))}

                                {TIME_SLOTS.map((slot, timeIndex) => (
                                    <React.Fragment key={slot}>
                                        <div className="compact-cell header" style={{ fontSize: '0.65rem' }}>
                                            {timeIndex + 1}<br />{slot.split(' - ')[0]}
                                        </div>
                                        {classList.map(cls => {
                                            const lesson = schedule[cls]?.[day]?.[timeIndex];
                                            const cellId = `${cls}::${day}::${timeIndex}`;
                                            return (
                                                <DroppableCell
                                                    key={cellId}
                                                    id={cellId}
                                                    lesson={lesson}
                                                    cls={cls}
                                                    day={day}
                                                    timeIndex={timeIndex}
                                                    updateLesson={updateLesson}
                                                    isDragging={!!currentActiveId}
                                                />
                                            );
                                        })}
                                    </React.Fragment>
                                ))}
                            </div>
                        </SortableContext>
                    </div>
                );
            })}
        </div>
    );
};

export default function App() {
    const [currentClass, setCurrentClass] = useState(CLASSES[0]);
    const [schedule, setSchedule] = useState(() => {
        const saved = localStorage.getItem('school-schedule-v4');
        if (saved) return JSON.parse(saved);
        const initial = {};
        CLASSES.forEach(cls => {
            initial[cls] = {};
            DAYS.forEach(day => {
                initial[cls][day] = TIME_SLOTS.map((slot, index) => {
                    const seeded = INITIAL_DATA[cls]?.[day]?.[index];
                    return { id: `${cls}::${day}::${index}`, name: seeded?.name || '', teacher: seeded?.teacher || '' };
                });
            });
        });
        return initial;
    });

    const [activeId, setActiveId] = useState(null);
    useEffect(() => { localStorage.setItem('school-schedule-v4', JSON.stringify(schedule)); }, [schedule]);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const handleDragStart = (event) => { setActiveId(event.active.id); };

    const handleDragEnd = (event) => {
        const { active, over } = event;
        setActiveId(null);
        if (!over || active.id === over.id) return;

        // Если перетаскиваем из банка
        if (active.id.startsWith('bank::')) {
            const subjectName = active.id.replace('bank::', '');
            const [overCls, overDay, overIdx] = over.id.split('::');

            if (overCls && overDay && overIdx !== undefined) {
                updateLesson(overCls, overDay, parseInt(overIdx), 'name', subjectName);
            }
            return;
        }

        // Если перетаскиваем существующий урок (обмен)
        const [activeCls, activeDay, activeIdx] = active.id.split('::');
        const [overCls, overDay, overIdx] = over.id.split('::');

        if (activeCls !== overCls || activeDay !== overDay) return;

        setSchedule(prev => {
            const newSchedule = { ...prev };
            const dayLessons = [...newSchedule[activeCls][activeDay]];

            const activeLesson = { ...dayLessons[parseInt(activeIdx)] };
            const overLesson = { ...dayLessons[parseInt(overIdx)] };

            dayLessons[parseInt(activeIdx)] = overLesson;
            dayLessons[parseInt(overIdx)] = activeLesson;

            newSchedule[activeCls][activeDay] = dayLessons;
            return newSchedule;
        });
    };

    const updateLesson = (cls, day, index, field, value) => {
        setSchedule(prev => {
            if (!prev[cls] || !prev[cls][day]) return prev;
            const newDay = [...prev[cls][day]];
            newDay[index] = { ...newDay[index], [field]: value };
            return {
                ...prev,
                [cls]: { ...prev[cls], [day]: newDay }
            };
        });
    };

    const exportAsImage = async () => {
        try {
            const id = currentClass === 'Все классы' ? 'compact-schedule-board' : 'schedule-grid';
            const element = document.getElementById(id);
            if (!element) return;

            const canvas = await html2canvas(element, {
                backgroundColor: '#ffffff',
                scale: 2,
                useCORS: true,
                logging: false,
                onclone: (clonedDoc) => {
                    const inputs = clonedDoc.querySelectorAll('input');
                    inputs.forEach(input => {
                        const span = clonedDoc.createElement('span');
                        span.innerText = input.value;
                        span.className = input.className;
                        span.style.cssText = input.style.cssText;
                        span.style.display = 'inline-block';
                        span.style.border = 'none';
                        span.style.background = 'transparent';
                        if (input.parentNode) {
                            input.parentNode.replaceChild(span, input);
                        }
                    });
                }
            });

            const link = document.createElement('a');
            link.style.display = 'none';
            document.body.appendChild(link);
            link.download = `schedule-${currentClass === 'Все классы' ? 'all' : currentClass}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
            link.remove();
        } catch (err) {
            console.error('Export failed:', err);
            alert('Произошла ошибка при сохранении. Проверьте консоль.');
        }
    };

    return (
        <div className="app-container">
            <header>
                <h1>Конструктор Расписания</h1>
                <div className="class-selector" style={{ marginBottom: '1rem', display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                    {CLASSES.map(cls => (
                        <button
                            key={cls}
                            onClick={() => setCurrentClass(cls)}
                            className={currentClass === cls ? 'btn-primary' : ''}
                            style={{ margin: '0.25rem' }}
                        >
                            {cls}
                        </button>
                    ))}
                </div>
            </header>

            <div className="controls" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '1rem' }}>
                <button onClick={exportAsImage} className="btn-primary">
                    <Download size={20} style={{ marginRight: '8px' }} />
                    {currentClass === 'Все классы' ? 'Скачать общее расписание' : `Скачать ${currentClass}`}
                </button>
            </div>

            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                {/* Банк предметов доступен всегда для быстрого заполнения */}
                <SubjectBank />

                <div id="schedule-display-area">
                    {currentClass === 'Все классы' ? (
                        <CompactBoard schedule={schedule} updateLesson={updateLesson} currentActiveId={activeId} />
                    ) : (
                        <div id="schedule-grid">
                            <SingleGrid
                                cls={currentClass}
                                schedule={schedule}
                                updateLesson={updateLesson}
                            />
                        </div>
                    )}
                </div>

                <DragOverlay dropAnimation={{
                    sideEffects: defaultDropAnimationSideEffects({
                        styles: {
                            active: {
                                opacity: '0.5',
                            },
                        },
                    }),
                }}>
                    {activeId ? (
                        activeId.startsWith('bank::') ? (
                            <div className="bank-item" style={{ backgroundColor: getSubjectColor(activeId.replace('bank::', '')) }}>
                                {activeId.replace('bank::', '')}
                            </div>
                        ) : null
                    ) : null}
                </DragOverlay>
            </DndContext>
        </div>
    );
}
