import React, {useState, useEffect} from 'react'
import { colors, Icon } from "react-native-elements";
import { Image, FlatList, Text, View, StyleSheet, ActivityIndicator, TouchableOpacity, Alert, Pressable} from 'react-native';
import axios from 'axios'
import {locationsRef} from "../utils/firebase"
import {useNavigation} from "@react-navigation/native"
import * as SQLite from 'expo-sqlite';
import Modal from "react-native-modal";


const STORAGE_KEY = '@save_productos'
const database_name = 'CotzulBD4.db';
const database_version = '1.0';
const database_displayname = 'CotzulBD';
const database_size = 200000;


export default function DataCatalogo(props) {
    const {texto} = props;
    const [imageFirebase, setImage] = useState("")
    const [isLoading, setLoading] = useState(false)
    const navigation = useNavigation();

    const [posts, setPosts] = useState([])


    
    const abrirtablaCatalogo = async() => {
        getDataCata();
    }

    getDataCata = async () => {
        db = SQLite.openDatabase(
            database_name,
            database_version,
            database_displayname,
            database_size,
        ); 
   
        db.transaction((tx) => {
            tx.executeSql(
            'SELECT * FROM Catalogo WHERE ct_nomcata LIKE ?',
            [`${texto}%`],
            (tx, results) => {
                var temp = [];
                for (let i = 0; i < results.rows.length; ++i)
                temp.push(results.rows.item(i));
                setPosts(temp);
                console.log("temporal: "+temp);
            }
            );
    
        });
    };

    

    useEffect(() => {
       
        abrirtablaCatalogo();
    }, [texto]);




    return (
            
        <View>
           {posts == null ? (
                <NoFoundCatalogo />
            ) : (<View>
            <FlatList
                data = {posts}
                keyExtractor={( id , index) => index.toString()}
                renderItem={({ item }) => (<ListCatalogo catalogo={item} navigation={navigation}  getDataCata={getDataCata} /> )} 
                ListFooterComponent={() => <View style={{flex:1,justifyContent: "center",alignItems: "center"}}><Text style={styles.finalproducto}>--- Fin de busqueda ---</Text></View>}
                />
            </View>)}
        </View>
        
    
)
   
};


function NoFoundCatalogo(){
    return(<View style={{flex: 1, alignItems: 'center', }}>
    <Image
        source={require("../../assets/img/no-result-found.png")}
        resizeMode = "cover"
        style={{width: 200, height: 200}}
    />
</View>); 
}



function ListCatalogo(props){
    const {catalogo, navigation, getDataCata} = props;
    const {ct_codigo,ct_nomcata, ct_nomcliente, ct_codcliente, ct_descargado, ct_cantprod, ct_cantpromo, ct_cantliqui, ct_cantprox, ct_idcata, ct_cantcombo} = catalogo;
    const [modalVisible, setModalVisible] = useState(false);
    const [sqla, setSqla] = useState("");

    const goCatalogo = () =>{
        console.log("Detalle Catalogo");
        console.log("ct_idcata: "+ ct_idcata);
        navigation.navigate("scatalogo",{ct_codigo,ct_nomcata, ct_nomcliente, ct_codcliente, ct_idcata}); 
    }

    const goElimina = () => {
        // Mostrar el modal de confirmación

        db = SQLite.openDatabase(
            database_name,
            database_version,
            database_displayname,
            database_size,
        ); 
        setSqla("DELETE FROM Catalogo WHERE ct_codigo = ?");

        db.transaction((tx) => {
            tx.executeSql(
            sqla,
            [`${ct_codigo}`],
            (tx, results) => {
                console.log("Se elimino con exito");
                getDataCata();
                setModalVisible(!modalVisible);
                
            }, (tx, error) => {
                console.error("Error al ejecutar la transacción SQL:", error);
                // Manejar el error de alguna manera (puede mostrar un mensaje al usuario, hacer un rollback, etc.)
              }
            );
        });




       
    };

    return (<TouchableOpacity onPress={goCatalogo}>
                <View style={styles.productoCardWrapper}>
                
                    <View style={styles.productoTexto}>
                        <Text style={styles.productoReferencia}>{ct_nomcata}</Text>
                        <Text style={styles.productoCodigo}>{ct_nomcliente}</Text>
                        <Text style={styles.productoConf}>Cantidad producto: {ct_cantprod}</Text>
                        <Text style={styles.productoConf}>Cantidad promociones: {ct_cantpromo}</Text>
                        <Text style={styles.productoConf}>Cantidad liquidaciones: {ct_cantliqui}</Text>
                        <Text style={styles.productoConf}>Cantidad Combos: {ct_cantcombo}</Text>
                        
                    </View>
                    <TouchableOpacity style={styles.iconoTachoWrapper} onPress={() => setModalVisible(!modalVisible)}>
                    <Icon
                        type="material-community"
                        name="trash-can-outline"
                        size={25}
                        color="#9462c1"
                    />
                    </TouchableOpacity>
                    <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                    <Text>¿Estás seguro de que deseas eliminar este elemento?</Text>
                    <View style={styles.styleItems}>
                    <View style={{width:120 , marginHorizontal:5}}>
                    <Pressable
                        style={[styles.button, styles.buttonClose]}
                        onPress={() => setModalVisible(!modalVisible)}
                    >
                        <Text style={styles.textStyle}>Cerrar</Text>
                    </Pressable>
                    </View>
                    <View style={{width:120, marginHorizontal:5}}>
                    <Pressable
                        style={[styles.button, styles.buttonClose]}
                        onPress={goElimina}
                    >
                        <Text style={styles.textStyle}>Aceptar</Text>
                    </Pressable>
                    </View>
                </View>
                    </View>
                </View>
                </Modal>
                </View>
                </TouchableOpacity>);
}




const styles = StyleSheet.create({
    productoCardWrapper:{
        backgroundColor: '#CDCDCD',
        borderRadius:25,
        paddingTop: 10,
        paddingLeft: 10,
        paddingBottom: 0,
        marginTop:10,
        height: 120,
        flexDirection: 'row',
    }, 
    styleItems:{
        flexDirection: "row",
        marginHorizontal: 20,
        marginTop:20
    },
    button: {
        padding: 10,
        elevation: 2
      },
      buttonOpen: {
        backgroundColor: "#00a680",
        width: 320,
        
        
      },
      textStyle: {
        color: "white",
        fontWeight: 'bold',
        textAlign: "center"
      },
      buttonClose: {
        backgroundColor: "#9462c1",
        borderRadius: 20,
      },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',

    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    }, 
    productoTexto:{
        flexDirection: 'column',
        width: 250,
    },
    productoPrecio:{
        flexDirection: 'column',
        width: 100,
        height:100,
        paddingRight: 5,
    },
    textoPrecio:{
        textAlign:'right',
        paddingRight: 20,
        paddingTop:0,
        color:'#9462c1',
        fontSize: 12,
    },
    productoReferencia:{
        color:'#9462c1',
        paddingLeft: 10,
        fontSize: 15,
        fontWeight: 'bold',
        flexShrink: 1,
    },
    productoCodigo:{
        color:'#000',
        paddingTop:2,
        paddingLeft: 10,
        fontSize: 12,
    },
    iconoTachoWrapper: {
        position: 'absolute',
        top: 15,
        right: 20,
      },
    productoImage:{
        paddingTop: 0,
        paddingBottom: 10,
    },
    productoConf:{
        paddingTop:2,
        paddingLeft: 10,
        fontSize: 10,
        color: 'grey'
    },
    finalproducto:{
        color:'#9462c1',
        fontSize: 15,
        height: 150,
        marginTop: 10,
    }
});