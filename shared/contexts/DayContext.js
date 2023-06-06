import { createContext, useContext, useEffect, useState } from 'react';

const DayContext = createContext(null);

export const DayContextProvider = ({ children }) => {
    const [calorieGoal, setCalorieGoal] = useState(1);
    useEffect(() => {
        setCalorieGoal(parseFloat(localStorage.getItem('calorieGoal')) || 0);
    }, []);

    return (
        <DayContext.Provider value={{ calorieGoal }}>
            {children}
        </DayContext.Provider>
    );
};

export const useDayContext = () => useContext(DayContext);
