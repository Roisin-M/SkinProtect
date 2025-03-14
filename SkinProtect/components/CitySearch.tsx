import React, { useState } from 'react';
import { View, TextInput, Button, FlatList, Text, TouchableOpacity, ScrollView, StyleSheet, Pressable } from 'react-native';
import { searchCity, PlaceResult } from '../services/GooglePlacesService';
import { Colors } from '@/constants/colors';


type CitySearchProps = {
    onSelectCity: (item: PlaceResult) => void;
  };

export default function CitySearch({ onSelectCity }:CitySearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<PlaceResult[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const data = await searchCity(query.trim());
      setResults(data);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (item: PlaceResult) => {
    // pass selection up to parent
    onSelectCity(item); // item has displayName, lat, lng
    setResults([]);
  };

  //const displayedResults = results.slice(0,3);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter a city name"
        value={query}
        onChangeText={setQuery}
      />
      <Button title="Search" onPress={handleSearch} />
      {loading && <Text style={styles.loadingText}>Loading...</Text>}
      <ScrollView style={styles.scrollContainer}>
        {results.map((item, index) => (
          <TouchableOpacity 
            key={index} 
            style={styles.resultItem} 
            onPress={() => handleSelect(item)}
          >
            <Text style={styles.resultName}>{item.displayName}</Text>
            {item.formattedAddress ? (
              <Text style={styles.resultAddress}>{item.formattedAddress}</Text>
            ) : null}
            <Text style={styles.resultCoords}>
              Lat: {item.latitude}, Lon: {item.longitude}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  input: {
    backgroundColor: Colors.textLight,
    marginVertical: 8,
    padding: 10,
    borderRadius: 4,
    borderColor: Colors.paletteBlue,
    borderWidth: 2,
  },
  loadingText: {
    marginTop: 8,
    textAlign: 'center',
  },
  scrollContainer: {
    marginTop: 16,
    maxHeight: 300, 
  },
  resultItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: Colors.textDark,
  },
  resultName: {
    fontSize: 16,
    fontWeight: '600',
  },
  resultAddress: {
    fontSize: 14,
    color: Colors.softText,
  },
  resultCoords: {
    fontSize: 12,
    color: Colors.softText,
  },
});