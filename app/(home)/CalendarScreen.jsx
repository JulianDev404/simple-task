import React, { useState } from 'react';
import { Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Calendar } from 'react-native-calendars';
import { ChevronRight, ChevronLeft, Clock, Circle } from 'lucide-react-native';

// Datos de ejemplo
const tasksByDate = {
  '2024-01-15': [
    { id: 1, title: 'Reunión de equipo', time: '10:00', completed: true },
    { id: 2, title: 'Revisión de proyecto', time: '14:30', completed: false },
  ],
  '2024-01-20': [
    {
      id: 3,
      title: 'Entrega de documentación',
      time: '09:00',
      completed: false,
    },
  ],
};

export default function CalendarScreen() {
  const [selectedDate, setSelectedDate] = useState('');
  const today = new Date().toISOString().split('T')[0];

  const TaskItem = ({ task }) => (
    <View className="flex-row items-center p-4 mb-3 bg-gray-800/50 rounded-xl">
      <TouchableOpacity className="mr-3">
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
        <View className="flex-row items-center mt-1">
          <Clock size={14} color="#9CA3AF" strokeWidth={1.5} />
          <Text className="ml-1 text-sm text-gray-400">{task.time}</Text>
        </View>
      </View>
    </View>
  );

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
          onDayPress={(day) => setSelectedDate(day.dateString)}
          markedDates={{
            [selectedDate]: { selected: true, selectedColor: '#9333EA' },
            ...Object.keys(tasksByDate).reduce(
              (acc, date) => ({
                ...acc,
                [date]: {
                  marked: true,
                  dotColor: '#9333EA',
                },
              }),
              {}
            ),
          }}
          theme={{
            backgroundColor: '#111827',
            calendarBackground: '#1F2937',
            textSectionTitleColor: '#9CA3AF',
            selectedDayBackgroundColor: '#9333EA',
            selectedDayTextColor: '#ffffff',
            todayTextColor: '#9333EA',
            dayTextColor: '#ffffff',
            textDisabledColor: '#4B5563',
            dotColor: '#9333EA',
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

      {/* Tasks for selected date */}
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
                /* Agregar tarea */
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
          {selectedDate &&
            tasksByDate[selectedDate]?.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}

          {selectedDate && !tasksByDate[selectedDate] && (
            <View className="items-center justify-center py-8">
              <Text className="text-center text-gray-500">
                No hay tareas para esta fecha
              </Text>
              <TouchableOpacity
                className="px-6 py-3 mt-4 bg-purple-600/20 rounded-xl"
                onPress={() => {
                  /* Agregar tarea */
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
    </SafeAreaView>
  );
}
