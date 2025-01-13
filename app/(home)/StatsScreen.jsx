import React, { useState } from 'react';
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  Calendar,
} from 'lucide-react-native';

const screenWidth = Dimensions.get('window').width;

const chartConfig = {
  backgroundColor: '#1F2937',
  backgroundGradientFrom: '#1F2937',
  backgroundGradientTo: '#1F2937',
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(147, 51, 234, ${opacity})`, // Purple
  labelColor: (opacity = 1) => `rgba(156, 163, 175, ${opacity})`, // Gray-400
  style: {
    borderRadius: 16,
  },
  propsForDots: {
    r: '6',
    strokeWidth: '2',
    stroke: '#9333EA',
  },
};

export default function StatsScreen() {
  const [timeRange, setTimeRange] = useState('week');

  const data = {
    labels: ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'],
    datasets: [
      {
        data: [4, 6, 3, 5, 7, 2, 4],
        color: (opacity = 1) => `rgba(147, 51, 234, ${opacity})`, // Purple
      },
    ],
  };

  const pieData = [
    {
      name: 'Completadas',
      population: 18,
      color: '#22C55E',
      legendFontColor: '#9CA3AF',
    },
    {
      name: 'Pendientes',
      population: 6,
      color: '#EF4444',
      legendFontColor: '#9CA3AF',
    },
  ];

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <View className="flex-1 p-4 bg-gray-800/50 rounded-2xl">
      <View className="flex-row items-center justify-between">
        <Text className="text-sm text-gray-400">{title}</Text>
        <View
          className={`w-8 h-8 rounded-full items-center justify-center bg-${color}-500/20`}
        >
          <Icon
            size={18}
            color={`#${
              color === 'purple'
                ? '9333EA'
                : color === 'green'
                ? '22C55E'
                : 'EF4444'
            }`}
            strokeWidth={1.5}
          />
        </View>
      </View>
      <Text className="mt-2 text-2xl font-bold text-white">{value}</Text>
    </View>
  );

  const TimeRangeButton = ({ range, label }) => (
    <TouchableOpacity
      onPress={() => setTimeRange(range)}
      className={`px-4 py-2 rounded-lg ${
        timeRange === range ? 'bg-purple-600' : 'bg-gray-800/50'
      }`}
    >
      <Text
        className={`${
          timeRange === range ? 'text-white' : 'text-gray-400'
        } font-medium`}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-900" edges={['top']}>
      <StatusBar style="light" />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="px-6 py-4">
          <Text className="text-2xl font-bold text-white">Estadísticas</Text>
          <Text className="mt-1 text-gray-400">
            Resumen de tu productividad
          </Text>
        </View>

        {/* Quick Stats */}
        <View className="px-6">
          <View className="flex-row mb-6 space-x-4">
            <StatCard
              title="Total Tareas"
              value="24"
              icon={CheckCircle2}
              color="purple"
            />
            <StatCard
              title="Completadas"
              value="18"
              icon={Clock}
              color="green"
            />
          </View>

          <View className="flex-row space-x-4">
            <StatCard
              title="Pendientes"
              value="6"
              icon={AlertCircle}
              color="red"
            />
            <StatCard
              title="Esta Semana"
              value="12"
              icon={Calendar}
              color="purple"
            />
          </View>
        </View>

        {/* Time Range Selector */}
        <View className="flex-row justify-center mt-8 space-x-4">
          <TimeRangeButton range="week" label="Semana" />
          <TimeRangeButton range="month" label="Mes" />
          <TimeRangeButton range="year" label="Año" />
        </View>

        {/* Charts */}
        <View className="mt-6">
          {/* Productivity Trend */}
          <View className="p-4 mx-4 mb-6 bg-gray-800/50 rounded-2xl">
            <Text className="mb-4 font-semibold text-white">
              Tendencia de Productividad
            </Text>
            <LineChart
              data={data}
              width={screenWidth - 48}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={{
                marginVertical: 8,
                borderRadius: 16,
              }}
            />
          </View>

          {/* Task Distribution */}
          <View className="p-4 mx-4 bg-gray-800/50 rounded-2xl">
            <Text className="mb-4 font-semibold text-white">
              Distribución de Tareas
            </Text>
            <PieChart
              data={pieData}
              width={screenWidth - 48}
              height={220}
              chartConfig={chartConfig}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="0"
              absolute
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
