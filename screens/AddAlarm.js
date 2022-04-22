import * as React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, TextInput, Switch, Platform  } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useDispatch, useSelector } from 'react-redux';
import { addAlarmReducer } from '../redux/alarmsSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';
import moment from 'moment';
import Checkbox from '../components/Checkbox';
import {RadioButton, RadioGrup} from 'react-native-radio-check';
import { Entypo } from '@expo/vector-icons';


export default function AddAlarm() {
    const [name, setName] = React.useState('');
    const [date, setDate] = React.useState(new Date());
    const [isToday, setIsToday] = React.useState(true);
    const listAlarms = useSelector(state => state.alarms.alarms);
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const [withAlert, setWithAlert] = React.useState(true);
    const [mode, setMode] = React.useState("date");//*
    const [show, setShow] = React.useState(false);//*
    //****************************
    const onChange = (event, selectedDate)=>{
        const currentDate = selectedDate||date;
        setShow(Platform.OS === 'android');
        setDate(currentDate);
        //временная дата
        let tempDate = new Date(currentDate);
        //отформатированная дата
        let fDate = tempDate.getDate()+'/'+(tempDate.getMonth()+1)+'/'+tempDate.getFullYear();
        //отформатированное время
        let fTime = tempDate.getHours()+'|'+tempDate.getMinutes();
        console.log(fDate+"  "+fTime);
    }
    const showMode = (currentMode)=>{
        setShow(true);
        setMode(currentMode);
    }
    //*******************************

    //добавление будильника
    const addAlarm = async()=>{
        const newAlarm = {
            id: Math.floor(Math.random()*1000000),//генерируем сохраненные имена
            text: name,
           // hour: isToday ? date.toString() : new Date(date).getDate() + 24 * 60 * 60 *1000, 
            //hour: isToday?date.toISOString():new Date(date).getTime()+24*60*60*1000,
            hour: date.toISOString(),
            isToday: isToday,
            isCompleted: false,
            isAlert: false
        }
        //const withAlert=true;
        //сохранение данных локально
        try {
            await AsyncStorage.setItem("@Alarms", JSON.stringify([...listAlarms, newAlarm]));
            dispatch (addAlarmReducer(newAlarm));
            console.log("Alarm saved correctly");
           /* if(withAlert){
                await scheduleAlarmNotification(newAlarm);
                console.log("********");
            }*/
            navigation.goBack();
            //await scheduleAlarmNotification(newAlarm);
        } catch (e){
            console.log(e)
        }
        console.log(newAlarm);
    }

    //функция для уведомления
    const scheduleAlarmNotification = async (alarm) => {
        const trigger = new Date(alarm.hour);
        try {
            await Notifications.scheduleNotificationAsync({
                content: {
                    title: "It's time",
                    body: alarm.text,
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
            <Text style={styles.title}>Add Alarm</Text>
            <View style={styles.inputContainer}>
                <Text style={styles.inputTitle}>Name</Text>
                <TextInput
                        style={styles.textInput}
                        placeholder="Alarm"
                        placeholderTextColor="#00000030"
                        onChangeText={(text) => {setName(text)}} 
                    /> 
            </View>        
            <View style={styles.inputContainer}>
                <Text style={styles.inputTitle}>Hour</Text>
                <TouchableOpacity onPress={()=>showMode('time')}>
                    <Text style={styles.titleTime}>{moment(date).format('LT').toString()}</Text>
                 </TouchableOpacity>
                <Text style={styles.inputTitle}>Date</Text>
                <TouchableOpacity onPress={()=>showMode('date')}>
                    <Text style={styles.titleTime}>{moment(date).format('DD/MM/YYYY').toString()}</Text>
                </TouchableOpacity>
                
                {show && (
                <DateTimePicker
                    testID='dateTimePicker'
                    value={date}
                    mode={mode}
                    is24Hour={true}
                    display='default'
                    onChange={onChange}
                />)} 
                
            </View>

            <View style={{flexDirection: 'row', marginBottom: 10}}>
                <Checkbox id={1} isCompleted={true}/>
                <Text style={styles.text}>Авторадио</Text> 
            </View>
            <View style={{flexDirection: 'row', marginBottom: 10}}>
                <Checkbox id={2} isCompleted={false}/>
                <Text style={styles.text}>Русское Радио</Text> 
            </View>
            <View style={{flexDirection: 'row', marginBottom: 10}}>
                <Checkbox id={3} isCompleted={false}/>
                <Text style={styles.text}>Ретро FM</Text> 
            </View>
            <TouchableOpacity onPress={addAlarm} style={styles.button}>
                <Text style={{color: 'white'}}>Done</Text>
            </TouchableOpacity>
            </View>
    );
}

            /*<View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={styles.inputTitle}>Alert</Text>
                <Switch 
                    value={withAlert}
                    onValueChange={(value) => {setWithAlert(value)}}
                />
            </View>*/
const styles = StyleSheet.create({
    title: {
        fontSize: 34,
        fontWeight: 'bold',
        marginBottom: 35,
        marginTop: 10,
    },
    textInput: {
        borderBottomColor: '#00000030',
        borderBottomWidth: 1,
        width: '80%',
    },
    container: {
        flex: 1,
        backgroundColor: '#F7F8FA',
        paddingHorizontal: 30,
    },
    inputTitle: {
        fontSize: 20,
        fontWeight: '600',
        lineHeight: 24
    },
    titleTime: {
        fontSize: 18,
        color: '#00000070',
        //color:'white',
        fontWeight: '600',
        lineHeight: 24
    },
    inputContainer: {
        justifyContent: 'space-between', 
        flexDirection: 'row', 
        paddingBottom: 30,
    },
    button: {
        marginTop: 30,
        marginBottom: 15,
        alignItems: 'center',
        justifyContent: 'center',
        //backgroundColor: '#000000',
        backgroundColor: 'purple',
        height: 46,
        borderRadius: 11,
    }
});