import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import ReactCalendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const Calendar = () => {
    const tileClassName = ({ date, view }) => {
        if (view !== 'month') return;

        const foodBlocks = JSON.parse(localStorage.getItem('foodBlocks'));

        if (!foodBlocks) return;

        const dates = Object.keys(foodBlocks);
        for (let i = 0; i < dates.length; i++) {
            let [month, day, year] = dates[i].split('-');
            if (
                month == date.getMonth() + 1 &&
                day == date.getDate() &&
                year == date.getFullYear() &&
                foodBlocks[dates[i]].length
            ) {
                return 'active-date';
            }
        }
    };

    const router = useRouter();

    const onChange = date => {
        date = date.toLocaleDateString('en-US').replace(/\//g, '-');
        router.push(`day/${date}`);
    };

    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);

        if (JSON.parse(localStorage.getItem('goToFoodBlocks'))) {
            const date = new Date()
                .toLocaleDateString('en-US')
                .replace(/\//g, '-');
            router.replace(`day/${date}`);
        }
    }, []);

    return (
        <ReactCalendar
            onChange={onChange}
            className="ml-1"
            value={mounted ? new Date() : null}
            tileClassName={mounted ? tileClassName : null}
        />
    );
};

export default Calendar;
