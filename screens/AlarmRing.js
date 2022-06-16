import * as React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Platform } from 'react-native';
import AlarmList from '../components/AlarmList.js';
import { alarmsData } from '../date/alarms.js';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { hideComplitedReducer, setAlarmsReducer } from '../redux/alarmsSlice.js';
import { useDispatch, useSelector } from 'react-redux';
import * as Notification from 'expo-notifications';
//import  Constants from 'expo-constants';
import * as Device from 'expo-device';
import moment from 'moment';
import {MaterialIcons} from '@expo/vector-icons';
import { Audio } from "expo-av";

Audio.setAudioModeAsync({
  allowsRecordingIOS: false,
  staysActiveInBackground: true,
  interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DUCK_OTHERS,
  playsInSilentModeIOS: true,
  shouldDuckAndroid: true,
  interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DUCK_OTHERS,
  playThroughEarpieceAndroid: false,
});

const radio = new Audio.Sound();

async function playRadio (uri)  {
  try {
    await radio.stopAsync();
  } finally {
    try {
      await radio.unloadAsync();
    } finally {
      await radio.loadAsync({ uri });
      return await radio.playAsync();
    }
  }
}

async function stopRadio ()  {
  await radio.stopAsync()
  return await radio.unloadAsync();
} 



export default function AlarmRing({title}) {
    const navigation = useNavigation();
    const alarms = useSelector(state => state.alarms.alarms);

    const [loading, setLoading] = React.useState(false)

    React.useEffect(() => {
      setLoading(true)
      playRadio('http://sc-classrock.1.fm:8200/').finally(() => {
        setLoading(false)
      })
      return () => {
        stopRadio()
      }
    }, [])

    //TouchableOpacity - область прикосновения, используем ее, а не обычную кнопку, потому что в обычной кнопке нельзя поменять цвет и шрифт
  return (
    <View style={styles.container}>       
        <TouchableOpacity onPress={()=>navigation.goBack()} style={styles.button}>
            
            <Text style={styles.plus}>Отключить</Text>
        </TouchableOpacity>
        <MaterialIcons name={loading ? "file-download" : "access-alarm"} size={104} style={styles.icon} />
        <Text style={styles.text}>Alarm</Text>
        
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 15,//50
      paddingHorizontal: 15,

    },
    button:{
        width: 132,
        height: 42,
        borderRadius: 11,
        //backgroundColor: '#000',
        backgroundColor: 'purple',
        position: 'absolute',
        bottom: 50,
        right: 135,
        top:380,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: .5,
        shadowRadius: 5,
        elevation: 5,
        
    },
    plus:{
        fontSize:20,
        color:'#fff',
        position: 'absolute',
        top:4,
        left:11,
    },
    icon:{
        marginTop: 180,
        color:"grey",
        marginLeft: 140
    }, 
    text:{
      fontSize: 34,
        fontWeight: 'bold',
        marginBottom: 35,
        marginTop: 10,
        alignItems: 'center', //выровнять предметы в центр
        justifyContent: 'center',
        marginLeft: 145,
    }, 
    
  });