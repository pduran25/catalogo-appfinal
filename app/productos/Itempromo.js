import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions , ImageBackground, TouchableOpacity, Alert, TextInput} from 'react-native'
import { ScrollView } from 'react-native-gesture-handler';
import Itemimg from '../../assets/img/imagenprueba.png'
import { captureRef } from 'react-native-view-shot';
import * as ImagePicker from 'expo-image-picker';

/**
* @author Pedro Durán A.
* @function  Itempromo
**/

const screenWidth = Dimensions.get("window").width;

export const Itempromo = (props) => {
  
    const imageRef = useRef(null);
    const [imageUri, setImageUri] = useState(null);
    const [texto, setTexto] = useState("$0.99");

    const handleCaptureAndDownload = async () => {
      try {
        // Capturar la imagen usando Expo Image Picker
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
  
        if (!result.cancelled) {
          // Establecer la imagen seleccionada en el estado
          setImageUri(result.uri);
        }
      } catch (error) {
        console.error('Error al capturar la imagen:', error);
        // Mostrar un mensaje de error si es necesario
        Alert.alert('Error', 'Hubo un problema al capturar la imagen.');
      }
    };

    const [backgroundImage, setBackgroundImage] = useState(require( '../../assets/img/imagenprueba.png'));

  const handleBackgroundChange = () => {
    // Cambiar la imagen de fondo aquí
    // Por ejemplo, podrías tener un arreglo de imágenes y seleccionar una al azar
    // O podrías tener una lógica específica para cambiar la imagen
    // Aquí solo estamos cambiando entre dos imágenes de ejemplo
    setBackgroundImage(backgroundImage === require( '../../assets/img/imagenprueba.png') ? require('../../assets/img/plantilla1.png') : require( '../../assets/img/imagenprueba.png'));
  };

const { container } = styles
 return(
  <ScrollView style={styles.container}>
      <TouchableOpacity onPress={handleBackgroundChange} style={styles.imgprom}>
        <ImageBackground
          source={backgroundImage}
          resizeMode="cover"
          style={styles.image}
        >
          <Text style={styles.text}>{texto}</Text>
        </ImageBackground>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleBackgroundChange}>
        <Text>Cambiar Imagen de Fondo</Text>
      </TouchableOpacity>
      <TextInput style={styles.input} 
          keyboardType='default'
          placeholder='0,0'
          onChangeText={(value)=> setTexto(value)}
          value={texto}
          />
    </ScrollView>
  )
}


const styles = StyleSheet.create({
  container: {
   flex: 1,
  },
  imgprom:{
    width: screenWidth,
    height: screenWidth,
    borderWidth: 1,
    resizeMode: 'cover'
  },
  input:{
    borderWidth:1, 
    borderColor: '#777',
    padding: 8, 
    margin: 10, 
    width:200, 
},
  image: {
    flex: 1,
    justifyContent: 'center',
  },
  text: {
    color: 'white',
    fontSize: 42,
    lineHeight: 84,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: '#000000c0',
  },
})