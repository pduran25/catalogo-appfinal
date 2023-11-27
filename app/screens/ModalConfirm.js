import React, { Component } from "react";
import { Alert, Modal, StyleSheet, Text, Pressable, View, TextInput, SafeAreaView } from "react-native";
import { CheckBox } from "react-native-elements";
import AsyncStorage from '@react-native-async-storage/async-storage'

const key_check1 = '@check1'
const key_check2 = '@check2'
const key_check3 = '@check3'
const key_check4 = '@check4'
const key_check5 = '@check5'
const key_check6 = '@check6'

class ModalConfirm extends Component {

  constructor(props) {
    super();
    this.state = {
        data: [],
        isLoading: true,
        check1: false,
        check2: false,
        check3: false,
        check4: false,
        check5: false,
        check6: false
      };

 }

 
  state = {
    modalVisible: false,
    texto: ''
  };

  componentDidMount() {
    this.setState({ modalVisible: false });
  }

  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  }

  setCheck1 = (visible) => {
    console.log("se checo: "+visible);
    this.setState({ check1: visible });
  }

  setCheck2 = (visible) => {
    this.setState({ check2: visible });
  }

  setCheck3 = (visible) => {
    this.setState({ check3: visible });
  }

  setCheck4 = (visible) => {
    this.setState({ check4: visible });
  }

  setCheck5 = (visible) => {
    this.setState({ check5: visible });
  }

  setCheck6 = (visible) => {
    this.setState({ check6: visible });
  }

   setChecks = async () => {
    try {
        console.log("entro a los checks");
        if(this.state.check1 || this.state.check2 || this.state.check3 || this.state.check4 || this.state.check5 || this.state.check6){
            console.log("entro a los checks");
            await AsyncStorage.setItem(key_check1, JSON.stringify(this.state.check1))
            await AsyncStorage.setItem(key_check2, JSON.stringify(this.state.check2))
            await AsyncStorage.setItem(key_check3, JSON.stringify(this.state.check3))
            await AsyncStorage.setItem(key_check4, JSON.stringify(this.state.check4))
            await AsyncStorage.setItem(key_check5, JSON.stringify(this.state.check5))
            await AsyncStorage.setItem(key_check6, JSON.stringify(this.state.check6))
            this.props.openModal();
        }else{
            this.setState({ modalVisible: false });
        }
        
    } catch(e) {
    console.log(e)
    }
  }

   getChecksvals = async () => {
    try {
      this.setCheck1(await AsyncStorage.getItem(key_check1))
      this.setCheck2(await AsyncStorage.getItem(key_check2))
      this.setCheck3(await AsyncStorage.getItem(key_check3))
      this.setCheck4(await AsyncStorage.getItem(key_check4))
      this.setCheck5(await AsyncStorage.getItem(key_check5))
      this.setCheck6(await AsyncStorage.getItem(key_check6))
    } catch(e) {
       console.log(e)
    }
}


  render() {
    const { modalVisible, texto, check1, check2, check3, check4, check5, check6 } = this.state;
    const {openModal} = this.props;

    
        return (
      <View style={styles.centeredView1}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            this.setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
            
              <Text style={styles.modalText}>Seleccionar para sincronizar</Text>
            

          <CheckBox checked={check1} title="Sincronizar Productos" onPress={() => this.setCheck1(!check1)} />  
          <CheckBox checked={check2} title="Sincronizar Promociones" onPress={() => this.setCheck2(!check2)} />
          <CheckBox checked={check3} title="Sincronizar Liquidaciones" onPress={() => this.setCheck3(!check3)} />
          <CheckBox checked={check4} title="Sincronizar X Llegar" onPress={() => this.setCheck4(!check4)} />
          <CheckBox checked={check5} title="Sincronizar Combos" onPress={() => this.setCheck5(!check5)} />
          <CheckBox checked={check6} title="Sincronizar Clientes" onPress={() => this.setCheck6(!check6)} />
              

              <View style={styles.styleItems}>
                    <View style={{width:120 , marginHorizontal:5}}>
                    <Pressable
                        style={[styles.button, styles.buttonClose]}
                        onPress={() => this.setModalVisible(!modalVisible)}
                    >
                        <Text style={styles.textStyle}>Cerrar</Text>
                    </Pressable>
                    </View>
                    <View style={{width:120, marginHorizontal:5}}>
                    <Pressable
                        style={[styles.button, styles.buttonClose]}
                        onPress={this.setChecks}
                    >
                        <Text style={styles.textStyle}>Aceptar</Text>
                    </Pressable>
                    </View>
                </View>
            </View>
          </View>
        </Modal>
        <Pressable
          style={[styles.button, styles.buttonOpen]}
          onPress={() => this.setModalVisible(true)}
        >
          <Text style={styles.textStyle1}>Sincronizar Datos</Text>
        </Pressable>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  input: {
    margin: 12,
    borderWidth: 1,
    width:300,
    height:100,
  },
  centeredView1: {
    marginTop: 22
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "left",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  button: {
    padding: 10,
    elevation: 2
  },
  buttonOpen: {
    backgroundColor: "#00a680",
    width: 320,
    
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: 'bold',
    textAlign: "center"
  },
  textStyle1: {
    color: "white",
    fontSize: 18,
    textAlign: "center"
  },
  modalText:{
    fontWeight: 'bold',
    textAlign: 'center',
    paddingHorizontal: 5,
    paddingVertical:10,
    fontSize: 20,
  },
  modelText2:{
    textAlign: 'center',
    paddingHorizontal: 5,
    paddingVertical:5,
    fontSize: 15,
  },
  modelText3:{
    fontWeight: 'bold',
    textAlign: 'center',
    paddingHorizontal: 5,
    paddingBottom:10,
    fontSize: 15,
  },
  styleItems:{
    flexDirection: "row",
    marginHorizontal: 20,
    marginTop:20
},
});

export default ModalConfirm;