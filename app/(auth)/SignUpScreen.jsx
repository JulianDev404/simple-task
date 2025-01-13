import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../constants/firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../constants/firebaseConfig'; // Asegúrate de importar Firestore

export default function SignUpScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [focusedInput, setFocusedInput] = useState('');

  const handleSignUp = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Guardar información adicional en Firestore
      await setDoc(doc(db, 'users', user.uid), {
        name: name,
        email: user.email,
        createdAt: new Date(),
      });

      router.push('HomeScreen');
    } catch (error) {
      console.error('Error al registrar usuario', error);
    }
  };

  const getInputStyle = (inputName) => {
    return `w-full bg-gray-800 border rounded-xl px-4 py-4 text-white ${
      focusedInput === inputName ? 'border-purple-500' : 'border-gray-700'
    }`;
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
            {/* Logo o ícono */}
            <View className="w-20 h-20 bg-gray-800 rounded-full items-center justify-center mb-6 border border-gray-700">
              <Text className="text-3xl">🚀</Text>
            </View>

            {/* Encabezado */}
            <Text className="text-3xl font-bold text-white mb-2 text-center">
              Crear cuenta
            </Text>
            <Text className="text-base text-gray-400 text-center">
              Únete a la comunidad de Simple Task
            </Text>
          </View>

          {/* Formulario */}
          <View className="space-y-4">
            {/* Nombre completo */}
            <View>
              <Text className="text-gray-400 mb-2 font-medium text-sm">
                NOMBRE COMPLETO
              </Text>
              <TextInput
                className={getInputStyle('name')}
                placeholder="Tu nombre completo"
                placeholderTextColor="#6B7280"
                value={name}
                onChangeText={setName}
                onFocus={() => setFocusedInput('name')}
                onBlur={() => setFocusedInput('')}
              />
            </View>

            {/* Email */}
            <View>
              <Text className="text-gray-400 mb-2 font-medium text-sm">
                CORREO ELECTRÓNICO
              </Text>
              <TextInput
                className={getInputStyle('email')}
                placeholder="tu@email.com"
                placeholderTextColor="#6B7280"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                onFocus={() => setFocusedInput('email')}
                onBlur={() => setFocusedInput('')}
              />
            </View>

            {/* Contraseña */}
            <View>
              <Text className="text-gray-400 mb-2 font-medium text-sm">
                CONTRASEÑA
              </Text>
              <TextInput
                className={getInputStyle('password')}
                placeholder="Crea tu contraseña"
                placeholderTextColor="#6B7280"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                onFocus={() => setFocusedInput('password')}
                onBlur={() => setFocusedInput('')}
              />
            </View>

            {/* Confirmar Contraseña */}
            <View>
              <Text className="text-gray-400 mb-2 font-medium text-sm">
                CONFIRMAR CONTRASEÑA
              </Text>
              <TextInput
                className={getInputStyle('confirmPassword')}
                placeholder="Confirma tu contraseña"
                placeholderTextColor="#6B7280"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                onFocus={() => setFocusedInput('confirmPassword')}
                onBlur={() => setFocusedInput('')}
              />
            </View>
          </View>

          {/* Botón de Registro */}
          <View className="mt-8">
            <TouchableOpacity
              className="bg-purple-600 py-4 rounded-xl w-full mb-4 shadow-lg shadow-purple-600/20"
              onPress={handleSignUp}
            >
              <Text className="text-white text-center font-semibold text-lg">
                Crear cuenta
              </Text>
            </TouchableOpacity>
          </View>

          {/* Footer - Login Link */}
          <View className="flex-row justify-center mt-6">
            <Text className="text-gray-400">¿Ya tienes una cuenta? </Text>
            <TouchableOpacity onPress={() => router.push('LoginScreen')}>
              <Text className="text-purple-400 font-semibold">
                Inicia sesión
              </Text>
            </TouchableOpacity>
          </View>

          {/* Términos y condiciones */}
          <Text className="text-gray-500 text-xs text-center mt-6">
            Al registrarte, aceptas nuestros{' '}
            <Text className="text-purple-400">términos y condiciones</Text> y{' '}
            <Text className="text-purple-400">política de privacidad</Text>
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
