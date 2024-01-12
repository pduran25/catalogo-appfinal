// ActualizacionBolita.js

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ActualizacionBolita = ({ actualizada }) => {
  const bolitaColor = (actualizada == 0) ? 'green' : (actualizada == 1) ? 'blue' : 'orange';
  const estadoTexto = (actualizada == 0) ? 'Actualizada' : (actualizada == 1) ? 'Actualizando' : 'No Actualizada';

  return (
    <View style={styles.container}>
      <View style={[styles.bolita, { backgroundColor: bolitaColor }]} />
      <Text style={styles.texto}>{estadoTexto}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    top: 10,
    right: 10,
  },
  bolita: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 5,
  },
  texto: {
    color: 'black',  // Color del texto
  },
});

export default ActualizacionBolita;

