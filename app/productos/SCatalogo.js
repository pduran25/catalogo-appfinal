import React,{useState, useEffect} from 'react'
import { Image, FlatList, Text, View, StyleSheet, ActivityIndicator, TouchableOpacity, Alert, Linking, Clipboard, ScrollView, TextInput, Pressable} from 'react-native';
import axios from 'axios'
import { colors, Button, Icon, SearchBar, CheckBox } from "react-native-elements";
import * as SQLite from 'expo-sqlite';
import Modal from "react-native-modal";
import DataAddProd from '../data/DataAddProd'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Picker from '@ouroboros/react-native-picker';
import { async } from '@firebase/util';


const database_name = 'CotzulBD4.db';
const database_version = '1.0';
const database_displayname = 'CotzulBD';
const database_size = 200000;

export default function SCatalogo(props) {
    const {navigation, route} = props;
    const {ct_codigo,ct_nomcata, ct_nomcliente, ct_codcliente, ct_idcata} = route.params;
    const [posts, setPosts] = useState([])
    const [tprecio, setTprecio] = useState(0);
    const [precio, setPrecio] = useState("-");
    const [isModalVisible, setIsModalVisible] = React.useState(false);
    const [isModalVisible2, setIsModalVisible2] = React.useState(false);
    const [search, setSearch] = useState("");
    const [tcatalogo, setCatalogo] = useState(1);
    const [nomcatalogo, setNomcatalogo] = useState("Catálogo de productos");
    const [codigofin, setCodigofin] = useState(0);
    const [codigoprod, setCodigoprod] = useState(0);
    const [codigoprom, setCodigoprom] = useState(0);
    const [codigoliqui, setCodigoliqui] = useState(0);
    const [codigocombo, setCodigocombo] = useState(0);
    const [codigocat, setCodigocat] = useState(0);
    const [arraydata, setArraydata] = useState([]);
    const [sql2, setSql2] = useState("");
    var codigovar = 0;
    var ArrayDatos = []
    const [sql, setSql] = useState("");
    
    var number = 0;
    const [btnvisible, setBtnvisible] = useState(true);
    const [btnvisible2, setBtnvisible2] = useState(true);
    const [textoespera, setTextoespera] = useState("Por favor espere, registrando productos...")
    const [nombreCata, onChangeText] = React.useState("");
    const [tcliente, setTcliente] = useState(0);
    const [Clientes, setClientes] = useState([])
    const [primera, setPrimera] = useState(0)
    const [isChecked1, setIsChecked1] = useState(false);
    const [isChecked2, setIsChecked2] = useState(false);
    const [isChecked3, setIsChecked3] = useState(false);
    const [dataUser, setdataUser] = useState(null);
    const [datap, setDatap] = useState("");
    const [datar, setDatar] = useState("");
    const [datal, setDatal] = useState("");
    const [cntp, setCntp] = useState(-1);
    const [cntr, setCntr] = useState(-1);
    const [cntl, setCntl] = useState(-1);
    const [cntc, setCntc] = useState(-1);
    const [nombrecliente, setNombreCliente] = useState(0);
    const STORAGE_KEY = '@save_data'
    const STORAGE_DB = '@login_data'
    const [contcheck, setContcheck] = useState(0);
    const [idcatalogo, setidcatalogo] = useState(0);
    const [codproductos, setcodproductos] = useState("");
    const [modificado, setModificado] = useState(0);
    

    var checkval = 0;
    

    
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
            cargarDatosCatalogo();
        }
        setidcatalogo(ct_idcata);
    }, []);

    const abrirtablaCatProd = async() => {
        getDataCatP();
        
    }

    const cargarDatosCatalogo = async () => {
        db = SQLite.openDatabase(
            database_name,
            database_version,
            database_displayname,
            database_size,
        );

        db.transaction((tx) => {
            tx.executeSql(
                'SELECT * FROM Catalogo WHERE ct_codigo = ?',
                [ct_codigo],
                (tx, results) => {
                  var len = results.rows.length;
                  for (let i = 0; i < len; i++) {
                    let row = results.rows.item(i);
                    let ct_modprod = row.ct_modprod;
                    let ct_modprom = row.ct_modprom;
                    let ct_modliqui = row.ct_modliqui;
                    let ct_modxllegar = row.ct_modxllegar;
                    let ct_modcombo = row.ct_modcombo;
                    let ct_total = ct_modprod + ct_modprom + ct_modliqui + ct_modxllegar + ct_modcombo;
                    console.log("catalogo de productos modificado: "+ ct_total);
                    if(ct_total>0)
                      setModificado(1) 

                  }
                },(tx, error) => {
                    // Manejar errores en la ejecución de la sentencia SQL
                    console.error('Error en la sentencia SQL:', error);
                  }); 

        });

    };

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

    const getDataCatP = async () => {
        
        db = SQLite.openDatabase(
            database_name,
            database_version,
            database_displayname,
            database_size,
        ); 
   
        db.transaction((tx) => {
            tx.executeSql(
            'SELECT a.pr_codigo as pr_codigo, a.pr_codprod as pr_codprod, a.pr_referencia as pr_referencia, a.pr_familia as pr_familia, a.pr_nivel1 as pr_nivel1, a.pr_nivel2 as pr_nivel2, a.pr_pvp as pr_pvp, a.pr_rutaimg as pr_rutaimg, a.pr_stock as pr_stock FROM Producto a, Catproducto b  WHERE b.cd_idoffline = ? AND b.cd_idproducto = a.pr_codigo',
            [`${ct_codigo}`],
            (tx, results) => {
                console.log("conteo de productos: "+ results.rows.length);
                var temp = [];
                for (let i = 0; i < results.rows.length; ++i)
                temp.push(results.rows.item(i));
                setPosts(temp);
                
            }
            );
        });
    };

    const getDataCatPromo = async () => {
        
        db = SQLite.openDatabase(
            database_name,
            database_version,
            database_displayname,
            database_size,
        ); 
   
        db.transaction((tx) => {
            tx.executeSql(
            'SELECT a.pr_codigo as pr_codigo, a.pr_codprod as pr_codprod, a.pr_referencia as pr_referencia, a.pr_familia as pr_familia, a.pr_nivel1 as pr_nivel1, a.pr_nivel2 as pr_nivel2, a.pr_pvp as pr_pvp, a.pr_rutaimg as pr_rutaimg, a.pr_stock as pr_stock FROM Producto a, CatPromociones b  WHERE b.ch_idoffline = ? AND b.ch_idproducto = a.pr_codigo',
            [`${ct_codigo}`],
            (tx, results) => {
                var temp = [];
                console.log("conteo de promociones: "+ results.rows.length);
                for (let i = 0; i < results.rows.length; ++i)
                temp.push(results.rows.item(i));
                setPosts(temp);
                
            }
            );
        });
    };

    const getDataCatCombo = async () => {
        
        db = SQLite.openDatabase(
            database_name,
            database_version,
            database_displayname,
            database_size,
        ); 
   
        db.transaction((tx) => {
            tx.executeSql(
            'SELECT a.cb_codigo as codigo, a.cb_nombcombo as cb_nombcombo, a.cb_desccombo as cb_desccombo, a.cb_total as cb_total, a.cb_imgcombo as cb_imgcombo FROM Combos a, Catcombos b WHERE b.cc_idoffline = ? AND b.cc_idcombo = a.cb_codigo',
            [`${ct_codigo}`],
            (tx, results) => {
                var temp = [];
                console.log("conteo de combos: "+ results.rows.length);
                for (let i = 0; i < results.rows.length; ++i)
                    temp.push(results.rows.item(i));
                setPosts(temp);
            },
            (tx, error) => {
              // Manejar errores en la ejecución de la sentencia SQL
              console.error('Error en la sentencia SQL:', error);
            }
            );
        });
    };

    const getDataCatLiqui = async () => {
        
        db = SQLite.openDatabase(
            database_name,
            database_version,
            database_displayname,
            database_size,
        ); 
   
        db.transaction((tx) => {
            tx.executeSql(
            'SELECT a.pr_codigo as pr_codigo, a.pr_codprod as pr_codprod, a.pr_referencia as pr_referencia, a.pr_familia as pr_familia, a.pr_nivel1 as pr_nivel1, a.pr_nivel2 as pr_nivel2, a.pr_pvp as pr_pvp, a.pr_rutaimg as pr_rutaimg, a.pr_stock as pr_stock FROM Producto a, CatLiquidaciones b  WHERE b.cl_idoffline = ? AND b.cl_idproducto = a.pr_codigo',
            [`${ct_codigo}`],
            (tx, results) => {
                var temp = [];
                console.log("conteo de liquidaciones: "+ results.rows.length);
                for (let i = 0; i < results.rows.length; ++i)
                temp.push(results.rows.item(i));
                setPosts(temp);
            }
            );
        });
    };

    useEffect(() => {
       
        abrirtablaCatProd();
    }, [ct_codigo]);


    const handleModal = () => {
        if(!isModalVisible)
            setBtnvisible(true)
        setIsModalVisible(() => !isModalVisible);

    }

    const handleModal2 = () => {
        if(!isModalVisible2)
            setBtnvisible2(true)
            if (primera == 0){
                getDataCliente();
                setPrimera(1);
            }
        console.log("conteo de checks inicial: "+ contcheck);
        setIsModalVisible2(() => !isModalVisible2);

    }

    const rechargueResult = () => {
        if(tcatalogo == 1){
            setNomcatalogo("Catálogo de productos")
            setSql("SELECT * FROM Producto WHERE pr_referencia LIKE ?");
            getDataCatP()
        }else if(tcatalogo == 2){
            setNomcatalogo("Catálogo de promociones")
            setSql("SELECT b.pr_codigo as pr_codigo, b.pr_codprod as pr_codprod, b.pr_referencia as pr_referencia, b.pr_familia as pr_familia, b.pr_nivel1 as pr_nivel1, b.pr_nivel2 as pr_nivel2, b.pr_pvp as pr_pvp, b.pr_rutaimg as pr_rutaimg, b.pr_stock as pr_stock, b.pr_arrayimg as arrayimg FROM ProdHueso a, Producto b WHERE a.ph_codigo = b.pr_codigo AND b.pr_referencia LIKE ?");
            getDataCatPromo()
        }else if(tcatalogo == 3){
            setNomcatalogo("Catálogo de liquidaciones")
            setSql("SELECT b.pr_codigo as pr_codigo, b.pr_codprod as pr_codprod, b.pr_referencia as pr_referencia, b.pr_familia as pr_familia, b.pr_nivel1 as pr_nivel1, b.pr_nivel2 as pr_nivel2, b.pr_pvp as pr_pvp, b.pr_rutaimg as pr_rutaimg, b.pr_stock as pr_stock, b.pr_arrayimg as arrayimg FROM ProdLiquidacion a, Producto b WHERE a.pl_codigo = b.pr_codigo AND b.pr_referencia LIKE ?");
            getDataCatLiqui()
        }else if(tcatalogo == 5){
            setNomcatalogo("Catálogo de Combos")
            setSql("SELECT cb_codigo as cb_codigo, b.cb_nombcombo as nombcombo, cb_imgcombo as imgcombo, cb_total as total, cb_desccombo as desccombo FROM ProdxCombo a, Combos b WHERE a.cp_idcomb = b.cb_codigo AND b.cb_nombcombo LIKE ?");
            getDataCatCombo()
        }
    }

    



    
    useEffect(() => {
        if(tcatalogo == 1){
            setNomcatalogo("Catálogo de productos")
            setSql("SELECT * FROM Producto WHERE pr_referencia LIKE ?");
            getDataCatP()
        }else if(tcatalogo == 2){
            setNomcatalogo("Catálogo de promociones")
            setSql("SELECT b.pr_codigo as pr_codigo, b.pr_codprod as pr_codprod, b.pr_referencia as pr_referencia, b.pr_familia as pr_familia, b.pr_nivel1 as pr_nivel1, b.pr_nivel2 as pr_nivel2, b.pr_pvp as pr_pvp, b.pr_rutaimg as pr_rutaimg, b.pr_stock as pr_stock, b.pr_arrayimg as arrayimg FROM ProdHueso a, Producto b WHERE a.ph_codigo = b.pr_codigo AND b.pr_referencia LIKE ?");
            getDataCatPromo()
        }else if(tcatalogo == 3){
            setNomcatalogo("Catálogo de liquidaciones")
            setSql("SELECT b.pr_codigo as pr_codigo, b.pr_codprod as pr_codprod, b.pr_referencia as pr_referencia, b.pr_familia as pr_familia, b.pr_nivel1 as pr_nivel1, b.pr_nivel2 as pr_nivel2, b.pr_pvp as pr_pvp, b.pr_rutaimg as pr_rutaimg, b.pr_stock as pr_stock, b.pr_arrayimg as arrayimg FROM ProdLiquidacion a, Producto b WHERE a.pl_codigo = b.pr_codigo AND b.pr_referencia LIKE ?");
            getDataCatLiqui()
        }else if(tcatalogo == 5){
            setNomcatalogo("Catálogo de Combos")
            setSql("SELECT cb_codigo as cb_codigo, b.cb_nombcombo as nombcombo, cb_imgcombo as imgcombo, cb_total as total, cb_desccombo as desccombo FROM ProdxCombo a, Combos b WHERE a.cp_idcomb = b.cb_codigo AND b.cb_nombcombo LIKE ?");
            getDataCatCombo()
        }
    }, [tcatalogo]);

    const guardarProductos1 = () => {
        setBtnvisible(!btnvisible)
        number++;
        console.log("ok: "+number)

    }

    const CargarDatos = async () => {
        CargarDatosparaEnvio(1);
    }

    const CargarDatosparaEnvio = async (analizar) => {

        db = SQLite.openDatabase(
            database_name,
            database_version,
            database_displayname,
            database_size,
        ); 

        var dtproductos = "";
        var contp = 0;
        var dtpromo = "";
        var contr = 0;
        var dtliqui = "";
        var contl = 0;
        var dtcombo = "";
        var contc = 0;

        db.transaction((tx) => {
            if(analizar == 1){
                console.log("SELECT cd_idproducto FROM Catproducto WHERE cd_idoffline = ?");
                tx.executeSql(
                    "SELECT cd_idproducto FROM Catproducto WHERE cd_idoffline = ?",
                    [ct_codigo],
                    (tx, results) => {
                        console.log("si registro el producto: "+results.rows.length);
                        
                        for (let i = 0; i < results.rows.length; ++i){
                            if(contp != 0)
                                dtproductos = dtproductos + "*";
                            dtproductos = dtproductos + results.rows.item(i).cd_idproducto;
                            contp++;
                        }
                            
                            setCodigoprod(dtproductos);
                            console.log("el numero inicial: "+ cntp+ "numero final: "+ contp);
                            setCntp(contp);
                            

                        }
                    );
            }else if(analizar == 2){
                console.log("SELECT ch_idproducto FROM CatPromociones WHERE ch_idoffline = ?");
                tx.executeSql(
                    "SELECT ch_idproducto FROM CatPromociones WHERE ch_idoffline = ?",
                    [ct_codigo],
                    (tx, results) => {
                        console.log("si registro el promociones: "+results.rows.length);
                        
                        for (let i = 0; i < results.rows.length; ++i){
                                if(contr != 0)
                                     dtpromo = dtpromo + "*";
                            dtpromo = dtpromo + results.rows.item(i).ch_idproducto;
                            contr++;
                        }
                            
                            setCodigoprom(dtpromo);
                            console.log("el numero inicial: "+ cntr+ "numero final: "+ contr);
                            setCntr(contr);
                          

                        }
                    );
            }else if(analizar == 3){
                console.log("SELECT cl_idproducto FROM CatLiquidaciones WHERE cl_idoffline = ?");
                tx.executeSql(
                    "SELECT cl_idproducto FROM CatLiquidaciones WHERE cl_idoffline = ?",
                    [ct_codigo],
                    (tx, results) => {
                        console.log("si registro el liquidaciones: "+results.rows.length);
                        
                        for (let i = 0; i < results.rows.length; ++i){
                            if(contl != 0)
                                 dtliqui = dtliqui + "*";
                            dtliqui = dtliqui + results.rows.item(i).cl_idproducto;
                            contl++;
                        }
                        console.log("el numero inicial: "+ cntl+ "numero final: "+ contl);
                        setCodigoliqui(dtliqui);  
                        setCntl(contl);
                        

                        }
                    );
            }else if(analizar == 4){
                console.log("SELECT cc_idcombo FROM Catcombos WHERE cc_idoffline = ?");
                tx.executeSql(
                    "SELECT cc_idcombo FROM Catcombos WHERE cc_idoffline = ?",
                    [ct_codigo],
                    (tx, results) => {
                        console.log("si registro el combo: "+results.rows.length);
                        
                        for (let i = 0; i < results.rows.length; ++i){
                            if(contc != 0)
                                 dtcombo = dtcombo + "*";
                                 dtcombo = dtcombo + results.rows.item(i).cc_idcombo;
                                 contc++;
                        }
                        console.log("el numero inicial: "+ cntc+ "numero final: "+ contc);
                        setCodigocombo(dtcombo);  
                        setCntc(contc);
                        

                        }
                    );
            }else if(analizar == 5){
                subirCatalogoaNube();

            }
                
        });

    }

   /* const cargaProductos = async () => {
        db = SQLite.openDatabase(
            database_name,
            database_version,
            database_displayname,
            database_size,
        ); 
    
        db.transaction((tx) => {

            if(isChecked1){
                console.log("probando ingreso:");
                tx.executeSql(
                    "SELECT cd_idproducto FROM Catproducto WHERE cd_idcatalogo = ?",
                    [ct_codigo],
                    (tx, results) => {
                        console.log("si registro el producto: "+results.rows.length);
                        var dtproductos = "";
                        var contp = 0;
                        for (let i = 0; i < results.rows.length; ++i){
                            if(contp != 0)
                                dtproductos = dtproductos + "*";
                            dtproductos = dtproductos + results.rows.item(i).cd_idproducto;
                            contp++;
                        }
                        console.log("dtproductos: "+ dtproductos+ "valor de conteo: "+contp);
                        setDatap(dtproductos);
                        setCodigoprod(dtproductos);
                       // setCntp(contp);
                        }
                    );
            }
                
           
            if(isChecked2){
                tx.executeSql(
                    "SELECT ch_idproducto FROM CatPromociones WHERE ch_idcatalogo = ?",
                    [ct_codigo],
                    (tx, results) => {
                        console.log("si registro el promociones: "+results.rows.length);
                        var dtpromo = "";
                        var contr = 0;
                        for (let i = 0; i < results.rows.length; ++i){
                                if(contr != 0)
                                     dtpromo = dtpromo + "*";
                            dtpromo = dtpromo + results.rows.item(i).ch_idproducto;
                            contr++;
                        }
                        setDatar(dtpromo);
                        setCntr(contr);  
                        setCodigoprom(dtpromo);
                        }
                    );
            }

            if(isChecked3){
                tx.executeSql(
                    "SELECT cl_idproducto FROM CatLiquidaciones WHERE cl_idcatalogo = ?",
                    [ct_codigo],
                    (tx, results) => {
                        console.log("si registro el liquidaciones: "+results.rows.length);
                        var dtliqui = "";
                        var contl = 0;
                        for (let i = 0; i < results.rows.length; ++i){
                            if(contl != 0)
                                 dtliqui = dtliqui + "*";
                            dtliqui = dtliqui + results.rows.item(i).cl_idproducto;
                            contl++;
                        }
                        setDatal(dtliqui); 
                        setCntl(contl);  
                        setCodigoliqui(dtliqui);  
                        }
                    );
            }


           
        });

        
        
    }
*/



    const subirCatalogoaNube = async () => {
        try {
            console.log("https://app.cotzul.com/Catalogo/php/conect/db_insertCatalogoComplet.php?idcliente="+ct_codcliente+"&nomcliente="+ct_nomcliente+"&nomcata="+ct_nomcata+"&codvendedor="+dataUser.us_idvendedor+"&idprodcata="+codigoprod+"&idprodpromo="+codigoprom+"&idprodliqui="+codigoliqui+"&idcombo="+codigocombo);
            const response = await fetch(
              "https://app.cotzul.com/Catalogo/php/conect/db_insertCatalogoComplet.php?idcliente="+ct_codcliente+"&nomcliente="+ct_nomcliente+"&nomcata="+ct_nomcata+"&codvendedor="+dataUser.us_idvendedor+"&idprodcata="+codigoprod+"&idprodpromo="+codigoprom+"&idprodliqui="+codigoliqui+"&idcombo="+codigocombo
            );
            const jsonResponse = await response.json();
            console.log(jsonResponse)
            jsonResponse?.prodregistrados.map((value,index) => {
               console.log("valor1: "+value.idcatalogo);
               setidcatalogo(value.idcatalogo);
               console.log("valor2: "+value.codproductos);
                setcodproductos(value.codproductos);
            });

          } catch (error) {
            console.log("un error cachado");
            console.log(error);
          }
    }

    useEffect(() => {
      if(idcatalogo != 0){
        db.transaction((tx) => {

            tx.executeSql(
                'UPDATE Catalogo SET ct_idcata = ? WHERE ct_codigo = ?',
                [idcatalogo, ct_codigo],
                (tx, results) => {
                    console.log("Catalogo Actualizado con éxito")
                }
                );
        });
      }
    }, [idcatalogo]);

    useEffect(() => {
        if(codproductos != ""){
            db.transaction((tx) => {
                var pprod = codproductos.split("*");
                if(pprod.length > 0){
                for (let i = 0; i <= pprod.length; i++) {
                    console.log("valor de pprod: "+pprod[i]);
                    if(pprod[i].includes("-")){
                    var pget = pprod[i].split("-");
                    tx.executeSql(
                        'UPDATE Catproducto SET cd_idcatalogo = ? WHERE cd_idoffline = ?',
                        [pget[1], pget[0]],
                        (tx, results) => {
                            console.log("Catproducto Actualizado con éxito: "+pget[0]+" = "+ pget[1])
                        }
                        );
                    }
                }
            }
                setcodproductos("");


                
            });
        }
    }, [codproductos])
    
    




    const guardarProductos = async () => {
        setBtnvisible(!btnvisible)
        if(tcatalogo == 1){
            setSql2('INSERT INTO Catproducto(cd_idoffline, cd_idproducto) VALUES(?,?)');
        }else if(tcatalogo == 2){
            setSql2('INSERT INTO CatPromociones(ch_idoffline, ch_idproducto) VALUES(?,?)');
        }else if(tcatalogo == 3){
            setSql2('INSERT INTO CatLiquidaciones(cl_idoffline, cl_idproducto) VALUES(?,?)');
        }else if(tcatalogo == 5){
            setSql2('INSERT INTO Catcombos(cc_idoffline, cc_idcombo) VALUES(?,?)');
        }

        var dtproductos = "";
        var contv = 0;
        console.log("Lenght datos inicial: " + ArrayDatos.length)
        setArraydata(ArrayDatos)
        for (let idproducto of ArrayDatos) {
            if(contv != 0)
                dtproductos = dtproductos + "*";
            dtproductos = dtproductos + idproducto;
            contv++;
        }

        

        console.log(dtproductos)
        setCodigofin(dtproductos)
        setModificado(1);
        console.log(ct_codigo)
        console.log(tcatalogo)

        /*
        db.transaction((tx) => {
            tx.executeSql(
            sql1,
            [`${ct_codigo}`],
            (tx, results) => {
                    var len = results.rows.length;
                    console.log("tamaño: " + len)
                    
                    if(len > 0){
                        setCodigofin(results.rows.item(0).cd_codigo+1)
                        codigovar = results.rows.item(0).cd_codigo+1;
                    }
                    else {
                        setCodigofin(1)
                        codigovar = 1;
                    }
                    
                    var tot = ArrayDatos.length;
                    var num = 1;

                    for (let idproducto of ArrayDatos) {
                        console.log(codigovar)
                        console.log("id de producto*222: " + idproducto);
                        insertProductos(codigovar, idproducto, tot, num, sql2)
                        codigovar++;
                        num++;
                        
                    }
                    
                    
            }
            );
        });*/

        /*console.log("https://app.cotzul.com/Catalogo/php/conect/db_insertProductos.php?idcatalogo="+ct_codigo+"&idproductos="+dtproductos+"&tcatalogo="+tcatalogo);

        try {
            const response = await fetch(
              "https://app.cotzul.com/Catalogo/php/conect/db_insertProductos.php?idcatalogo="+ct_codigo+"&idproductos="+dtproductos+"&tcatalogo="+tcatalogo
            );
            const jsonResponse = await response.json();
            console.log(jsonResponse)
            jsonResponse?.productosid.map((value,index) => {
               setCodigofin(value.codigo)
            });

          } catch (error) {
            console.log("un error cachado");
            console.log(error);
          }*/
        
        
    }

    const updateCatalogoVAR1 = async(codigocat, tot, vcatalogo) =>{
        var sqlup = "";
        if(vcatalogo == 1){
            sqlup = "UPDATE Catalogo SET ct_cantprod = ? WHERE ct_codigo = ?";
        }else if(vcatalogo == 2){
            sqlup = "UPDATE Catalogo SET ct_cantpromo = ? WHERE ct_codigo = ?";
        }else if(vcatalogo == 3){
            sqlup = "UPDATE Catalogo SET ct_cantliqui = ? WHERE ct_codigo = ?";
        }
        db.transaction((tx) => {
            tx.executeSql(
            sqlup,
            [tot, codigocat],
            (tx, results) => {
                console.log("grabo el update de catalogo: " + sqlup);
 


                if(contcheck == 1){
                    handleModal2()
                    navigation.navigate("scatalogo", { ct_codigo: codigocat, ct_nomcata: nombreCata, ct_nomcliente: nombrecliente, ct_codcliente: tcliente });
                }

                console.log("Entro a 1");
               
            }
            );
        });

            
                
    }

    const updateCatalogoVAR2 = async(codigocat, tot, vcatalogo) =>{
        var sqlup = "";
        if(vcatalogo == 1){
            sqlup = "UPDATE Catalogo SET ct_cantprod = ? WHERE ct_codigo = ?";
        }else if(vcatalogo == 2){
            sqlup = "UPDATE Catalogo SET ct_cantpromo = ? WHERE ct_codigo = ?";
        }else if(vcatalogo == 3){
            sqlup = "UPDATE Catalogo SET ct_cantliqui = ? WHERE ct_codigo = ?";
        }
        db.transaction((tx) => {
            tx.executeSql(
            sqlup,
            [tot, codigocat],
            (tx, results) => {
                console.log("grabo el update de catalogo: " + sqlup);
                /*handleModal()
                setBtnvisible(!btnvisible)
                if(vcatalogo == 1){
                    getDataCatP()
                }else if(vcatalogo == 2){
                    getDataCatPromo()
                }else if(vcatalogo == 3){
                    getDataCatLiqui()
                }  */


                if(contcheck == 2){
                    handleModal2()
                    navigation.navigate("scatalogo", { ct_codigo: codigocat, ct_nomcata: nombreCata, ct_nomcliente: nombrecliente, ct_codcliente: tcliente });
                }

                console.log("Entro a 2");
               
            }
            );
        });

            
                
    }

    const updateCatalogoVAR3 = async(codigocat, tot, vcatalogo) =>{
        var sqlup = "";
        if(vcatalogo == 1){
            sqlup = "UPDATE Catalogo SET ct_cantprod = ? WHERE ct_codigo = ?";
        }else if(vcatalogo == 2){
            sqlup = "UPDATE Catalogo SET ct_cantpromo = ? WHERE ct_codigo = ?";
        }else if(vcatalogo == 3){
            sqlup = "UPDATE Catalogo SET ct_cantliqui = ? WHERE ct_codigo = ?";
        }
        db.transaction((tx) => {
            tx.executeSql(
            sqlup,
            [tot, codigocat],
            (tx, results) => {
                console.log("grabo el update de catalogo: " + sqlup);
               

                if(contcheck == 3){
                    handleModal2()
                    navigation.navigate("scatalogo", { ct_codigo: codigocat, ct_nomcata: nombreCata, ct_nomcliente: nombrecliente, ct_codcliente: tcliente });
                }

                console.log("Entro a 3");
               
            }
            );
        });

            
                
    }

    function obtenerFechaActual() {
        const fecha = new Date();
        const formatoFecha = `${fecha.getFullYear()}-${(fecha.getMonth() + 1)
          .toString()
          .padStart(2, '0')}-${fecha.getDate().toString().padStart(2, '0')} ${fecha
          .getHours()
          .toString()
          .padStart(2, '0')}:${fecha.getMinutes().toString().padStart(2, '0')}:${fecha.getSeconds().toString().padStart(2, '0')}`;
        return formatoFecha;
      }


    const updateCatalogo = async(ct_codigo, tot) =>{
        var sqlup = "";
        
        const fechaActual = obtenerFechaActual();
        console.log("Presentando fecha actual: "+fechaActual);
        if(tcatalogo == 1){
            sqlup = "UPDATE Catalogo SET ct_cantprod = ct_cantprod + ?, ct_modprod = 1, ct_fechamod = ? WHERE ct_codigo = ?";
        }else if(tcatalogo == 2){
            sqlup = "UPDATE Catalogo SET ct_cantpromo = ct_cantpromo + ?, ct_modprom = 1, ct_fechamod = ?  WHERE ct_codigo = ?";
        }else if(tcatalogo == 3){
            sqlup = "UPDATE Catalogo SET ct_cantliqui = ct_cantliqui + ?, ct_modliqui = 1, ct_fechamod = ?  WHERE ct_codigo = ?";
        }else if(tcatalogo == 5){
            sqlup = "UPDATE Catalogo SET ct_cantcombo = ct_cantcombo + ?, ct_modcombo = 1, ct_fechamod = ?  WHERE ct_codigo = ?";
        }
        db.transaction((tx) => {
            tx.executeSql(
            sqlup,
            [tot, fechaActual, ct_codigo],
            (tx, results) => {
                console.log("grabo el update de catalogo: " + sqlup);
                handleModal()

                    console.log("Catalogo_registros afectados: " + results.rowsAffected)

                setBtnvisible(!btnvisible)
                if(tcatalogo == 1){
                    getDataCatP()
                }else if(tcatalogo == 2){
                    getDataCatPromo()
                }else if(tcatalogo == 3){
                    getDataCatLiqui()
                }else if(tcatalogo == 5){
                    getDataCatCombo()
                }   
            },(tx, error) => {
                console.log("error al grabar catalogo: "+error);
            }
            );
        });

     
            
                
    }

    



    const insertProductos = async (codigovar, idproducto, tot, num) => {
        db.transaction((tx) => {
                console.log("grabando este codigo: " + codigovar)
                tx.executeSql(
                    sql2,
                    [ct_codigo, idproducto],
                    (tx, results) => {
                        console.log("ingresado con exito: num: "+num+ " tot: "+ tot);
                        if((num+1) == tot){
                            updateCatalogo(ct_codigo, tot)
                        }
                    }
                    );
        });
        
    };

    const insertProductosv1 = async (codigovar, idproducto, tot, num) => {
        db.transaction((tx) => {
                console.log("grabando este codigo1: " + codigovar)

                tx.executeSql(
                    'INSERT INTO Catproducto(cd_idcatalogo, cd_idproducto) VALUES(?,?)',
                    [codigocat, idproducto],
                    (tx, results) => {
                        console.log("ingresado con exito")
                        if((num+1) == tot){
                            updateCatalogoVAR1(codigocat, tot, 1)
                        }
                    }
                    );
        });
        
    };

    const insertProductosv2 = async (codigovar, idproducto, tot, num) => {
        db.transaction((tx) => {
                console.log("grabando este codigo2: " + codigovar)

                tx.executeSql(
                    'INSERT INTO CatPromociones(ch_idcatalogo, ch_idproducto) VALUES(?,?)',
                    [codigovar, codigocat, idproducto],
                    (tx, results) => {
                        console.log("ingresado con exito")
                        if((num+1) == tot){
                            updateCatalogoVAR2(codigocat, tot, 2)
                        }
                    }
                    );
        });
        
    };

    const insertProductosv3 = async (codigovar, idproducto, tot, num) => {
        db.transaction((tx) => {
                console.log("grabando este codigo3: " + codigovar)

                tx.executeSql(
                    'INSERT INTO CatLiquidaciones(cl_idcatalogo, cl_idproducto) VALUES(?,?)',
                    [codigocat, idproducto],
                    (tx, results) => {
                        console.log("ingresado con exito")
                        if((num+1) == tot){
                            updateCatalogoVAR3(codigocat, tot, 3)
                        }
                    }
                    );
        });
        
    };

    

    useEffect(()  => {
        if(cntp > 0){
       
        console.log("prueba salio1: "+ cntp);
        if(cntp>0){
            console.log("Prueba productos-: "+ codigoprod);
        }
        CargarDatosparaEnvio(2);
    }else{
        console.log("que paso?");
    }

    },[cntp])

    useEffect(()  => {
        if(cntr > -1){
            console.log("codigoprom: "+ codigoprom);
      
        console.log("prueba salio2: "+ cntr);
        console.log("Prueba Prom-: "+ codigoprom); 
        if(cntr> 0){
                    console.log("Prueba Prom-: "+ codigoprom);    
        }
        CargarDatosparaEnvio(3);
        }
        
 
    },[cntr])

    useEffect(()  => {
        if(cntl > -1){

        console.log("prueba salio3: "+ cntl);
        if(cntl> 0){
                    console.log("Prueba Liquidacion-: "+ codigoliqui);  
        }
        CargarDatosparaEnvio(4);
    }
    },[cntl])

    useEffect(()  => {
        if(cntc > -1){

        console.log("prueba salio4: "+ cntc);
        if(cntc> 0){
                    console.log("Prueba Combo-: "+ codigocombo);  
        }
        CargarDatosparaEnvio(5);
    }
    },[cntc])



    useEffect(()=>{
        var contid = 0;
        var valid;
        var tot = arraydata.length;
        if(codigofin != 0){
            console.log("Presentacion de codigos: "+ codigofin);
            valid = codigofin.split("*");
            for (let idproducto of arraydata) {
                
                insertProductos(valid[contid], idproducto, tot, contid)
                console.log("entro este producto: "+valid[contid]);
                contid ++;
            }
        }
        

    }, [codigofin])



    const handleCheckBoxToggle1 = () => {
        if(!isChecked1)
            setContcheck(contcheck+1);
        else 
            setContcheck(contcheck-1);
        setIsChecked1(!isChecked1);
        console.log("valor de cont check1: "+ contcheck);

        
      };

      const handleCheckBoxToggle2 = () => {
        if(!isChecked2)
            setContcheck(contcheck+1);
        else 
            setContcheck(contcheck-1);
        setIsChecked2(!isChecked2);
        console.log("valor de cont check2: "+ contcheck);
      };
      

      const handleCheckBoxToggle3 = () => {
        if(!isChecked3)
            setContcheck(contcheck+1);
        else 
            setContcheck(contcheck-1);
        setIsChecked3(!isChecked3);
        console.log("valor de cont check3: "+ contcheck);
      };

      const asignarCatalogo = () => {
        console.log("Asignando catalogo")
        setBtnvisible2(!btnvisible2)
        asignaCatalogo()
    }

    const asignaCatalogo = async () => {
        var nomcli = "---";
        try {
            const response = await fetch(
                "https://app.cotzul.com/Catalogo/php/conect/db_insertNewCatalogo.php?idcliente=" + tcliente + "&nomcliente=" + nomcli + "&nomcata=" + nombreCata + "&codvendedor=" + dataUser.us_idvendedor
            );
            const jsonResponse = await response.json();
            console.log(jsonResponse)
            jsonResponse?.catalogoid.map((value, index) => {
                setCodigocat(value.idcodigo)

            });

        } catch (error) {
            console.log("un error cachado");
            console.log(error);
        }
    };

    const getCurrentDate = () => {

        var date = new Date().getDate();
        var month = new Date().getMonth() + 1;
        var year = new Date().getFullYear();

        //Alert.alert(date + '-' + month + '-' + year);
        // You can turn it in to your desired format
        return date + '-' + month + '-' + year;//format: dd-mm-yyyy;
    }

    useEffect(() => {
        if (codigocat != 0) {
            console.log("el codigo registrado es: " + codigocat)
            db.transaction((tx) => {
                tx.executeSql(
                    'INSERT INTO Catalogo(ct_codigo, ct_codcliente, ct_nomcliente, ct_nomcata, ct_tipocli, ct_fecha, ct_codvendedor, ct_cantprod, ct_cantpromo, ct_cantliqui, ct_cantprox) VALUES(?,?,?,?,?,?,?,?,?,?,?)',
                    [codigocat, tcliente, nombrecliente, nombreCata, 1, getCurrentDate(), dataUser.us_idvendedor, 0, 0, 0, 0],
                    (tx, results) => {
                        console.log("ingresado con exito ahora a cargar productos")
                        cargaProductos();
                    }
                );
            });
        }
    }, [codigocat])


    return (
        <View style={styles.container}>
            <View style={styles.titlesWrapper}>
                <Text style={styles.titlesSubtitle}>{ct_nomcata}</Text>
                <Text style={styles.titlesTitle}>{ct_nomcliente}</Text>
                <Text style={styles.titlesTitle}>Tipo Precio: </Text>
                <Picker
              onChanged={setTprecio}
              options={[
                {value: 0, text: 'Selecccionar'},
                {value: 1, text: 'Pvp'},
                  {value: 2, text: 'Contado'},
                  {value: 3, text: 'Credito'},
                  {value: 4, text: 'Subdistribuidor'},
                  {value: 5, text: 'Más iva'},
              ]}
              style={{borderWidth: 1, width:150, borderColor: '#a7a7a7', borderRadius: 5, marginTop:5, marginHorizontal:100, padding: 5, backgroundColor: "#6f4993", color: 'white', textAlign: 'center'}}
              value={tprecio}
          />
                <Modal isVisible={isModalVisible} tcatalogo={tcatalogo}>
                
                <View style={styles.modalContainer1}>
                    <View style={styles.modalContent1}>
                <Icon
                    reverse
                    type="material-community"
                    name="close"
                    color="red"
                    containerStyle={styles.btnContainer}
                    onPress={handleModal} 
                />
                <View style={styles.titlesWrapper2}>
                <Text style={styles.titlesSubtitle1}>{tcatalogo == 1? "Agregar productos": tcatalogo == 2? "Agregar promociones" : tcatalogo == 3? "Agregar Liquidaciones" : "Agregar Combos"}</Text>
               
                <View style={styles.searchWrapper}>
                    <View style={styles.search}>
                        {(tcatalogo != 5)?(<SearchBar
                        placeholder="Buscar por referencia"
                        onChangeText={(e)=> setSearch(e)}
                        containerStyle = {styles.Searchbar}
                        value= {search}
                        />):(<SearchBar
                            placeholder="Buscar por nombre"
                            onChangeText={(e)=> setSearch(e)}
                            containerStyle = {styles.Searchbar}
                            value= {search}
                            />)}
                        
                    </View>
                </View>
                
                <Text style={styles.titlesecond}>
                {tcatalogo == 1? "Listado de productos:": tcatalogo == 2? "Listado de promociones:" :tcatalogo == 3? "Listado de Liquidaciones:" : "Listado de Combos"}</Text>
                
                </View>

                
                
                <ScrollView style={styles.scrollview}>
                <View style={styles.productoWrapper}>
                <DataAddProd texto={search} sql={sql} tipocat={tcatalogo} ArrayDatos={ArrayDatos} />
                </View>
            </ScrollView>
                
            {(btnvisible) ? 
            <Button
                containerStyle={styles.btnContainerLogin2}
                buttonStyle = {styles.btnLogin}
                title='Agregar productos' 
                onPress={guardarProductos} 
                />
                 : 
                 <View style={styles.viewobservacion}>
                 <Text style={styles.observacion}>{textoespera}</Text>
                 <ActivityIndicator style={styles.actInd} size="large" color="#0000ff" />
                 </View>
                 }
                 
                
                </View></View>
                
                
            </Modal>

            <Modal isVisible={isModalVisible2}>
                <View style={{
                    flex: 1, backgroundColor: "white",
                    alignItems: "center", width: "100%", height: "50%"
                }}>
                    <Icon
                        reverse
                        type="material-community"
                        name="close"
                        color="red"
                        containerStyle={styles.btnContainer}
                        onPress={handleModal2}
                    />
                    <View style={styles.titlesWrapper}>
                        <Text style={styles.titlesSubtitle1}>Exportar Catálogo</Text>
                    </View>
                    <View style={styles.titlesWrapper}>
                        <Text style={styles.titlesSubtitle2}>Nombre Anterior:  </Text>
                        <Text style={styles.titlesSubtitle3}>{ct_nomcata}</Text>
                    </View>
                    

                    <Text style={styles.titlesSubtitle2}>Nuevo nombre del Catálogo:</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={onChangeText}
                        value={nombreCata}
                        keyboardType="text"

                    />

                  

            <Picker
              onChanged={selectedValue => {
                setTcliente(selectedValue);
                const selectedOption = Clientes.find(option => option.value === selectedValue);
                if (selectedOption) {
                  setNombreCliente(selectedOption.text); // Guarda el texto en otra variable
                }
              }}
              options={Clientes}
              style={{borderWidth: 1, width:250, borderColor: '#a7a7a7', borderRadius: 5, marginVertical:15, padding: 5, backgroundColor: "#6f4993", color: 'white', alignItems: 'center'}}
              value={tcliente}
          />

            <CheckBox
                    title="Catalogo de Productos"
                    checked={isChecked1}
                    onPress={handleCheckBoxToggle1}
                />
             <CheckBox
                    title="Catalogo de Promociones"
                    checked={isChecked2}
                    onPress={handleCheckBoxToggle2}
                />

            <CheckBox
                    title="Catalogo de Liquidacionesx"
                    checked={isChecked3}
                    onPress={handleCheckBoxToggle3}
                />

                    {(btnvisible2) ?
                        <Button
                            containerStyle={styles.btnContainerLogin2}
                            buttonStyle={styles.btnLogin}
                            title='Asignar Catálogo'
                            onPress={asignarCatalogo}
                        /> :
                        <View style={styles.viewobservacion}>
                            <Text style={styles.observacion}>{textoespera}</Text>
                            <ActivityIndicator style={styles.actInd} size="large" color="#0000ff" />
                        </View>
                    }
                </View>


            </Modal>
            <View style={styles.buttonsContainer}>
                {(idcatalogo == 0 || idcatalogo == null || modificado != 0) ? <Button
                    containerStyle={styles.btnContainerSincronizar}
                    buttonStyle = {styles.btnLogin}
                    icon={
                        <Icon
                          type="material-community"
                          name="upload"
                          size={25}
                          color="white"
                        />
                      }
                    title='Sincronizar' 
                    onPress={(CargarDatos)} 
                    /> :<><Button
                    containerStyle={styles.btnContainerLogin}
                    buttonStyle = {styles.btnLogin}
                    title='Ver' 
                    icon={
                        <Icon
                          type="material-community"
                          name="card-search-outline"
                          size={25}
                          color="white"
                        />
                      }

                      //https://app.cotzul.com/Catalogo/Presentacion/prod/productos.php?idcata="+idcatalogo+"&tipocata="+tcatalogo+"&tipo="+tprecio
                    onPress={ () => openUrl("https://app.cotzul.com/Catalogo/catalogocliente2.php?idcatalogo="+idcatalogo+"&idcliente="+ct_codcliente+"&tipousu=1")} 
                    />
                <Button
                    containerStyle={styles.btnContainerLogin}
                    buttonStyle = {styles.btnLogin}
                    icon={
                        <Icon
                          type="material-community"
                          name="link-variant-plus"
                          size={25}
                          color="white"
                        />
                      }
                    title='Copiar' 
                    onPress={ () => copiarLink("https://app.cotzul.com/Catalogo/catalogocliente2.php?idcatalogo="+idcatalogo+"&idcliente="+ct_codcliente+"&tipousu=1")} 
                    /></> }
                
                <Button
                    containerStyle={styles.btnContainerLogin}
                    buttonStyle = {styles.btnLogin}
                    icon={
                        <Icon
                          type="material-community"
                          name="plus-thick"
                          size={25}
                          color="white"
                        />
                      }
                    title='Agregar' 
                    onPress={handleModal} 
                    />
                     
                </View>
                <Button
                    containerStyle={styles.btnContainerTotal}
                    buttonStyle = {styles.btnLogin}
                    icon={
                        <Icon
                          type="material-community"
                          name="export"
                          size={25}
                          color="white"
                        />
                      }
                    title=' Exportar Catálogo' 
                    onPress={handleModal2} 
                    />
                <Text style={styles.titlesTitle}>Tipo de Catálogo: </Text>
                <Picker
              onChanged={setCatalogo}
              options={[
                {value: 0, text: 'Selecccionar'},
                {value: 1, text: 'Productos'},
                  {value: 2, text: 'Promociones'},
                  {value: 3, text: 'Liquidaciones'},
                  {value: 5, text: 'Combos'},
              ]}
              style={{borderWidth: 1, width:150, borderColor: '#a7a7a7', borderRadius: 5, marginTop:5, marginHorizontal:100, padding: 5, backgroundColor: "#6f4993", color: 'white', textAlign: 'center'}}
              value={tcatalogo}
          />
                <Text style={styles.titlesecond}>{nomcatalogo}:</Text>
            </View>
            <ScrollView>
            {posts == null || posts.length == 0 ? (
                <View><NoFoundProducts /></View>
            ) : (<View>
                <FlatList
                data = {posts}
                keyExtractor={( id , index) => index.toString()}
                renderItem={({ item }) => (<ListProducto producto={item} navigation={navigation} tcatalogo={tcatalogo} rechargueResult={rechargueResult}  /> )} 
                ListFooterComponent={() => <View style={{flex:1,justifyContent: "center",alignItems: "center"}}><Text style={styles.finalproducto}>--- Fin de busqueda ---</Text></View>}
                />
            </View>)}
            </ScrollView>
        </View>
    )
}

