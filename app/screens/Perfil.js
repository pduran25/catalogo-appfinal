import React,{useState, useEffect, useContext} from "react";
import {View, Text, Image,StyleSheet, Alert} from "react-native";
import { Input, Icon, Button} from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage'
import LoginForm from "../navegations/LoginForm";
import * as SQLite from 'expo-sqlite';
import { AuthContext } from "../components/Context"
import NetInfo from "@react-native-community/netinfo";
import ModalConfirma from './ModalConfirm';
const STORAGE_KEY = '@save_data'

const database_name = 'CotzulBD4.db';
const database_version = '1.0';
const database_displayname = 'CotzulBD';
const database_size = 200000;

export default function Perfil(){
    
    const [dataUser, setdataUser] = useState(defaultValueUser());
    const [user, setUser] = useState(true);
    const {signOut, signUp} = React.useContext(AuthContext);
    const [internet, setInternet] = useState(true);

    

   
    

    const getData = async () => {
        try {
          const jsonValue = await AsyncStorage.getItem(STORAGE_KEY)
          setdataUser(JSON.parse(jsonValue));
        } catch(e) {
           console.log(e)
        }
    }

   useEffect(()=>{
        getData();
   });
    

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
            signUp();

        }else{
            Alert.alert("Su dispositivo no cuenta con internet");
        }
   }


   const openModal = () =>{
    onLoad();
  }

  




    return(<>
    
        <View style={styles.formContainer}>
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
        <ModalConfirma openModal={openModal}></ModalConfirma>
        {/*<Button
            title="Recargar Datos"
            containerStyle={styles.btnContainerLogin}
            buttonStyle = {styles.btnLogin}
            onPress= {openModal}
    />*/}
        <Text style={styles.txtusuario}>Version App: 1.0.3</Text>
    </View>
        
        </>
    );
}

const styles = StyleSheet.create({
    formContainer:{
        flex: 1,
        alignItems: 'center',
        marginTop: 10, 
        marginLeft: 30, 
        marginRight: 30
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