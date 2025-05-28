import * as React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Entypo } from '@expo/vector-icons';


export default function Checkbox({
    id,
    text,
    isCompleted,
    isToday,
    hour

}) {
    return (
        <TouchableOpacity style={style.checked}> 
            {isCompleted && <Entypo name="check" size={16} color="FAFAFA"/>}
        </TouchableOpacity>
    )
}

const style = StyleSheet.create({
    checked: {
        width: 20,
height:20,
marginRight:13,
borderRadius: 6,
backgroundColor: '#262626',
alignItems: 'center',
justifyContent: 'center',
marginleft: 15,
shadowColor: '#000',
shadowOfset: {
width: 0,
height: 2,
},
shadowOpacity: .3,
shadowRadius: 5,
elevation: 5,

    }
})