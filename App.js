import {NavigationContainer} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from "./screens/Home.js";
import AddAlarm from './screens/AddAlarm.js';
import {store} from './redux/store';
import { Provider } from 'react-redux';
import AlarmRing from './screens/AlarmRing.js';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
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
