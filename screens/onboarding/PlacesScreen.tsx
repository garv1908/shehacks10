import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Checkbox, Text } from 'react-native-paper';

const places = ['Cafe', 'Library', 'Park', 'Bookstore'];

export default function PlacesScreen() {
  return (
    <View style={styles.container}>
      <Text variant="headlineMedium">Select your preferred meeting places</Text>
      <View style={styles.list}>
        {places.map((place) => (
          <View key={place} style={styles.item}>
            <Checkbox.Android status="unchecked" />
            <Text>{place}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  list: { marginTop: 16 },
  item: { flexDirection: 'row', alignItems: 'center', marginVertical: 6 },
});
