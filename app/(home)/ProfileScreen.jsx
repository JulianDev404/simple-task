import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import {
  Bell,
  Moon,
  Shield,
  LogOut,
  ChevronRight,
  Star,
  HelpCircle,
  Share2,
  User,
  Settings,
  Sun,
} from 'lucide-react-native';
import { router } from 'expo-router';
import { signOut } from 'firebase/auth';
import { auth } from '../../constants/firebaseConfig';
import { fetchUserInfo } from '../../utils/firestoreUtils';
import { getTasksFromFirestore } from '../../utils/tasksUtils';
import ThemeModal from '../../components/ThemeModal';
import { useTheme } from '../../context/ThemeContext';

export default function ProfileScreen() {
  const { theme, isDarkMode, toggleTheme } = useTheme();
  const [isThemeModalVisible, setIsThemeModalVisible] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [taskStats, setTaskStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
  });
  const [loading, setLoading] = useState(true);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace('LoginScreen');
    } catch (error) {
      console.error('Error al cerrar sesión:', error.message);
    }
  };

  useEffect(() => {
    loadUserDataAndStats();
  }, []);

  const loadUserDataAndStats = async () => {
    setLoading(true);
    try {
      const user = auth.currentUser;
      if (user) {
        // Cargar datos del usuario
        const userData = await fetchUserInfo(user.uid);
        setUserInfo(userData);

        // Cargar estadísticas de tareas
        const tasks = await getTasksFromFirestore();
        const stats = {
          total: tasks.length,
          completed: tasks.filter((task) => task.completed).length,
          pending: tasks.filter((task) => !task.completed).length,
        };
        setTaskStats(stats);
      }
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const MenuItem = ({ icon: Icon, title, onPress, showBorder = true }) => (
    <TouchableOpacity
      onPress={onPress}
      className={`flex-row items-center py-4 px-6 active:opacity-70 ${
        showBorder ? `border-b ${theme.border}` : ''
      }`}
    >
      <Icon size={20} color={theme.icon} strokeWidth={1.5} />
      <Text className={`flex-1 ml-4 text-base ${theme.text}`}>{title}</Text>
      <ChevronRight size={20} color={theme.icon} strokeWidth={1.5} />
    </TouchableOpacity>
  );

  const Section = ({ title, children }) => (
    <View className="mt-6">
      <Text className={`px-6 mb-2 text-sm ${theme.secondaryText}`}>
        {title}
      </Text>
      <View className={`mx-4 ${theme.card} rounded-2xl`}>{children}</View>
    </View>
  );

  const StatItem = ({ value, label }) => (
    <View className="items-center flex-1">
      {loading ? (
        <ActivityIndicator color="#9333EA" size="small" />
      ) : (
        <>
          <Text className="text-xl font-bold text-purple-500">{value}</Text>
          <Text className="text-sm text-gray-400">{label}</Text>
        </>
      )}
    </View>
  );

  return (
    <SafeAreaView className={`flex-1 ${theme.background}`} edges={['top']}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header con información del perfil */}
        <View className="px-6 pt-6">
          <View className="items-center">
            {userInfo?.avatarUrl ? (
              <Image
                source={{ uri: userInfo.avatarUrl }}
                className="w-24 h-24 mb-4 rounded-full"
              />
            ) : (
              <View
                className={`items-center justify-center w-24 h-24 mb-4 ${theme.card} rounded-full`}
              >
                <User size={40} color={theme.icon} strokeWidth={1.5} />
              </View>
            )}
            <Text className={`mb-1 text-xl font-semibold ${theme.text}`}>
              {loading ? 'Cargando...' : userInfo?.name || 'Usuario'}
            </Text>
            <Text className={theme.secondaryText}>
              {loading ? '...' : userInfo?.email || 'correo@ejemplo.com'}
            </Text>
          </View>

          {/* Estadísticas rápidas */}
          <View
            className={`flex-row justify-between p-4 mt-8 ${theme.card} rounded-2xl`}
          >
            <StatItem value={taskStats.total} label="Tareas" />
            <View className={`items-center flex-1 ${theme.border} border-x`}>
              <StatItem value={taskStats.completed} label="Completadas" />
            </View>
            <StatItem value={taskStats.pending} label="Pendientes" />
          </View>
        </View>

        {/* Secciones de Menú */}
        <Section title="CUENTA">
          <MenuItem
            icon={Settings}
            title="Configuración de cuenta"
            onPress={() => {}}
          />
          <MenuItem icon={Bell} title="Notificaciones" onPress={() => {}} />
          <MenuItem
            icon={Shield}
            title="Privacidad y seguridad"
            onPress={() => {}}
            showBorder={false}
          />
        </Section>

        <Section title="PREFERENCIAS">
          <MenuItem
            icon={isDarkMode ? Sun : Moon}
            title="Tema de la aplicación"
            onPress={() => setIsThemeModalVisible(true)}
          />
          <MenuItem
            icon={Star}
            title="App Premium"
            onPress={() => {}}
            showBorder={false}
          />
        </Section>

        <Section title="AYUDA">
          <MenuItem
            icon={HelpCircle}
            title="Centro de ayuda"
            onPress={() => {}}
          />
          <MenuItem
            icon={Share2}
            title="Invitar amigos"
            onPress={() => {}}
            showBorder={false}
          />
        </Section>

        {/* Botón de cerrar sesión */}
        <View className="pb-6 mx-4 mt-6">
          <TouchableOpacity
            onPress={handleLogout}
            className="flex-row items-center justify-center py-4 bg-red-500/10 rounded-2xl active:opacity-70"
          >
            <LogOut size={20} color="#EF4444" strokeWidth={1.5} />
            <Text className="ml-2 text-base font-medium text-red-500">
              Cerrar sesión
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      {/* Agregar al final del componente, justo antes del cierre del SafeAreaView */}
      <ThemeModal
        visible={isThemeModalVisible}
        onClose={() => setIsThemeModalVisible(false)}
      />
    </SafeAreaView>
  );
}
