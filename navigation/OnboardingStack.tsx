// Removed: Using expo-router for navigation
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import InterestsScreen from '../screens/onboarding/InterestsScreen';
import NameScreen from '../screens/onboarding/NameScreen';
import PlacesScreen from '../screens/onboarding/PlacesScreen';

const Stack = createNativeStackNavigator();

export default function OnboardingStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Name" component={NameScreen} />
      <Stack.Screen name="Interests" component={InterestsScreen} />
      <Stack.Screen name="Places" component={PlacesScreen} />
    </Stack.Navigator>
  );
}
