import * as React from 'react';
import { StyleSheet, Text, View, FlatList, Switch, TouchableOpacity } from 'react-native';
import { Entypo } from '@expo/vector-icons'; //импортируем значок
import { updateAlarmReducer } from '../redux/alarmsSlice';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Checkbox({id, isCompleted}) {
    return ( 
      <View>
        <TouchableOpacity style={isCompleted ? styles.checked : styles.unChecked}> 
          {isCompleted && <Entypo name="check" size={16} color="#FAFAFA" />}
        </TouchableOpacity>
      </View>
    );
  }


const styles = StyleSheet.create({
    checked: {
        width: 20,
        height: 20,
        marginRight: 3, //13
        borderRadius: 6,
        backgroundColor: '#262626',
        alignItems: 'center', //выровнять предметы в центр
        justifyContent: 'center',
        marginLeft: 5, //15
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: .3,
        shadowRadius: 5,
        elevation: 0,//5
    },
    unChecked: {
        width: 20,
        height: 20,
        marginRight: 3,//13
        borderWidth: 2,
        borderColor: '#E8E8E8',
        borderRadius: 6,
        backgroundColor: '#fff',
        marginLeft: 5, //15
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: .1,
        shadowRadius: 5,
        elevation: 5,
    },
    isToday: {
        width: 10,
        height: 10,
        marginHorizontal: 10,
        borderRadius: 10,
        backgroundColor: '#262626',
        marginRight: 13,
        marginLeft: 15,
    },
})