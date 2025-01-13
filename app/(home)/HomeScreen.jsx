import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  FlatList,
  Alert,
  Modal,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import {
  Plus,
  Clock,
  Flag,
  X,
  Calendar,
  ChevronDown,
} from 'lucide-react-native';
import {
  addTaskToFirestore,
  getTasksFromFirestore,
  updateTaskInFirestore,
  deleteTaskFromFirestore,
} from '../../utils/tasksUtils';

export default function HomeScreen() {
  const [tasks, setTasks] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium',
    date: new Date(),
    time: new Date(),
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const tasksFromFirestore = await getTasksFromFirestore();
    setTasks(tasksFromFirestore);
  };

  const handleAddTask = async () => {
    if (newTask.title.trim() === '') {
      Alert.alert('Error', 'El título de la tarea es requerido');
      return;
    }

    const task = {
      ...newTask,
      completed: false,
      time: newTask.time.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    await addTaskToFirestore(task);
    await fetchTasks();
    setIsModalVisible(false);
    resetNewTask();
  };

  const resetNewTask = () => {
    setNewTask({
      title: '',
      description: '',
      priority: 'medium',
      date: new Date(),
      time: new Date(),
    });
  };

  const toggleTask = async (id, completed) => {
    await updateTaskInFirestore(id, { completed: !completed });
    await fetchTasks();
  };

  const deleteTask = (id) => {
    Alert.alert(
      'Eliminar tarea',
      '¿Estás seguro de que quieres eliminar esta tarea?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          onPress: async () => {
            await deleteTaskFromFirestore(id);
            await fetchTasks();
          },
          style: 'destructive',
        },
      ]
    );
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'bg-red-500',
      medium: 'bg-yellow-500',
      low: 'bg-green-500',
    };
    return colors[priority] || 'bg-gray-500';
  };

  const getPriorityLabel = (priority) => {
    const labels = {
      high: 'Alta',
      medium: 'Media',
      low: 'Baja',
    };
    return labels[priority] || 'Normal';
  };

  const renderTask = ({ item }) => (
    <View className="flex-row items-center p-4 mb-3 shadow-lg bg-gray-800/50 rounded-xl">
      <TouchableOpacity
        onPress={() => toggleTask(item.id, item.completed)}
        className={`w-6 h-6 rounded-full mr-3 border-2 items-center justify-center
          ${
            item.completed
              ? 'bg-purple-500 border-purple-500'
              : 'border-gray-600'
          }`}
      >
        {item.completed && <Text className="text-xs text-white">✓</Text>}
      </TouchableOpacity>

      <View className="flex-1">
        <Text
          className={`text-base ${
            item.completed ? 'text-gray-500 line-through' : 'text-white'
          }`}
        >
          {item.title}
        </Text>
        {item.description && (
          <Text className="mt-1 text-sm text-gray-400">{item.description}</Text>
        )}
        <View className="flex-row items-center mt-2">
          <View
            className={`w-2 h-2 rounded-full mr-2 ${getPriorityColor(
              item.priority
            )}`}
          />
          <Text className="text-sm text-gray-400">{item.time}</Text>
        </View>
      </View>

      <TouchableOpacity
        onPress={() => deleteTask(item.id)}
        className="p-2 ml-3"
      >
        <X size={20} color="#EF4444" strokeWidth={1.5} />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-900" edges={['top']}>
      <StatusBar style="light" />

      {/* Header */}
      <View className="px-6 py-4 border-b border-gray-800">
        <View className="flex-row items-center justify-between">
          <Text className="text-2xl font-bold text-white">Simple Task</Text>
          <TouchableOpacity
            onPress={() => router.push('ProfileScreen')}
            className="items-center justify-center w-10 h-10 bg-gray-800 rounded-full"
          >
            <Text className="text-white">👤</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Lista de tareas */}
      <FlatList
        data={tasks}
        renderItem={renderTask}
        keyExtractor={(item) => item.id}
        className="px-6 pt-4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListEmptyComponent={
          <View className="items-center justify-center py-10">
            <Text className="text-center text-gray-500">
              No hay tareas pendientes
            </Text>
          </View>
        }
      />

      {/* Botón flotante */}
      <TouchableOpacity
        className="absolute z-50 items-center justify-center bg-purple-600 rounded-full shadow-lg bottom-32 right-6 w-14 h-14 shadow-purple-600/20"
        onPress={() => setIsModalVisible(true)}
      >
        <Plus size={24} color="#ffffff" />
      </TouchableOpacity>

      {/* Modal para nueva tarea */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1"
        >
          <View className="justify-end flex-1">
            <Pressable
              className="absolute inset-0 bg-black/50"
              onPress={() => setIsModalVisible(false)}
            />
            <View className="p-6 pb-8 bg-gray-900 rounded-t-3xl">
              <View className="flex-row items-center justify-between mb-6">
                <Text className="text-xl font-bold text-white">
                  Nueva Tarea
                </Text>
                <TouchableOpacity
                  onPress={() => setIsModalVisible(false)}
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
                    DESCRIPCIÓN
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

                {/* Prioridad */}
                <View>
                  <Text className="mb-2 text-sm text-gray-400">PRIORIDAD</Text>
                  <View className="flex-row space-x-3">
                    {['high', 'medium', 'low'].map((priority) => (
                      <TouchableOpacity
                        key={priority}
                        onPress={() => setNewTask({ ...newTask, priority })}
                        className={`flex-1 py-3 rounded-xl flex-row items-center justify-center space-x-2
                          ${
                            newTask.priority === priority
                              ? 'bg-purple-600'
                              : 'bg-gray-800 border border-gray-700'
                          }`}
                      >
                        <Flag
                          size={16}
                          color={
                            newTask.priority === priority
                              ? '#ffffff'
                              : '#9CA3AF'
                          }
                        />
                        <Text
                          className={`${
                            newTask.priority === priority
                              ? 'text-white'
                              : 'text-gray-400'
                          }`}
                        >
                          {getPriorityLabel(priority)}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Botón de guardar */}
                <TouchableOpacity
                  className="items-center w-full py-4 mt-4 bg-purple-600 rounded-xl"
                  onPress={handleAddTask}
                >
                  <Text className="text-lg font-semibold text-white">
                    Crear Tarea
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}
