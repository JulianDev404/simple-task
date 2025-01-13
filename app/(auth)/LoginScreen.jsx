import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../constants/firebaseConfig';
import { Lock, Mail, Eye, EyeOff } from 'lucide-react-native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    Keyboard.dismiss();
    setError('');

    if (!email || !password) {
      setError('Por favor completa todos los campos');
      return;
    }

    if (!email.includes('@')) {
      setError('Por favor ingresa un correo válido');
      return;
    }

    setIsLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      router.push('HomeScreen');
    } catch (error) {
      let errorMessage = 'Ocurrió un error al iniciar sesión';
      if (error.code === 'auth/invalid-email') {
        errorMessage = 'El correo electrónico no es válido';
      } else if (error.code === 'auth/user-not-found') {
        errorMessage = 'No existe una cuenta con este correo';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'La contraseña es incorrecta';
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <StatusBar style="light" />

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-1 justify-center px-6">
            {/* Logo y Bienvenida */}
            <View className="items-center mb-10">
              <View className="w-24 h-24 bg-purple-500/10 rounded-3xl items-center justify-center mb-6 border border-purple-500/20">
                <Lock size={40} color="#9333EA" strokeWidth={1.5} />
              </View>
              <Text className="text-4xl font-bold text-white mb-3">
                ¡Hola de nuevo!
              </Text>
              <Text className="text-base text-gray-400 text-center max-w-[250px]">
                Nos alegra verte otra vez por aquí
              </Text>
            </View>

            {/* Formulario */}
            <View className="space-y-4">
              {/* Email Input */}
              <View>
                <Text className="text-gray-400 mb-2 font-medium text-sm">
                  CORREO ELECTRÓNICO
                </Text>
                <View className="relative">
                  <TextInput
                    className={`w-full bg-gray-800/50 border rounded-xl px-4 py-4 pl-11 text-white ${
                      isEmailFocused ? 'border-purple-500' : 'border-gray-700'
                    }`}
                    placeholder="tu@email.com"
                    placeholderTextColor="#6B7280"
                    value={email}
                    onChangeText={(text) => {
                      setEmail(text);
                      setError('');
                    }}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    keyboardAppearance="dark"
                    onFocus={() => setIsEmailFocused(true)}
                    onBlur={() => setIsEmailFocused(false)}
                  />
                  <View className="absolute left-3 top-3.5">
                    <Mail
                      size={20}
                      color={isEmailFocused ? '#9333EA' : '#6B7280'}
                      strokeWidth={1.5}
                    />
                  </View>
                </View>
              </View>

              {/* Password Input */}
              <View>
                <Text className="text-gray-400 mb-2 font-medium text-sm">
                  CONTRASEÑA
                </Text>
                <View className="relative">
                  <TextInput
                    className={`w-full bg-gray-800/50 border rounded-xl px-4 py-4 pl-11 pr-11 text-white ${
                      isPasswordFocused
                        ? 'border-purple-500'
                        : 'border-gray-700'
                    }`}
                    placeholder="Tu contraseña"
                    placeholderTextColor="#6B7280"
                    value={password}
                    onChangeText={(text) => {
                      setPassword(text);
                      setError('');
                    }}
                    secureTextEntry={!showPassword}
                    keyboardAppearance="dark"
                    onFocus={() => setIsPasswordFocused(true)}
                    onBlur={() => setIsPasswordFocused(false)}
                  />
                  <View className="absolute left-3 top-3.5">
                    <Lock
                      size={20}
                      color={isPasswordFocused ? '#9333EA' : '#6B7280'}
                      strokeWidth={1.5}
                    />
                  </View>
                  <TouchableOpacity
                    className="absolute right-3 top-3.5"
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff size={20} color="#6B7280" strokeWidth={1.5} />
                    ) : (
                      <Eye size={20} color="#6B7280" strokeWidth={1.5} />
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              {/* Error Message */}
              {error ? (
                <Text className="text-red-500 text-sm text-center">
                  {error}
                </Text>
              ) : null}

              {/* Forgot Password */}
              <TouchableOpacity
                className="items-end"
                onPress={() => router.push('ForgotPasswordScreen')}
              >
                <Text className="text-purple-400 text-sm font-medium">
                  ¿Olvidaste tu contraseña?
                </Text>
              </TouchableOpacity>
            </View>

            {/* Login Button */}
            <View className="mt-8">
              <TouchableOpacity
                className={`bg-purple-600 py-4 rounded-xl w-full mb-4 
                  ${isLoading ? 'opacity-70' : 'opacity-100'}`}
                onPress={handleLogin}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white text-center font-semibold text-lg">
                    Iniciar Sesión
                  </Text>
                )}
              </TouchableOpacity>
            </View>

            {/* Sign Up Link */}
            <View className="flex-row justify-center mt-6">
              <Text className="text-gray-400">¿No tienes una cuenta? </Text>
              <TouchableOpacity
                onPress={() => router.push('SignUpScreen')}
                className="active:opacity-60"
              >
                <Text className="text-purple-400 font-semibold">
                  Regístrate aquí
                </Text>
              </TouchableOpacity>
            </View>

            {/* Security Indicator */}
            <View className="mt-8 flex-row items-center justify-center space-x-2">
              <View className="w-1.5 h-1.5 rounded-full bg-green-500" />
              <Text className="text-gray-500 text-sm">Conexión segura</Text>
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}
