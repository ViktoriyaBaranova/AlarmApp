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

//настройка уведомлений
Notification.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true, //держать уведомления открытыми
        
    }),
})

export default function Home() {
    const alarms = useSelector(state => state.alarms.alarms); //список будильников
    const [expoPushToken, setExpoPushToken] = React.useState('');
    const navigation = useNavigation();
    const dispatch = useDispatch();

    React.useEffect(()=>{
        registerForPushNotificationsAsync().then(token => setExpoPushToken(token));
        const getAlarms = async()=>{
            try{
                const alarms = await AsyncStorage.getItem("@Alarms");
                if(alarms !== null){
                       dispatch(setAlarmsReducer(JSON.parse(alarms)));
                }
                
            } catch (e){
                console.log(e);
            }
        }
        getAlarms();
    }, []);


        //функция получения уведомления
    const registerForPushNotificationsAsync = async () => {
        let token;
        if (Device.isDevice) {
          const { status: existingStatus } = await Notifications.getPermissionsAsync();
          let finalStatus = existingStatus;
          if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
          }
          if (finalStatus !== 'granted') {
            alert('Failed to get push token for push notification!');
            return;
          }
          token = (await Notifications.getExpoPushTokenAsync()).data;
          console.log(token);
        } else {
            return;
        }
        if (Platform.OS === 'android') {
          Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
          });
          //navigation.navigate("Add Alarm");
          //console.log("navigate***");
        
        }
        return token;
    }

    //TouchableOpacity - область прикосновения, используем ее, а не обычную кнопку, потому что в обычной кнопке нельзя поменять цвет и шрифт
  return (
    <View style={styles.container}>
        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
            <Text style={styles.title}>List Alrms</Text>
        </View>
        <AlarmList alarmsData={alarms}/> 
        <TouchableOpacity onPress={()=>navigation.navigate("Add Alarm")} style={styles.button}>
            <Text style={styles.plus}>+</Text>
        </TouchableOpacity>
        
    </View>
  );
  //<AlarmList alarmsData={alarms}/> - передаем, какой список хотим использовать
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 15,//50
      paddingHorizontal: 15,

    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 20, //35
        marginTop: 15, //10
    },
    button:{
        width: 42,
        height: 42,
        borderRadius: 21,
        //backgroundColor: '#000',
        backgroundColor: 'purple',
        position: 'absolute',
        bottom: 50,
        right: 20,
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
        fontSize:40,
        color:'#fff',
        position: 'absolute',
        top:-7,
        left:10.5,
    }
  });