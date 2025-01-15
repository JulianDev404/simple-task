import React from 'react';
import { View, Text, Modal, TouchableOpacity, Pressable } from 'react-native';
import { Sun, Moon, X, Check } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';

const ThemeModal = ({ visible, onClose }) => {
  const { theme, isDarkMode, toggleTheme } = useTheme();

  const ThemeOption = ({
    title,
    description,
    icon: Icon,
    isSelected,
    onSelect,
  }) => (
    <TouchableOpacity
      onPress={onSelect}
      className={`p-4 rounded-2xl mb-3 ${
        isSelected ? theme.accentLight : theme.card
      } ${theme.shadow}`}
    >
      <View className="flex-row items-center">
        <View
          className={`w-10 h-10 rounded-full items-center justify-center ${
            isSelected ? theme.accentBg : theme.cardSecondary
          }`}
        >
          <Icon
            size={20}
            color={isSelected ? '#ffffff' : theme.icon}
            strokeWidth={1.5}
          />
        </View>
        <View className="flex-1 ml-4">
          <Text className={`text-lg font-semibold ${theme.text}`}>{title}</Text>
          <Text className={`${theme.secondaryText} text-sm mt-1`}>
            {description}
          </Text>
        </View>
        {isSelected && (
          <View className="ml-2">
            <Check size={20} color={theme.iconSelected} strokeWidth={2} />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="justify-center flex-1 bg-black/50">
        <View
          className={`mx-4 p-6 rounded-3xl ${theme.background} ${theme.shadowLg}`}
        >
          {/* Header */}
          <View className="flex-row items-center justify-between mb-6">
            <Text className={`text-xl font-bold ${theme.text}`}>
              Tema de la aplicación
            </Text>
            <TouchableOpacity
              onPress={onClose}
              className={`p-2 rounded-full ${theme.card}`}
            >
              <X size={20} color={theme.icon} strokeWidth={1.5} />
            </TouchableOpacity>
          </View>

          {/* Theme Options */}
          <View className="mb-6">
            <ThemeOption
              title="Tema Claro"
              description="Perfecto para usar durante el día"
              icon={Sun}
              isSelected={!isDarkMode}
              onSelect={() => {
                if (isDarkMode) toggleTheme();
                onClose();
              }}
            />
            <ThemeOption
              title="Tema Oscuro"
              description="Ideal para ambientes con poca luz"
              icon={Moon}
              isSelected={isDarkMode}
              onSelect={() => {
                if (!isDarkMode) toggleTheme();
                onClose();
              }}
            />
          </View>

          {/* Close Button */}
          <TouchableOpacity
            className={`py-4 rounded-xl ${theme.accentBg}`}
            onPress={onClose}
          >
            <Text className="text-base font-medium text-center text-white">
              Listo
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default ThemeModal;
