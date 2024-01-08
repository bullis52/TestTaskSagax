import React, {useCallback, useRef, useState} from 'react';
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  ImageLibraryOptions,
  launchImageLibrary,
} from 'react-native-image-picker';
import {ImagePickerResponse} from 'react-native-image-picker/src/types';
import {Picker} from '@react-native-picker/picker';
import {SVGIcon} from './src/components/svg';
import {Animated} from 'react-native';

const fontOptions = [
  {label: 'Arial', value: 'Arial'},
  {label: 'Helvetica', value: 'Helvetica'},
  {label: 'Times New Roman', value: 'Times New Roman'},
  {label: 'Courier New', value: 'Courier New'},
  {label: 'Georgia', value: 'Georgia'},
];

const initialFontSize = 16;
const initialIconSize = 100;
const initialFont = fontOptions[0].value;

const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [pickerResponse, setPickerResponse] = useState<ImagePickerResponse>();
  const [iconSize, setIconSize] = useState(100);
  const [selectedFont, setSelectedFont] = useState(fontOptions[0].value);

  const scaleAnim = useRef(new Animated.Value(1)).current;

  const startScaleAnimation = (toValue: number) => {
    Animated.timing(scaleAnim, {
      toValue: toValue,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const increaseFontSize = () => {
    setFontSize(fontSize + 1);
  };

  const increaseIconSize = () => {
    setIconSize(iconSize + 10);
  };

  const decreaseIconSize = () => {
    setIconSize(iconSize - 10);
  };

  const decreaseFontSize = () => {
    setFontSize(fontSize - 1);
  };

  const onImageLibraryPress = useCallback(() => {
    try {
      const options: ImageLibraryOptions = {
        mediaType: 'photo',
        selectionLimit: 1,
      };

      launchImageLibrary(options, setPickerResponse);
    } catch (e) {
      return;
    }
  }, []);

  const changeFont = (font: string) => {
    setSelectedFont(font);
  };

  const resetSettings = () => {
    startScaleAnimation(0);
    setTimeout(() => {
      setIsDarkMode(false);
      setFontSize(initialFontSize);
      setPickerResponse(undefined);
      setIconSize(initialIconSize);
      setSelectedFont(initialFont);
      startScaleAnimation(1);
    }, 500);
  };

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
        <Image
          source={{uri: pickerResponse.assets[0].uri}}
          style={StyleSheet.absoluteFillObject}
          resizeMode="cover"
        />
      )}
      <SafeAreaView style={styles.safeArea}>
        <TouchableOpacity onPress={resetSettings}>
          <Text
            style={[
              styles.resetButton,
              {color: isDarkMode ? '#FFFFFF' : '#000000'},
            ]}>
            Скинути налаштування
          </Text>
        </TouchableOpacity>
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
          <SVGIcon iconSize={iconSize} isDarkMode={isDarkMode} />
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
          <TouchableOpacity onPress={onImageLibraryPress}>
            <Text
              style={[
                isDarkMode ? styles.darkText : styles.lightText,
                {fontSize: 20},
              ]}>
              Вибрати фотку для фону
            </Text>
          </TouchableOpacity>
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

          <Text style={isDarkMode ? styles.darkText : styles.lightText}>
            Поточний розмір шрифту: {fontSize}
          </Text>
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

const styles = StyleSheet.create({
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

export default App;
