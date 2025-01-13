import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const handleResetPassword = () => {
    if (!email) {
      Alert.alert('Error', 'Por favor ingresa tu correo electrónico');
      return;
    }

    setIsSending(true);

    // Simular envío de correo
    setTimeout(() => {
      setIsSending(false);
      Alert.alert(
        'Correo enviado',
        'Si existe una cuenta asociada a este correo, recibirás instrucciones para restablecer tu contraseña.',
        [
          {
            text: 'OK',
            onPress: () => router.push('LoginScreen'),
          },
        ]
      );
    }, 2000);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <StatusBar style="light" />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <View className="flex-1 justify-center px-6">
          {/* Contenedor principal centrado */}
          <View className="items-center mb-10">
            {/* Ícono */}
            <View className="w-20 h-20 bg-gray-800 rounded-full items-center justify-center mb-6 border border-gray-700">
              <Text className="text-3xl">🔐</Text>
            </View>

            {/* Encabezado */}
            <Text className="text-3xl font-bold text-white mb-2 text-center">
              ¿Olvidaste tu contraseña?
            </Text>
            <Text className="text-base text-gray-400 text-center px-4">
              Ingresa tu correo electrónico y te enviaremos instrucciones para
              restablecerla
            </Text>
          </View>

          {/* Formulario */}
          <View className="space-y-4">
            <View>
              <Text className="text-gray-400 mb-2 font-medium text-sm">
                CORREO ELECTRÓNICO
              </Text>
              <TextInput
                className={`w-full bg-gray-800 border rounded-xl px-4 py-4 text-white ${
                  isEmailFocused ? 'border-purple-500' : 'border-gray-700'
                }`}
                placeholder="tu@email.com"
                placeholderTextColor="#6B7280"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                onFocus={() => setIsEmailFocused(true)}
                onBlur={() => setIsEmailFocused(false)}
              />
            </View>
          </View>

          {/* Botón de Enviar */}
          <View className="mt-8">
            <TouchableOpacity
              className={`bg-purple-600 py-4 rounded-xl w-full mb-4 shadow-lg shadow-purple-600/20 
                ${isSending ? 'opacity-70' : 'opacity-100'}`}
              onPress={handleResetPassword}
              disabled={isSending}
            >
              <Text className="text-white text-center font-semibold text-lg">
                {isSending ? 'Enviando...' : 'Enviar instrucciones'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Footer - Volver a Login */}
          <View className="flex-row justify-center mt-6">
            <TouchableOpacity
              className="flex-row items-center"
              onPress={() => router.push('LoginScreen')}
            >
              <Text className="text-purple-400 text-base">
                ← Volver al inicio de sesión
              </Text>
            </TouchableOpacity>
          </View>

          {/* Ayuda adicional */}
          <TouchableOpacity className="mt-8">
            <Text className="text-gray-500 text-sm text-center">
              ¿Necesitas ayuda adicional?{' '}
              <Text className="text-purple-400">Contacta soporte</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
