import React,{useState, useEffect, useContext} from "react";
import {View, Text, Image,StyleSheet, Alert} from "react-native";
import { Input, Icon, Button} from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage'
import LoginForm from "../navegations/LoginForm";
import * as SQLite from 'expo-sqlite';
import { AuthContext } from "../components/Context"
import NetInfo from "@react-native-community/netinfo";
import ModalConfirma from './ModalConfirm';
import ActualizacionBolita from './Actualizacionbolita';
const STORAGE_KEY = '@save_data'
import CargarDatos from "../navegations/CargarDatos";


const database_name = 'CotzulBD6.db';
const database_version = '1.0';
const database_displayname = 'CotzulBD';
const database_size = 200000;

export default function Perfil(){
    
    const [dataUser, setdataUser] = useState(defaultValueUser());
    const [user, setUser] = useState(true);
    const {signOut, signLoad, singUp} = React.useContext(AuthContext);
    const [internet, setInternet] = useState(true);
    const [estaActualizada, setEstaActualizada] = useState(0);
    const [existcheck, setExistCheck] = useState(false);

    
    const key_check1 = '@check1'
    const key_check2 = '@check2'
    const key_check3 = '@check3'
    const key_check4 = '@check4'
    const key_check5 = '@check5'
    const key_check6 = '@check6'
    const STORAGE_CHECK = '@scheck_data'

    const getData = async () => {
        try {
           const jsonValue = await AsyncStorage.getItem(STORAGE_KEY)
          console.log("carga de datauser: "+JSON.parse(jsonValue));
          setdataUser(JSON.parse(jsonValue));
          const checkingValue = await AsyncStorage.getItem(STORAGE_CHECK);
          console.log("valor de checking value: "+checkingValue);
         if (checkingValue === null || checkingValue === false) {
            // El valor es null o 'false'
            await AsyncStorage.setItem(STORAGE_CHECK, JSON.stringify(false))
            setExistCheck(false);
          } else {
            // El valor no es null ni 'false'
            await AsyncStorage.setItem(STORAGE_CHECK, JSON.stringify(true))
            setExistCheck(true);
          }

         
         
          
        } catch(e) {
           console.log(e)
        }
    }

   useEffect(()=>{
    getData();
    /*const fetchData = async () => {
        
            const check1Value = await AsyncStorage.getItem(key_check1);
            if (check1Value != null) {
               // singUp();
                //setExistCheck(true);
                await AsyncStorage.removeItem(STORAGE_CHECK)
            }
       
        
    };
    fetchData();*/

   },[]);


    

   const reviewInternet = () =>{
    NetInfo.fetch().then(state => {
            console.log("Connection type", state.type);
            console.log("Is connected?", state.isConnected);
            setInternet(state.isConnected)
    });
   }

   const onSubmit = async() =>{
        try {

            await AsyncStorage.removeItem(STORAGE_KEY)
            await AsyncStorage.removeItem(STORAGE_CHECK)
            setUser(false)
            signOut()
            console.log('Done.')
          } catch(e) {
            console.log(e)
          }
        
          
   }

   const onLoad = () =>{
        reviewInternet();
        if(internet){
            signLoad();

        }else{
            Alert.alert("Su dispositivo no cuenta con internet");
        }
   }

   openModal2  = async () =>{
    try {
    const checkingValue2 = await AsyncStorage.getItem(STORAGE_CHECK);
    if(!checkingValue2){
        await AsyncStorage.setItem(STORAGE_CHECK, JSON.stringify(true))
    }

    await AsyncStorage.setItem(key_check1, JSON.stringify(true))
    await AsyncStorage.setItem(key_check2, JSON.stringify(true))
    await AsyncStorage.setItem(key_check3, JSON.stringify(true))
    await AsyncStorage.setItem(key_check4, JSON.stringify(true))
    await AsyncStorage.setItem(key_check5, JSON.stringify(true))
    await AsyncStorage.setItem(key_check6, JSON.stringify(true))
} catch(e) {
    console.log(e)
 }
    onLoad();
    
  }

  const openModal  = () =>{
    onLoad();
  }

  




    return(<>
    
        <View style={styles.formContainer}>
        {/*<ActualizacionBolita actualizada={estaActualizada} />*/}
        <Image 
            source={require("../../assets/img/imagen_perfil.jpeg")}
            resizeMode = "contain"
            style={styles.image}
        />
        <Text style={styles.txtusuario}>{dataUser.us_nombre}</Text>
        <Text style={styles.txttipo}>{dataUser.us_nomtipoadm}</Text>
        <Button
            title="Cerrar sesión"
            containerStyle={styles.btnContainerLogin}
            buttonStyle = {styles.btnLogin}
            onPress= {onSubmit}
        />
        {(!existcheck)?(<Button
            title="Recargar Datos"
            containerStyle={styles.btnContainerLogin}
            buttonStyle = {styles.btnLogin}
            onPress= {openModal2}
    />):(<ModalConfirma openModal={openModal} ></ModalConfirma>)}
        
        {/**/}
        <Text style={styles.txtusuario}>Version App: 1.0.6</Text>
    </View>
        
        </>
    );
}

const styles = StyleSheet.create({
    formContainer:{
        flex: 1,
        alignItems: 'center',

    },
    inputForm:{
        width: "100%",
        marginTop: 10
    },
    image:{
        height: 200,
        width: "150%",
        marginTop: 50, 
        marginBottom: 10,
    },
    btnContainerLogin:{
        marginTop: 30, 

        width: "95%"
    },
    btnLogin:{
        backgroundColor: "#00a680",
        marginLeft: 30, 
        marginRight: 30
    }, 
    iconRight:{
        color : "#c1c1c1",

    },
    txtusuario:{
        fontSize: 15,
        marginTop: 10,
        fontWeight: "400",
    },
    txttipo:{
        fontSize: 13,
        marginTop: 10,
        fontWeight: "bold",
    }
})

function defaultValueUser(){
    return{
        us_codigo: "",
        us_idtipoadm: "",
        us_nombre: "",
        us_nomtipoadm: ""
    }
}