function copiarLink(url){
    Clipboard.setString(url);
    Alert.alert("Link copiado con éxito");
}

function NoFoundProducts(){
    return(<View style={{flex: 1, alignItems: 'center', }}>
    <Image
        source={require("../../assets/img/no-result-found.png")}
        resizeMode = "cover"
        style={{width: 200, height: 200}}
    />
</View>); 
}


function ListProducto(props){
    const {producto, navigation, tcatalogo, rechargueResult} = props;
    const [modalVisible, setModalVisible] = useState(false);
    const [sqla, setSqla] = useState("");

    useEffect(() => {
        console.log(sqla);
    
    }, [sqla])


   
    
    const goElimina = (tcatalogo, code) => {
        // Mostrar el modal de confirmación

        db = SQLite.openDatabase(
            database_name,
            database_version,
            database_displayname,
            database_size,
        ); 


        console.log("ingreo a goElimina");

        if(tcatalogo == 1){
            setSqla("DELETE FROM Catproducto WHERE cd_idproducto = ?");
        }else if(tcatalogo == 2){
            setSqla("DELETE FROM CatPromociones WHERE ch_idproducto = ?");
        }else if(tcatalogo == 3){
            setSqla("DELETE FROM CatLiquidaciones WHERE cl_idproducto = ?");
        }else if(tcatalogo == 5){
            setSqla("DELETE FROM Combos WHERE cb_codigo = ?");
        }

        


        db.transaction((tx) => {
            tx.executeSql(
            sqla,
            [`${code}`],
            (tx, results) => {
                console.log("Se elimino con exito");
                rechargueResult();
                setModalVisible(!modalVisible);
                
            }, (tx, error) => {
                console.error("Error al ejecutar la transacción SQL:", error);
                // Manejar el error de alguna manera (puede mostrar un mensaje al usuario, hacer un rollback, etc.)
              }
            );
        });




       
    };
    const {pr_codigo,pr_codprod, pr_referencia, pr_familia, pr_nivel1, pr_nivel2, pr_pvp, pr_stock, pr_rutaimg, codigo, cb_nombcombo, cb_desccombo, cb_total, cb_imgcombo} = producto;

    const goProducto = () =>{
        if(tcatalogo != 5)
            navigation.navigate("producto",{pr_codigo, pr_codprod, pr_referencia,}); 
        else
            navigation.navigate("combo",{codigo}); 
     }

    return (<TouchableOpacity onPress={goProducto}>
                <View style={styles.productoCardWrapper}>
                <View style={styles.productoImage}>
                    {(tcatalogo != 5)?(<Image
                    PlaceholderContent = {<ActivityIndicator color="fff" />}
                    style={{width:100, height:100}}
                    source={{uri: pr_rutaimg}}
                />):(<Image
                    PlaceholderContent = {<ActivityIndicator color="fff" />}
                    style={{width:100, height:100}}
                    source={{uri: cb_imgcombo}}
                />)}
                
                </View>
                {(tcatalogo!=5)?(<><View style={styles.productoTexto}>
                        <Text style={styles.productoReferencia}>{pr_referencia}</Text>
                        <Text style={styles.productoCodigo}>{pr_codprod}</Text>
                        <Text style={styles.productoConf}>{pr_familia}</Text>
                        <Text style={styles.productoConf}>{pr_nivel1}</Text>
                        <Text style={styles.productoConf}>{pr_nivel2}</Text>
                        
                    </View>
                    <View style={styles.productoPrecio}>
                                <Text style={styles.textoPrecio}>cant:{pr_pvp}</Text>
                    </View></>):(<><View style={styles.productoTexto}>
                        <Text style={styles.productoReferencia}>{cb_nombcombo}</Text>
                        <Text style={styles.productoCodigo}>{cb_desccombo}</Text>
                        <Text style={styles.productoConf}>-</Text>
                        <Text style={styles.productoConf}>-</Text>
                        <Text style={styles.productoConf}>-</Text>
                        
                    </View>
                    <View style={styles.productoPrecio}>
                                <Text style={styles.textoPrecio}>$ {cb_total}</Text>
                    </View></>)}
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
                        onPress={() => goElimina(tcatalogo, ((tcatalogo != 5)?pr_codigo:codigo))}
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

async function openUrl(url){
    console.log(url)
    const isSupported = await Linking.canOpenURL(url);
        if(isSupported){
            await Linking.openURL(url)
        }else{
            Alert.alert('No se encontro el archivo xls');
        }
}

const styles = StyleSheet.create({

    titlesWrapper:{
        marginTop: 10,
        paddingHorizontal: 20,
    },
    titlesWrapper2:{
        marginTop: 10,
        width: "100%",
        paddingHorizontal: 20,
    },
    buttonsContainer:{
        flexDirection: 'row',
        alignItems:'center',
        marginBottom: 10,
    },
    btnLogin:{
        backgroundColor: "#00a680",
    },
    btnContainerSincronizar:{
        marginTop: 10,
        paddingHorizontal: 5, 
        width: "66%"
    },
    btnContainerLogin:{
        marginTop: 10,
        paddingHorizontal: 5, 
        width: "33%"
    },
    titlesSubtitle3: {
        textAlign:'center',
        marginTop: 10,
        fontSize: 16,
        color: colors.textDark,
    },
     // Estilos para el modal
     modalContainer1: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',

    },
    modalContent1: {
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
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
    titlesSubtitle2: {
        // fontFamily: 
        fontWeight: 'bold',
        textAlign:'center',
        marginTop: 10,
        fontSize: 16,
        color: colors.textDark,
    },
    titlesSubtitle: {
        // fontFamily: 
        fontSize: 20,
        color: '#9462c1',
    },
    iconoTachoWrapper: {
        position: 'absolute',
        top: 15,
        right: 20,
      },
    input: {
        width: "90%",
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
    },

    btnContainerTotal:{
        marginVertical: 10,
        paddingHorizontal: 5, 
        width: "100%"
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
      buttonClose: {
        backgroundColor: "#9462c1",
        borderRadius: 20,
      },
   
titlesSubtitle:{
   // fontFamily: 
   fontSize: 25,
   color:'#9462c1',
   fontWeight: 'bold',
   textAlign: 'center'
},
titlesSubtitle1:{
    // fontFamily: 
    fontSize: 18,
    color:'#9462c1',
    fontWeight: 'bold',
    textAlign: 'center',
    paddingBottom: 10
 },
btnContainerLogin2:{
    width: "90%",
    marginVertical: 10
},
titlesTitle:{
    // fontFamily: 
   fontSize: 15,
   color: colors.textDark,
   textAlign: 'center'
},
titlesecond:{
    paddingTop:10,
    fontSize: 15,
    fontWeight: 'bold',
    color: 'grey'
},
viewobservacion:{
    paddingVertical: 10,
},
observacion:{
    fontSize: 15,
    fontWeight: 'bold',
    color: 'grey'
},
productoCardWrapper:{
    backgroundColor: '#CDCDCD',
    borderRadius:25,
    paddingTop: 10,
    paddingLeft: 10,
    paddingBottom: 0,
    marginLeft:10,
    marginRight:10,
    marginTop:10,
    height: 120,
    flexDirection: 'row',
},  
textStyle: {
    color: "white",
    fontWeight: 'bold',
    textAlign: "center"
  },
productoTexto:{
    flexDirection: 'column',
    width: 180,
},
productoPrecio:{
    flexDirection: 'column',
    width: 50,
    height:100,
},
textoPrecio:{
    textAlign:'right',
    paddingTop:80,
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
Searchbar:{
    width: 300,
    backgroundColor: '#ffffff'
}, 
finalproducto:{
    color:'#9462c1',
    fontSize: 15,
    height: 300,
    marginTop: 10,
},
scrollview:{
    marginTop:10,
    marginBottom: 10,
},
productoWrapper:{
    marginTop: 10,
},
})

const pickerStyle = {
    inputIOS: {
        color: 'white',
        paddingHorizontal: 10,
        backgroundColor: 'red',
        borderRadius: 5,
    },
    placeholder: {
        color: 'white',
      },
    inputAndroid: {
        width: 100,
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
