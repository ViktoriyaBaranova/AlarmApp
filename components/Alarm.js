import * as React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Switch } from 'react-native';
import Checkbox from './Checkbox';
import moment from 'moment';
import {MaterialIcons} from '@expo/vector-icons'; //для установления значка "удалить"
import { useDispatch, useSelector } from 'react-redux';
import { deleteAlarmReducer } from '../redux/alarmsSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { updateAlarmReducer } from '../redux/alarmsSlice';
import * as Notifications from 'expo-notifications';
import { useNavigation } from '@react-navigation/native';
import {AlarmRing} from '../screens/AlarmRing';

//функция, которая будет получать свойства
//как элемент списка будет отображаться
export default function Alarm({id, 
    text, 
    isCompleted, 
    isToday, 
    hour,
    isAlert}
){
   // const [thisAlarmIsToday, setThisAlarmIsToday] =  hour ? React.useState(moment(new Date(hour)).isSame(moment(), "day")) : React.useState(false);
    const [localHour, setLocalHour] = React.useState(new Date(hour));
    const alarms = useSelector(state => state.alarms.alarms);
    const dispatch = useDispatch();
   const [isAlerts, setIsAlert] = React.useState(isAlert);
   const navigation = useNavigation();

   //удалить будильник
   const handleDeleteAlarm = async () => {
        dispatch(deleteAlarmReducer(id));
        try {
          await AsyncStorage.setItem('@Alarms', JSON.stringify(
            alarms.filter(alarm => alarm.id !== id)
          ));
          console.log('Alarm deleted correctly');
        } catch (e) {
          console.log(e);
        }
      };

  

    const listAlarms = useSelector(state => state.alarms.alarms);
   
    //For Switch Component
    const handleSwitch = async() => {
        try {
          dispatch(updateAlarmReducer({id, isAlert}));
          AsyncStorage.setItem('@Alarms', JSON.stringify(
            listAlarms.map(alarm => { 
              if(alarm.id === id) {
                return {...alarm, isAlert: !alarm.isAlert};
                
              }
              return alarm;
            }
          )));
          /*for (let index = 0; index < listAlarms.length; index++) {
            if (listAlarms[index].isAlert===true){
              await scheduleAlarmNotification(listAlarms[index]);
              //console.log(listAlarms[index], listAlarms[index].hour);
            }
            
          }*/
          console.log('Alarm saved and alert change correctly');
          console.log(alarms);
        } catch (e) {
          console.log(e);
        }
      }

//функция для уведомления
const scheduleAlarmNotification = async (alarm) => {
  const trigger = new Date(alarm.hour); //переменная для даты
  try {
      await Notifications.scheduleNotificationAsync({
          content: {
              title: "It's time",
              body: alarm.text,
              sound:'default',
          },
          trigger,  
        
      });
      console.log('Notification scheduled');
      
  } catch (e) {
      alert('The notification failed to schedule, make sure the hour is valid');
  }
 
};



    return(
        <View style={styles.container}>
            <View style={{flexDirection:'row', alignItems: 'center'}}>
                  <Switch
                      value={isAlerts}
                      onValueChange={(value) => { 
                        setIsAlert(value),
                        handleSwitch()
                      }}
                  />
                <View>
                    <Text style={styles.text}>{text}</Text>
                    <Text style={styles.time}>{moment(localHour).format("LT     DD/MM/YYYY")}</Text> 
                </View>
            </View>
            <TouchableOpacity onPress={handleDeleteAlarm}>
              <MaterialIcons name="delete-outline" size={24} color="#73737340" style={styles.delete} />
            </TouchableOpacity>
                      
        </View>
    )
}
//moment(localHour).format('LT') - показывать время в нужном формате (без даты)
//moment(localHour).format("LT     DD/MM/YYYY")}

const styles = StyleSheet.create({
    container: {
      marginBottom: 20, //20
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    text: {
      fontSize: 15,
      fontWeight: '500',
      color: '#737373',
    },
    time: {
      fontSize: 13,
      color: '#a3a3a3',
      fontWeight: '500',
    }
});