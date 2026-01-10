// Removed: Using expo-router for navigation
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../providers/AuthProvider';
import AuthStack from './AuthStack';
import MainStack from './MainStack';
import OnboardingStack from './OnboardingStack';

const Root = createNativeStackNavigator();

export default function RootNavigator() {
  const { isLoggedIn, needsOnboarding } = useAuth();

  return (
    <Root.Navigator screenOptions={{ headerShown: false }}>
      {!isLoggedIn ? (
        <Root.Screen name="Auth" component={AuthStack} />
      ) : needsOnboarding ? (
        <Root.Screen name="Onboarding" component={OnboardingStack} />
      ) : (
        <Root.Screen name="Main" component={MainStack} />
      )}
    </Root.Navigator>
  );
}
