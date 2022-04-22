import { createSlice } from "@reduxjs/toolkit";

//объявим наше начальное состояние
const initialState = {
    alarms: [],
};

export const alarmsSlice = createSlice({
    name: 'alarms',
    initialState,
    reducers:{
        setAlarmsReducer: (state, action)=>{
            state.alarms = action.payload;
            console.log(state.alarms);
        },
        addAlarmReducer: (state, action)=>{
            state.alarms.push(action.payload);
        },
        //функция скрытия и возврата
        hideComplitedReducer: (state, action)=>{
            state.alarms =state.alarms.filter(alarm => !alarm.isCompleted);
        },
        updateAlarmReducer: (state, action)=>{
            state.alarms = state.alarms.map(alarm => {
                if(alarm.id === action.payload.id){
                    alarm.isAlert = !alarm.isAlert;
                }
                return alarm;
            })
        },
        deleteAlarmReducer:(state, action)=>{
            const id = action.payload;
            const alarms = state.alarms.filter(alarm => alarm.id !== id);
            state.alarms = alarms;
        }


    }
});
export const { 
    setAlarmsReducer, 
    addAlarmReducer, 
    updateAlarmReducer, 
    hideComplitedReducer, 
    deleteAlarmReducer
 } = alarmsSlice.actions;
export default alarmsSlice.reducer;