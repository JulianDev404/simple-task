import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  FlatList,
  Alert,
  Modal,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import {
  Plus,
  Clock,
  Flag,
  X,
  Calendar,
  Search,
  User,
  Filter,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react-native';
import {
  addTaskToFirestore,
  getTasksFromFirestore,
  updateTaskInFirestore,
  deleteTaskFromFirestore,
} from '../../utils/tasksUtils';
import { auth } from '../../constants/firebaseConfig';
import { fetchUserInfo } from '../../utils/firestoreUtils';

export default function HomeScreen() {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all'); // all, pending, completed
  const [userInfo, setUserInfo] = useState(null);
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
      high: 'bg-red-600',
      medium: 'bg-yellow-500',
      low: 'bg-green-600',
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

  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (user) {
        const data = await fetchUserInfo(user.uid);
        setUserInfo(data);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    filterTasks();
  }, [tasks, searchQuery, selectedFilter]);

  const filterTasks = () => {
    let result = [...tasks];

    // Aplicar filtro de estado
    if (selectedFilter !== 'all') {
      result = result.filter((task) =>
        selectedFilter === 'completed' ? task.completed : !task.completed
      );
    }

    // Aplicar búsqueda
    if (searchQuery) {
      result = result.filter(
        (task) =>
          task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          task.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredTasks(result);
  };

  const TaskStats = () => (
    <View className="flex-row justify-between px-2 mb-4">
      <View className="flex-row items-center">
        <CheckCircle2 size={16} color="#22C55E" />
        <Text className="ml-2 text-gray-400">
          {tasks.filter((t) => t.completed).length} completadas
        </Text>
      </View>
      <View className="flex-row items-center">
        <AlertCircle size={16} color="#EF4444" />
        <Text className="ml-2 text-gray-400">
          {tasks.filter((t) => !t.completed).length} pendientes
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-900" edges={['top']}>
      <StatusBar style="light" />

      {/* Header */}
      <View className="px-6 py-4 border-b border-gray-800">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-2xl font-bold text-white">
              Bienvenido, {userInfo?.name?.split(' ')[0] || 'Usuario'}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => router.push('ProfileScreen')}
            className="w-10 h-10 overflow-hidden bg-gray-800 rounded-full"
          >
            {userInfo?.avatarUrl ? (
              <Image
                source={{ uri: userInfo.avatarUrl }}
                className="w-full h-full"
              />
            ) : (
              <View className="items-center justify-center w-full h-full">
                <User size={24} color="#9CA3AF" />
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Barra de búsqueda y filtros */}
        <View className="mt-4 ">
          <View className="flex-row items-center px-4 py-2 bg-gray-800 rounded-xl">
            <Search size={20} color="#9CA3AF" />
            <TextInput
              className="flex-1 ml-2 text-white"
              placeholder="Buscar tareas..."
              placeholderTextColor="#6B7280"
              value={searchQuery}
              onChangeText={setSearchQuery}
              keyboardAppearance="dark"
            />
          </View>

          <View className="flex-row gap-2 mt-4">
            {['all', 'pending', 'completed'].map((filter) => (
              <TouchableOpacity
                key={filter}
                onPress={() => setSelectedFilter(filter)}
                className={`px-4 py-2 rounded-xl ${
                  selectedFilter === filter ? 'bg-purple-600' : 'bg-gray-800'
                }`}
              >
                <Text
                  className={`${
                    selectedFilter === filter ? 'text-white' : 'text-gray-400'
                  } capitalize`}
                >
                  {filter === 'all'
                    ? 'Todas'
                    : filter === 'pending'
                    ? 'Pendientes'
                    : 'Completadas'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {/* Lista de tareas */}
      <FlatList
        data={filteredTasks}
        ListHeaderComponent={<TaskStats />}
        renderItem={renderTask}
        keyExtractor={(item) => item.id}
        className="px-6 pt-4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListEmptyComponent={
          <View className="items-center justify-center py-10">
            <Text className="text-center text-gray-500">
              {searchQuery
                ? 'No se encontraron tareas'
                : selectedFilter === 'completed'
                ? 'No hay tareas completadas'
                : selectedFilter === 'pending'
                ? 'No hay tareas pendientes'
                : 'No hay tareas creadas'}
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

              <View className="flex gap-2">
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
                  <View className="flex-row gap-2">
                    {[
                      {
                        value: 'high',
                        label: 'Alta',
                        bgColor: 'bg-red-600',
                        borderColor: 'border-red-700',
                        hoverBg: 'bg-red-700',
                      },
                      {
                        value: 'medium',
                        label: 'Media',
                        bgColor: 'bg-yellow-500',
                        borderColor: 'border-yellow-600',
                        hoverBg: 'bg-yellow-600',
                      },
                      {
                        value: 'low',
                        label: 'Baja',
                        bgColor: 'bg-green-600',
                        borderColor: 'border-green-700',
                        hoverBg: 'bg-green-700',
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

                {/* Botón de guardar */}
                <TouchableOpacity
                  className={`items-center w-full py-4 mt-4 rounded-xl ${
                    newTask.priority === 'high'
                      ? 'bg-red-600'
                      : newTask.priority === 'medium'
                      ? 'bg-yellow-500'
                      : 'bg-green-600'
                  }`}
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
