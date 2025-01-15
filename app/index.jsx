import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Text, View, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useAuth } from '../hooks/useAuth';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const { user, loading } = useAuth();
  useEffect(() => {
    const checkFirstLaunch = async () => {
      const isFirstLaunch = await AsyncStorage.getItem('isFirstLaunch');
      if (isFirstLaunch === null) {
        await AsyncStorage.setItem('isFirstLaunch', 'false');
      } else {
        if (!loading) {
          if (user) {
            router.replace('/HomeScreen');
          } else {
            router.replace('/LoginScreen');
          }
        }
      }
    };
    checkFirstLaunch();
  }, [user, loading]);

  const handleLogin = () => {
    router.push('LoginScreen'); // Navega a LoginScreen
  };

  const handleSignup = () => {
    router.push('SignUpScreen'); // Navega a SignUpScreen
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <StatusBar style="light" />

      {/* Contenedor Principal con gradiente sutil */}
      <View className="justify-between flex-1 px-6 py-10 bg-gradient-to-b from-gray-900 to-gray-800">
        {/* Sección Superior */}
        <View className="items-center justify-center flex-1">
          {/* Logo o Imagen Principal con efecto de brillo */}
          <View className="items-center justify-center w-64 h-64 mb-8 bg-gray-800 border border-gray-700 rounded-full shadow-lg">
            <View className="absolute w-full h-full rounded-full bg-purple-500/10" />
            <Text className="text-6xl">✨</Text>
          </View>

          {/* Textos de Bienvenida con gradiente */}
          <Text className="mb-4 text-4xl font-bold text-center text-white">
            Simple Task
          </Text>

          <Text className="max-w-xs px-4 text-base text-center text-gray-400">
            Organiza tus tareas de manera eficiente y mejora tu productividad
            diaria
          </Text>
        </View>

        {/* Sección Inferior - Botones */}
        <View className="w-full mt-8">
          <TouchableOpacity
            className="w-full py-4 mb-4 bg-purple-600 shadow-lg rounded-2xl shadow-purple-600/20"
            onPress={handleLogin}
          >
            <Text className="text-lg font-semibold text-center text-white">
              Iniciar Sesión
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="w-full py-4 bg-gray-800 border border-gray-700 shadow-lg rounded-2xl"
            onPress={handleSignup}
          >
            <Text className="text-lg font-semibold text-center text-purple-400">
              Crear Cuenta
            </Text>
          </TouchableOpacity>

          {/* Texto adicional */}
          <Text className="mt-6 text-sm text-center text-gray-500">
            Tu productividad, reinventada
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
