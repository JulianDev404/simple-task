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
      <View className="flex-1 px-6 justify-between py-10 bg-gradient-to-b from-gray-900 to-gray-800">
        {/* Sección Superior */}
        <View className="flex-1 items-center justify-center">
          {/* Logo o Imagen Principal con efecto de brillo */}
          <View className="w-64 h-64 bg-gray-800 rounded-full items-center justify-center mb-8 shadow-lg border border-gray-700">
            <View className="absolute w-full h-full rounded-full bg-purple-500/10" />
            <Text className="text-6xl">✨</Text>
          </View>

          {/* Textos de Bienvenida con gradiente */}
          <Text className="text-4xl font-bold text-white mb-4 text-center">
            Simple Task
          </Text>

          <Text className="text-base text-gray-400 text-center px-4 max-w-xs">
            Organiza tus tareas de manera eficiente y mejora tu productividad
            diaria
          </Text>
        </View>

        {/* Sección Inferior - Botones */}
        <View className="w-full mt-8">
          <TouchableOpacity
            className="bg-purple-600 py-4 rounded-2xl w-full mb-4 shadow-lg shadow-purple-600/20"
            onPress={handleLogin}
          >
            <Text className="text-white text-center font-semibold text-lg">
              Iniciar Sesión
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-gray-800 border border-gray-700 py-4 rounded-2xl w-full shadow-lg"
            onPress={handleSignup}
          >
            <Text className="text-purple-400 text-center font-semibold text-lg">
              Crear Cuenta
            </Text>
          </TouchableOpacity>

          {/* Texto adicional */}
          <Text className="text-gray-500 text-center mt-6 text-sm">
            Tu productividad, reinventada
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
