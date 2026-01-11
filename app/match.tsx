import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Linking, Animated, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Text, Card, Chip, Button, IconButton } from 'react-native-paper';
import { Sparkles, MapPin, Users } from 'lucide-react-native';
import { Colors } from '../constants/theme';

export default function MatchScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  
  let matchInfo = null;
  if (params.matchInfo) {
    try {
      const matchInfoStr = Array.isArray(params.matchInfo) ? params.matchInfo[0] : params.matchInfo;
      matchInfo = JSON.parse(matchInfoStr);
    } catch (e) {
      matchInfo = null;
    }
  }

  useEffect(() => {
    if (matchInfo) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [matchInfo]);

  const cuteQuestions = [
    "Spot a cozy cafe nearby — want to grab a drink?",
    "Who's your go-to conversation starter?",
    "Try an icebreaker: What's one thing you love doing?",
    "A quick challenge: Find something blue nearby!",
  ];
  const [questionIdx] = useState(() => Math.floor(Math.random() * cuteQuestions.length));

  if (!matchInfo) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyState}>
          <Users size={64} color="#999" />
          <Text style={styles.emptyText}>No match data found</Text>
          <Button mode="contained" onPress={() => router.back()} style={styles.backButton}>
            Go Back
          </Button>
        </View>
      </View>
    );
  }

  const openGoogleMaps = (place) => {
    if (!place) return;
    let url = '';
    if (place.place_id) {
      url = `https://www.google.com/maps/search/?api=1&query=Google&query_place_id=${place.place_id}`;
    } else if (place.location && place.location.lat && place.location.lng) {
      url = `https://www.google.com/maps/search/?api=1&query=${place.location.lat},${place.location.lng}`;
    }
    if (url) Linking.openURL(url);
  };

  return (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
      <Animated.View 
        style={[
          styles.container,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Sparkles size={40} color="#FF6B6B" strokeWidth={2.5} />
          </View>
          <Text style={styles.headerTitle}>It's a Match! 🎉</Text>
          <Text style={styles.headerSubtitle}>
            Someone nearby shares your interests
          </Text>
          <Text style={styles.cuteQuestion}>{cuteQuestions[questionIdx]}</Text>
        </View>

        {/* Shared Interests Card */}
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.cardHeader}>
              <Users size={20} color="#FF6B6B" />
              <Text style={styles.cardTitle}>Shared Interests</Text>
            </View>
            <View style={styles.chipContainer}>
              {Array.isArray(matchInfo.mutual_interest) && matchInfo.mutual_interest.map((interest, index) => (
                <Chip 
                  key={interest} 
                  style={[
                    styles.chip,
                    { backgroundColor: index % 2 === 0 ? '#FFF5F7' : '#F0FFF4' }
                  ]}
                  textStyle={styles.chipText}
                >
                  {interest}
                </Chip>
              ))}
            </View>
          </Card.Content>
        </Card>

        {/* Meeting Place Card */}
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.cardHeader}>
              <MapPin size={20} color="#FF6B6B" />
              <Text style={styles.cardTitle}>Meeting Suggestion</Text>
            </View>
            
            <View style={styles.meetingPlaceContainer}>
              <Text style={styles.meetingPlaceLabel}>Location Type</Text>
              <Text style={styles.meetingPlaceValue}>{matchInfo.mutual_meeting_place}</Text>
            </View>

            {matchInfo.nearest_place && (
              <View style={styles.venueContainer}>
                <View style={styles.venueDivider} />
                <Text style={styles.venueLabel}>Suggested Venue</Text>
                <Text style={styles.venueName}>{matchInfo.nearest_place.name}</Text>
                {matchInfo.nearest_place.address && (
                  <Text style={styles.venueAddress}>{matchInfo.nearest_place.address}</Text>
                )}
                <Button
                  icon="map-marker"
                  mode="contained"
                  onPress={() => openGoogleMaps(matchInfo.nearest_place)}
                  style={styles.mapButton}
                  buttonColor="#FF6B6B"
                  contentStyle={styles.mapButtonContent}
                >
                  Open in Google Maps
                </Button>
              </View>
            )}
          </Card.Content>
        </Card>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <Button 
            mode="outlined" 
            onPress={() => router.replace('/')}
            style={styles.homeButton}
            textColor="#666"
            contentStyle={styles.buttonContent}
          >
            Back to Home
          </Button>
        </View>
      </Animated.View>
    </ScrollView>
  );
}

// Helper function to get alternating chip colors
function getChipColor(index) {
  const colors = ['#FFE5E5', '#E5F5FF', '#F0E5FF', '#E5FFE5', '#FFF5E5'];
  return colors[index % colors.length];
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  scrollContent: {
    flexGrow: 1,
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  container: {
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFF0F4',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: Colors.light.icon,
    textAlign: 'center',
  },
  cuteQuestion: {
    marginTop: 8,
    fontSize: 15,
    color: '#FF6B6B',
    fontStyle: 'italic',
    textAlign: 'center',
    maxWidth: 420,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
    marginLeft: 8,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    marginRight: 0,
    marginBottom: 0,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.light.text,
  },
  meetingPlaceContainer: {
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  meetingPlaceLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.light.icon,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  meetingPlaceValue: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
  },
  venueContainer: {
    marginTop: 20,
  },
  venueDivider: {
    height: 1,
    backgroundColor: '#E8E8E8',
    marginBottom: 16,
  },
  venueLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.light.icon,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  venueName: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 6,
  },
  venueAddress: {
    fontSize: 15,
    color: Colors.light.icon,
    lineHeight: 22,
    marginBottom: 16,
  },
  mapButton: {
    borderRadius: 12,
  },
  mapButtonContent: {
    paddingVertical: 6,
  },
  actionButtons: {
    marginTop: 16,
    gap: 12,
  },
  homeButton: {
    borderRadius: 12,
    borderColor: '#E0E0E0',
    borderWidth: 1.5,
  },
  buttonContent: {
    paddingVertical: 6,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    color: Colors.light.icon,
    marginTop: 16,
    marginBottom: 24,
  },
  backButton: {
    borderRadius: 12,
  },
});