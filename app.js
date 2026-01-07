const { useEffect, useMemo, useState } = React;

const createIcon = (label) => {
  const Icon = ({ className }) => (
    <span
      className={`inline-flex items-center justify-center ${className || ''}`}
      aria-hidden="true"
      title={label}
    >
      ●
    </span>
  );

  Icon.displayName = label;
  return Icon;
};

const AlertCircle = createIcon('Alert');
const BookOpen = createIcon('Book');
const Building2 = createIcon('Building');
const CheckCircle2 = createIcon('Check');
const Clock = createIcon('Clock');
const Download = createIcon('Download');
const Edit2 = createIcon('Edit');
const Filter = createIcon('Filter');
const Moon = createIcon('Moon');
const Play = createIcon('Play');
const Plus = createIcon('Plus');
const Redo2 = createIcon('Redo');
const Settings = createIcon('Settings');
const Sun = createIcon('Sun');
const Trash2 = createIcon('Trash');
const Undo2 = createIcon('Undo');
const Upload = createIcon('Upload');
const Users = createIcon('Users');
const X = createIcon('Close');

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
  const [editingTeacherIndex, setEditingTeacherIndex] = useState(null);
  const [editingClassIndex, setEditingClassIndex] = useState(null);
  const [editingRoomIndex, setEditingRoomIndex] = useState(null);

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const [timeSlots, setTimeSlots] = useState([
    { id: 1, start: '08:00', end: '08:45', name: 'Period 1', isBreak: false },
    { id: 2, start: '08:50', end: '09:35', name: 'Period 2', isBreak: false },
    { id: 3, start: '09:40', end: '10:25', name: 'Period 3', isBreak: false },
    { id: 'break1', start: '10:25', end: '10:45', name: 'Break', isBreak: true },
    { id: 4, start: '10:45', end: '11:30', name: 'Period 4', isBreak: false },
    { id: 5, start: '11:35', end: '12:20', name: 'Period 5', isBreak: false },
    { id: 'lunch', start: '12:20', end: '13:00', name: 'Lunch', isBreak: true },
    { id: 6, start: '13:00', end: '13:45', name: 'Period 6', isBreak: false }
  ]);

  const makeLessonKey = (day, slotId, className) => `${day}__${slotId}__${className}`;

  const parseLessonKey = (key) => {
    const parts = key.split('__');
    if (parts.length >= 3) {
      return { day: parts[0], slotId: parts[1], className: parts.slice(2).join('__') };
    }

    const legacyParts = key.split('-');
    return {
      day: legacyParts[0],
      slotId: legacyParts[1],
      className: legacyParts.slice(2).join('-')
    };
  };

  const [lessons, setLessons] = useState({
    [makeLessonKey('Monday', 1, 'Grade 10A')]: {
      subject: 'Mathematics',
      teacher: 'Dr. Smith',
      room: 'A-201',
      color: 'bg-blue-500',
      class: 'Grade 10A'
    },
    [makeLessonKey('Monday', 2, 'Grade 10A')]: {
      subject: 'Physics',
      teacher: 'Dr. Johnson',
      room: 'Lab-3',
      color: 'bg-purple-500',
      class: 'Grade 10A'
    },
    [makeLessonKey('Tuesday', 1, 'Grade 10A')]: {
      subject: 'English',
      teacher: 'Ms. Brown',
      room: 'B-104',
      color: 'bg-green-500',
      class: 'Grade 10A'
    },
    [makeLessonKey('Tuesday', 3, 'Grade 10A')]: {
      subject: 'Chemistry',
      teacher: 'Dr. Davis',
      room: 'Lab-1',
      color: 'bg-pink-500',
      class: 'Grade 10A'
    },
    [makeLessonKey('Wednesday', 2, 'Grade 10A')]: {
      subject: 'History',
      teacher: 'Mr. Wilson',
      room: 'C-302',
      color: 'bg-orange-500',
      class: 'Grade 10A'
    },
    [makeLessonKey('Thursday', 1, 'Grade 10A')]: {
      subject: 'Mathematics',
      teacher: 'Dr. Smith',
      room: 'A-201',
      color: 'bg-blue-500',
      class: 'Grade 10A'
    },
    [makeLessonKey('Friday', 4, 'Grade 10A')]: {
      subject: 'Physical Ed',
      teacher: 'Coach Lee',
      room: 'Gym',
      color: 'bg-teal-500',
      class: 'Grade 10A'
    },
    [makeLessonKey('Monday', 1, 'Grade 10B')]: {
      subject: 'English',
      teacher: 'Ms. Brown',
      room: 'B-105',
      color: 'bg-green-500',
      class: 'Grade 10B'
    },
    [makeLessonKey('Tuesday', 3, 'Grade 10B')]: {
      subject: 'Mathematics',
      teacher: 'Dr. Smith',
      room: 'A-202',
      color: 'bg-blue-500',
      class: 'Grade 10B'
    }
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
    { name: 'Geography', color: 'bg-yellow-500' }
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

  useEffect(() => {
    if (historyIndex === -1 && Object.keys(lessons).length > 0) {
      setHistory([JSON.parse(JSON.stringify(lessons))]);
      setHistoryIndex(0);
    }
  }, [historyIndex, lessons]);

  useEffect(() => {
    if (!classes.includes(selectedClass)) {
      setSelectedClass(classes[0] || '');
    }
  }, [classes, selectedClass]);

  useEffect(() => {
    if (!teachers.find((teacher) => teacher.name === selectedTeacher)) {
      setSelectedTeacher(teachers[0]?.name || '');
    }
  }, [teachers, selectedTeacher]);

  useEffect(() => {
    if (!rooms.includes(selectedRoom)) {
      setSelectedRoom(rooms[0] || '');
    }
  }, [rooms, selectedRoom]);

  const detectConflicts = () => {
    const conflicts = [];
    const lessonArray = Object.entries(lessons);

    lessonArray.forEach(([key1, lesson1], i) => {
      lessonArray.slice(i + 1).forEach(([key2, lesson2]) => {
        const { day: day1, slotId: slot1 } = parseLessonKey(key1);
        const { day: day2, slotId: slot2 } = parseLessonKey(key2);

        if (day1 === day2 && String(slot1) === String(slot2)) {
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
  const conflictKeys = useMemo(() => new Set(conflicts.map((conflict) => conflict.key)), [conflicts]);

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
    const { day, slotId } = parseLessonKey(lessonKey);
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
    const key = makeLessonKey(selectedDay, selectedTimeSlot, lessonData.class);
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
          alert(`Ошибка при импорте расписания: ${error.message}`);
        }
      };
      reader.readAsText(file);
    }
    e.target.value = '';
  };

  const getLessonsForView = () => {
    const lessonEntries = Object.entries(lessons);

    if (viewMode === 'class') {
      return lessonEntries.filter(([, lesson]) => lesson.class === selectedClass);
    }

    if (viewMode === 'teacher') {
      return lessonEntries.filter(([, lesson]) => lesson.teacher === selectedTeacher);
    }

    if (viewMode === 'classroom') {
      return lessonEntries.filter(([, lesson]) => lesson.room === selectedRoom);
    }

    return lessonEntries;
  };

  const lessonGroups = useMemo(() => {
    const grouped = new Map();
    getLessonsForView().forEach(([key, lesson]) => {
      const { day, slotId } = parseLessonKey(key);
      const bucketKey = `${day}__${slotId}`;
      if (!grouped.has(bucketKey)) {
        grouped.set(bucketKey, []);
      }
      grouped.get(bucketKey).push({ key, lesson });
    });
    return grouped;
  }, [lessons, viewMode, selectedClass, selectedTeacher, selectedRoom]);

  const AddLessonModal = () => {
    const [formData, setFormData] = useState(
      editingLesson || {
        subject: '',
        teacher: '',
        room: '',
        class: viewMode === 'class' ? selectedClass : classes[0] || '',
        color: 'bg-blue-500'
      }
    );

    useEffect(() => {
      if (editingLesson) {
        setFormData(editingLesson);
      } else {
        setFormData({
          subject: '',
          teacher: '',
          room: '',
          class: viewMode === 'class' ? selectedClass : classes[0] || '',
          color: 'bg-blue-500'
        });
      }
    }, [editingLesson, selectedClass, viewMode, classes]);

    const handleSubmit = (e) => {
      e.preventDefault();
      saveLessonFromModal(formData);
    };

    return (
      <div
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        onClick={() => setShowAddLessonModal(false)}
      >
        <div className={`${cardBg} rounded-lg p-6 w-full max-w-md`} onClick={(event) => event.stopPropagation()}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold">{editingLesson ? 'Редактировать урок' : 'Добавить урок'}</h3>
            <button
              onClick={() => setShowAddLessonModal(false)}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Предмет</label>
              <select
                value={formData.subject}
                onChange={(event) => {
                  const subject = subjects.find((s) => s.name === event.target.value);
                  setFormData({ ...formData, subject: event.target.value, color: subject?.color || 'bg-blue-500' });
                }}
                className={`w-full px-3 py-2 border ${borderColor} rounded-lg ${cardBg}`}
                required
              >
                <option value="">Выберите предмет</option>
                {subjects.map((s) => (
                  <option key={s.name} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Учитель</label>
              <select
                value={formData.teacher}
                onChange={(event) => setFormData({ ...formData, teacher: event.target.value })}
                className={`w-full px-3 py-2 border ${borderColor} rounded-lg ${cardBg}`}
                required
              >
                <option value="">Выберите учителя</option>
                {teachers.map((t) => (
                  <option key={t.name} value={t.name}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Кабинет</label>
              <select
                value={formData.room}
                onChange={(event) => setFormData({ ...formData, room: event.target.value })}
                className={`w-full px-3 py-2 border ${borderColor} rounded-lg ${cardBg}`}
                required
              >
                <option value="">Выберите кабинет</option>
                {rooms.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            {viewMode !== 'class' && (
              <div>
                <label className="block text-sm font-medium mb-1">Класс</label>
                <select
                  value={formData.class}
                  onChange={(event) => setFormData({ ...formData, class: event.target.value })}
                  className={`w-full px-3 py-2 border ${borderColor} rounded-lg ${cardBg}`}
                  required
                >
                  {classes.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4" />
              <span>
                {selectedDay} - {timeSlots.find((t) => String(t.id) === String(selectedTimeSlot))?.start} to{' '}
                {timeSlots.find((t) => String(t.id) === String(selectedTimeSlot))?.end}
              </span>
            </div>

            <div className="flex gap-2 pt-4">
              <button
                type="button"
                onClick={() => setShowAddLessonModal(false)}
                className={`flex-1 px-4 py-2 border ${borderColor} rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700`}
              >
                Отмена
              </button>
              <button type="submit" className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
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
        const id = newSlot.isBreak ? `break-${Date.now()}` : slots.filter((s) => !s.isBreak).length + 1;
        setSlots([...slots, { ...newSlot, id }]);
        setNewSlot({ start: '', end: '', name: '', isBreak: false });
      }
    };

    const removeTimeSlot = (id) => {
      setSlots(slots.filter((s) => s.id !== id));
    };

    const saveTimeSlots = () => {
      setTimeSlots(slots);
      setShowTimeSlotsModal(false);
    };

    return (
      <div
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        onClick={() => setShowTimeSlotsModal(false)}
      >
        <div
          className={`${cardBg} rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-auto`}
          onClick={(event) => event.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold">Управление временными слотами</h3>
            <button
              onClick={() => setShowTimeSlotsModal(false)}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-2">
              <input
                type="time"
                value={newSlot.start}
                onChange={(event) => setNewSlot({ ...newSlot, start: event.target.value })}
                className={`px-3 py-2 border ${borderColor} rounded-lg ${cardBg}`}
                placeholder="Начало"
              />
              <input
                type="time"
                value={newSlot.end}
                onChange={(event) => setNewSlot({ ...newSlot, end: event.target.value })}
                className={`px-3 py-2 border ${borderColor} rounded-lg ${cardBg}`}
                placeholder="Конец"
              />
              <input
                type="text"
                value={newSlot.name}
                onChange={(event) => setNewSlot({ ...newSlot, name: event.target.value })}
                className={`px-3 py-2 border ${borderColor} rounded-lg ${cardBg}`}
                placeholder="Название"
              />
              <div className="flex gap-2">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={newSlot.isBreak}
                    onChange={(event) => setNewSlot({ ...newSlot, isBreak: event.target.checked })}
                  />
                  Перерыв
                </label>
                <button onClick={addTimeSlot} className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-2">
              {slots.map((slot) => (
                <div
                  key={slot.id}
                  className={`flex items-center justify-between p-3 border ${borderColor} rounded-lg ${
                    slot.isBreak ? 'bg-yellow-50 dark:bg-yellow-900/20' : ''
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className="font-medium">{slot.name}</span>
                    <span className={`text-sm ${mutedText}`}>
                      {slot.start} - {slot.end}
                    </span>
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
              <button onClick={saveTimeSlots} className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                Сохранить
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const SettingsModal = () => {
    const [settings, setSettings] = useState({ ...schoolSettings });

    const handleSave = () => {
      setSchoolSettings(settings);
      setShowSettingsModal(false);
      alert('Настройки сохранены!');
    };

    return (
      <div
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        onClick={() => setShowSettingsModal(false)}
      >
        <div className={`${cardBg} rounded-lg p-6 w-full max-w-md`} onClick={(event) => event.stopPropagation()}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold">Настройки</h3>
            <button
              onClick={() => setShowSettingsModal(false)}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Название школы</label>
              <input
                type="text"
                value={settings.schoolName}
                onChange={(event) => setSettings({ ...settings, schoolName: event.target.value })}
                className={`w-full px-3 py-2 border ${borderColor} rounded-lg ${cardBg}`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Макс. уроков в день</label>
              <input
                type="number"
                value={settings.maxPeriodsPerDay}
                onChange={(event) => setSettings({
                  ...settings,
                  maxPeriodsPerDay: parseInt(event.target.value, 10) || 0
                })}
                className={`w-full px-3 py-2 border ${borderColor} rounded-lg ${cardBg}`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Макс. уроков в неделю</label>
              <input
                type="number"
                value={settings.maxPeriodsPerWeek}
                onChange={(event) => setSettings({
                  ...settings,
                  maxPeriodsPerWeek: parseInt(event.target.value, 10) || 0
                })}
                className={`w-full px-3 py-2 border ${borderColor} rounded-lg ${cardBg}`}
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={settings.enableConflictCheck}
                onChange={(event) => setSettings({ ...settings, enableConflictCheck: event.target.checked })}
                id="conflictCheck"
              />
              <label htmlFor="conflictCheck" className="text-sm">
                Включить проверку конфликтов
              </label>
            </div>

            <div className="flex gap-2 pt-4">
              <button
                onClick={() => setShowSettingsModal(false)}
                className={`flex-1 px-4 py-2 border ${borderColor} rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700`}
              >
                Отмена
              </button>
              <button onClick={handleSave} className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
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

    useEffect(() => {
      if (editingTeacherIndex !== null) {
        setNewTeacher(teachers[editingTeacherIndex]);
      } else {
        setNewTeacher({ name: '', subject: '', email: '' });
      }
    }, [editingTeacherIndex, teachers]);

    const handleAdd = () => {
      if (newTeacher.name && newTeacher.subject) {
        if (editingTeacherIndex !== null) {
          const updated = [...teachers];
          updated[editingTeacherIndex] = newTeacher;
          setTeachers(updated);
          setEditingTeacherIndex(null);
          alert('Учитель обновлен!');
        } else {
          setTeachers([...teachers, newTeacher]);
          alert('Учитель добавлен!');
        }
        setShowAddTeacherModal(false);
      }
    };

    return (
      <div
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        onClick={() => setShowAddTeacherModal(false)}
      >
        <div className={`${cardBg} rounded-lg p-6 w-full max-w-md`} onClick={(event) => event.stopPropagation()}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold">{editingTeacherIndex !== null ? 'Редактировать учителя' : 'Добавить учителя'}</h3>
            <button
              onClick={() => setShowAddTeacherModal(false)}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Имя</label>
              <input
                type="text"
                value={newTeacher.name}
                onChange={(event) => setNewTeacher({ ...newTeacher, name: event.target.value })}
                className={`w-full px-3 py-2 border ${borderColor} rounded-lg ${cardBg}`}
                placeholder="Иванов Иван Иванович"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Предмет</label>
              <select
                value={newTeacher.subject}
                onChange={(event) => setNewTeacher({ ...newTeacher, subject: event.target.value })}
                className={`w-full px-3 py-2 border ${borderColor} rounded-lg ${cardBg}`}
              >
                <option value="">Выберите предмет</option>
                {subjects.map((s) => (
                  <option key={s.name} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                value={newTeacher.email}
                onChange={(event) => setNewTeacher({ ...newTeacher, email: event.target.value })}
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
              <button onClick={handleAdd} className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                {editingTeacherIndex !== null ? 'Обновить' : 'Добавить'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const AddClassModal = () => {
    const [className, setClassName] = useState('');

    useEffect(() => {
      if (editingClassIndex !== null) {
        setClassName(classes[editingClassIndex]);
      } else {
        setClassName('');
      }
    }, [editingClassIndex, classes]);

    const handleAdd = () => {
      if (className.trim()) {
        if (editingClassIndex !== null) {
          const updated = [...classes];
          updated[editingClassIndex] = className.trim();
          setClasses(updated);
          setEditingClassIndex(null);
          alert('Класс обновлен!');
        } else {
          setClasses([...classes, className.trim()]);
          alert('Класс добавлен!');
        }
        setShowAddClassModal(false);
      }
    };

    return (
      <div
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        onClick={() => setShowAddClassModal(false)}
      >
        <div className={`${cardBg} rounded-lg p-6 w-full max-w-md`} onClick={(event) => event.stopPropagation()}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold">{editingClassIndex !== null ? 'Редактировать класс' : 'Добавить класс'}</h3>
            <button
              onClick={() => setShowAddClassModal(false)}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Название класса</label>
              <input
                type="text"
                value={className}
                onChange={(event) => setClassName(event.target.value)}
                className={`w-full px-3 py-2 border ${borderColor} rounded-lg ${cardBg}`}
                placeholder="Grade 12A"
              />
            </div>

            <div className="flex gap-2 pt-4">
              <button
                onClick={() => setShowAddClassModal(false)}
                className={`flex-1 px-4 py-2 border ${borderColor} rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700`}
              >
                Отмена
              </button>
              <button onClick={handleAdd} className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                {editingClassIndex !== null ? 'Обновить' : 'Добавить'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const AddRoomModal = () => {
    const [roomName, setRoomName] = useState('');

    useEffect(() => {
      if (editingRoomIndex !== null) {
        setRoomName(rooms[editingRoomIndex]);
      } else {
        setRoomName('');
      }
    }, [editingRoomIndex, rooms]);

    const handleAdd = () => {
      if (roomName.trim()) {
        if (editingRoomIndex !== null) {
          const updated = [...rooms];
          updated[editingRoomIndex] = roomName.trim();
          setRooms(updated);
          setEditingRoomIndex(null);
          alert('Кабинет обновлен!');
        } else {
          setRooms([...rooms, roomName.trim()]);
          alert('Кабинет добавлен!');
        }
        setShowAddRoomModal(false);
      }
    };

    return (
      <div
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        onClick={() => setShowAddRoomModal(false)}
      >
        <div className={`${cardBg} rounded-lg p-6 w-full max-w-md`} onClick={(event) => event.stopPropagation()}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold">{editingRoomIndex !== null ? 'Редактировать кабинет' : 'Добавить кабинет'}</h3>
            <button
              onClick={() => setShowAddRoomModal(false)}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Название кабинета</label>
              <input
                type="text"
                value={roomName}
                onChange={(event) => setRoomName(event.target.value)}
                className={`w-full px-3 py-2 border ${borderColor} rounded-lg ${cardBg}`}
                placeholder="A-101"
              />
            </div>

            <div className="flex gap-2 pt-4">
              <button
                onClick={() => setShowAddRoomModal(false)}
                className={`flex-1 px-4 py-2 border ${borderColor} rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700`}
              >
                Отмена
              </button>
              <button onClick={handleAdd} className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                {editingRoomIndex !== null ? 'Обновить' : 'Добавить'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderLessonCard = (lessonKey, lesson) => (
    <div
      key={lessonKey}
      className={`${lesson.color} text-white rounded-lg p-2 shadow-sm ${conflictKeys.has(lessonKey) ? 'ring-2 ring-red-400' : ''}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="font-semibold text-sm">{lesson.subject}</div>
          <div className="text-xs">{lesson.teacher}</div>
          <div className="text-xs">{lesson.room}</div>
          {viewMode !== 'class' && <div className="text-xs">{lesson.class}</div>}
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => handleEditLesson(lessonKey)}
            className="p-1 rounded hover:bg-white/20"
            aria-label="Edit"
          >
            <Edit2 className="w-3 h-3" />
          </button>
          <button
            onClick={() => handleDeleteLesson(lessonKey)}
            className="p-1 rounded hover:bg-white/20"
            aria-label="Delete"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );

  const renderTimetableCell = (day, slot) => {
    const bucketKey = `${day}__${slot.id}`;
    const cellLessons = lessonGroups.get(bucketKey) || [];

    return (
      <div key={bucketKey} className={`border ${borderColor} p-2 min-h-[110px]`}>
        <div className="flex flex-col gap-2">
          {cellLessons.length === 0 ? (
            <button
              onClick={() => handleAddLesson(day, slot.id)}
              className="flex items-center justify-center text-sm text-blue-500 hover:text-blue-600 border border-dashed border-blue-300 rounded-lg py-4"
            >
              <Plus className="w-4 h-4 mr-1" /> Добавить
            </button>
          ) : (
            <>
              {cellLessons.map(({ key, lesson }) => renderLessonCard(key, lesson))}
              <button
                onClick={() => handleAddLesson(day, slot.id)}
                className="text-xs text-blue-500 hover:text-blue-600"
              >
                + Добавить еще
              </button>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={`${bgColor} min-h-screen ${textColor} transition-colors duration-200 ${darkMode ? 'dark' : ''}`}>
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">{schoolSettings.schoolName}</h1>
            <p className={mutedText}>Система управления расписанием</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={exportSchedule}
              className={`flex items-center gap-2 px-3 py-2 border ${borderColor} rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700`}
            >
              <Download className="w-4 h-4" /> Экспорт
            </button>
            <label
              className={`flex items-center gap-2 px-3 py-2 border ${borderColor} rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer`}
            >
              <Upload className="w-4 h-4" /> Импорт
              <input type="file" accept="application/json" className="hidden" onChange={importSchedule} />
            </label>
            <button
              onClick={() => setShowSettingsModal(true)}
              className={`flex items-center gap-2 px-3 py-2 border ${borderColor} rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700`}
            >
              <Settings className="w-4 h-4" /> Настройки
            </button>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`flex items-center gap-2 px-3 py-2 border ${borderColor} rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700`}
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />} {darkMode ? 'Светлая' : 'Темная'} тема
            </button>
          </div>
        </header>

        <div className={`flex flex-wrap gap-2 border-b ${borderColor} pb-2`}>
          <button
            onClick={() => setActiveTab('timetable')}
            className={`px-4 py-2 rounded-lg ${activeTab === 'timetable' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
          >
            Расписание
          </button>
          <button
            onClick={() => setActiveTab('teachers')}
            className={`px-4 py-2 rounded-lg ${activeTab === 'teachers' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
          >
            Учителя
          </button>
          <button
            onClick={() => setActiveTab('classes')}
            className={`px-4 py-2 rounded-lg ${activeTab === 'classes' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
          >
            Классы
          </button>
          <button
            onClick={() => setActiveTab('rooms')}
            className={`px-4 py-2 rounded-lg ${activeTab === 'rooms' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
          >
            Кабинеты
          </button>
        </div>

        {activeTab === 'timetable' && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-3 gap-4">
              <div className={`${cardBg} border ${borderColor} rounded-lg p-4 space-y-3`}>
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-blue-500" />
                  <span className="font-semibold">Фильтр просмотра</span>
                </div>
                <select
                  value={viewMode}
                  onChange={(event) => setViewMode(event.target.value)}
                  className={`w-full px-3 py-2 border ${borderColor} rounded-lg ${cardBg}`}
                >
                  <option value="class">По классу</option>
                  <option value="teacher">По учителю</option>
                  <option value="classroom">По кабинету</option>
                </select>

                {viewMode === 'class' && (
                  <select
                    value={selectedClass}
                    onChange={(event) => setSelectedClass(event.target.value)}
                    className={`w-full px-3 py-2 border ${borderColor} rounded-lg ${cardBg}`}
                  >
                    {classes.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                )}

                {viewMode === 'teacher' && (
                  <select
                    value={selectedTeacher}
                    onChange={(event) => setSelectedTeacher(event.target.value)}
                    className={`w-full px-3 py-2 border ${borderColor} rounded-lg ${cardBg}`}
                  >
                    {teachers.map((t) => (
                      <option key={t.name} value={t.name}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                )}

                {viewMode === 'classroom' && (
                  <select
                    value={selectedRoom}
                    onChange={(event) => setSelectedRoom(event.target.value)}
                    className={`w-full px-3 py-2 border ${borderColor} rounded-lg ${cardBg}`}
                  >
                    {rooms.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className={`${cardBg} border ${borderColor} rounded-lg p-4 space-y-3`}>
                <div className="flex items-center gap-2">
                  <Play className="w-4 h-4 text-green-500" />
                  <span className="font-semibold">Управление</span>
                </div>
                <button
                  onClick={autoGenerate}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  <Play className="w-4 h-4" /> Автогенерация
                </button>
                <button
                  onClick={() => setShowTimeSlotsModal(true)}
                  className={`w-full flex items-center justify-center gap-2 px-3 py-2 border ${borderColor} rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700`}
                >
                  <Clock className="w-4 h-4" /> Слоты времени
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={undo}
                    disabled={historyIndex <= 0}
                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 border ${borderColor} rounded-lg disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-gray-700`}
                  >
                    <Undo2 className="w-4 h-4" /> Undo
                  </button>
                  <button
                    onClick={redo}
                    disabled={historyIndex >= history.length - 1}
                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 border ${borderColor} rounded-lg disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-gray-700`}
                  >
                    <Redo2 className="w-4 h-4" /> Redo
                  </button>
                </div>
              </div>

              <div className={`${cardBg} border ${borderColor} rounded-lg p-4 space-y-3`}>
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <span className="font-semibold">Конфликты</span>
                </div>
                {conflicts.length === 0 ? (
                  <div className="flex items-center gap-2 text-green-500">
                    <CheckCircle2 className="w-4 h-4" /> Нет конфликтов
                  </div>
                ) : (
                  <div className="space-y-2 max-h-40 overflow-auto">
                    {conflicts.map((conflict, index) => (
                      <div key={`${conflict.key}-${index}`} className="text-sm text-red-500">
                        {conflict.reason}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className={`${cardBg} border ${borderColor} rounded-lg overflow-auto`}>
              <div className="min-w-[900px]">
                <div className="grid grid-cols-[140px_repeat(5,minmax(160px,1fr))]">
                  <div className={`border ${borderColor} p-3 font-semibold text-center`}>Время</div>
                  {daysOfWeek.map((day) => (
                    <div key={day} className={`border ${borderColor} p-3 font-semibold text-center`}>
                      {day}
                    </div>
                  ))}

                  {timeSlots.map((slot) => (
                    <React.Fragment key={slot.id}>
                      <div className={`border ${borderColor} p-3 text-sm font-medium ${mutedText}`}>
                        <div>{slot.name}</div>
                        <div>
                          {slot.start} - {slot.end}
                        </div>
                      </div>
                      {slot.isBreak ? (
                        <div className={`border ${borderColor} p-3 col-span-5 text-center ${mutedText} bg-yellow-50 dark:bg-yellow-900/20`}>
                          {slot.name}
                        </div>
                      ) : (
                        daysOfWeek.map((day) => renderTimetableCell(day, slot))
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'teachers' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Users className="w-5 h-5" /> Учителя
              </h2>
              <button
                onClick={() => {
                  setEditingTeacherIndex(null);
                  setShowAddTeacherModal(true);
                }}
                className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                <Plus className="w-4 h-4" /> Добавить учителя
              </button>
            </div>

            <div className={`${cardBg} border ${borderColor} rounded-lg p-4 space-y-3`}>
              {teachers.map((teacher, index) => (
                <div key={`${teacher.name}-${index}`} className={`flex items-center justify-between p-3 border ${borderColor} rounded-lg`}>
                  <div>
                    <div className="font-semibold">{teacher.name}</div>
                    <div className={`text-sm ${mutedText}`}>{teacher.subject}</div>
                    <div className={`text-sm ${mutedText}`}>{teacher.email}</div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingTeacherIndex(index);
                        setShowAddTeacherModal(true);
                      }}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setTeachers(teachers.filter((_, i) => i !== index))}
                      className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'classes' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <BookOpen className="w-5 h-5" /> Классы
              </h2>
              <button
                onClick={() => {
                  setEditingClassIndex(null);
                  setShowAddClassModal(true);
                }}
                className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                <Plus className="w-4 h-4" /> Добавить класс
              </button>
            </div>

            <div className={`${cardBg} border ${borderColor} rounded-lg p-4 space-y-3`}>
              {classes.map((className, index) => (
                <div key={`${className}-${index}`} className={`flex items-center justify-between p-3 border ${borderColor} rounded-lg`}>
                  <div className="font-semibold">{className}</div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingClassIndex(index);
                        setShowAddClassModal(true);
                      }}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setClasses(classes.filter((_, i) => i !== index))}
                      className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'rooms' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Building2 className="w-5 h-5" /> Кабинеты
              </h2>
              <button
                onClick={() => {
                  setEditingRoomIndex(null);
                  setShowAddRoomModal(true);
                }}
                className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                <Plus className="w-4 h-4" /> Добавить кабинет
              </button>
            </div>

            <div className={`${cardBg} border ${borderColor} rounded-lg p-4 space-y-3`}>
              {rooms.map((room, index) => (
                <div key={`${room}-${index}`} className={`flex items-center justify-between p-3 border ${borderColor} rounded-lg`}>
                  <div className="font-semibold">{room}</div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingRoomIndex(index);
                        setShowAddRoomModal(true);
                      }}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setRooms(rooms.filter((_, i) => i !== index))}
                      className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {showAddLessonModal && <AddLessonModal />}
      {showTimeSlotsModal && <TimeSlotsModal />}
      {showSettingsModal && <SettingsModal />}
      {showAddTeacherModal && <AddTeacherModal />}
      {showAddClassModal && <AddClassModal />}
      {showAddRoomModal && <AddRoomModal />}
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<TimetableSystemUI />);
