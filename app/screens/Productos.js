import React, {useState, useEffect, useCallback} from 'react'
import {View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Alert} from "react-native";
import { colors } from "react-native-elements";
import { FlatList } from "react-native-gesture-handler";
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DataExtra from '../data/DataExtra'
import {SearchBar, ListItem, Icon} from "react-native-elements"
import * as SQLite from 'expo-sqlite';
import AsyncStorage from '@react-native-async-storage/async-storage'
import Picker from '@ouroboros/react-native-picker';
import NetInfo from "@react-native-community/netinfo";


export default function Productos(){

    const [search, setSearch] = useState("");
    const [familias, setFamilias] = useState([])
    const [elegido, setElegido] = useState(0)
    const [tproducto, setTproducto] = useState(0)
    const [internet, setInternet] = useState(false);

    const database_name = 'CotzulBD4.db';
    const database_version = '1.0';
    const database_displayname = 'CotzulBD';
    const database_size = 200000;



    useEffect(() => {
        getDataFamilia()
        const interval = setInterval(myFunction, 10000);
    },[]);

    const myFunction = () => {
        console.log('Función ejecutada');
        reviewInternet();
    };

    const reviewInternet = () =>{
        NetInfo.fetch().then(state => {
            console.log("Connection type", state.type);
            console.log("Is connected?", state.isConnected);
            setInternet(state.isConnected)
        });
    } 


    useEffect(() => {
      if(internet){
        console.log("Revisamos si hay alguna modificacion");
        // Ejemplo de uso
      revisarCatalogo2()
      .then((textoConcatenado) => {
        console.log("Texto Concatenado:", textoConcatenado);
      })
      .catch((error) => {
        console.error("Error en la función principal:", error);
      });

      }
    }, [internet]);

    
    const revisarCatalogo2 = async () => {
        return new Promise((resolve, reject) => {
          let db = SQLite.openDatabase(
            database_name,
            database_version,
            database_displayname,
            database_size
          );
      
          let texto = "";
          let texto1 = "";
          let texto2 = "";
          let texto3 = "";
          let texto4 = "";

          let cat1 = "";
          let cat2 = "";
          let cat3 = "";
          let cat4 = "";
      
          db.transaction(
            (tx) => {
              tx.executeSql('SELECT * FROM Catalogo', [], (tx, results) => {
                console.log("si busco correctamente");
                var len = results.rows.length;
                console.log("cantidad de catproducto registrados : " + len);
      
                for (let i = 0; i < len; i++) {
                  let row = results.rows.item(i);
                  let idcode = row.ct_codigo;
      
                  console.log(`FECHAMOD : ${row.ct_fechamod}`);
                  console.log(`NOMCATA : ${row.ct_nomcata}`);
                  console.log(`MODPROD : ${row.ct_modprod}`);
                  console.log(`MODPROM : ${row.ct_modprom}`);
                  console.log(`MODLIQUI : ${row.ct_modliqui}`);
                  console.log(`MODXLLEGAR : ${row.ct_modxllegar}`);
                  console.log(`MODCOMBO : ${row.ct_modcombo}`);
      
                  let ct_total =
                    row.ct_modprod +
                    row.ct_modprom +
                    row.ct_modliqui +
                    row.ct_modxllegar +
                    row.ct_modcombo;
      
                  if (ct_total > 0) {
                    var idcatalo = row.ct_idcata;
                    
      
                    if (row.ct_modprod > 0) {
                      tx.executeSql(
                        'SELECT * FROM Catproducto WHERE cd_idoffline =  ?',
                        [idcode],
                        (tx, results) => {
                          var len2 = 0;
                          len2 = results.rows.length;

                         
      
                          if (len2 > 0) {
                            console.log("ingreso 1");
                            cat1 = cat1 + "%idcatalogo=" + idcatalo + "%";
                            texto1 = texto1 + "*tipocat=1*";
                          }
      
                          for (let j = 0; j < len2; j++) {
                            const row2 = results.rows.item(j);
                            texto1 = texto1 + row2.cd_idproducto + "-";
                          }
                        },
                        (tx, error) => {
                          console.error("Error en concatenar 1:", error);
                          reject(error);
                        }
                      );
                    }
      
                    if (row.ct_modprom > 0) {
                      tx.executeSql(
                        'SELECT * FROM CatPromociones WHERE ch_idoffline =  ?',
                        [idcode],
                        (tx, results) => {
                          var len2 = 0;
                          len2 = results.rows.length;

                         
      
                          if (len2 > 0) {
                            console.log("ingreso 2");
                            cat2 = cat2 + "%idcatalogo=" + idcatalo + "%";
                            texto2 = texto2 + "*tipocat=2*";
                          }
      
                          for (let j = 0; j < len2; j++) {
                            const row2 = results.rows.item(j);
                            texto2 = texto2 + row2.ch_idproducto + "-";
                          }
                        },
                        (tx, error) => {
                          console.error("Error en concatenar 2:", error);
                          reject(error);
                        }
                      );
                    }
      
                    if (row.ct_modliqui > 0) {
                      tx.executeSql(
                        'SELECT * FROM CatLiquidaciones WHERE cl_idoffline =  ?',
                        [idcode],
                        (tx, results) => {
                          var len2 = 0;
                          len2 = results.rows.length;
                          
      
                          if (len2 > 0) {
                            console.log("ingreso 3");
                            cat3 = cat3 + "%idcatalogo=" + idcatalo + "%";
                            texto3 = texto3 + "*tipocat=3*";
                          }
      
                          for (let j = 0; j < len2; j++) {
                            const row2 = results.rows.item(j);
                            texto3 = texto3 + row2.cl_idproducto + "-";
                          }
                        },
                        (tx, error) => {
                          console.error("Error en concatenar 3:", error);
                          reject(error);
                        }
                      );
                    }
      
                    if (row.ct_modcombo > 0) {
                      tx.executeSql(
                        'SELECT * FROM Catcombos WHERE cc_idoffline =  ?',
                        [idcode],
                        (tx, results) => {
                          var len2 = 0;
                          len2 = results.rows.length;
                          
                          if (len2 > 0) {
                            console.log("ingreso 4");
                            cat4 = cat4 + "%idcatalogo=" + idcatalo + "%";
                            texto4 = texto4 + "*tipocat=4*";
                          }
      
                          for (let j = 0; j < len2; j++) {
                            const row2 = results.rows.item(j);
                            texto4 = texto4 + row2.cc_idcombo + "-";
                          }
                        },
                        (tx, error) => {
                          console.error("Error en concatenar 4:", error);
                          reject(error);
                        }
                      );
                    }

                    
      
                    console.log("***Registrado: " + texto);
                  }
                }
              });
            },
            (error) => {
              // Manejar errores en la ejecución de la sentencia SQL
              console.error("ERROR EL EJECUTAR SENTENCIA", error);
              reject(error);
            },
            () => {
              // Transacción completada con éxito
              texto =    cat1 + texto1 + cat2 +  texto2 + cat3 +  texto3 + cat4 +  texto4;
              //texto =    texto1 +  texto2 + texto3 +  texto4;
              resolve(texto);
            }
          );
        });
      };
      
    

      
      


    const revisarCatalogo = async () =>{

        db = SQLite.openDatabase(
            database_name,
            database_version,
            database_displayname,
            database_size,
        );

        db.transaction((tx) => {
            tx.executeSql('SELECT * FROM Catalogo', [], (tx, results) => {
                console.log("si busco correctamente");
                var len = results.rows.length;
                var texto = "";
                console.log("cantidad de catproducto registrados : " + len);
                for (let i = 0; i < len; i++) {
                let row = results.rows.item(i);
                
                let idcode = row.ct_codigo;

                console.log(`FECHAMOD : ${row.ct_fechamod}`);
                console.log(`NOMCATA : ${row.ct_nomcata}`);
                
                console.log(`MODPROD : ${row.ct_modprod}`);
                console.log(`MODPROM : ${row.ct_modprom}`);
                console.log(`MODLIQUI : ${row.ct_modliqui}`);
                console.log(`MODXLLEGAR : ${row.ct_modxllegar}`);
                console.log(`MODCOMBO : ${row.ct_modcombo}`);
                
                let ct_total = row.ct_modprod + row.ct_modprom + row.ct_modliqui + row.ct_modxllegar + row.ct_modcombo;

                if(ct_total > 0){
                    
                    var idcatalo = row.ct_idcata;
            
                if(row.ct_modprod > 0){
                    
                    tx.executeSql('SELECT * FROM Catproducto WHERE cd_idoffline =  ?', [idcode], (tx, results) => {
                        // Operaciones con los resultados de la segunda consulta
                       
                        texto = texto + "%idcatalogaaa="+idcatalo+"%";
                        var len2 = results.rows.length;
                        
                        if(len2 > 0){
                            texto = texto + "*tipocat=1*";
                        }
                        for (let j = 0; j < len2; j++) {
                          
                          const row2 = results.rows.item(j);
                          
                          texto = texto + row2.cd_idproducto + "-";
                        }
                       
                       
                       
                },(tx, error) => {
                    
                    console.error("Error en concatenar 1:", error);
                    // Manejar el error de alguna manera (puede mostrar un mensaje al usuario, hacer un rollback, etc.)
                  });
                }

                console.log("entro a modprod"+texto);

                if(row.ct_modprom > 0){
                    tx.executeSql('SELECT * FROM CatPromociones WHERE ch_idoffline =  ?', [idcode], (tx, results) => {
                        // Operaciones con los resultados de la segunda consulta
                        var len2 = results.rows.length;
                        if(len2 > 0){
                            texto = texto + "*tipocat=2*";
                        }
                        for (let j = 0; j < len2; j++) {
                          const row2 = results.rows.item(j);
                          texto = texto + row2.ch_idproducto + "-";
                        }
                       
                },(tx, error) => {
                    
                    console.error("Error en concatenar 2:", error);
                    // Manejar el error de alguna manera (puede mostrar un mensaje al usuario, hacer un rollback, etc.)
                  });
                }

                if(row.ct_modliqui > 0){
                    tx.executeSql('SELECT * FROM CatLiquidaciones WHERE cl_idoffline =  ?', [idcode], (tx, results) => {
                        // Operaciones con los resultados de la segunda consulta
                        var len2 = results.rows.length;
                        if(len2 > 0){
                            texto = texto + "*tipocat=3*";
                        }
                        for (let j = 0; j < len2; j++) {
                          const row2 = results.rows.item(j);
                          texto = texto + row2.cl_idproducto + "-";
                        }
                        
                },(tx, error) => {
                    
                    console.error("Error en concatenar 3:", error);
                    // Manejar el error de alguna manera (puede mostrar un mensaje al usuario, hacer un rollback, etc.)
                  });
                }

                if(row.ct_modcombo > 0){
                    tx.executeSql('SELECT * FROM Catcombos WHERE cc_idoffline =  ?', [idcode], (tx, results) => {
                        // Operaciones con los resultados de la segunda consulta
                        var len2 = results.rows.length;
                        if(len2 > 0){
                            texto = texto + "*tipocat=4*";
                        }
                        for (let j = 0; j < len2; j++) {
                          const row2 = results.rows.item(j);
                          texto = texto + row2.cc_idcombo + "-";
                        }
                        
                },(tx, error) => {
                    console.error("Error en concatenar 4:", error);
                    
                    // Manejar el error de alguna manera (puede mostrar un mensaje al usuario, hacer un rollback, etc.)
                  });
                }

                console.log("***Registrado: "+ texto);
                
            }

            
                
            }},
            (tx, error) => {
              // Manejar errores en la ejecución de la sentencia SQL
              reject(error);
              console.error('ERROR EL EJECUTAR SENTENCIA', error);
            });    
        });

    }
    
    
    


    getDataFamilia = async () => {
        db = SQLite.openDatabase(
            database_name,
            database_version,
            database_displayname,
            database_size,
        ); 
   
        db.transaction((tx) => {
            tx.executeSql(
            'SELECT * FROM Catfamilia',
            [],
            (tx, results) => {
                var temp = [];
                for (let i = 0; i < results.rows.length; ++i)
                temp.push(results.rows.item(i));
                console.log("se encontro");
                setFamilias(temp);
            }
            );
    
        });
    };

     const goFamilia = (codigo) =>{
        setElegido(codigo)
     }

     useEffect(() => {
        if(tproducto != 0)
            setElegido(0);
     },[tproducto]);

   
    return(
        <View style={styles.container}>
            <View style={styles.titlesWrapper}>
                <Text style={styles.titlesSubtitle}>Productos</Text>
                <Text style={styles.titlesTitle}>Cotzul S.A.</Text>
            </View>
            {/*Search*/}
            <View style={styles.searchWrapper}>
               
                <View style={styles.search}>
                <SearchBar
                placeholder="Buscar por referencia"
                onChangeText={(e)=> setSearch(e)}
                containerStyle = {StyleSheet.Searchbar}
                value= {search}
                />
                </View>
                
            </View>
            <View style={styles.categoriaWrapper1}>
            <Text style={styles.titlesSubtitle}>Tipo Productos:{/* <RNPickerSelect
                    useNativeAndroidPickerStyle={false}
                    style={pickerStyle}
                    onValueChange={(tproducto) => setTproducto(tproducto)}
                    placeholder={{ label: "Productos", value: 0 }}
                    items={[
                        { label: "Promoción", value: 1 },
                        { label: "Liquidación", value: 2 },
                        { label: "x LLegar", value: 3 },
                    ]}
                />*/}</Text><Picker
              onChanged={setTproducto}
              options={[
                {value: 0, text: 'Productos'},
                  {value: 1, text: 'Promoción'},
                  {value: 2, text: 'Liquidación'},
                  {value: 3, text: 'x LLegar'},
                  {value: 4, text: 'Combos'},
              ]}
              style={{borderWidth: 1, width:150, borderColor: '#a7a7a7', borderRadius: 5, marginTop:5, padding: 5, backgroundColor: "#6f4993", color: 'white', alignItems: 'center'}}
              value={tproducto}
          />
            </View>
            {/*
                (tproducto == 0)?(
                    <View style={styles.categoriaWrapper}>
                    <View style={styles.categoriaListWrapper}>
                        <FlatList 
                        data ={familias}
                        renderItem = {({ item }) => ( <TouchableOpacity style={item.fa_codigo == elegido ? styles.categoriaItemWrapper1 : styles.categoriaItemWrapper2} onPress={() => goFamilia(item.fa_codigo)}><View ><Text style={styles.textItem}>{item.fa_familia}</Text></View></TouchableOpacity>)}
                        keyExtractor = {item => item.fa_codigo}
                        horizontal = {true}/>
                    </View>
                </View>
                ):null
                */}
            
            {/*Familias*/}
            <ScrollView style={styles.scrollview}>
                <View style={styles.productoWrapper}>
                    <DataExtra texto={search} familia={elegido} tproducto={tproducto} />
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    titlesWrapper:{
        marginTop: 10,
        paddingHorizontal: 20,
    },
titlesSubtitle:{
   // fontFamily: 
   fontSize: 16,
   color: colors.textDark,
},
titlesTitle:{
    // fontFamily: 
   fontSize: 25,
   color: colors.textDark,
},
searchWrapper:{
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
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
    marginTop: 10,
},
Searchbar:{
    marginBottom: 20,
    backgroundColor: '#fff'
}, 
scrollview:{
    marginTop:10,
    marginBottom: 50,
},
categoriaWrapper:{
    paddingHorizontal: 20
},
categoriaWrapper1:{
    paddingHorizontal: 20,
    paddingVertical:10,
    alignItems: 'center', //Centered vertically
},
categoriaItemWrapper1:{
    marginTop: 10,
    marginRight: 10,
    padding: 15,
    backgroundColor: '#f5ca4b',
    borderRadius: 20,
    width: 120, 
    height: 70,
    justifyContent: 'center', //Centered horizontally
    alignItems: 'center', //Centered vertically
    flex:1
},
categoriaItemWrapper2:{
    marginTop: 10,
    marginRight: 10,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 20,
    width: 120, 
    height: 70,
    justifyContent: 'center', //Centered horizontally
    alignItems: 'center', //Centered vertically
    flex:1
},
textItem:{
    textAlign: 'center',
    fontSize: 10,
}


});

const pickerStyle = {
    inputIOS: {
        color: 'white',
        paddingHorizontal: 10,
        backgroundColor: 'red',
        borderRadius: 5,
        height: 20,
    },
    placeholder: {
        color: 'white',
      },
    inputAndroid: {
        width: 100,
        height: 20,
        color: 'white',
        paddingHorizontal: 10,
        backgroundColor: 'red',
        borderRadius: 5,
    },
    searchWrapper:{
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 0,
        marginTop: 10,
    },
    search:{
        flex: 1,
        marginLeft: 0,
        borderBottomColor: colors.textLight,
        borderBottomWidth: 1,
    }
};
