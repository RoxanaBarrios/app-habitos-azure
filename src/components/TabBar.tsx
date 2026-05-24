import { View, TouchableOpacity, Text } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Colors, Spacing, Typography } from '../theme/colors';

type Screen = 'home' | 'calendar' | 'metrics' | 'profile';
type IconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

interface TabBarProps {
  activeTab: Screen;
  onTabChange: (screen: Screen) => void;
}

interface TabItem {
  id: Screen;
  label: string;
  icon: IconName;
}

export default function TabBar({ activeTab, onTabChange }: TabBarProps) {
  const tabs: TabItem[] = [
    { id: 'home', label: 'Inicio', icon: 'home' },
    { id: 'calendar', label: 'Calendario', icon: 'calendar' },
    { id: 'metrics', label: 'Estadísticas', icon: 'chart-line' },
    { id: 'profile', label: 'Perfil', icon: 'account' },
  ];

  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: Colors.surface,
        opacity: 0.5,
        paddingBottom: 24,
        paddingTop: 16,
        marginTop: 0,
      }}
    >
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.id}
          onPress={() => onTabChange(tab.id)}
          style={{
            flex: 1,
            alignItems: 'center',
            paddingVertical: Spacing.md,
          }}
        >
          <MaterialCommunityIcons
            name={tab.icon}
            size={24}
            color={activeTab === tab.id ? Colors.primary : Colors.textSecondary}
            style={{ marginBottom: Spacing.xs }}
          />
          <Text
            style={{
              fontSize: 11,
              fontWeight: '600',
              color: activeTab === tab.id ? Colors.primary : Colors.textSecondary,
            }}
          >
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
