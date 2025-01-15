import React, { useEffect, useState } from 'react';
import { Text, View, TouchableOpacity, ScrollView, Image } from 'react-native';
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
} from 'lucide-react-native';
import { router } from 'expo-router';
import { signOut } from 'firebase/auth';
import { auth } from '../../constants/firebaseConfig';
import { fetchUserInfo } from '../../utils/firestoreUtils';

export default function ProfileScreen() {
  const [userInfo, setUserInfo] = useState(null);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace('LoginScreen');
    } catch (error) {
      console.error('Error al cerrar sesión:', error.message);
    }
  };

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

  const MenuItem = ({ icon: Icon, title, onPress, showBorder = true }) => (
    <TouchableOpacity
      onPress={onPress}
      className={`flex-row items-center py-4 px-6 active:opacity-70 ${
        showBorder ? 'border-b border-gray-800' : ''
      }`}
    >
      <Icon size={20} color="#9CA3AF" strokeWidth={1.5} />
      <Text className="flex-1 ml-4 text-base text-white">{title}</Text>
      <ChevronRight size={20} color="#6B7280" strokeWidth={1.5} />
    </TouchableOpacity>
  );

  const Section = ({ title, children }) => (
    <View className="mt-6">
      <Text className="px-6 mb-2 text-sm text-gray-400">{title}</Text>
      <View className="mx-4 bg-gray-800/50 rounded-2xl">{children}</View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-900" edges={['top']}>
      <StatusBar style="light" />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 100 }} // Añadido padding extra al final
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
              <View className="items-center justify-center w-24 h-24 mb-4 bg-gray-800 rounded-full">
                <User size={40} color="#9CA3AF" strokeWidth={1.5} />
              </View>
            )}
            <Text className="mb-1 text-xl font-semibold text-white">
              {userInfo?.name || 'Usuario'}
            </Text>
            <Text className="text-gray-400">
              {userInfo?.email || 'correo@ejemplo.com'}
            </Text>
          </View>

          {/* Estadísticas rápidas */}
          <View className="flex-row justify-between p-4 mt-8 bg-gray-800/50 rounded-2xl">
            <View className="items-center flex-1">
              <Text className="text-xl font-bold text-purple-500">12</Text>
              <Text className="text-sm text-gray-400">Tareas</Text>
            </View>
            <View className="items-center flex-1 border-gray-700 border-x">
              <Text className="text-xl font-bold text-purple-500">8</Text>
              <Text className="text-sm text-gray-400">Completadas</Text>
            </View>
            <View className="items-center flex-1">
              <Text className="text-xl font-bold text-purple-500">4</Text>
              <Text className="text-sm text-gray-400">Pendientes</Text>
            </View>
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
            icon={Moon}
            title="Tema de la aplicación"
            onPress={() => {}}
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
    </SafeAreaView>
  );
}
