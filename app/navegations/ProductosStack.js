import React from "react";
import {createStackNavigator} from "@react-navigation/stack";
import Productos from "../screens/Productos";
import Producto from "../productos/Producto";
import Combo from "../productos/Combo";
import { Itempromo } from "../productos/Itempromo";

const Stack = createStackNavigator();
export default function ProductosStack(){
    return(
        <Stack.Navigator>
            <Stack.Screen 
            name="productos"
            component={Productos}
            options={{title:"Listado de Productos"}} />
            <Stack.Screen 
            name="producto"
            component={Producto}
            options={{title:"Detalle producto"}} />
            <Stack.Screen 
            name="combo"
            component={Combo}
            options={{title:"Detalle Combo"}} />
            <Stack.Screen 
            name="promocional"
            component={Itempromo}
            options={{title:"Imagen Promocional"}} />
        </Stack.Navigator>
        
    );
}