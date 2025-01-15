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
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../constants/firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../constants/firebaseConfig';

export default function SignUpScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [focusedInput, setFocusedInput] = useState('');

  const handleSignUp = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }

    try {
      // Registrar usuario en Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Generar la URL del avatar usando DiceBear
      const avatarUrl = `https://api.dicebear.com/5.x/initials/png?seed=${encodeURIComponent(
        name
      )}`;

      // Guardar información adicional en Firestore
      await setDoc(doc(db, 'users', user.uid), {
        name: name,
        email: user.email,
        avatarUrl: avatarUrl, // Guardar la URL del avatar
        createdAt: new Date(),
      });

      router.push('HomeScreen');
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      Alert.alert(
        'Error',
        error.message || 'Ocurrió un problema al registrar al usuario'
      );
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
        <View className="justify-center flex-1 px-6">
          {/* Contenedor principal */}
          <View className="items-center mb-10">
            <View className="items-center justify-center w-20 h-20 mb-6 bg-gray-800 border border-gray-700 rounded-full">
              <Text className="text-3xl">🚀</Text>
            </View>
            <Text className="mb-2 text-3xl font-bold text-center text-white">
              Crear cuenta
            </Text>
            <Text className="text-base text-center text-gray-400">
              Únete a la comunidad de Simple Task
            </Text>
          </View>

          {/* Formulario */}
          <View className="space-y-4">
            {/* Nombre completo */}
            <View>
              <Text className="mb-2 text-sm font-medium text-gray-400">
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
              <Text className="mb-2 text-sm font-medium text-gray-400">
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
              <Text className="mb-2 text-sm font-medium text-gray-400">
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

            {/* Confirmar contraseña */}
            <View>
              <Text className="mb-2 text-sm font-medium text-gray-400">
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

          {/* Botón de registro */}
          <View className="mt-8">
            <TouchableOpacity
              className="w-full py-4 mb-4 bg-purple-600 shadow-lg rounded-xl shadow-purple-600/20"
              onPress={handleSignUp}
            >
              <Text className="text-lg font-semibold text-center text-white">
                Crear cuenta
              </Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View className="flex-row justify-center mt-6">
            <Text className="text-gray-400">¿Ya tienes una cuenta? </Text>
            <TouchableOpacity onPress={() => router.push('LoginScreen')}>
              <Text className="font-semibold text-purple-400">
                Inicia sesión
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
