import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LineChart, PieChart } from 'react-native-chart-kit';
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  Calendar,
} from 'lucide-react-native';
import { getTasksFromFirestore } from '../../utils/tasksUtils';

const screenWidth = Dimensions.get('window').width;

const chartConfig = {
  backgroundColor: '#1F2937',
  backgroundGradientFrom: '#1F2937',
  backgroundGradientTo: '#1F2937',
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(147, 51, 234, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(156, 163, 175, ${opacity})`,
  style: { borderRadius: 16 },
  propsForDots: {
    r: '6',
    strokeWidth: '2',
    stroke: '#9333EA',
  },
};

export default function StatsScreen() {
  const [timeRange, setTimeRange] = useState('week');
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    thisWeek: 0,
  });
  const [chartData, setChartData] = useState({
    weekly: { labels: [], data: [] },
    monthly: { labels: [], data: [] },
    yearly: { labels: [], data: [] },
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const tasksData = await getTasksFromFirestore();
      setTasks(tasksData);
      calculateStats(tasksData);
      generateChartData(tasksData);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (tasksData) => {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const stats = {
      total: tasksData.length,
      completed: tasksData.filter((task) => task.completed).length,
      pending: tasksData.filter((task) => !task.completed).length,
      thisWeek: tasksData.filter((task) => {
        const taskDate = task.date ? new Date(task.date) : null;
        return taskDate && taskDate >= startOfWeek;
      }).length,
    };

    setStats(stats);
  };

  const generateChartData = (tasksData) => {
    // Datos semanales
    const weekDays = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];
    const weeklyData = new Array(7).fill(0);
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    // Datos mensuales
    const monthlyData = new Array(30).fill(0);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Datos anuales
    const monthNames = [
      'Ene',
      'Feb',
      'Mar',
      'Abr',
      'May',
      'Jun',
      'Jul',
      'Ago',
      'Sep',
      'Oct',
      'Nov',
      'Dic',
    ];
    const yearlyData = new Array(12).fill(0);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    tasksData.forEach((task) => {
      const taskDate = task.date ? new Date(task.date) : null;
      if (!taskDate) return;

      // Datos semanales
      if (taskDate >= startOfWeek) {
        const dayIndex = taskDate.getDay();
        weeklyData[dayIndex]++;
      }

      // Datos mensuales
      if (taskDate >= startOfMonth) {
        const dayOfMonth = taskDate.getDate() - 1;
        if (dayOfMonth < 30) monthlyData[dayOfMonth]++;
      }

      // Datos anuales
      if (taskDate >= startOfYear) {
        const month = taskDate.getMonth();
        yearlyData[month]++;
      }
    });

    setChartData({
      weekly: {
        labels: weekDays,
        data: weeklyData,
      },
      monthly: {
        labels: Array.from({ length: 30 }, (_, i) => (i + 1).toString()),
        data: monthlyData,
      },
      yearly: {
        labels: monthNames,
        data: yearlyData,
      },
    });
  };

  const getCurrentChartData = () => {
    const data =
      chartData[
        timeRange === 'week'
          ? 'weekly'
          : timeRange === 'month'
          ? 'monthly'
          : 'yearly'
      ];
    return {
      labels: data.labels,
      datasets: [
        {
          data: data.data,
          color: (opacity = 1) => `rgba(147, 51, 234, ${opacity})`,
        },
      ],
    };
  };

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

  const pieData = [
    {
      name: 'Completadas',
      population: stats.completed,
      color: '#22C55E',
      legendFontColor: '#9CA3AF',
    },
    {
      name: 'Pendientes',
      population: stats.pending,
      color: '#EF4444',
      legendFontColor: '#9CA3AF',
    },
  ];

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-900">
        <View className="items-center justify-center flex-1">
          <Text className="text-white">Cargando estadísticas...</Text>
        </View>
      </SafeAreaView>
    );
  }

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
          <View className="flex-row gap-4 mb-6">
            <StatCard
              title="Total Tareas"
              value={stats.total.toString()}
              icon={CheckCircle2}
              color="purple"
            />
            <StatCard
              title="Completadas"
              value={stats.completed.toString()}
              icon={Clock}
              color="green"
            />
          </View>

          <View className="flex-row gap-4">
            <StatCard
              title="Pendientes"
              value={stats.pending.toString()}
              icon={AlertCircle}
              color="red"
            />
            <StatCard
              title="Esta Semana"
              value={stats.thisWeek.toString()}
              icon={Calendar}
              color="purple"
            />
          </View>
        </View>

        {/* Time Range Selector */}
        <View className="flex-row justify-center gap-4 px-4 mt-8">
          <TimeRangeButton range="week" label="Semana" />
          <TimeRangeButton range="month" label="Mes" />
          <TimeRangeButton range="year" label="Año" />
        </View>

        {/* Charts */}
        <View className="mt-6">
          {/* Productivity Trend */}
          <View className="p-4 mx-4 mb-6 bg-gray-800/50 rounded-2xl">
            <Text className="mb-4 font-semibold text-white">
              Tendencia de Tareas
            </Text>
            <LineChart
              data={getCurrentChartData()}
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
