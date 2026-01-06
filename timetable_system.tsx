import React, { useState } from 'react';
import { Calendar, Clock, Users, Building2, BookOpen, Settings, Play, Save, Undo2, Redo2, AlertCircle, CheckCircle2, Plus, Search, Filter, Download, Upload, Moon, Sun, X, Edit2, Trash2 } from 'lucide-react';

const TimetableSystemUI = () => {
  const [activeTab, setActiveTab] = useState('timetable');
  const [darkMode, setDarkMode] = useState(false);
  const [selectedClass, setSelectedClass] = useState('Grade 10A');
  const [viewMode, setViewMode] = useState('class');
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [showAddLessonModal, setShowAddLessonModal] = useState(false);
  const [showTimeSlotsModal, setShowTimeSlotsModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showAddTeacherModal, setShowAddTeacherModal] = useState(false);
  const [showAddClassModal, setShowAddClassModal] = useState(false);
  const [showAddRoomModal, setShowAddRoomModal] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [selectedRoom, setSelectedRoom] = useState('');

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const [timeSlots, setTimeSlots] = useState([
    { id: 1, start: '08:00', end: '08:45', name: 'Period 1', isBreak: false },
    { id: 2, start: '08:50', end: '09:35', name: 'Period 2', isBreak: false },
    { id: 3, start: '09:40', end: '10:25', name: 'Period 3', isBreak: false },
    { id: 'break1', start: '10:25', end: '10:45', name: 'Break', isBreak: true },
    { id: 4, start: '10:45', end: '11:30', name: 'Period 4', isBreak: false },
    { id: 5, start: '11:35', end: '12:20', name: 'Period 5', isBreak: false },
    { id: 'lunch', start: '12:20', end: '13:00', name: 'Lunch', isBreak: true },
    { id: 6, start: '13:00', end: '13:45', name: 'Period 6', isBreak: false },
  ]);

  const [lessons, setLessons] = useState({
    'Monday-1-Grade10A': { subject: 'Mathematics', teacher: 'Dr. Smith', room: 'A-201', color: 'bg-blue-500', class: 'Grade 10A' },
    'Monday-2-Grade10A': { subject: 'Physics', teacher: 'Dr. Johnson', room: 'Lab-3', color: 'bg-purple-500', class: 'Grade 10A' },
    'Tuesday-1-Grade10A': { subject: 'English', teacher: 'Ms. Brown', room: 'B-104', color: 'bg-green-500', class: 'Grade 10A' },
    'Tuesday-3-Grade10A': { subject: 'Chemistry', teacher: 'Dr. Davis', room: 'Lab-1', color: 'bg-pink-500', class: 'Grade 10A' },
    'Wednesday-2-Grade10A': { subject: 'History', teacher: 'Mr. Wilson', room: 'C-302', color: 'bg-orange-500', class: 'Grade 10A' },
    'Thursday-1-Grade10A': { subject: 'Mathematics', teacher: 'Dr. Smith', room: 'A-201', color: 'bg-blue-500', class: 'Grade 10A' },
    'Friday-4-Grade10A': { subject: 'Physical Ed', teacher: 'Coach Lee', room: 'Gym', color: 'bg-teal-500', class: 'Grade 10A' },
    'Monday-1-Grade10B': { subject: 'English', teacher: 'Ms. Brown', room: 'B-105', color: 'bg-green-500', class: 'Grade 10B' },
    'Tuesday-3-Grade10B': { subject: 'Mathematics', teacher: 'Dr. Smith', room: 'A-202', color: 'bg-blue-500', class: 'Grade 10B' },
  });

  const [classes, setClasses] = useState(['Grade 10A', 'Grade 10B', 'Grade 11A', 'Grade 11B']);
  const [teachers, setTeachers] = useState([
    { name: 'Dr. Smith', subject: 'Mathematics', email: 'smith@school.com' },
    { name: 'Dr. Johnson', subject: 'Physics', email: 'johnson@school.com' },
    { name: 'Ms. Brown', subject: 'English', email: 'brown@school.com' },
    { name: 'Dr. Davis', subject: 'Chemistry', email: 'davis@school.com' },
    { name: 'Mr. Wilson', subject: 'History', email: 'wilson@school.com' },
    { name: 'Coach Lee', subject: 'Physical Ed', email: 'lee@school.com' }
  ]);
  const [rooms, setRooms] = useState(['A-201', 'A-202', 'B-104', 'B-105', 'Lab-1', 'Lab-3', 'C-302', 'Gym']);
  const subjects = [
    { name: 'Mathematics', color: 'bg-blue-500' },
    { name: 'Physics', color: 'bg-purple-500' },
    { name: 'Chemistry', color: 'bg-pink-500' },
    { name: 'English', color: 'bg-green-500' },
    { name: 'History', color: 'bg-orange-500' },
    { name: 'Physical Ed', color: 'bg-teal-500' },
    { name: 'Biology', color: 'bg-emerald-500' },
    { name: 'Geography', color: 'bg-yellow-500' },
  ];

  const [schoolSettings, setSchoolSettings] = useState({
    schoolName: 'Washington High School',
    maxPeriodsPerDay: 8,
    maxPeriodsPerWeek: 30,
    enableConflictCheck: true
  });

  const bgColor = darkMode ? 'bg-gray-900' : 'bg-gray-50';
  const cardBg = darkMode ? 'bg-gray-800' : 'bg-white';
  const textColor = darkMode ? 'text-gray-100' : 'text-gray-900';
  const mutedText = darkMode ? 'text-gray-400' : 'text-gray-600';
  const borderColor = darkMode ? 'border-gray-700' : 'border-gray-200';

  const detectConflicts = () => {
    const conflicts = [];
    const lessonArray = Object.entries(lessons);
    
    lessonArray.forEach(([key1, lesson1], i) => {
      lessonArray.slice(i + 1).forEach(([key2, lesson2]) => {
        const [day1, slot1] = key1.split('-');
        const [day2, slot2] = key2.split('-');
        
        if (day1 === day2 && slot1 === slot2) {
          if (lesson1.teacher === lesson2.teacher) {
            conflicts.push({ key: key1, reason: `Teacher ${lesson1.teacher} has multiple classes` });
          }
          if (lesson1.room === lesson2.room && lesson1.class !== lesson2.class) {
            conflicts.push({ key: key1, reason: `Room ${lesson1.room} double booked` });
          }
        }
      });
    });
    
    return conflicts;
  };

  const conflicts = schoolSettings.enableConflictCheck ? detectConflicts() : [];

  const saveToHistory = (newLessons) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(JSON.parse(JSON.stringify(newLessons)));
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setLessons(JSON.parse(JSON.stringify(history[historyIndex - 1])));
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setLessons(JSON.parse(JSON.stringify(history[historyIndex + 1])));
    }
  };

  const handleAddLesson = (day, timeSlot) => {
    setSelectedDay(day);
    setSelectedTimeSlot(timeSlot);
    setEditingLesson(null);
    setShowAddLessonModal(true);
  };

  const handleEditLesson = (lessonKey) => {
    const lesson = lessons[lessonKey];
    const parts = lessonKey.split('-');
    const day = parts[0];
    const slotId = parts[1];
    setSelectedDay(day);
    setSelectedTimeSlot(slotId);
    setEditingLesson({ ...lesson, key: lessonKey });
    setShowAddLessonModal(true);
  };

  const handleDeleteLesson = (lessonKey) => {
    const newLessons = { ...lessons };
    delete newLessons[lessonKey];
    saveToHistory(newLessons);
    setLessons(newLessons);
  };

  const saveLessonFromModal = (lessonData) => {
    const classId = lessonData.class.replace(/\s/g, '');
    const key = `${selectedDay}-${selectedTimeSlot}-${classId}`;
    const newLessons = { ...lessons };
    
    if (editingLesson && editingLesson.key) {
      delete newLessons[editingLesson.key];
    }
    
    newLessons[key] = lessonData;
    
    saveToHistory(newLessons);
    setLessons(newLessons);
    setShowAddLessonModal(false);
  };

  const autoGenerate = () => {
    alert('Автоматическая генерация расписания запущена! В полной версии здесь будет алгоритм оптимизации.');
  };

  const exportSchedule = () => {
    const exportData = {
      lessons,
      classes,
      teachers,
      rooms,
      timeSlots,
      settings: schoolSettings,
      exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `timetable-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const importSchedule = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const imported = JSON.parse(event.target.result);
          if (imported.lessons) {
            saveToHistory(imported.lessons);
            setLessons(imported.lessons);
          }
          if (imported.classes) setClasses(imported.classes);
          if (imported.teachers) setTeachers(imported.teachers);
          if (imported.rooms) setRooms(imported.rooms);
          if (imported.timeSlots) setTimeSlots(imported.timeSlots);
          if (imported.settings) setSchoolSettings(imported.settings);
          alert('Расписание успешно импортировано!');
        } catch (error) {
          alert('Ошибка при импорте расписания: ' + error.message);
        }
      };
      reader.readAsText(file);
    }
    e.target.value = '';
  };

  const getLessonsForView = () => {
    const lessonEntries = Object.entries(lessons);
    
    if (viewMode === 'class') {
      return lessonEntries.filter(([key, lesson]) => lesson.class === selectedClass);
    } else if (viewMode === 'teacher') {
      return lessonEntries.filter(([key, lesson]) => lesson.teacher === selectedTeacher);
    } else if (viewMode === 'classroom') {
      return lessonEntries.filter(([key, lesson]) => lesson.room === selectedRoom);
    }
    return lessonEntries;
  };

  const AddLessonModal = () => {
    const [formData, setFormData] = useState(editingLesson || {
      subject: '',
      teacher: '',
      room: '',
      class: viewMode === 'class' ? selectedClass : classes[0],
      color: 'bg-blue-500'
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      saveLessonFromModal(formData);
    };

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowAddLessonModal(false)}>
        <div className={`${cardBg} rounded-lg p-6 w-full max-w-md`} onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold">{editingLesson ? 'Редактировать урок' : 'Добавить урок'}</h3>
            <button onClick={() => setShowAddLessonModal(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Предмет</label>
              <select
                value={formData.subject}
                onChange={(e) => {
                  const subject = subjects.find(s => s.name === e.target.value);
                  setFormData({ ...formData, subject: e.target.value, color: subject?.color || 'bg-blue-500' });
                }}
                className={`w-full px-3 py-2 border ${borderColor} rounded-lg ${cardBg}`}
                required
              >
                <option value="">Выберите предмет</option>
                {subjects.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Учитель</label>
              <select
                value={formData.teacher}
                onChange={(e) => setFormData({ ...formData, teacher: e.target.value })}
                className={`w-full px-3 py-2 border ${borderColor} rounded-lg ${cardBg}`}
                required
              >
                <option value="">Выберите учителя</option>
                {teachers.map(t => <option key={t.name} value={t.name}>{t.name}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Кабинет</label>
              <select
                value={formData.room}
                onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                className={`w-full px-3 py-2 border ${borderColor} rounded-lg ${cardBg}`}
                required
              >
                <option value="">Выберите кабинет</option>
                {rooms.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>

            {viewMode !== 'class' && (
              <div>
                <label className="block text-sm font-medium mb-1">Класс</label>
                <select
                  value={formData.class}
                  onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                  className={`w-full px-3 py-2 border ${borderColor} rounded-lg ${cardBg}`}
                  required
                >
                  {classes.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            )}

            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4" />
              <span>{selectedDay} - {timeSlots.find(t => t.id == selectedTimeSlot)?.start} to {timeSlots.find(t => t.id == selectedTimeSlot)?.end}</span>
            </div>

            <div className="flex gap-2 pt-4">
              <button
                type="button"
                onClick={() => setShowAddLessonModal(false)}
                className={`flex-1 px-4 py-2 border ${borderColor} rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700`}
              >
                Отмена
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                {editingLesson ? 'Обновить' : 'Добавить'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const TimeSlotsModal = () => {
    const [slots, setSlots] = useState([...timeSlots]);
    const [newSlot, setNewSlot] = useState({ start: '', end: '', name: '', isBreak: false });

    const addTimeSlot = () => {
      if (newSlot.start && newSlot.end && newSlot.name) {
        const id = newSlot.isBreak ? `break-${Date.now()}` : slots.filter(s => !s.isBreak).length + 1;
        setSlots([...slots, { ...newSlot, id }]);
        setNewSlot({ start: '', end: '', name: '', isBreak: false });
      }
    };

    const removeTimeSlot = (id) => {
      setSlots(slots.filter(s => s.id !== id));
    };

    const saveTimeSlots = () => {
      setTimeSlots(slots);
      setShowTimeSlotsModal(false);
    };

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowTimeSlotsModal(false)}>
        <div className={`${cardBg} rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-auto`} onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold">Управление временными слотами</h3>
            <button onClick={() => setShowTimeSlotsModal(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-2">
              <input
                type="time"
                value={newSlot.start}
                onChange={(e) => setNewSlot({ ...newSlot, start: e.target.value })}
                className={`px-3 py-2 border ${borderColor} rounded-lg ${cardBg}`}
                placeholder="Начало"
              />
              <input
                type="time"
                value={newSlot.end}
                onChange={(e) => setNewSlot({ ...newSlot, end: e.target.value })}
                className={`px-3 py-2 border ${borderColor} rounded-lg ${cardBg}`}
                placeholder="Конец"
              />
              <input
                type="text"
                value={newSlot.name}
                onChange={(e) => setNewSlot({ ...newSlot, name: e.target.value })}
                className={`px-3 py-2 border ${borderColor} rounded-lg ${cardBg}`}
                placeholder="Название"
              />
              <div className="flex gap-2">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={newSlot.isBreak}
                    onChange={(e) => setNewSlot({ ...newSlot, isBreak: e.target.checked })}
                  />
                  Перерыв
                </label>
                <button
                  onClick={addTimeSlot}
                  className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-2">
              {slots.map(slot => (
                <div key={slot.id} className={`flex items-center justify-between p-3 border ${borderColor} rounded-lg ${slot.isBreak ? 'bg-yellow-50 dark:bg-yellow-900/20' : ''}`}>
                  <div className="flex items-center gap-4">
                    <span className="font-medium">{slot.name}</span>
                    <span className={`text-sm ${mutedText}`}>{slot.start} - {slot.end}</span>
                    {slot.isBreak && <span className="text-xs bg-yellow-200 dark:bg-yellow-800 px-2 py-1 rounded">Перерыв</span>}
                  </div>
                  <button
                    onClick={() => removeTimeSlot(slot.id)}
                    className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2 pt-4">
              <button
                onClick={() => setShowTimeSlotsModal(false)}
                className={`flex-1 px-4 py-2 border ${borderColor} rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700`}
              >
                Отмена
              </button>
              <button
                onClick={saveTimeSlots}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Сохранить
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const SettingsModal = () => {
    const [settings, setSettings] = useState({...schoolSettings});

    const handleSave = () => {
      setSchoolSettings(settings);
      setShowSettingsModal(false);
      alert('Настройки сохранены!');
    };

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowSettingsModal(false)}>
        <div className={`${cardBg} rounded-lg p-6 w-full max-w-md`} onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold">Настройки</h3>
            <button onClick={() => setShowSettingsModal(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Название школы</label>
              <input
                type="text"
                value={settings.schoolName}
                onChange={(e) => setSettings({...settings, schoolName: e.target.value})}
                className={`w-full px-3 py-2 border ${borderColor} rounded-lg ${cardBg}`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Макс. уроков в день</label>
              <input
                type="number"
                value={settings.maxPeriodsPerDay}
                onChange={(e) => setSettings({...settings, maxPeriodsPerDay: parseInt(e.target.value)})}
                className={`w-full px-3 py-2 border ${borderColor} rounded-lg ${cardBg}`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Макс. уроков в неделю</label>
              <input
                type="number"
                value={settings.maxPeriodsPerWeek}
                onChange={(e) => setSettings({...settings, maxPeriodsPerWeek: parseInt(e.target.value)})}
                className={`w-full px-3 py-2 border ${borderColor} rounded-lg ${cardBg}`}
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={settings.enableConflictCheck}
                onChange={(e) => setSettings({...settings, enableConflictCheck: e.target.checked})}
                id="conflictCheck"
              />
              <label htmlFor="conflictCheck" className="text-sm">Включить проверку конфликтов</label>
            </div>

            <div className="flex gap-2 pt-4">
              <button
                onClick={() => setShowSettingsModal(false)}
                className={`flex-1 px-4 py-2 border ${borderColor} rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700`}
              >
                Отмена
              </button>
              <button
                onClick={handleSave}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Сохранить
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const AddTeacherModal = () => {
    const [newTeacher, setNewTeacher] = useState({ name: '', subject: '', email: '' });

    const handleAdd = () => {
      if (newTeacher.name && newTeacher.subject) {
        setTeachers([...teachers, newTeacher]);
        setShowAddTeacherModal(false);
        alert('Учитель добавлен!');
      }
    };

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowAddTeacherModal(false)}>
        <div className={`${cardBg} rounded-lg p-6 w-full max-w-md`} onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold">Добавить учителя</h3>
            <button onClick={() => setShowAddTeacherModal(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Имя</label>
              <input
                type="text"
                value={newTeacher.name}
                onChange={(e) => setNewTeacher({...newTeacher, name: e.target.value})}
                className={`w-full px-3 py-2 border ${borderColor} rounded-lg ${cardBg}`}
                placeholder="Иванов Иван Иванович"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Предмет</label>
              <select
                value={newTeacher.subject}
                onChange={(e) => setNewTeacher({...newTeacher, subject: e.target.value})}
                className={`w-full px-3 py-2 border ${borderColor} rounded-lg ${cardBg}`}
              >
                <option value="">Выберите предмет</option>
                {subjects.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                value={newTeacher.email}
                onChange={(e) => setNewTeacher({...newTeacher, email: e.target.value})}
                className={`w-full px-3 py-2 border ${borderColor} rounded-lg ${cardBg}`}
                placeholder="teacher@school.com"
              />
            </div>

            <div className="flex gap-2 pt-4">
              <button
                onClick={() => setShowAddTeacherModal(false)}
                className={`flex-1 px-4 py-2 border ${borderColor} rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700`}
              >
                Отмена
              </button>
              <button
                onClick={handleAdd}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Добавить
              </button>
            </div>
          </div>
        </div>
      </div>
    