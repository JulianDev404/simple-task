import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="LoginScreen"
        options={{ title: 'Iniciar Sesión', headerShown: false }}
      />
      <Stack.Screen
        name="SignUpScreen"
        options={{ title: 'Crear Cuenta', headerShown: false }}
      />
      <Stack.Screen
        name="ForgotPasswordScreen"
        options={{ title: 'Recuperar Contraseña', headerShown: false }}
      />
    </Stack>
  );
}
