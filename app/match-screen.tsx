import { ThemedText } from '@/components/themed-text';
import { AppButton } from '@/components/ui/app-button';
import { Colors, Fonts } from '@/constants/theme';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Linking, ScrollView, StyleSheet, View } from 'react-native';
import { Card } from 'react-native-paper';

const cuteQuestions = [
  "If you could teleport anywhere right now, where would you go?",
  "What's your go-to comfort food?",
  "If you could have any superpower for a day, what would it be?",
  "What's your favorite way to spend a Sunday?",
  "If you could instantly master any skill, what would it be?",
  "What's a song you never get tired of?",
  "What's the best adventure you've ever had?",
  "If you could meet any fictional character, who would it be?",
  "What's your favorite thing about today so far?",
  "If you could swap lives with anyone for a day, who would it be?"
];

export function getRandomCuteQuestion() {
  return cuteQuestions[Math.floor(Math.random() * cuteQuestions.length)];
}

export default function MatchScreen() {
  const router = useRouter();
  const { data } = useLocalSearchParams();
  
  if (!data) {
    return (
        <View style={styles.root}>
            <ThemedText>Error: No match data provided.</ThemedText>
            <AppButton onPress={() => router.replace('/')}>Go Home</AppButton>
        </View>
    )
  }

  const { matched_user_id, mutual_interest, nearest_place, mutual_meeting_place, distance } = JSON.parse(data as string);

  const openMaps = () => {
    let url = '';
    if (nearest_place.place_id) {
        url = `https://www.google.com/maps/search/?api=1&query=Google&query_place_id=${nearest_place.place_id}`;
    } else if (nearest_place.location && nearest_place.location.lat && nearest_place.location.lng) {
        url = `https://www.google.com/maps/search/?api=1&query=${nearest_place.location.lat},${nearest_place.location.lng}`;
    } else {
        // Fallback for demo data or simple names
        url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(nearest_place.name + ' ' + (nearest_place.address || ''))}`;
    }
    if (url) Linking.openURL(url);
  };
  const question = getRandomCuteQuestion();

  return (
    <View style={styles.root}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {/* Header Section */}
            <View style={styles.header}>
                <ThemedText style={styles.emoji}>✨🤝✨</ThemedText>
                <ThemedText style={styles.matchTitle}>it's a Match!</ThemedText>
                <ThemedText style={styles.subtitle}>You found someone with great taste.</ThemedText>
            </View>

            {/* Main Card */}
            <Card style={styles.card}>
                <Card.Content style={styles.cardContent}>
                    {/* Location Section */}
                    <View style={styles.sectionContainer}>
                        <ThemedText style={styles.sectionLabel}>MEET AT</ThemedText>
                        <ThemedText style={styles.placeName}>{nearest_place.name}</ThemedText>
                        <ThemedText style={styles.address}>{nearest_place.address}</ThemedText>
                    </View>
                    <View style={styles.distanceContainer}>
                      <ThemedText style={styles.distanceLabel}>📍 {distance.label}</ThemedText>
                      <ThemedText style={styles.distanceTime}>{distance.time} min walk</ThemedText>
                    </View>

                    <View style={styles.divider} />

                    {/* Interests Section */}
                    <View style={styles.sectionContainer}>
                        <ThemedText style={styles.sectionLabel}>YOU BOTH LIKE</ThemedText>
                        <View style={styles.chipRow}>
                            {mutual_interest.map((interest: string) => (
                            <View key={interest} style={styles.chip}>
                                <ThemedText style={styles.chipText}>{interest}</ThemedText>
                            </View>
                            ))}
                        </View>
                    </View>

                     <View style={styles.divider} />

                    {/* Icebreaker Section */}
                    <View style={styles.icebreakerContainer}>
                        <ThemedText style={styles.icebreakerLabel}>ICEBREAKER</ThemedText>
                        <ThemedText style={styles.icebreakerText}>"{question}"</ThemedText>
                    </View>

                </Card.Content>
            </Card>

            {/* Actions */}
            <View style={styles.actions}>
                <AppButton onPress={openMaps} style={styles.primaryButton} labelStyle={{ fontSize: 18 }}>
                    Open in Maps 📍
                </AppButton>
                <AppButton mode="text" onPress={() => router.replace('/')} style={styles.secondaryButton}>
                    Maybe Later
                </AppButton>
            </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  scrollContent: {
    padding: 24,
    paddingTop: 60,
    alignItems: 'center',
    paddingBottom: 40,
  },
  header: {
    marginBottom: 32,
    alignItems: 'center',
  },
  emoji: {
    fontSize: 48,
    marginBottom: 8,
    lineHeight: 56,
  },
  matchTitle: {
    fontFamily: Fonts.serif, // Outfit
    fontSize: 42,
    fontWeight: 'bold',
    color: Colors.light.tint,
    marginBottom: 8,
    textAlign: 'center',
    lineHeight: 52,
  },
  subtitle: {
    fontFamily: Fonts.sans,
    fontSize: 18,
    color: Colors.light.text,
    opacity: 0.7,
    textAlign: 'center',
  },
  card: {
    width: '100%',
    borderRadius: 32,
    elevation: 8,
    backgroundColor: Colors.light.surface,
    marginBottom: 24,
    shadowColor: Colors.light.tint,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  cardContent: {
    padding: 24,
  },
  sectionContainer: {
    alignItems: 'center',
    marginVertical: 8,
  },
  sectionLabel: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: Colors.light.text,
    opacity: 0.5,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  placeName: {
    fontFamily: Fonts.serif, // Outfit
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.light.text,
    textAlign: 'center',
    marginBottom: 4,
  },
  address: {
    fontFamily: Fonts.sans,
    fontSize: 15,
    color: Colors.light.text,
    opacity: 0.7,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.light.text,
    opacity: 0.1,
    marginVertical: 20,
    width: '80%',
    alignSelf: 'center',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  chip: {
    backgroundColor: Colors.light.elevation, // Soft pink bg
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  chipText: {
    fontFamily: Fonts.sans,
    fontWeight: '600',
    color: Colors.light.tint,
    fontSize: 14,
  },
  icebreakerContainer: {
    backgroundColor: Colors.light.background,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  icebreakerLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: Colors.light.tint,
    marginBottom: 6,
    letterSpacing: 1,
  },
  icebreakerText: {
    fontFamily: Fonts.serif,
    fontStyle: 'italic',
    fontSize: 18,
    color: Colors.light.text,
    textAlign: 'center',
    lineHeight: 24,
  },
  actions: {
    width: '100%',
    gap: 12,
  },
  primaryButton: {
    width: '100%',
    height: 56,
  },
  secondaryButton: {
    width: '100%',
  },
  distanceContainer: {
    backgroundColor: Colors.light.elevation,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginTop: 12,
    alignItems: 'center',
  },
  distanceLabel: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.tint,
    marginBottom: 4,
  },
  distanceTime: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    color: Colors.light.text,
    opacity: 0.7,
  },
});
