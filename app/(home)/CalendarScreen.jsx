import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  Alert,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Calendar } from 'react-native-calendars';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  ChevronRight,
  ChevronLeft,
  Clock,
  Circle,
  X,
  Flag,
  Calendar as CalendarIcon,
} from 'lucide-react-native';
import {
  addTaskToFirestore,
  getTasksFromFirestore,
  updateTaskInFirestore,
  deleteTaskFromFirestore,
} from '../../utils/tasksUtils';

const CalendarScreen = () => {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [tasksByDate, setTasksByDate] = useState({});
  const [isModalVisible, setModalVisible] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium',
    time: new Date(),
    date: new Date(),
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const tasks = await getTasksFromFirestore();
      const groupedTasks = tasks.reduce((acc, task) => {
        const date =
          task.date || task.createdAt?.toDate().toISOString().split('T')[0];
        if (!acc[date]) acc[date] = [];
        acc[date].push(task);
        return acc;
      }, {});
      setTasksByDate(groupedTasks);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar las tareas');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateSelect = (day) => {
    setSelectedDate(day.dateString);
  };

  const handleTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      setNewTask((prev) => ({ ...prev, time: selectedTime }));
    }
  };

  const resetForm = () => {
    setNewTask({
      title: '',
      description: '',
      priority: 'medium',
      time: new Date(),
      date: new Date(selectedDate),
    });
  };

  const addTask = async () => {
    if (!newTask.title.trim()) {
      Alert.alert('Error', 'El título es requerido');
      return;
    }

    setIsLoading(true);
    try {
      const taskToAdd = {
        ...newTask,
        date: selectedDate,
        time: newTask.time.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        }),
        completed: false,
        createdAt: new Date(),
      };

      await addTaskToFirestore(taskToAdd);
      await fetchTasks();
      setModalVisible(false);
      resetForm();
      Alert.alert('Éxito', 'Tarea creada correctamente');
    } catch (error) {
      Alert.alert('Error', 'No se pudo crear la tarea');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTaskCompletion = async (taskId, currentStatus) => {
    setIsLoading(true);
    try {
      await updateTaskInFirestore(taskId, {
        completed: !currentStatus,
        completedAt: !currentStatus ? new Date() : null,
      });
      await fetchTasks();
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar la tarea');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTask = async (taskId) => {
    Alert.alert(
      'Eliminar Tarea',
      '¿Estás seguro de que deseas eliminar esta tarea?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            setIsLoading(true);
            try {
              await deleteTaskFromFirestore(taskId);
              await fetchTasks();
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar la tarea');
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  const TaskItem = ({ task }) => (
    <View className="flex-row items-center p-4 mb-3 bg-gray-800/50 rounded-xl">
      <TouchableOpacity
        className="mr-3"
        onPress={() => toggleTaskCompletion(task.id, task.completed)}
      >
        <Circle
          size={20}
          color={task.completed ? '#9333EA' : '#6B7280'}
          fill={task.completed ? '#9333EA' : 'transparent'}
          strokeWidth={1.5}
        />
      </TouchableOpacity>
      <View className="flex-1">
        <Text
          className={`text-base ${
            task.completed ? 'text-gray-400 line-through' : 'text-white'
          }`}
        >
          {task.title}
        </Text>
        {task.description && (
          <Text className="mt-1 text-sm text-gray-400">{task.description}</Text>
        )}
        <View className="flex-row items-center mt-2">
          <View
            className={`w-2 h-2 rounded-full mr-2 ${
              task.priority === 'high'
                ? 'bg-red-500'
                : task.priority === 'medium'
                ? 'bg-yellow-500'
                : 'bg-green-500'
            }`}
          />
          <Clock size={14} color="#9CA3AF" strokeWidth={1.5} />
          <Text className="ml-1 text-sm text-gray-400">{task.time}</Text>
        </View>
      </View>

      <TouchableOpacity
        className="p-2 ml-2"
        onPress={() => deleteTask(task.id)}
      >
        <X size={18} color="#EF4444" strokeWidth={1.5} />
      </TouchableOpacity>
    </View>
  );

  const getMarkedDates = () => {
    const marked = {};
    Object.keys(tasksByDate).forEach((date) => {
      const tasks = tasksByDate[date];
      const hasCompletedTasks = tasks.some((task) => task.completed);
      const hasPendingTasks = tasks.some((task) => !task.completed);

      marked[date] = {
        marked: true,
        dotColor:
          hasCompletedTasks && hasPendingTasks
            ? '#9333EA'
            : hasCompletedTasks
            ? '#22C55E'
            : '#EF4444',
      };
    });

    if (selectedDate) {
      marked[selectedDate] = {
        ...marked[selectedDate],
        selected: true,
        selectedColor: '#9333EA',
      };
    }

    return marked;
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-900" edges={['top']}>
      <StatusBar style="light" />

      {/* Header */}
      <View className="px-6 py-4">
        <Text className="text-2xl font-bold text-white">Calendario</Text>
        <Text className="mt-1 text-gray-400">
          Organiza tus tareas por fecha
        </Text>
      </View>

      {/* Calendar */}
      <View className="px-4">
        <Calendar
          onDayPress={handleDateSelect}
          markedDates={getMarkedDates()}
          theme={{
            backgroundColor: '#111827',
            calendarBackground: '#1F2937',
            textSectionTitleColor: '#9CA3AF',
            selectedDayBackgroundColor: '#9333EA',
            selectedDayTextColor: '#ffffff',
            todayTextColor: '#9333EA',
            dayTextColor: '#ffffff',
            textDisabledColor: '#4B5563',
            monthTextColor: '#ffffff',
            textMonthFontWeight: 'bold',
            textDayFontSize: 14,
            textMonthFontSize: 16,
            textDayHeaderFontSize: 14,
            arrowColor: '#9333EA',
          }}
          renderArrow={(direction) =>
            direction === 'left' ? (
              <ChevronLeft size={20} color="#9333EA" strokeWidth={1.5} />
            ) : (
              <ChevronRight size={20} color="#9333EA" strokeWidth={1.5} />
            )
          }
        />
      </View>

      {/* Tasks List */}
      <View className="flex-1 px-6 pt-6">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-lg font-semibold text-white">
            {selectedDate
              ? new Date(selectedDate).toLocaleDateString('es-ES', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                })
              : 'Selecciona una fecha'}
          </Text>
          {selectedDate && (
            <TouchableOpacity
              className="px-4 py-2 rounded-lg bg-purple-600/20"
              onPress={() => {
                resetForm();
                setModalVisible(true);
              }}
            >
              <Text className="font-medium text-purple-400">Añadir</Text>
            </TouchableOpacity>
          )}
        </View>

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        >
          {isLoading ? (
            <View className="items-center justify-center py-8">
              <Text className="text-gray-400">Cargando tareas...</Text>
            </View>
          ) : selectedDate && tasksByDate[selectedDate]?.length > 0 ? (
            tasksByDate[selectedDate].map((task) => (
              <TaskItem key={task.id} task={task} />
            ))
          ) : (
            <View className="items-center justify-center py-8">
              <CalendarIcon size={40} color="#6B7280" strokeWidth={1.5} />
              <Text className="mt-4 text-center text-gray-500">
                No hay tareas para esta fecha
              </Text>
              <TouchableOpacity
                className="px-6 py-3 mt-4 bg-purple-600/20 rounded-xl"
                onPress={() => {
                  resetForm();
                  setModalVisible(true);
                }}
              >
                <Text className="font-medium text-purple-400">
                  Crear nueva tarea
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </View>

      {/* Modal para nueva tarea */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => {
          resetForm();
          setModalVisible(false);
        }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1"
        >
          <View className="justify-end flex-1">
            <Pressable
              className="absolute inset-0 bg-black/50"
              onPress={() => {
                resetForm();
                setModalVisible(false);
              }}
            />
            <View className="p-6 pb-8 bg-gray-900 rounded-t-3xl">
              <View className="flex-row items-center justify-between mb-6">
                <Text className="text-xl font-bold text-white">
                  Nueva Tarea
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    resetForm();
                    setModalVisible(false);
                  }}
                  className="p-2"
                >
                  <X size={20} color="#9CA3AF" />
                </TouchableOpacity>
              </View>

              <View className="space-y-4">
                {/* Título */}
                <View>
                  <Text className="mb-2 text-sm text-gray-400">TÍTULO</Text>
                  <TextInput
                    className="w-full px-4 py-3 text-white bg-gray-800 border border-gray-700 rounded-xl"
                    placeholder="¿Qué necesitas hacer?"
                    placeholderTextColor="#6B7280"
                    value={newTask.title}
                    onChangeText={(text) =>
                      setNewTask({ ...newTask, title: text })
                    }
                  />
                </View>

                {/* Descripción */}
                <View>
                  <Text className="mb-2 text-sm text-gray-400">
                    DESCRIPCIÓN (Opcional)
                  </Text>
                  <TextInput
                    className="w-full px-4 py-3 text-white bg-gray-800 border border-gray-700 rounded-xl"
                    placeholder="Agrega más detalles..."
                    placeholderTextColor="#6B7280"
                    multiline
                    numberOfLines={3}
                    value={newTask.description}
                    onChangeText={(text) =>
                      setNewTask({ ...newTask, description: text })
                    }
                  />
                </View>

                {/* Hora */}
                <View>
                  <Text className="mb-2 text-sm text-gray-400">HORA</Text>
                  <TouchableOpacity
                    className="flex-row items-center w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl"
                    onPress={() => setShowTimePicker(true)}
                  >
                    <Clock size={18} color="#9CA3AF" className="mr-2" />
                    <Text className="text-white">
                      {newTask.time.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true,
                      })}
                    </Text>
                  </TouchableOpacity>
                </View>

                {showTimePicker && (
                  <DateTimePicker
                    value={newTask.time}
                    mode="time"
                    is24Hour={false}
                    display="spinner"
                    onChange={handleTimeChange}
                  />
                )}

                {/* Prioridad */}
                <View>
                  <Text className="mb-2 text-sm text-gray-400">PRIORIDAD</Text>
                  <View className="flex-row gap-2">
                    {[
                      {
                        value: 'high',
                        label: 'Alta',
                        bgColor: 'bg-red-600',
                        borderColor: 'border-red-700',
                      },
                      {
                        value: 'medium',
                        label: 'Media',
                        bgColor: 'bg-yellow-500',
                        borderColor: 'border-yellow-600',
                      },
                      {
                        value: 'low',
                        label: 'Baja',
                        bgColor: 'bg-green-600',
                        borderColor: 'border-green-700',
                      },
                    ].map((priority) => (
                      <TouchableOpacity
                        key={priority.value}
                        onPress={() =>
                          setNewTask({ ...newTask, priority: priority.value })
                        }
                        className={`flex-1 py-3 rounded-xl flex-row items-center justify-center gap-2
                          ${
                            newTask.priority === priority.value
                              ? priority.bgColor
                              : 'bg-gray-800 border border-gray-700'
                          }`}
                        style={{
                          shadowColor:
                            newTask.priority === priority.value
                              ? priority.value === 'high'
                                ? '#ef4444'
                                : priority.value === 'medium'
                                ? '#eab308'
                                : '#22c55e'
                              : 'transparent',
                          shadowOffset: { width: 0, height: 2 },
                          shadowOpacity: 0.25,
                          shadowRadius: 3.84,
                          elevation: 5,
                        }}
                      >
                        <Flag
                          size={16}
                          color={
                            newTask.priority === priority.value
                              ? '#ffffff'
                              : '#9CA3AF'
                          }
                        />
                        <Text
                          className={`${
                            newTask.priority === priority.value
                              ? 'text-white font-medium'
                              : 'text-gray-400'
                          }`}
                        >
                          {priority.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Fecha seleccionada */}
                <View className="flex-row items-center px-4 py-3 mt-2 bg-gray-800/50 rounded-xl">
                  <CalendarIcon size={18} color="#9CA3AF" />
                  <Text className="ml-2 text-gray-400">
                    Fecha:{' '}
                    {new Date(selectedDate).toLocaleDateString('es-ES', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                    })}
                  </Text>
                </View>

                {/* Botón de guardar */}
                <TouchableOpacity
                  className={`items-center w-full py-4 mt-4 rounded-xl ${
                    isLoading ? 'opacity-50' : ''
                  } ${
                    newTask.priority === 'high'
                      ? 'bg-red-600'
                      : newTask.priority === 'medium'
                      ? 'bg-yellow-500'
                      : 'bg-green-600'
                  }`}
                  onPress={addTask}
                  disabled={isLoading}
                >
                  <Text className="text-lg font-semibold text-white">
                    {isLoading ? 'Creando...' : 'Crear Tarea'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
};

export default CalendarScreen;
