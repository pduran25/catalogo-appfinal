import React, {useState, useEffect} from 'react'
import { StyleSheet, Text, View, Image, ActivityIndicator, Alert } from 'react-native'
import { colors } from "react-native-elements";
import * as SQLite from 'expo-sqlite';
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import LoginForm from './LoginForm';
import Navigation from "../navegations/Navegation";
import { AuthContext } from "../components/Context"



const database_name = 'CotzulBD4.db';
const database_version = '1.0';
const database_displayname = 'CotzulBD';
const database_size = 200000;

const STORAGE_KEY = '@save_data'
const STORAGE_DB = '@login_data'
let conta = 0;





export default function CargarDatos(props) {

    const [dataUser, setdataUser] = useState(defaultValueUser());
    const [loading2, setLoading2] = useState(false);
    const [loading3, setLoading3] = useState(false);
    const [loading4, setLoading4] = useState(false);
    const [loading5, setLoading5] = useState(false);
    const [loading6, setLoading6] = useState(false);
    const [loading7, setLoading7] = useState(false);
    const [loading8, setLoading8] = useState(false);
    const [loading9, setLoading9] = useState(false);
    const [loadingcombo, setLoadingcombo] = useState(false);
    const [loading10, setLoading10] = useState(false);
    const [loading11, setLoading11] = useState(false);
    const [loading12, setLoading12] = useState(false);
    const [loading13, setLoading13] = useState(false);
    const [loading14, setLoading14] = useState(false);
    
    
    const [loading, setLoading] = useState(false);
    const [usuario, setUsuario] = useState(false);
    const [user, setUser] = useState(false);
    const [textIndicador, settextIndicador] = useState("Cargando...");
    const [actdb, setActDB] = useState(-1);
    const [actfam, setActFAM] = useState(-1);
    const [acthueso, setActHueso] = useState(-1);
    
    const [catliqui, setCatLiqui] = useState(-1);

    
    const [estado, setEstado] = useState({data: "", isLoaded: false});
    const [catalogos, setCatalogos] = useState({data: "", isLoaded: false});
    const [check1, setCheck1] = useState(false);
    const [check2, setCheck2] = useState(false);
    const [check3, setCheck3] = useState(false);
    const [check4, setCheck4] = useState(false);
    const [check5, setCheck5] = useState(false);
    const [check6, setCheck6] = useState(false);

    const {signIn} = React.useContext(AuthContext);
    let db = null;

    const key_check1 = '@check1'
    const key_check2 = '@check2'
    const key_check3 = '@check3'
    const key_check4 = '@check4'
    const key_check5 = '@check5'
    const key_check6 = '@check6'
    /* FUNCIONES RECURSIVAS */
    const getDataUser = async () => {
        try {
        const jsonValue = await AsyncStorage.getItem(STORAGE_KEY)
        setdataUser(JSON.parse(jsonValue));
        setUsuario(true);
        regChecks();
        console.log(dataUser.us_nombre);
        } catch(e) {
        }
    }

    const regChecks = async () => {
      try {
        console.log("valor de check1: " + await AsyncStorage.getItem(key_check1));
        console.log("valor de check2: " + await AsyncStorage.getItem(key_check2));
        console.log("valor de check3: " + await AsyncStorage.getItem(key_check3));
        console.log("valor de check4: " + await AsyncStorage.getItem(key_check4));
        console.log("valor de check5: " + await AsyncStorage.getItem(key_check5));
        console.log("valor de check6: " + await AsyncStorage.getItem(key_check6));
        setCheck1(JSON.parse(await AsyncStorage.getItem(key_check1)));
        setCheck2(JSON.parse(await AsyncStorage.getItem(key_check2)));
        setCheck3(JSON.parse(await AsyncStorage.getItem(key_check3)));
        setCheck4(JSON.parse(await AsyncStorage.getItem(key_check4)));
        setCheck5(JSON.parse(await AsyncStorage.getItem(key_check5)));
        setCheck6(JSON.parse(await AsyncStorage.getItem(key_check6)));
        setActDB(1);

        
      } catch(e) {
         console.log(e)
      }
    }

    const setDB = async (value) => {
      try {
          await AsyncStorage.setItem(STORAGE_DB, value)
        } catch(e) {
           console.log(e)
        }
  }

  useEffect(() => {
    if(dataUser){

      if(!usuario){
          getDataUser();
      }
    }

    }, [])


    useEffect(() => {
      console.log("entro a ActDB: "+actdb);
      if(actdb <= 6){
        if(actdb == 1){
          if(check1){
            getData();
            console.log("entro a ActDB check1: "+check1);
          }else
            setActDB(actdb+1);
        }else if(actdb == 2){
          if(check2){
            getProdHueso();
            console.log("entro a ActDB check2: "+check2);
           } else
            setActDB(actdb+1);
        }else if(actdb == 3){
          if(check3){
            getProdLiquidacion();
            console.log("entro a ActDB check3: "+check3);
          }else
            setActDB(actdb+1);
        }else if(actdb == 4){
          if(check4){
            getProdxLlegar();
            console.log("entro a ActDB check4: "+check4);
          }else
            setActDB(actdb+1);
        }else if(actdb == 5){
          if(check5){
            getCombo();
            console.log("entro a ActDB check5: "+check5);
          }else
            setActDB(actdb+1);
        }else if(actdb == 6){
          if(check6){
            getClientes();
            console.log("entro a ActDB check6: "+check6);
          }else
            setActDB(actdb+1);
        }
      }else if(actdb == 7){
              setActDB(-1);
              setUser(true);
              setDB("SI");
              signIn()
      }
      
      
    }, [actdb])
    
        
        getData = async () => {
          try {
            settextIndicador("Registro de Datos productos ... ");
            setLoading(true)
            const response = await fetch(
              "https://app.cotzul.com/Catalogo/php/conect/db_getAllData.php"
            );
            
            const jsonResponse = await response.json();
            saveDbData(jsonResponse);
            setLoading(false)
          } catch (error) {
            setLoading(false)
            console.log(error);
          }
        };


        saveDbData = async (myResponse) => {
          console.log("entró a la parte de grabacion")
         
          if (loading) {
            db = SQLite.openDatabase(
              database_name,
              database_version,
              database_displayname,
              database_size,
          ); 
          var cont = 0;
             
            db.transaction((tx) => {
              tx.executeSql("DROP TABLE IF EXISTS Producto")
              tx.executeSql(
                "CREATE TABLE IF NOT EXISTS "
                + "Producto "
                + "(pr_codigo INTEGER, pr_codprod VARCHAR(20), pr_referencia VARCHAR(20), pr_descorta TEXT, pr_deslarga TEXT, pr_marca VARCHAR(20), "
                + "pr_codfamilia INTEGER, pr_codnivel1 INTEGER, pr_codnivel2 INTEGER, pr_familia VARCHAR(20),"
                + "pr_nivel1 VARCHAR(20), pr_nivel2 VARCHAR(20), pr_pvp DOUBLE, pr_preciosub DOUBLE, pr_contado DOUBLE, pr_precioiva DOUBLE,"
                + "pr_credito DOUBLE, pr_stock INTEGER, pr_rutaimg TEXT, pr_arrayimg TEXT, pr_sku INTEGER, pr_cm INTEGER, pr_ce INTEGER,"
                + "pr_bod INTEGER, pr_alm INTEGER, pr_chi INTEGER, pr_rep INTEGER, pr_subseg DOUBLE, pr_contseg DOUBLE, pr_credseg DOUBLE, pr_pubseg DOUBLE);"
                )
                console.log('tx1: ', tx);
                myResponse?.productos.map((value,index) => {
                  tx.executeSql(
                    'INSERT INTO Producto VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?,?,?)', [
                      value.pr_codigo,
                      value.pr_codprod,
                      value.pr_referencia,
                      value.pr_descorta,
                      value.pr_deslarga,
                      value.pr_marca,
                      value.pr_codfamilia, 
                      value.pr_codnivel1,
                      value.pr_codnivel2,
                      value.pr_familia,
                      value.pr_nivel1,
                      value.pr_nivel2,
                      value.pr_pvp,
                      value.pr_preciosub,
                      value.pr_contado,
                      value.pr_precioiva,
                      value.pr_credito,
                      value.pr_stock,
                      value.pr_rutaimg,
                      value.pr_arrayimg, 
                      value.pr_sku, 
                      value.pr_cm, 
                      value.pr_ce, 
                      value.pr_bod, 
                      value.pr_alm, 
                      value.pr_chi, 
                      value.pr_rep, 
                      value.pr_subseg, 
                      value.pr_contseg, 
                      value.pr_credseg,
                      value.pr_pubseg
              ],
                    (tx, results) => {
                     // console.log('Productos:', results.rowsAffected);
                      if (results.rowsAffected > 0) {
                        cont++;
                        console.log("Producto_" + cont)
                      }
                    })
                })
              })

              getCatalogos();
                  
            }
        }

        getCatalogos = async () => {
          try {
            setLoading2(true)
            const response2 = await fetch(
              "https://app.cotzul.com/Catalogo/php/conect/db_getCatalogosxidvendedor.php?id="+dataUser.us_idvendedor
            );
            console.log("https://app.cotzul.com/Catalogo/php/conect/db_getCatalogosxidvendedor.php?id="+dataUser.us_idvendedor);
            const jsonResponse2 = await response2.json();
            
            saveDbDataCatalogo(jsonResponse2);
            setLoading2(false)
          } catch (error) {
            setLoading2(false)
            console.log("un error cachado");
            console.log(error);
          }
        }

        /*getCombos = async () => {
          try {
            setLoadingcombo(true)
            const response2 = await fetch(
              "https://app.cotzul.com/Catalogo/php/conect/db_getCombos.php"
            );
            console.log("https://app.cotzul.com/Catalogo/php/conect/db_getCombos.php");
            const jsonResponse2 = await response2.json();
            
            saveDbCombo(jsonResponse2);
            setLoadingcombo(false)
          } catch (error) {
            setLoadingcombo(false)
            console.log("un error cachado");
            console.log(error);
          }
        }

        saveDbCombo = async (myResponse) => {
          if (loadingcombo) {
              settextIndicador("Registro de Datos Combo ... ");
              
              db = SQLite.openDatabase(
                database_name,
                database_version,
                database_displayname,
                database_size,
            ); 
            if(db != null){
              console.log("entro correctamente a la base de datos 2:")
            }
            var cont = 0;
               db.transaction( (txn) => {
                txn.executeSql("DROP TABLE IF EXISTS Combo")
                 txn.executeSql(
                  "CREATE TABLE IF NOT EXISTS "
                + "Combo "
                + "(cb_codigo INTEGER PRIMARY KEY AUTOINCREMENT, cb_nombcombo VARCHAR(50), cb_imgcombo VARCHAR(50), cb_fechareg VARCHAR(50),  cb_fechacad VARCHAR(50), cb_subtotal FLOAT, cb_idcombo INTEGER);"
                  )

                  
                  console.log('tx2: ', txn);
                  myResponse?.combo.map((value,index) => {
                    
                   txn.executeSql(
                      'INSERT INTO Combo(cb_nombcombo, cb_imgcombo, cb_fechareg, cb_fechacad, cb_subtotal, cb_idcombo) VALUES (?, ?, ?, ?, ?, ?)', [
                        value.cb_nombcombo,
                        value.cb_imgcombo,
                        value.ct_fechareg,
                        value.ct_fechacad,
                        value.ct_subtotal,
                        value.cb_codigo
                    ],
                      (txn, results) => {
                        console.log('Combos_afectados', results.rowsAffected);
                        if (results.rowsAffected > 0) {
                          cont++;
                          console.log("Combos_" + cont)
                        }
                      })
                  })
                })
                
                console.log("termino los combos");
                presentCombo();
              }
            
            
          }


          const presentCombo = async () => {
          db.transaction((tx) => {
            tx.executeSql('SELECT * FROM Combo LIMIT 10', [], (tx, results) => {
              console.log("Query completed");
         
              // Get rows with Web SQL Database spec compliance.
         
              var len = results.rows.length;
              console.log("cantidad de combos registrados : " + len);
              for (let i = 0; i < len; i++) {
               let row = results.rows.item(i);
               console.log(`NOMBRE CATALOGO : ${row.cb_nombcombo}`);
               //this.setState({record: row});
              }
              console.log("Combos Registrados con éxito");
             });
           });


        }*/


        saveDbDataCatalogo = async (myResponse) => {
        if (loading2) {
            settextIndicador("Registro de Datos Catalogo ... ");
            
            db = SQLite.openDatabase(
              database_name,
              database_version,
              database_displayname,
              database_size,
          ); 
          if(db != null){
            console.log("entro correctamente a la base de datos 2:")
          }
          var cont = 0;
             db.transaction( (txn) => {
              txn.executeSql("DROP TABLE IF EXISTS Catalogo")
               txn.executeSql(
                "CREATE TABLE IF NOT EXISTS "
              + "Catalogo "
              + "(ct_codigo INTEGER PRIMARY KEY AUTOINCREMENT, ct_codcliente INTEGER, ct_nomcliente VARCHAR(100), ct_nomcata VARCHAR(50), ct_tipocli INTEGER, ct_fecha VARCHAR(50), ct_codvendedor INTEGER, ct_descargado VARCHAR(10), ct_cantprod INTEGER, ct_cantpromo INTEGER, ct_cantliqui INTEGER, ct_cantprox INTEGER, ct_cantcombo INTEGER, ct_idcata INTEGER, ct_fechamod VARCHAR(30), ct_modprod INTEGER, ct_modprom INTEGER, ct_modliqui INTEGER, ct_modxllegar INTEGER, ct_modcombo INTEGER);"
                )

                
                console.log('tx2: ', txn);
                myResponse?.catalogos.map((value,index) => {
                  
                 txn.executeSql(
                    'INSERT INTO Catalogo(ct_codcliente, ct_nomcliente, ct_nomcata, ct_tipocli, ct_fecha, ct_codvendedor, ct_descargado, ct_cantprod, ct_cantpromo, ct_cantliqui, ct_cantprox, ct_cantcombo, ct_idcata, ct_fechamod, ct_modprod, ct_modprom, ct_modliqui, ct_modxllegar, ct_modcombo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? , ?)', [
                      value.ct_idcliente,
                      value.ct_cliente,
                      value.ct_nombcat,
                      value.ct_tipocli,
                      value.ct_fecha,
                      value.ct_idvendedor,
                      value.ct_descargado, 
                      value.ct_cantprod, 
                      value.ct_cantpromo, 
                      value.ct_cantliqui, 
                      value.ct_cantprox,
                      value.ct_cantcombo,
                      value.ct_codigo,
                      "",
                      0,
                      0,
                      0,
                      0,
                      0,
                  ],
                    (txn, results) => {
                      console.log('Catalogos_afectados', results.rowsAffected);
                      if (results.rowsAffected > 0) {
                        cont++;
                        console.log("Catalogo_" + cont)
                      }
                    })
                })
              })
              getProductosxcatalogos();
              console.log("termino el catalogo");
              
            }
          
          
        }

        /**CLIENTES **/

        getClientes = async () => {
          try {
            setLoading3(true)
           
            const response2 = await fetch(
              "https://app.cotzul.com/Catalogo/php/conect/db_getClientexidvendedor.php?id="+dataUser.us_idvendedor
            );
            console.log("https://app.cotzul.com/Catalogo/php/conect/db_getClientexidvendedor.php?id="+dataUser.us_idvendedor);
            const jsonResponse2 = await response2.json();
            
            saveClientes(jsonResponse2);
            setLoading3(false)
          } catch (error) {
            setLoading3(false)
            console.log("un error cachado");
            console.log(error);
          }
        }


        saveClientes = async (myResponse) => {
          if (loading3) {
              settextIndicador("Registro de Datos Cliente ... ");
              
              db = SQLite.openDatabase(
                database_name,
                database_version,
                database_displayname,
                database_size,
            ); 
            
            var cont = 0;
               db.transaction( (txn) => {
                txn.executeSql("DROP TABLE IF EXISTS Cliente")
                 txn.executeSql(
                  "CREATE TABLE IF NOT EXISTS "
                  + "Cliente "
                  + "(cl_codigo INTEGER, cl_cedula VARCHAR(20), cl_tipoid VARCHAR(10),"
                  + "cl_cliente VARCHAR(50), cl_telefono VARCHAR(50), cl_direccion VARCHAR(100), cl_correo VARCHAR(100));"
                  )

                  myResponse?.clientes.map((value,index) => {
                  
                   txn.executeSql(
                      'INSERT INTO Cliente VALUES (?, ?, ?, ?, ?, ?, ?)', [
                        value.cl_codigo,
                        value.cl_cedula,
                        value.cl_tipoid,
                        value.cl_cliente,
                        value.cl_telefono,
                        value.cl_direccion,
                        value.cl_correo
                    ],
                      (txn, results) => {
                        console.log('Clientes_afectados', results.rowsAffected);
                        if (results.rowsAffected > 0) {
                          cont++;
                          console.log("Clientes_" + cont)
                        }
                      })
                  })
                })
                setActDB(actdb+1);
                
                console.log("termino los clientes");
                
              }
            
            
          }




          /**PRODUCTOS X CATALOGO **/
          getProductosxcatalogos = async () => {;
            console.log("https://app.cotzul.com/Catalogo/php/conect/db_getProductosxcatalogo.php?id="+dataUser.us_idvendedor)
            try {
              setLoading4(true)
              const response = await fetch(
                "https://app.cotzul.com/Catalogo/php/conect/db_getProductosxcatalogo.php?id="+dataUser.us_idvendedor
              );
              const jsonResponse = await response.json();
              //console.log("My Catdetalle",jsonResponse);
              saveProdCatalogo(jsonResponse);
              setLoading4(false)
            } catch (error) {
              setLoading4(false)
              console.log("un error cachado");
              console.log(error);
            }

          }

          saveProdCatalogo = async (myResponse) => {
            if (loading4) {
                settextIndicador("Registro de Datos Producto/Catálogo ... ");
                
                db = SQLite.openDatabase(
                  database_name,
                  database_version,
                  database_displayname,
                  database_size,
              ); 
              
              var cont = 0;
              db.transaction( (txn) => {
                  txn.executeSql("DROP TABLE IF EXISTS Catproducto")
                  txn.executeSql(
                    "CREATE TABLE IF NOT EXISTS "
                    + "Catproducto "
                    + "(cd_codigo INTEGER PRIMARY KEY AUTOINCREMENT, cd_idcatalogo INTEGER, cd_idoffline INTEGER, cd_idproducto INTEGER);"
                    )
  
                    myResponse?.Catproductos.map((value,index) => {
                    
                    txn.executeSql(
                        'INSERT INTO Catproducto(cd_idcatalogo, cd_idoffline, cd_idproducto) VALUES (?, ?, ?)', [
                          value.cl_idcatalogo,
                          0,
                          value.cl_idproducto
                      ],
                        (txn, results) => {
                          console.log('CatProducto', results.rowsAffected);
                          if (results.rowsAffected > 0) {
                            cont++;
                            console.log("Catproducto_" + cont)
                          }
                        })
                    })
                  })
                   
                  updateCatProductos();
                  console.log("termino los catalogos/productos");
                }
            }

        
            const updateCatProductos= async () => {
          
              db = SQLite.openDatabase(
                database_name,
                database_version,
                database_displayname,
                database_size,
            );
    
            console.log("Estamos adentro de updateCatProductos");
              db.transaction((tx) => {
                tx.executeSql('SELECT a.ct_codigo as codigooff, a.ct_idcata as idcata FROM Catalogo a, Catproducto b WHERE a.ct_idcata = b.cd_idcatalogo', [], (tx, results) => {
                  console.log("Query completed");
                  var len = results.rows.length;
                  console.log("cantidad de Combo: " + len);
                  for (let i = 0; i < len; i++) {
                    
                    let row = results.rows.item(i);
                    let codigooff = row.codigooff;
                    console.log("valor off: "+codigooff)
                    let idcata = row.idcata;
                    tx.executeSql(
                      'UPDATE Catproducto SET cd_idoffline = ? WHERE cd_idcatalogo = ?',
                      [codigooff,idcata ],
                      (tx, updateResult) => {
                        // Maneja el resultado de la actualización si es necesario
                        console.log("Actualización realizada con éxito Catalogo Productos");
                      }
                    );
                    
                  }
                  console.log("Cat productos registrada con éxito");
                  setActDB(actdb+1);
                },
                (tx, error) => {
                  // Manejar errores en la ejecución de la sentencia SQL
                  console.error('Error en la sentencia SQL:', error);
                });                                       
              });
            }


         



      /*CARGAR LAS CATEGORIAS FAMILIAS*/ 

      getFamiliaCat = async () => {
        try {
          setLoading5(true)
          setActFAM(2);
          const response = await fetch(
            "https://app.cotzul.com/Catalogo/php/conect/db_getFamilia.php"
          );
          const jsonResponse = await response.json();
          saveFamCate(jsonResponse);
          setLoading5(false)
        } catch (error) {
          setLoading5(false)
          console.log("un error cachado");
          console.log(error);
        }

      }


      saveFamCate = async (myResponse) => {
        if (loading5) {
            settextIndicador("Registro de Datos Familia/Categoría ... ");
            
            db = SQLite.openDatabase(
              database_name,
              database_version,
              database_displayname,
              database_size,
          ); 
          
             var cont = 0;
             db.transaction( (txn) => {
              txn.executeSql("DROP TABLE IF EXISTS Catfamilia")
               txn.executeSql(
                "CREATE TABLE IF NOT EXISTS "
                + "Catfamilia "
                + "(fa_codigo INTEGER, fa_familia VARCHAR(50), fa_selected INTEGER);"
                )

                txn.executeSql(
                  'INSERT INTO Catfamilia VALUES (?, ?, ?)', [
                    0,
                    'TODOS',
                    1
                ])

                myResponse?.familia.map((value,index) => {
                  
                 txn.executeSql(
                    'INSERT INTO Catfamilia VALUES (?, ?, ?)', [
                      value.fa_codigo,
                      value.fa_familia,
                      0
                  ],
                    (txn, results) => {
                      console.log('Catfamilia', results.rowsAffected);
                      if (results.rowsAffected > 0) {
                        cont++;
                        console.log("Catfamilia_" + cont)
                      }
                    })
                })
              })
              presentFamilia();
              console.log("termino los familia");
              
            }
        }

        const presentFamilia = async () => {
          db.transaction((tx) => {
            tx.executeSql('SELECT * FROM Catfamilia', [], (tx, results) => {
              console.log("Query completed");
         
              // Get rows with Web SQL Database spec compliance.
         
              var len = results.rows.length;
              console.log("cantidad de catproducto registrados : " + len);
              for (let i = 0; i < len; i++) {
               let row = results.rows.item(i);
               console.log(`ID CODIGO : ${row.fa_codigo}`);
               console.log(`ID FAMILIA : ${row.fa_familia}`);
               
              }
              
              console.log("Familia registrada con éxito");
              setActHueso(1)
             });
           });


        }


        /** CARGAR LOS PRODUCTOS EN PROMOCION */

        getProdHueso = async () => {
          console.log("getprodhueso")
          try {
            setLoading6(true)
            const response = await fetch(
              "https://app.cotzul.com/Catalogo/php/conect/db_getProdHueso.php"
            );
            const jsonResponse = await response.json();
            console.log(jsonResponse)
            saveProdHueso(jsonResponse);
            setLoading6(false)
          } catch (error) {
            setLoading6(false)
            console.log("un error cachado");
            console.log(error);
          }

        }


        saveProdHueso = async (myResponse) => {
          if (loading6) {
              settextIndicador("Registro de Datos Productos/Promociones ... ");
              
              db = SQLite.openDatabase(
                database_name,
                database_version,
                database_displayname,
                database_size,
            ); 
            
               var cont = 0;
               db.transaction( (txn) => {
                txn.executeSql("DROP TABLE IF EXISTS ProdHueso")
                 txn.executeSql(
                  "CREATE TABLE IF NOT EXISTS "
                  + "ProdHueso "
                  + "(ph_codigo INTEGER, ph_codprod VARCHAR(50), ph_referencia VARCHAR(50),"
                  + " ph_preciosub DOUBLE, ph_preciocont DOUBLE, ph_preciocred DOUBLE,"
                  + " ph_precioconiva DOUBLE, ph_dias INTEGER, ph_existencia INTEGER, ph_rutaimg TEXT, ph_arrayimg TEXT);"
                  )

                  
                  myResponse?.phuesos.map((value,index) => {
                    
                   txn.executeSql(
                      'INSERT INTO ProdHueso VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [
                        value.ph_codigo,
                        value.ph_codprod,
                        value.ph_referencia,
                        value.ph_preciosub,
                        value.ph_preciocont,
                        value.ph_preciocred,
                        value.ph_precioconiva,
                        value.ph_dias,
                        value.ph_existencia,
                        value.ph_rutaimg,
                        value.ph_arrayimg
                    ],
                      (txn, results) => {
                        console.log('ProdHueso', results.rowsAffected);
                        if (results.rowsAffected > 0) {
                          cont++;
                          console.log("ProdHueso_" + cont)
                        }
                      })
                  })
                })

                getCatPromociones();
                console.log("termino los Producto en Promocion");
                
              }
          }




          /** CARGAR LOS PRODUCTOS EN LIQUIDACION */


          getProdLiquidacion = async () => {
            console.log("getprodliquidacion")
            try {
              setLoading7(true);
              const response = await fetch(
                "https://app.cotzul.com/Catalogo/php/conect/db_getProdLiquidacion.php"
              );
              const jsonResponse = await response.json();
              console.log(jsonResponse)
              saveProdLiq(jsonResponse);
              setLoading7(false)
            } catch (error) {
              setLoading7(false)
              console.log("un error cachado");
              console.log(error);
            }
          }


          saveProdLiq = async (myResponse) => {
            if (loading7) {
              settextIndicador("Registro de Datos Productos/Liquidaciones ... ");
              db = SQLite.openDatabase(
                  database_name,
                  database_version,
                  database_displayname,
                  database_size,
              );

              var cont = 0;
                 db.transaction( (txn) => {
                  txn.executeSql("DROP TABLE IF EXISTS ProdLiquidacion")
                   txn.executeSql(
                    "CREATE TABLE IF NOT EXISTS "
                    + "ProdLiquidacion "
                    + "(pl_codigo INTEGER, pl_codprod VARCHAR(50), pl_referencia VARCHAR(50),"
                    + " pl_preciosub DOUBLE, pl_preciocont DOUBLE, pl_preciocred DOUBLE,"
                    + " pl_precioconiva DOUBLE, pl_preciosiniva DOUBLE, pl_dias INTEGER, "
                    + " pl_existencia INTEGER, pl_rutaimg TEXT, pl_arrayimg TEXT);"
                    )
                    myResponse?.pliquidacion.map((value,index) => {
                      
                     txn.executeSql(
                        'INSERT INTO ProdLiquidacion VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [
                          value.pl_codigo,
                          value.pl_codprod,
                          value.pl_referencia,
                          value.pl_preciosub,
                          value.pl_preciocont,
                          value.pl_preciocred,
                          value.pl_precioconiva,
                          value.pl_preciosiniva,
                          value.pl_dias,
                          value.pl_existencia,
                          value.pl_rutaimg,
                          value.pl_arrayimg
                      ],
                        (txn, results) => {
                          console.log('ProdLiquidacion', results.rowsAffected);
                          if (results.rowsAffected > 0) {
                            cont++;
                            console.log("ProdLiquidacion_" + cont)
                          }
                        })
                    })
                  })
                  getCatLiquidaciones();
                  console.log("termino los Producto en Liquidaciones");


            }
          }


          /** CARGAR LOS PRODUCTOS EN POR LLEGAR */

          getProdxLlegar = async () => {
            console.log("getProdxLlegar")
            try {
              setLoading8(true)
              const response = await fetch(
                "https://app.cotzul.com/Catalogo/php/conect/db_getProdFuturo.php"
              );
              const jsonResponse = await response.json();
              console.log(jsonResponse)
              saveProdXLlegar(jsonResponse);
              setLoading8(false)
            } catch (error) {
              setLoading8(false)
              console.log("un error cachado");
              console.log(error);
            }
          }


          saveProdXLlegar = async (myResponse) => {
            if (loading8) {
              settextIndicador("Registro de Datos Productos/x LLegar ... ");
              db = SQLite.openDatabase(
                database_name,
                database_version,
                database_displayname,
                database_size,
            );

            var cont = 0;
               db.transaction( (txn) => {
                txn.executeSql("DROP TABLE IF EXISTS ProdxLlegar")
                 txn.executeSql(
                  "CREATE TABLE IF NOT EXISTS "
                  + "ProdxLlegar "
                  + "(sf_codigo INTEGER, sf_codped INTEGER, sf_codprod VARCHAR(50)," 
                  + " sf_referencia VARCHAR(50), sf_cantllega INTEGER,"
                  + " sf_fechallega VARCHAR(50), sf_rutaimg TEXT, sf_arrayimg TEXT);"
                  )
                  myResponse?.sfuturo.map((value,index) => {
                    
                   txn.executeSql(
                      'INSERT INTO ProdxLlegar VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [
                        value.sf_codigo,
                        value.sf_codped,
                        value.sf_codprod,
                        value.sf_referencia,
                        value.sf_cantllega,
                        value.sf_fechallega,
                        value.sf_rutaimg,
                        value.sf_arrayimg
                    ],
                      (txn, results) => {
                        console.log('ProdxLlegar', results.rowsAffected);
                        if (results.rowsAffected > 0) {
                          cont++;
                          console.log("ProdxLlegar_" + cont)
                        }
                      })
                  })
                })
                getCatxLlegar();
                console.log("termino los Producto x Llegar");
            }
            
          }



          /** CARGAR LOS CATALOGO DE PROMOCIONES */


          getCatPromociones = async () => {
            console.log("getCatPromociones")
            try {
              setLoading9(true);
              const response = await fetch(
                "https://app.cotzul.com/Catalogo/php/conect/db_getcatpromo.php"
              );
              const jsonResponse = await response.json();
              console.log(jsonResponse)
              saveCatPromociones(jsonResponse);
              setLoading9(false)
            } catch (error) {
              setLoading9(false)
              console.log("un error cachado");
              console.log(error);
            }
          }


          saveCatPromociones = async (myResponse) => {
            if (loading9) {
              settextIndicador("Registro de Catalogos de promociones ... ");
              db = SQLite.openDatabase(
                database_name,
                database_version,
                database_displayname,
                database_size,
            );

            var cont = 0;
               db.transaction( (txn) => {
                txn.executeSql("DROP TABLE IF EXISTS CatPromociones")
                 txn.executeSql(
                  "CREATE TABLE IF NOT EXISTS "
                  + "CatPromociones "
                  + "(ch_codigo INTEGER PRIMARY KEY AUTOINCREMENT, ch_idcatalogo INTEGER, ch_idoffline INTEGER, ch_idproducto INTEGER);"
                  )
                  myResponse?.catapromo.map((value,index) => {
                    
                   txn.executeSql(
                      'INSERT INTO CatPromociones(ch_idcatalogo, ch_idoffline, ch_idproducto) VALUES (?, ?, ?)', [
              
                        value.ch_idcatalogo,
                        0,
                        value.ch_idproducto
                    ],
                      (txn, results) => {
                        console.log('CatPromociones', results.rowsAffected);
                        if (results.rowsAffected > 0) {
                          cont++;
                          console.log("CatPromociones_" + cont)
                        }
                      })
                  })
                })
                updateCatPromociones();
                console.log("termino los Catalogos de promociones");
            }
            
          }

          const updateCatPromociones= async () => {
          
            db = SQLite.openDatabase(
              database_name,
              database_version,
              database_displayname,
              database_size,
          );
  
          console.log("Estamos adentro de updateCatCombo");
            db.transaction((tx) => {
              tx.executeSql('SELECT a.ct_codigo as codigooff, a.ct_idcata as idcata FROM Catalogo a, CatPromociones b WHERE a.ct_idcata = b.ch_idcatalogo', [], (tx, results) => {
                console.log("Query completed");
                var len = results.rows.length;
                console.log("cantidad de Combo: " + len);
                for (let i = 0; i < len; i++) {
                  
                  let row = results.rows.item(i);
                  let codigooff = row.codigooff;
                  console.log("valor off: "+codigooff)
                  let idcata = row.idcata;
                  tx.executeSql(
                    'UPDATE CatPromociones SET ch_idoffline = ? WHERE ch_idcatalogo = ?',
                    [codigooff,idcata ],
                    (tx, updateResult) => {
                      // Maneja el resultado de la actualización si es necesario
                      console.log("Actualización realizada con éxito Catalogo Hueso");
                    }
                  );
                  
                }
                console.log("Catalogo Hueso registrada con éxito");
                setActDB(actdb+1);
              },
              (tx, error) => {
                // Manejar errores en la ejecución de la sentencia SQL
                console.error('Error en la sentencia SQL:', error);
              });                                       
            });
          }

          




           /** CARGAR LOS CATALOGO DE LIQUIDACIONES */


           getCatLiquidaciones = async () => {
            console.log("getCatLiquidaciones")
            try {
              setLoading10(true)
              setCatLiqui(2);
              const response = await fetch(
                "https://app.cotzul.com/Catalogo/php/conect/db_getcatliqui.php"
              );
              const jsonResponse = await response.json();
              console.log(jsonResponse)
              saveCatLiquidacion(jsonResponse);
              setLoading10(false)
            } catch (error) {
              setLoading10(false)
              console.log("un error cachado");
              console.log(error);
            }
          }


          saveCatLiquidacion = async (myResponse) => {
            if (loading10) {
              settextIndicador("Registro de Catalogos de liquidaciones ... ");
              db = SQLite.openDatabase(
                database_name,
                database_version,
                database_displayname,
                database_size,
            );

            var cont = 0;
               db.transaction( (txn) => {
                txn.executeSql("DROP TABLE IF EXISTS CatLiquidaciones")
                 txn.executeSql(
                  "CREATE TABLE IF NOT EXISTS "
                  + "CatLiquidaciones "
                  + "(cl_codigo INTEGER PRIMARY KEY AUTOINCREMENT, cl_idcatalogo INTEGER, cl_idoffline INTEGER, cl_idproducto INTEGER);"
                  )
                  myResponse?.cataliqui.map((value,index) => {
                    
                   txn.executeSql(
                      'INSERT INTO CatLiquidaciones(cl_idcatalogo, cl_idoffline, cl_idproducto) VALUES (?, 0, ?)', [
                      
                        value.cl_idcatalogo,
                        0,
                        value.cl_idproducto
                    ],
                      (txn, results) => {
                        console.log('CatLiquidaciones', results.rowsAffected);
                        if (results.rowsAffected > 0) {
                          cont++;
                          console.log("CatLiquidaciones_" + cont)
                        }
                      })
                  })
                })

                updateCatLiquidaciones();
                console.log("termino los Catalogos de liquidaciones");
            }
            
          }

          const updateCatLiquidaciones= async () => {
          
            db = SQLite.openDatabase(
              database_name,
              database_version,
              database_displayname,
              database_size,
          );
  
          console.log("Estamos adentro de updateCatProductos");
            db.transaction((tx) => {
              tx.executeSql('SELECT a.ct_codigo as codigooff, a.ct_idcata as idcata FROM Catalogo a, CatLiquidaciones b WHERE a.ct_idcata = b.cl_idcatalogo', [], (tx, results) => {
                console.log("Query completed");
                var len = results.rows.length;
                console.log("cantidad de Combo: " + len);
                for (let i = 0; i < len; i++) {
                  
                  let row = results.rows.item(i);
                  let codigooff = row.codigooff;
                  console.log("valor off: "+codigooff)
                  let idcata = row.idcata;
                  tx.executeSql(
                    'UPDATE Catproducto SET cl_idoffline = ? WHERE cl_idcatalogo = ?',
                    [codigooff,idcata ],
                    (tx, updateResult) => {
                      // Maneja el resultado de la actualización si es necesario
                      console.log("Actualización realizada con éxito Catalogo Liquidaciones");
                    }
                  );
                  
                }
                console.log("Cat Liquidaciones registrada con éxito");
                setActDB(actdb+1);
              },
              (tx, error) => {
                // Manejar errores en la ejecución de la sentencia SQL
                console.error('Error en la sentencia SQL:', error);
              });                                       
            });
          }



          /** CARGAR LOS CATALOGO DE PRODUCTOS X LLEGAR */

          getCatxLlegar = async () => {
            console.log("getCatxLlegar")
            try {
              setLoading11(true)
              const response = await fetch(
                "https://app.cotzul.com/Catalogo/php/conect/db_getcatprox.php"
              );
              const jsonResponse = await response.json();
              console.log(jsonResponse)
              saveCatxLlegar(jsonResponse);
              setLoading11(false)
            } catch (error) {
              setLoading11(false)
              console.log("un error cachado");
              console.log(error);
            }
          }


          saveCatxLlegar = async (myResponse) => {
            if (loading11) {
              settextIndicador("Registro de Catalogos x Llegar ... ");
              db = SQLite.openDatabase(
                database_name,
                database_version,
                database_displayname,
                database_size,
            );

            var cont = 0;
               db.transaction( (txn) => {
                txn.executeSql("DROP TABLE IF EXISTS CatxLlegar")
                 txn.executeSql(
                  "CREATE TABLE IF NOT EXISTS "
                  + "CatxLlegar "
                  + "(cp_codigo INTEGER PRIMARY KEY AUTOINCREMENT, cp_idcatalogo INTEGER, cp_idoffline INTEGER, cp_idprox INTEGER);"
                  )
                  myResponse?.catafuturo.map((value,index) => {
                    
                   txn.executeSql(
                      'INSERT INTO CatxLlegar(cp_idcatalogo, cp_idoffline, cp_idprox) VALUES (?, ?, ?)', [
                        value.cp_idcatalogo,
                        0,
                        value.cp_idprox
                    ],
                      (txn, results) => {
                        console.log('CatxLlegar', results.rowsAffected);
                        if (results.rowsAffected > 0) {
                          cont++;
                          console.log("CatxLlegar_" + cont)
                        }
                      })
                  })
                })

                updateCatxLlegar();
                console.log("termino los Catalogos x llegar");
            }
            
          }


          const updateCatxLlegar = async () => {
          
            db = SQLite.openDatabase(
              database_name,
              database_version,
              database_displayname,
              database_size,
          );
  
          console.log("Estamos adentro de updateCatProductos");
            db.transaction((tx) => {
              tx.executeSql('SELECT a.ct_codigo as codigooff, a.ct_idcata as idcata FROM Catalogo a, CatxLlegar b WHERE a.ct_idcata = b.cp_idcatalogo', [], (tx, results) => {
                console.log("Query completed");
                var len = results.rows.length;
                console.log("cantidad de Combo: " + len);
                for (let i = 0; i < len; i++) {
                  
                  let row = results.rows.item(i);
                  let codigooff = row.codigooff;
                  console.log("valor off: "+codigooff)
                  let idcata = row.idcata;
                  tx.executeSql(
                    'UPDATE CatxLlegar SET cp_idoffline = ? WHERE cp_idcatalogo = ?',
                    [codigooff,idcata ],
                    (tx, updateResult) => {
                      // Maneja el resultado de la actualización si es necesario
                      console.log("Actualización realizada con éxito Catalogo x Llegar");
                    }
                  );
                  
                }
                console.log("Cat x Llegar registrada con éxito");
                setActDB(actdb+1);
              },
              (tx, error) => {
                // Manejar errores en la ejecución de la sentencia SQL
                console.error('Error en la sentencia SQL:', error);
              });                                       
            });
          }



        /** CARGAR LOS COMBOS DE PRODUCTOS */

        getCombo = async () => {
          console.log("getCombo")
          try {
            setLoading13(true)
            const response = await fetch(
              "https://app.cotzul.com/Catalogo/php/conect/db_getCombo.php"
            );
            const jsonResponse = await response.json();
            console.log(jsonResponse)
            saveCombo(jsonResponse);
            setLoading13(false)
          } catch (error) {
            setLoading13(false)
            console.log("un error cachado");
            console.log(error);
          }
        }


        saveCombo = async (myResponse) => {
          if (loading13) {
            settextIndicador("Registro Combos de productos ... ");
            db = SQLite.openDatabase(
              database_name,
              database_version,
              database_displayname,
              database_size,
          );

          var cont = 0;
             db.transaction( (txn) => {
              txn.executeSql("DROP TABLE IF EXISTS Combos")
               txn.executeSql(
                "CREATE TABLE IF NOT EXISTS "
                + "Combos "
                + "(cb_codigo INTEGER, cb_nombcombo VARCHAR(50), cb_imgcombo TEXT, cb_fechareg VARCHAR(50),"
                + " cb_cantllega VARCHAR(50), cb_subtotal DOUBLE, cb_chktransporte INTEGER, cb_chkseguro INTEGER, cb_desccombo VARCHAR(100),"
                + " cb_chkiva INTEGER, cb_transporte DOUBLE, cb_seguro DOUBLE, cb_total DOUBLE, cb_tipoprecio INTEGER,"
                + " cb_preciosiniva DOUBLE, cb_preciomasiva DOUBLE, cb_factor DOUBLE, cb_estatus INTEGER, cb_arrayimg VARCHAR(200));"
                )
                myResponse?.combos.map((value,index) => {
                  
                 txn.executeSql(
                    'INSERT INTO Combos VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [
                      value.cb_codigo,
                      value.cb_nombcombo,
                      value.cb_imgcombo, 
                      value.cb_fechareg, 
                      value.cb_cantllega, 
                      value.cb_subtotal, 
                      value.cb_chktransporte, 
                      value.cb_chkseguro, 
                      value.cb_desccombo, 
                      value.cb_chkiva, 
                      value.cb_transporte, 
                      value.cb_seguro, 
                      value.cb_total, 
                      value.cb_tipoprecio, 
                      value.cb_preciosiniva, 
                      value.cb_preciomasiva, 
                      value.cb_factor, 
                      value.cb_estatus,
                      value.cb_arrayimg

                  ],
                    (txn, results) => {
                      console.log('Combos', results.rowsAffected);
                      if (results.rowsAffected > 0) {
                        cont++;
                        console.log("Combos_" + cont)
                      }
                    })
                })
              })
              getProdxCombo();
              console.log("termino los Combos");
          }
          
        }


        /* PRODUCTOS COMBOS */ 

        getProdxCombo = async () => {
          console.log("getProdxCombo")
          try {
            setLoading14(true)
            const response = await fetch(
              "https://app.cotzul.com/Catalogo/php/conect/db_getProdxCombo.php"
            );
            const jsonResponse = await response.json();
            console.log(jsonResponse)
            saveProdxCombo(jsonResponse);
            setLoading14(false)
          } catch (error) {
            setLoading14(false)
            console.log("un error cachado");
            console.log(error);
          }
        }

        saveProdxCombo = async (myResponse) => {
          if (loading14) {
            settextIndicador("Registro Productos x Combo ... ");
            db = SQLite.openDatabase(
              database_name,
              database_version,
              database_displayname,
              database_size,
          );

          var cont = 0;
             db.transaction( (txn) => {
              txn.executeSql("DROP TABLE IF EXISTS ProdxCombo")
               txn.executeSql(
                "CREATE TABLE IF NOT EXISTS "
                + "ProdxCombo "
                + "(cp_codigo INTEGER, cp_idcomb INTEGER, cp_idproducto INTEGER, cp_cantidad INTEGER,"
                + " cp_costonac DOUBLE, cp_preciocmp DOUBLE, cp_descuento INTEGER, cp_peso DOUBLE,"
                + " cp_prioridad INTEGER);"
                )
                myResponse?.prodxcombo.map((value,index) => {
                  
                 txn.executeSql(
                    'INSERT INTO ProdxCombo VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [
                      value.cp_codigo,
                      value.cp_idcomb,
                      value.cp_idproducto, 
                      value.cp_cantidad, 
                      value.cp_costonac, 
                      value.cp_preciocmp, 
                      value.cp_descuento, 
                      value.cp_peso, 
                      value.cp_prioridad
                  ],
                    (txn, results) => {
                      console.log('Prodxcombo', results.rowsAffected);
                      if (results.rowsAffected > 0) {
                        cont++;
                        console.log("ProdxCombo_" + cont)
                      }
                    })
                })
              })
              //presentCombos();
              getcatcombo();
              console.log("termino los Combos");
          }
          
        }


        /* CAT COMBOS */

        getcatcombo = async () => {
          console.log("getCombo1111")
          try {
            setLoading12(true)
            const response = await fetch(
              "https://app.cotzul.com/Catalogo/php/conect/db_getcatcombo.php"
            );
            console.log("https://app.cotzul.com/Catalogo/php/conect/db_getcatcombo.php");
            const jsonResponse = await response.json();
            console.log(jsonResponse)
            savecatCombo(jsonResponse);
            setLoading12(false)
          } catch (error) {
            setLoading12(false)
            console.log("un error cachado");
            console.log(error);
          }
        }

        savecatCombo = async (myResponse) => {
          if (loading12) {
            settextIndicador("Registro Catálogo de Combos de productos ... ");
            db = SQLite.openDatabase(
              database_name,
              database_version,
              database_displayname,
              database_size,
          );

          var cont = 0;
             db.transaction( (txn) => {
              txn.executeSql("DROP TABLE IF EXISTS Catcombos")
               txn.executeSql(
                "CREATE TABLE IF NOT EXISTS "
                + "Catcombos "
                + "(cc_codigo INTEGER PRIMARY KEY AUTOINCREMENT, cc_idcatalogo INTEGER, cc_idoffline INTEGER, cc_idcombo INTEGER);"
                )
                myResponse?.catacombo.map((value,index) => {
                  console.log("ingreso a catregistro");
                  
                 txn.executeSql(
                    'INSERT INTO  Catcombos(cc_idcatalogo, cc_idoffline, cc_idcombo) VALUES (?, ?, ?)', [
                      value.cc_idcatalogo,
                      0,
                      value.cc_idcombo
                  ],
                    (txn, results) => {
                      console.log('Catcombos', results.rowsAffected);
                      if (results.rowsAffected > 0) {
                        cont++;
                        console.log("Catcombos_" + cont)
                      }
                    })
                })
              })
             updateCatCombos();
              
              
             // console.log("termino los Combos");
          }
          
        }


        const updateCatCombos= async () => {
          
          db = SQLite.openDatabase(
            database_name,
            database_version,
            database_displayname,
            database_size,
        );

        console.log("Estamos adentro de updateCatCombo");
          db.transaction((tx) => {
            tx.executeSql('SELECT a.ct_codigo as codigooff, a.ct_idcata as idcata FROM Catalogo a, Catcombos b WHERE a.ct_idcata = b.cc_idcatalogo', [], (tx, results) => {
              console.log("Query completed");
              var len = results.rows.length;
              console.log("cantidad de Combo: " + len);
              for (let i = 0; i < len; i++) {
                
                let row = results.rows.item(i);
                let codigooff = row.codigooff;
                console.log("valor off: "+codigooff)
                let idcata = row.idcata;
                tx.executeSql(
                  'UPDATE Catcombos SET cc_idoffline = ? WHERE cc_idcatalogo = ?',
                  [codigooff,idcata ],
                  (tx, updateResult) => {
                    // Maneja el resultado de la actualización si es necesario
                    console.log("Actualización realizada con éxito");
                  }
                );
                
              }
              console.log("Combos registrada con éxito");
              setActDB(actdb+1);
            },
            (tx, error) => {
              // Manejar errores en la ejecución de la sentencia SQL
              console.error('Error en la sentencia SQL:', error);
            });                                       
          });
        }



    /*  useEffect(() => {
          if(actdb >= 0 && actdb < 6){
             // createTable();
              setActDB(actdb +1);
          }
          if(actdb == 1){
              
              console.log("registro Producto");
              createTable2();
              settextIndicador("Tabla producto registrado correctamente ... ");
          }else if(actdb == 2){
              console.log("registro Catalogo");
              settextIndicador("Tabla Catálogo registrado correctamente ... ");
          }else if(actdb == 3){
              console.log("registro Cliente");
              settextIndicador("Tabla Cliente registrado correctamente ... ");
          }else if(actdb == 4){
              console.log("registro Catproducto");  
              settextIndicador("Tabla Catproducto registrado correctamente ... ");
          } else if(actdb == 5){
              console.log("registro datos producto");  
              settextIndicador("Registro de Datos productos ... ");
          }     
          
      },[actdb]);


      


      useEffect(() => {
        if(actcli == 1){
            getClientes();
        }
    },[actcli]);


    useEffect(() => {
      if(actcat == 1){
          getProductosxcatalogos();
      }
  },[actcat]);

  useEffect(() => {
    if(actfam == 1){
        getFamiliaCat();
    }
},[actfam]);

useEffect(() => {
  if(acthueso == 1){
      getProdHueso();
  }
},[acthueso]);


useEffect(() => {
if(actliq == 1){
    getProdLiquidacion();
}
},[actliq]);

useEffect(() => {
if(actxllegar == 1){
    getProdxLlegar();
}
},[actxllegar]);


useEffect(() => {
if(catpromo == 1){
    getCatPromociones();
}
},[catpromo])


useEffect(() => {
if(catliqui == 1){
    getCatLiquidaciones();
}
},[catliqui])*/



 
  

    
    

    return (<> 
       
        <View style={styles.formContainer}>
            <Text style={styles.textTitulo}>Recopilando Datos</Text>
            <Image 
                source={require("../../assets/img/logo_cotzul.jpeg")}
                resizeMode = "contain"
                style={styles.image}
            />
            
            <ActivityIndicator style={styles.actInd} size="large" color="#0000ff" />
            <Text style={styles.textInd}>{textIndicador}</Text>
        </View>
        </>
    )
}

const styles = StyleSheet.create({
    formContainer:{
        flex: 1,
        alignItems: 'center',
        marginTop: 10, 
    },
    textTitulo:{
        fontSize: 25,
        color: colors.textDark,
        marginTop: 150
    },
    image:{
        height: 50,
        width: "50%",
        marginTop: 20, 
        marginBottom: 10,
    },
    actInd:{
        marginTop: 50, 
    },
    textInd:{
        marginTop: 20,
        fontSize: 15,
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
