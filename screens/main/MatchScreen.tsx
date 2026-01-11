import React from 'react';
import { View, StyleSheet, Linking } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { AppButton } from '@/components/ui/app-button';
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

export function MatchScreen({ data, onBack }: { data: any; onBack: () => void }) {
  const { matched_user, mutual_interest, nearest_place } = data;
  const openMaps = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${nearest_place.location.lat},${nearest_place.location.lng}`;
    Linking.openURL(url);
  };
  const question = getRandomCuteQuestion();
  return (
    <View style={styles.root}>
      <Card style={styles.card}>
        <Card.Title
          title={() => (
            <ThemedText style={styles.matchTitle}>🎉 It's a Match!</ThemedText>
          )}
        />
        <Card.Content>
          <ThemedText type="subtitle" style={styles.section}>Meet at:</ThemedText>
          <ThemedText style={styles.place}>{nearest_place.name}</ThemedText>
          <ThemedText style={styles.address}>{nearest_place.address}</ThemedText>
          <ThemedText type="subtitle" style={styles.section}>Mutual Interests</ThemedText>
          <View style={styles.chipRow}>
            {mutual_interest.map((interest: string) => (
              <View key={interest} style={styles.chip}><ThemedText>{interest}</ThemedText></View>
            ))}
          </View>
          <ThemedText type="subtitle" style={styles.section}>Mutual Meeting Places</ThemedText>
          <View style={styles.chipRow}>
            {matched_user.meeting_places.map((place: string) => (
              <View key={place} style={styles.chip}><ThemedText>{place}</ThemedText></View>
            ))}
          </View>
          <ThemedText style={styles.cuteQ}>{question}</ThemedText>
        </Card.Content>
        <Card.Actions style={styles.actions}>
          <AppButton onPress={openMaps} style={styles.button}>Open in Google Maps</AppButton>
          <AppButton mode="outlined" onPress={onBack} style={styles.button}>Back</AppButton>
        </Card.Actions>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 24,
    paddingVertical: 16,
    paddingHorizontal: 8,
    elevation: 6,
  },
  matchTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#e95581',
    marginBottom: 4,
  },
  section: {
    marginTop: 12,
    marginBottom: 4,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  place: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 2,
  },
  address: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 8,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 8,
  },
  chip: {
    backgroundColor: '#f8bbd0',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    margin: 4,
  },
  cuteQ: {
    marginTop: 18,
    fontStyle: 'italic',
    fontSize: 16,
    textAlign: 'center',
    color: '#e95581',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    marginHorizontal: 8,
  },
  button: {
    flex: 1,
    marginHorizontal: 4,
  },
});
