import { useEffect, createRef } from 'react'
import {NavigationContainer} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from "./screens/Home.js";
import AddAlarm from './screens/AddAlarm.js';
import {store} from './redux/store';
import { Provider } from 'react-redux';
import AlarmRing from './screens/AlarmRing.js';
import * as Notifications from "expo-notifications";


const Stack = createNativeStackNavigator();

//настройка уведомлений
Notifications.setNotificationHandler({
  handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true, //держать уведомления открытыми
      
  }),
})

export const navigationRef = createRef();

export function navigate(name, params) {
  navigationRef.current?.navigate(name, params);
}

export default function App() {
  useEffect(() => {
    Notifications.addNotificationReceivedListener((notification) => {
      navigate("Ring", { headerShown: false })
    });
  }, [])
  return (
    <Provider store={store}>
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            component={Home}
            options={{headerShown: false}} //чтоб не отображалось в шапке
            />
            <Stack.Screen
              name="Add Alarm"
              component={AddAlarm}
              options={{presentation: "modal"}} //создание модального окна
            />
             <Stack.Screen
              name="Ring"
              component={AlarmRing}
              options={{headerShown: false}}
            />

        </Stack.Navigator>
      </NavigationContainer>
      
    </Provider>
    
  );
  
}