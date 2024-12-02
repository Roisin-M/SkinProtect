import React from 'react';
import { Picker as PickerComponent } from '@react-native-picker/picker'; // Explicit import
import { View, StyleSheet, Picker } from 'react-native';


type CustomPickerProps = {
  selectedValue: string;
  onValueChange: (itemValue: string) => void;
  options: string[];
};

const CustomPicker = ({ selectedValue, onValueChange, options }: CustomPickerProps) => {
  return (
    <View style={styles.container}>
      <Picker 
      selectedValue={selectedValue}
        onValueChange={onValueChange}
        style={styles.picker}
      >
        {options.map((option, index) => (
          <Picker.Item key={index} label={option} value={option} />
        ))}
      </Picker>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 10,
  },
  picker: {
    height: 50,
    width: '100%',
  },
});

export default CustomPicker;

