import React, { useState, useEffect, useCallback } from 'react'
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Alert, TextInput, RefreshControl, ActivityIndicator } from "react-native";
import { colors, Button } from "react-native-elements";
import Feather from 'react-native-vector-icons/Feather';
import DataCatalogo from '../data/DataCatalogo'
import { SearchBar, ListItem, Icon, CheckBox } from "react-native-elements"
import Modal from "react-native-modal";
import * as SQLite from 'expo-sqlite';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation } from "@react-navigation/native"
import Picker from '@ouroboros/react-native-picker';
import ActualizacionBolita from './Actualizacionbolita';

export default function Catalogo() {

    const [search, setSearch] = useState("");
    const [isModalVisible, setIsModalVisible] = React.useState(false);
    const [tcliente, setTcliente] = useState(0);
    const STORAGE_KEY = '@save_data'
    const STORAGE_DB = '@login_data'
    const [dataUser, setdataUser] = useState(null);

    const database_name = 'CotzulBD6.db';
    const database_version = '1.0';
    const database_displayname = 'CotzulBD';
    const database_size = 200000;
    const [Clientes, setClientes] = useState([])
    const [nomcliente, setNomCliente] = useState("---")
    const [primera, setPrimera] = useState(0)
    const [nombreCata, onChangeText] = React.useState("");
    const [check1, setCheck1] = useState(false)
    const [check2, setCheck2] = useState(false)
    const [check3, setCheck3] = useState(false)
    const [check4, setCheck4] = useState(false)
    const [codigofin, setCodigofin] = useState(0)
    const navigation = useNavigation();
    const [btnvisible, setBtnvisible] = useState(true);
    const [textoespera, setTextoespera] = useState("Por favor espere, registrando catalogo...")
    const [estaActualizada, setEstaActualizada] = useState(0);
    const [refreshing, setRefreshing] = useState(false);

    const getDataUser = async () => {
        try {
            console.log("entro a buscar usuario")
            const jsonValue = await AsyncStorage.getItem(STORAGE_KEY)
            setdataUser(JSON.parse(jsonValue));
            console.log(dataUser.us_nombre);
            console.log(dataUser.us_codigo);
            console.log("entra de nuevo")
        } catch (e) {
            // console.log(e)
        }
    }


    useEffect(() => {
        console.log("carga usuario")
        if (dataUser == null) {
            console.log("entra por primera ves")
            getDataUser();
        }

    }, []);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
    }, []);

    const refrescar = () =>  {
        setRefreshing(true);
        
    }




    const registrarCatalogo = () => {
        var fechaact = getCurrentDate();
        db.transaction((tx) => {
            tx.executeSql(
                'INSERT INTO Catalogo( ct_codcliente, ct_nomcliente, ct_nomcata, ct_tipocli, ct_fecha, ct_codvendedor, ct_cantprod, ct_cantpromo, ct_cantliqui, ct_cantprox) VALUES(?,?,?,?,?,?,?,?,?,?)',
                [tcliente, nomcliente, nombreCata, 1, fechaact, dataUser.us_idvendedor, 0, 0, 0, 0],
                (tx, results) => {
                    console.log("ingresado con exito registrar")
                    handleModal()
                    tx.executeSql(
                        'SELECT ct_codigo as codigo, ct_idcata as idcata FROM Catalogo WHERE ct_codcliente = ? AND ct_nomcliente = ? AND ct_fecha = ?',
                        [tcliente, nomcliente, fechaact],
                        (tx, results) => {
                         // console.log("se actualizo correctemente cat: "+ idcata);
                          var len = results.rows.length;
                          console.log("cantidad de catproducto registrados : " + len);
                          for (let i = 0; i < len; i++) {
                                let row = results.rows.item(i);
                                var code = row.codigo;
                                var idcata = row.idcata;
                                console.log("idcata: "+idcata);
                                navigation.navigate("scatalogo", { ct_codigo: code, ct_nomcata: nombreCata, ct_nomcliente: nomcliente, ct_codcliente: tcliente, ct_idcata: idcata, refrescar: refrescar });
                          }
                          
                        },
                        (tx, error) => {
                          // Error en la segunda consulta
                          console.log("error registro catalogo: "+error)
                        }
                      );
                    
                }
            );
        });
    }

    const getCurrentDate = () => {

        var date = new Date().getDate();
        var month = new Date().getMonth() + 1;
        var year = new Date().getFullYear();

        //Alert.alert(date + '-' + month + '-' + year);
        // You can turn it in to your desired format
        return date + '-' + month + '-' + year;//format: dd-mm-yyyy;
    }

    function findLinkByValue(value) {
        for (const item of Clientes) {
            if (item.value === value) {
                return item.text;
            }
        }
    }

    useEffect(() => {
        setNomCliente(findLinkByValue(tcliente))
    }, [tcliente])

    const handleModal2 = () => {
        Alert.alert("Version se esta desarrollando")
    }

    const handleModal = () => {
        if (!isModalVisible)
            setBtnvisible(true)
        if (primera == 0)
            getDataCliente();
        setPrimera(1);
        setIsModalVisible(() => !isModalVisible);
        setCheck1(0)
        setCheck2(0)
        setCheck3(0)
        setCheck4(0)
        setTcliente(0)
        onChangeText("")

    }

    const crearCatalogo = () => {
        console.log("creando catalogo")
        setBtnvisible(!btnvisible)
       registrarCatalogo()
    }


    const getDataCliente = async () => {
        db = SQLite.openDatabase(
            database_name,
            database_version,
            database_displayname,
            database_size,
        );

        db.transaction((tx) => {
            tx.executeSql(
                'SELECT * FROM Cliente',
                [],
                (tx, results) => {
                    var temp = [];
                    temp.push({ value: 0, text: "SELECCIONAR CLIENTE"})
                    for (let i = 0; i < results.rows.length; ++i) {
                        temp.push({ value: results.rows.item(i).cl_codigo, text: results.rows.item(i).cl_cliente})
                    }
                    console.log("se encontro clientes");
                    setClientes(temp);
                }
            );

        });
    };

    const [isSelected, setSelection] = useState(false);


    const insertCatalogo = async () => {
        try {
            const response = await fetch(
                "https://app.cotzul.com/Catalogo/php/conect/db_insertNewCatalogo.php?idcliente=" + tcliente + "&nomcliente=" + nomcliente + "&nomcata=" + nombreCata + "&codvendedor=" + dataUser.us_idvendedor
            );
            const jsonResponse = await response.json();
            console.log(jsonResponse)
            jsonResponse?.catalogoid.map((value, index) => {
                setCodigofin(value.idcodigo)
            });

        } catch (error) {
            console.log("un error cachado");
            console.log(error);
        }
    };


    return (

        <View style={styles.container} refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
             {/*<ActualizacionBolita actualizada={estaActualizada} />*/}
            <View style={styles.titlesWrapper}>
                <Text style={styles.titlesSubtitle}>Catálogos</Text>
            </View>
            {/*Search*/}

            <View style={styles.searchWrapper}>
                <View style={styles.search}>
                    <SearchBar
                        placeholder="Buscar por catálogo"
                        onChangeText={(e) => setSearch(e)}
                        containerStyle={StyleSheet.Searchbar}
                        value={search}
                    />
                </View>
            </View>
            <Modal isVisible={isModalVisible}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                    <Icon
                        reverse
                        type="material-community"
                        name="close"
                        color="red"
                        containerStyle={styles.btnContainer}
                        onPress={handleModal}
                    />
                    <View style={styles.titlesWrapper}>
                        <Text style={styles.titlesSubtitle1}>Crear nuevo Catálogo</Text>
                    </View>


                    <Text style={styles.titlesSubtitle2}>Nombre del Catálogo:</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={onChangeText}
                        value={nombreCata}
                        keyboardType="default"

                    />

                  

            <Picker
              onChanged={setTcliente}
              options={Clientes}
              style={{borderWidth: 1, width:250, borderColor: '#a7a7a7', borderRadius: 5, marginTop:5, padding: 5, backgroundColor: "#6f4993", color: 'white', alignItems: 'center'}}
              value={tcliente}
          />

                    {(btnvisible) ?
                        <Button
                            containerStyle={styles.btnContainerLogin2}
                            buttonStyle={styles.btnLogin}
                            title='Crear catálogo'
                            onPress={crearCatalogo}
                        /> :
                        <View style={styles.viewobservacion}>
                            <Text style={styles.observacion}>{textoespera}</Text>
                            <ActivityIndicator style={styles.actInd} size="large" color="#0000ff" />
                        </View>
                    }
                </View>
                </View>

            </Modal>
            <Button
                containerStyle={styles.btnContainerLogin}
                buttonStyle={styles.btnLogin}
                title='Crear catálogo'
                onPress={handleModal}
            />
            {/*Familias*/}
            <View style={styles.scrollview}>
                <View style={styles.productoWrapper}>
                    <DataCatalogo refreshing={refreshing} setRefreshing={setRefreshing} texto={search} />

                </View>


            </View>

        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 10,
    },
    titlesWrapper: {
        marginTop: 10,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',

    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    }, 
    titlesSubtitle2: {
        // fontFamily: 
        marginTop: 10,
        fontSize: 16,
        color: colors.textDark,
    },
    titlesSubtitle: {
        // fontFamily: 
        fontSize: 20,
        color: '#9462c1',
        fontWeight: 'bold'
    },
    titlesSubtitle1: {
        // fontFamily: 
        fontSize: 20,
        color: '#9462c1',
        fontWeight: 'bold'
    },
    titlesTitle: {
        // fontFamily: 
        fontSize: 32,
        color: colors.textDark,
    },
    searchWrapper: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 10,
    },
    search: {
        flex: 1,
        marginLeft: 0,
        borderBottomColor: colors.textLight,
        borderBottomWidth: 1,


    },
    searchText: {
        fontSize: 14,
        marginBottom: 5,
        color: colors.textLight,

    },
    productoWrapper: {
        marginTop: 30,
    },
    Searchbar: {
        marginBottom: 20,
        backgroundColor: '#fff'
    },
    scrollview: {
        marginTop: 10,
        marginBottom: 50,
        zIndex: 0,
    },
    btnContainer: {
        position: "relative",
        alignItems: "center",
        shadowColor: "black",
        shadowOffset: { width: 2, height: 2 },
        zIndex: 15,
    },
    btnContainerLogin: {
        marginTop: 10,
        width: "100%"
    },
    btnContainerLogin2: {
        marginTop: 10,
        width: "90%"
    },
    btnLogin: {
        backgroundColor: "#00a680",
    },
    checkboxContainer: {
        flexDirection: "column",
        marginBottom: 20,
    },
    checkbox: {
        alignSelf: "center",
    },
    label: {
        margin: 8,
    },
    input: {
        width: "90%",
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
    },
    viewobservacion: {
        paddingVertical: 10,
    },
    observacion: {
        fontSize: 15,
        fontWeight: 'bold',
        color: 'grey'
    },


});

const pickerStyle = {
    inputIOS: {
        width: "90%",
        color: 'white',
        padding: 10,
        margin: 10,
        backgroundColor: '#9462c1',
        borderRadius: 5,

    },
    placeholder: {
        color: 'white',
    },
    inputAndroid: {
        width: "100%",
        color: 'white',
        padding: 10,
        marging: 10,
        backgroundColor: '#9462c1',
        borderRadius: 5,
    },
};