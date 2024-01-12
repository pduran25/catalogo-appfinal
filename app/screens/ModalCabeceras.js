import React, { Component } from "react";
import { Alert, Modal, StyleSheet, Text, Pressable, View, TextInput, SafeAreaView } from "react-native";
import { CheckBox } from "react-native-elements";
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as SQLite from 'expo-sqlite';
import { FlatList } from 'react-native';

const key_check1 = '@check1'
const key_check2 = '@check2'
const key_check3 = '@check3'
const key_check4 = '@check4'
const key_check5 = '@check5'
const key_check6 = '@check6'
const key_check7 = '@check7'

const database_name = 'CotzulBD6.db';
const database_version = '1.0';
const database_displayname = 'CotzulBD';
const database_size = 200000;
const cabeceras = {};




class ModalCabeceras extends Component {

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
        check6: false,
        check7: false,
        cabe: [],
        cant: 0

      };

 }

 
  state = {
    modalVisible: false,
    texto: ''
  };

  componentDidMount() {
    this.setState({ modalVisible: false });
   
  }

  grabarCabeceraOff = async () => {
    const { idcatalogo, tipo, modificarCabecera } = this.props;
    const { cabe, cant } = this.state;

    db = SQLite.openDatabase(
      database_name,
      database_version,
      database_displayname,
      database_size,
    );


    db.transaction((txn) => {
        txn.executeSql("DELETE FROM ca_cabxcat WHERE cx_tipo = ? AND cx_idcatalogo = ?", [
          tipo,
          idcatalogo
      ])

      for (let i = 0; i < cant; i++) {
        if(cabe[i+1].show==1){
          console.log("entro a : "+(i+1));
          txn.executeSql('INSERT INTO ca_cabxcat(cx_idcatalogo, cx_tipo, cx_cabecera) VALUES (?, ?, ?)', [
            idcatalogo,
            tipo,
            i+1
          ])
        }
        
      }

      modificarCabecera();


    })

    this.setState({ modalVisible: false });


  }

   cargarCabeceras = async () => {
    
    const { idcatalogo, tipo } = this.props;
    
    var total = 0;
    
    console.log("consiguiendo de base de datos");
    // Tu lógica asíncrona aquí
    db = SQLite.openDatabase(
      database_name,
      database_version,
      database_displayname,
      database_size,
    );

    db.transaction( (txn) => {
      console.log("CODIGO IDCATALOGO: " + idcatalogo);
      var codigosql = "";
      if(tipo == 1){
         codigosql =  "SELECT cd_codigo as codigo, cd_cabecera as cabecera, CASE WHEN EXISTS (SELECT 1 FROM ca_cabxcat WHERE cx_cabecera = Catcabprod.cd_codigo AND cx_idcatalogo = "+idcatalogo+") THEN 1 ELSE 0 END AS show FROM Catcabprod";
      }else if(tipo == 2){
         codigosql =  "SELECT cm_codigo as codigo, cm_cabecera as cabecera, CASE WHEN EXISTS (SELECT 1 FROM ca_cabxcat WHERE cx_cabecera = Catcaprom.cm_codigo AND cx_idcatalogo = "+idcatalogo+") THEN 1 ELSE 0 END AS show FROM Catcabprom";
      }else if(tipo == 3){
        codigosql =  "SELECT cl_codigo as codigo, cl_cabecera as cabecera, CASE WHEN EXISTS (SELECT 1 FROM ca_cabxcat WHERE cx_cabecera = Catcabliqui.cl_codigo AND cx_idcatalogo = "+idcatalogo+") THEN 1 ELSE 0 END AS show FROM Catcabliqui";
     }
        console.log(codigosql);
      txn.executeSql(
        codigosql, [idcatalogo],
        (txn, results) => {
          var len = results.rows.length;
          total = len;

          console.log("valor de len: "+len);
          for (let i = 0; i < len; i++) {
            let row = results.rows.item(i);
            console.log(`CODIGO CAB : ${row.codigo}`);
            console.log(`CABECERA : ${row.cabecera}`);
            console.log(`SHOW : ${row.show}`);

            cabeceras[row.codigo] = {
              show: row.show === 1,
              title: row.cabecera,
            };
          }
          this.setState({ cabe: cabeceras });
          this.setState({ cant: total});
        },
        (tx, error) => {
          // Manejar errores en la ejecución de la sentencia SQL
          console.error('Error en la sentencia SQL:', error);
        })
       
      })




  };

  setCheck = (codigo, visible) => {
    if(codigo == 1){
      this.setCheck1(visible);
    }
    else if(codigo == 2){
      this.setCheck2(visible);
    }
    else if(codigo == 3){
      this.setCheck3(visible);
    }
    else if(codigo == 4){
      this.setCheck4(visible);
    }
    else if(codigo == 5){
      this.setCheck5(visible);
    }
    else if(codigo == 6){
      this.setCheck6(visible);
    }
    else if(codigo == 7){
      this.setCheck7(visible);
    }

    cabeceras[codigo].show = visible?1:0;
    
    this.setState({ cabe: cabeceras });
  }

  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
    this.cargarCabeceras();
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

  setCheck7 = (visible) => {
    this.setState({ check7: visible });
  }



  

   setChecks = async () => {
    try {
        console.log("entro a los checks");
        
        
    } catch(e) {
    console.log(e)
    }
  }

   


  render() {
    const { modalVisible, cabe } = this.state;
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
            
              <Text style={styles.modalText}>Seleccione Cabecera</Text>
              <FlatList
              data={Object.keys(cabe)}
              keyExtractor={(codigo) => codigo}
              renderItem={({ item: codigo }) => {
                const { show, title } = cabe[codigo];
                return (
                  <CheckBox
                    key={codigo}
                    checked={show}
                    title={title}
                    onPress={() => this.setCheck(codigo,!show)}
                  />
                );
              }}
            />
              

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
                        onPress={this.grabarCabeceraOff}
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
          <Text style={styles.textStyle1}>Edición Cabecera</Text>
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
    width: '98%',
    marginLeft: '1%',
    marginRight: '1%',
    borderRadius: 3,
    
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

export default ModalCabeceras;