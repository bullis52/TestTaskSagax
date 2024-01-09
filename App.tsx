// Importing necessary modules and components from React Native
import React, {useCallback, useRef, useState} from 'react';
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

// Importing image picker functionalities
import {
  ImageLibraryOptions,
  launchImageLibrary,
} from 'react-native-image-picker';
import {ImagePickerResponse} from 'react-native-image-picker/src/types';

// Importing Picker component from react-native
import {Picker} from '@react-native-picker/picker';

// Importing SVGIcon component
import {SVGIcon} from './src/components/svg';

// Importing Animated module from react-native
import {Animated} from 'react-native';

// Array of font options
const fontOptions = [
  {label: 'Arial', value: 'Arial'},
  {label: 'Helvetica', value: 'Helvetica'},
  {label: 'Times New Roman', value: 'Times New Roman'},
  {label: 'Courier New', value: 'Courier New'},
  {label: 'Georgia', value: 'Georgia'},
];

// Initial values for font size, icon size, and selected font
const initialFontSize = 16;
const initialIconSize = 100;
const initialFont = fontOptions[0].value;

// App functional component
const App = () => {
  // State variables using React Hooks
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [pickerResponse, setPickerResponse] = useState<ImagePickerResponse>();
  const [iconSize, setIconSize] = useState(100);
  const [selectedFont, setSelectedFont] = useState(fontOptions[0].value);

  // Creating a reference for scale animation
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Function to start scale animation
  const startScaleAnimation = (toValue: number) => {
    Animated.timing(scaleAnim, {
      toValue: toValue,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  // Function to toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Functions to handle font and icon size changes
  const increaseFontSize = () => {
    setFontSize(fontSize + 1);
  };

  const decreaseFontSize = () => {
    setFontSize(fontSize - 1);
  };

  const increaseIconSize = () => {
    setIconSize(iconSize + 10);
  };

  const decreaseIconSize = () => {
    setIconSize(iconSize - 10);
  };

  // Function to handle image library press
  const onImageLibraryPress = useCallback(() => {
    try {
      const options: ImageLibraryOptions = {
        mediaType: 'photo',
        selectionLimit: 1,
      };

      // Launch image library and set picker response
      launchImageLibrary(options, setPickerResponse);
    } catch (e) {
      return;
    }
  }, []);

  // Function to change selected font
  const changeFont = (font: string) => {
    setSelectedFont(font);
  };

  // Function to reset all settings
  const resetSettings = () => {
    // Start scale animation to reset settings
    startScaleAnimation(0);

    setTimeout(() => {
      // Resetting all state variables
      setIsDarkMode(false);
      setFontSize(initialFontSize);
      setPickerResponse(undefined);
      setIconSize(initialIconSize);
      setSelectedFont(initialFont);

      // Resuming scale animation
      startScaleAnimation(1);
    }, 500);
  };

  // JSX structure representing the app UI
  return (
    <Animated.View
      style={[
        styles.container,
        isDarkMode ? styles.darkModeContainer : styles.lightModeContainer,
        {
          transform: [{scale: scaleAnim}],
        },
      ]}>
      {pickerResponse?.assets && pickerResponse.assets.length > 0 && (
        // Display selected image as background if available
        <Image
          source={{uri: pickerResponse.assets[0].uri}}
          style={StyleSheet.absoluteFillObject}
          resizeMode="cover"
        />
      )}
      <SafeAreaView style={styles.safeArea}>
        {/* Button to reset settings */}
        <TouchableOpacity onPress={resetSettings}>
          <Text
            style={[
              styles.resetButton,
              {color: isDarkMode ? '#FFFFFF' : '#000000'},
            ]}>
            Скинути налаштування
          </Text>
        </TouchableOpacity>
        {/* Button to toggle dark mode */}
        <TouchableOpacity onPress={toggleDarkMode}>
          <Text
            style={[
              styles.toggleButton,
              {color: isDarkMode ? '#FFFFFF' : '#000000'},
            ]}>
            {isDarkMode ? 'Світла Тема' : 'Темна Тема'}
          </Text>
        </TouchableOpacity>

        <View style={styles.content}>
          {/* Component displaying SVG icon */}
          <SVGIcon iconSize={iconSize} isDarkMode={isDarkMode} />

          {/* Buttons to adjust icon size */}
          <TouchableOpacity onPress={increaseIconSize}>
            <Text style={isDarkMode ? styles.darkText : styles.lightText}>
              Збільшити іконку
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={decreaseIconSize}>
            <Text style={isDarkMode ? styles.darkText : styles.lightText}>
              Зменшити іконку
            </Text>
          </TouchableOpacity>

          {/* Button to choose an image from the library */}
          <TouchableOpacity onPress={onImageLibraryPress}>
            <Text
              style={[
                isDarkMode ? styles.darkText : styles.lightText,
                {fontSize: 20},
              ]}>
              Вибрати фотку для фону
            </Text>
          </TouchableOpacity>

          {/* Text element with customizable font */}
          <Text
            style={[
              styles.text,
              {
                color: isDarkMode ? '#FFFFFF' : '#000000',
                fontSize: fontSize,
                fontFamily: selectedFont,
              },
            ]}>
            Текст в якому можна змінити шрифт
          </Text>

          {/* Buttons to adjust font size */}
          <TouchableOpacity onPress={increaseFontSize}>
            <Text style={isDarkMode ? styles.darkText : styles.lightText}>
              Збільшити
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={decreaseFontSize}>
            <Text style={isDarkMode ? styles.darkText : styles.lightText}>
              Зменшити
            </Text>
          </TouchableOpacity>

          {/* Displaying current font size */}
          <Text style={isDarkMode ? styles.darkText : styles.lightText}>
            Поточний розмір шрифту: {fontSize}
          </Text>

          {/* Picker to select font */}
          <Picker
            selectedValue={selectedFont}
            style={{height: 50, width: 150}}
            onValueChange={itemValue => changeFont(itemValue)}>
            {fontOptions.map((font, index) => (
              <Picker.Item
                style={isDarkMode ? styles.darkText : styles.lightText}
                color={isDarkMode ? '#FFFFFF' : '#000000'}
                label={font.label}
                value={font.value}
                key={index.toString()}
              />
            ))}
          </Picker>
        </View>
      </SafeAreaView>
    </Animated.View>
  );
};

// Styles for various elements in the app
const styles = StyleSheet.create({
  // Container styles
  container: {
    flex: 1,
  },
  darkModeContainer: {
    backgroundColor: '#121218',
  },
  lightModeContainer: {
    backgroundColor: '#FFFFFF',
  },
  safeArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Button and text styles
  toggleButton: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  text: {
    marginVertical: 20,
  },
  lightText: {
    color: '#000000',
  },
  darkText: {
    color: '#FFFFFF',
  },
  resetButton: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

// Exporting the App component as the default export
export default App;
