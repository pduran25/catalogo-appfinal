import React, {useState, useEffect} from 'react'
import {View, Text, StyleSheet, SafeAreaView, ScrollView} from "react-native";
import { colors } from "react-native-elements";
import Feather from 'react-native-vector-icons/Feather';
import DataCliente from '../data/DataCliente'
import {SearchBar, ListItem, Icon} from "react-native-elements"
import ActualizacionBolita from './Actualizacionbolita';

export default function Clientes(){
    const [search, setSearch] = useState("");
    const [estaActualizada, setEstaActualizada] = useState(0);
    return(
        <View style={styles.container}>
            {/*<ActualizacionBolita actualizada={estaActualizada} />*/}
            <View style={styles.titlesWrapper}>
             <Text style={styles.titlesSubtitle}>Clientes</Text>
            </View>
            {/*Search*/}
            <View style={styles.searchWrapper}>
                
                <View style={styles.search}>
                <SearchBar
                    placeholder="Buscar por cliente"
                    onChangeText={(e)=> setSearch(e)}
                    containerStyle = {StyleSheet.Searchbar}
                    value= {search}
                    />
                </View>
            </View>
            {/*Familias*/}
            <View style={styles.scrollview}>
            <View style={styles.productoWrapper}>
               <DataCliente texto={search}  />
            </View>
            </View>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 10,
    },
    titlesWrapper:{
        marginTop: 10,
    },
titlesSubtitle:{
        // fontFamily: 
        fontSize: 16,
        color:'#9462c1',
        fontSize: 20,
        fontWeight: 'bold',
     },
titlesTitle:{
    // fontFamily: 
   fontSize: 32,
   color: colors.textDark,
},
searchWrapper:{
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
},
search:{
    flex: 1,
        marginLeft: 0,
        borderBottomColor: colors.textLight,
        borderBottomWidth: 1,


},
searchText:{
    fontSize: 14,
    marginBottom: 5,
    color: colors.textLight,

},
productoWrapper:{
    marginTop: 30,
},
Searchbar:{
    marginBottom: 20,
    backgroundColor: '#fff'
},
scrollview:{
    marginTop:10,
    marginBottom: 50,
}


});