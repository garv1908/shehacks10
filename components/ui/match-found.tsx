import React from 'react';
import { View, StyleSheet, Linking } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { AppButton } from '@/components/ui/app-button';

interface MatchData {
  matched_user: {
    id: string;
    interests: string[];
    meeting_places: string[];
  };
  mutual_interest: string[];
  mutual_meeting_place: string;
  nearest_place: {
    address: string;
    location: { lat: number; lng: number };
    name: string;
    place_id: string;
  };
}

export function MatchFound({ data, onClose }: Readonly<{ data: MatchData; onClose: () => void }>) {
  const { matched_user, mutual_interest, nearest_place } = data;
  const openMaps = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${nearest_place.location.lat},${nearest_place.location.lng}`;
    Linking.openURL(url);
  };
  return (
    <View style={styles.container}>
      <ThemedText type="title">🎉 It's a Match!</ThemedText>
      <ThemedText style={styles.section} type="subtitle">Meet at: {nearest_place.name}</ThemedText>
      <ThemedText style={styles.section}>Address: {nearest_place.address}</ThemedText>
      <ThemedText style={styles.section}>Mutual Interests:</ThemedText>
      <ThemedText style={styles.chip}>{mutual_interest.join(', ')}</ThemedText>
      <ThemedText style={styles.section}>Mutual Meeting Places:</ThemedText>
      <ThemedText style={styles.chip}>{matched_user.meeting_places.join(', ')}</ThemedText>
      <ThemedText style={styles.section}>
        {`Ask them: "What's your favorite thing about ${mutual_interest[0]}?"`}
      </ThemedText>
      <AppButton onPress={openMaps}>Open in Google Maps</AppButton>
      <AppButton mode="outlined" onPress={onClose} style={{ marginTop: 8 }}>Close</AppButton>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    margin: 24,
    elevation: 4,
  },
  section: {
    marginTop: 12,
    textAlign: 'center',
  },
  chip: {
    marginTop: 4,
    marginBottom: 8,
    fontWeight: '600',
    fontSize: 16,
    textAlign: 'center',
  },
});
