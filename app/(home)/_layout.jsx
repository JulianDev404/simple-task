import { Tabs } from 'expo-router';
import { View, Text } from 'react-native';
import { ClipboardList, Calendar, BarChart2, User } from 'lucide-react-native';
import { TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

export default function HomeLayout() {
  const MenuButton = ({ title, Icon, color, onPress }) => {
    return (
      <TouchableOpacity
        onPress={onPress}
        className="items-center justify-center"
        style={{ minHeight: 60, minWidth: 80 }} // Ajusta el tamaño mínimo del botón
      >
        <View className="items-center justify-center">
          {Icon && <Icon size={24} color={color} strokeWidth={1.5} />}
          <Text
            style={{ color }}
            className="text-xs mt-2 text-center" // Asegura el espacio entre el ícono y el texto
          >
            {title}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#111827', // bg-gray-900
          borderTopWidth: 1,
          borderTopColor: '#1F2937', // border-gray-800
          paddingBottom: 0,
          paddingTop: 8,
          height: 90,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
        },
        tabBarBackground: () => (
          <View className="absolute inset-0 bg-gray-900" />
        ),
        tabBarActiveTintColor: '#9333EA', // text-purple-600
        tabBarInactiveTintColor: '#6B7280', // text-gray-500
        headerShown: false,
        tabBarShowLabel: false,
        tabBarItemStyle: {
          paddingBottom: 12,
        },
      }}
    >
      <Tabs.Screen
        name="HomeScreen"
        options={{
          title: 'Tareas',
          tabBarIcon: ({ color }) => (
            <MenuButton
              title="Tareas"
              Icon={ClipboardList}
              color={color}
              onPress={() => router.push('HomeScreen')}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="CalendarScreen"
        options={{
          title: 'Calendario',
          tabBarIcon: ({ color }) => (
            <MenuButton
              title="Calendario"
              Icon={Calendar}
              color={color}
              onPress={() => router.push('CalendarScreen')}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="StatsScreen"
        options={{
          title: 'Estadísticas',
          tabBarIcon: ({ color }) => (
            <MenuButton
              title="Estadísticas"
              Icon={BarChart2}
              color={color}
              onPress={() => router.push('StatsScreen')}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="ProfileScreen"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color }) => (
            <MenuButton
              title="Perfil"
              Icon={User}
              color={color}
              onPress={() => router.push('ProfileScreen')}
            />
          ),
        }}
      />
    </Tabs>
  );
}
