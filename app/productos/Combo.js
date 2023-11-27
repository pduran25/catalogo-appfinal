import React,{useState, useEffect} from 'react'
import { StyleSheet, Text, View, ScrollView, Dimensions, Alert, Linking, Clipboard, TextInput } from 'react-native'
import Carousel from "../components/Carousel"
import { Input, Icon, Button, CheckBox } from 'react-native-elements';
import * as SQLite from 'expo-sqlite';
import utf8 from 'utf8'

const screenWidth = Dimensions.get("window").width;
const database_name = 'CotzulBD4.db';
const database_version = '1.0';
const database_displayname = 'CotzulBD';
const database_size = 200000;

const STORAGE_KEY = '@save_data'
const STORAGE_DB = '@login_data'

export default function Combo(props) {

    const {navigation, route} = props;
    const {codigo} = route.params;
    const [images, setImages] = useState(["http://cotzul.com/Catalogo/img/producto-sm/0.png"]);
    const [prod, setProd] = useState({});

    useEffect(() => {
      getDataCombo();
    }, []);
    

    getDataCombo = async () => {
        
   
        try{
            db = SQLite.openDatabase(
                database_name,
                database_version,
                database_displayname,
                database_size,
            ); 
            db.transaction((tx) => {
                
                tx.executeSql(
                'SELECT a.cb_nombcombo as nombcombo, a.cb_imgcombo as imgcombo, a.cb_desccombo as desccombo, a.cb_total as total, a.cb_arrayimg as arrayimg FROM Combos a WHERE cb_codigo = '+ codigo,
                [],
                (tx, results) => {
                    var len = results.rows.length;
                    if(len > 0){
                      let res = results.rows.item(0);
                      setProd(res);
                      console.log("imagen: "+ res.imgcombo);
                      setImages(JSON.parse(res.arrayimg));
                    }
                }
                );
            });

            
        }catch (error) {
            console.log(error)
        }
        
    };



    return (
        <ScrollView vertical style={styles.viewBody}>
            <Carousel 
                arrayImages = {images}
                height = {screenWidth}
                width = {screenWidth}
            />
            <View style={styles.productoTexto}>
                <View style={styles.viewdetalle}>
                            <Text style={styles.productoReferencia}>{prod.nombcombo}</Text>
                            <Text style={styles.productoConf}>{prod.desccombo}</Text>
                </View>
                <View style={styles.viewprecio}>
                    <Text style={styles.preciompm}>${prod.total}</Text>
                </View>
                
            </View>
        </ScrollView>
        )

}

const styles2 = StyleSheet.create({
    
});

const styles = StyleSheet.create({
  viewBody: {
      flex: 1, 
      backgroundColor:"#fff"
  },
  productoTexto:{
      flexDirection: 'row',
     
  },
  viewdetalle:{
      flexDirection: 'column',
      width: 260,
  },
  viewprecio:{
      flexDirection: 'column',
      paddingTop: 30,
      width: 110
  },
  preciompm:{
      fontSize: 20,
      paddingRight: 10,
      textAlign:'right',
      fontWeight: 'bold',
      color: 'grey'
  },
  productoReferencia:{
      paddingTop: 30,
      paddingLeft: 10,
      textAlign: 'left',
      color:'#9462c1',
      fontSize: 25,
      fontWeight: 'bold',
      flexShrink: 1,
  },
  productoCodigo:{
      textAlign: 'left',
      paddingLeft: 10,
      fontSize: 18,
  },
  productoConf:{
      textAlign: 'left',
      paddingLeft: 10,
      paddingTop:2,
      fontSize: 15,
      color: 'grey'
  },
  productoDesc:{
      paddingTop: 10,
  },
  descripcion:{
      paddingLeft: 10,
      paddingTop: 20,
      paddingRight: 10,
  },
  labelcorta:{
      fontSize: 18
  },
  viewcorta:{
      fontSize: 15,
      color: 'grey'
  },
  styleboton:{
      paddingTop: 20,
  },
  styleboton1:{
      paddingTop: 0,
  },
  btnContainerLogin:{
      marginTop: 30, 
      paddingLeft:20,
      paddingBottom: 20,
      width: "95%"
  },
  btnContainerLogin:{
      marginTop: 5, 
      paddingLeft:20,
      paddingBottom: 20,
      width: "95%"
  },
  btnLogin:{
      backgroundColor: "#00a680",
  },
  container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
  head: {  height: 40,  backgroundColor: '#f1f8ff'  },
  wrapper: { flexDirection: 'row' },
  title: { flex: 1, backgroundColor: '#f6f8fa' },
  row: {  height: 28  },
  text: { textAlign: 'center' },
  containertext:{
      flex: 1,
      backgroundColor: '#FFF',
      alignItems: 'center', 
      justifyContent: 'center',
      marginTop:30, 
  },
  input:{
      borderWidth:1, 
      borderColor: '#777',
      padding: 8, 
      margin: 10, 
      width:200, 
  },
  checkboxContainer: {
      flexDirection: "row",
      marginBottom: 20,
    },
    checkbox: {
      alignSelf: "center",
    },
    label: {
      margin: 8,
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
};


function defaultValueUser(){
  return{
      us_codigo: "",
      us_idtipoadm: "",
      us_nombre: "",
      us_nomtipoadm: ""
  }
}