import React, { useState,useRef, useEffect, useMemo } from "react";
import {View, ActivityIndicator} from 'react-native';
import {NavigationContainer} from "@react-navigation/native";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import ProductosStack from "../navegations/ProductosStack";
import CatalogoStack from "../navegations/CatalogoStack";
import ClienteStack from "../navegations/ClienteStack";
import PerfilStack from "../navegations/PerfilStack";
import { Icon } from "react-native-elements";
import * as SQLite from 'expo-sqlite';
import LoginForm from "./LoginForm";
import CargarDatos from "./CargarDatos";
import { AuthContext } from "../components/Context"

import AsyncStorage from '@react-native-async-storage/async-storage'

const Tab = createBottomTabNavigator();
const STORAGE_KEY = '@save_data'


export default function Navigation(props){ 
    const {toastRef} = props;
    const [isLoading, setIsLoading] = React.useState(false);
    const [userToken, setUserToken] = React.useState(null);
    const [chargue, setChargue] = React.useState(0);
    const [paso, setPaso] = React.useState(0);

    const authContext = React.useMemo(() => ({
        signIn: () => {
            setUserToken('keyrubik');
            setIsLoading(false);
            setChargue(0);
        },
        signUp: () => {
            setUserToken('keyrubikload');
            setIsLoading(false);
            setChargue(1);
        }, signNext: () => {
            setUserToken('keyrubiknext');
            setIsLoading(false);
            setChargue(2);
        }, signLoad: () => {
            setUserToken('keyrubikload');
            setIsLoading(false);
            setChargue(3);
        },
        signOut: () => {
            setUserToken(null);
            setIsLoading(false);
            setChargue(0);
            setPaso(0);
        },
    }))

    const getDataLogin = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
            if(paso == 0){
                if(jsonValue != null && chargue == 0){
                    authContext.signUp();
                    console.log("se logoneo")
                }else if(jsonValue != null && chargue == 1){
                    console.log("se cargo")
                }else{
                    authContext.signOut();
                    console.log("sin login")
            }
            setPaso(1);
        }
        } catch(e) {
           console.log(e)
        }
    }
    useEffect(() =>{
        getDataLogin();
    },[])
    



    
    return(
        <AuthContext.Provider value={authContext}>
        <NavigationContainer> 
            {(chargue == 0)  ? <LoginForm  toastRef={toastRef} /> : 
              (chargue == 1) ? 
            <Tab.Navigator
            initialRouteName="restaurants"
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color }) => screenOptions(route, color),
              })}
            >
                <Tab.Screen 
                    name="Productos" 
                    component={ProductosStack}
                    options={{headerShown: false}}
                    />
                    <Tab.Screen 
                    name="Catalogos" 
                    component={CatalogoStack}
                    options={{headerShown: false}} />
                    <Tab.Screen 
                    name="Clientes" 
                    component={ClienteStack}
                    options={{headerShown: false}}  />
                    <Tab.Screen 
                    name="Perfil" 
                    component={PerfilStack}
                    options={{headerShown: false}}  />
            </Tab.Navigator>: (chargue == 2) ? <Tab.Navigator
            initialRouteName="restaurants"
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color }) => screenOptions(route, color),
              })}
            >
            
                    <Tab.Screen 
                    name="Perfil" 
                    component={PerfilStack}
                    options={{headerShown: false}}  />
            </Tab.Navigator> : <CargarDatos></CargarDatos>}
                </NavigationContainer>
                </AuthContext.Provider>
          
    );
}

function screenOptions(route, color){
    let iconName;
    switch(route.name){
        case "Productos":
            iconName = "gift-outline";
            break;
        case "Catalogos":
            iconName = "book-open-variant";
            break;
        case "Clientes":
            iconName = "account-multiple";
            break;
        case "Perfil":
            iconName = "account-circle";
            break;
        default: 
            break;
    }
    return(
        <Icon type="material-community" name={iconName} size={22} color={color} />
    )
}