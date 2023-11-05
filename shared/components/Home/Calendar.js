import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const Calendar = () => {
    const tileClassName = date => {
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

        return '';
    };

    const router = useRouter();

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

    let dates = [];
    for (let i = 3; i >= 1; i--) {
        let day = new Date();
        day.setDate(day.getDate() - i);
        dates.push(day);
    }

    for (let i = 0; i <= 3; i++) {
        let day = new Date();
        day.setDate(day.getDate() + i);
        dates.push(day);
    }

    return (
        <div className="dates-wrapper">
            <div>
                <h1 className="dates-month">
                    {dates[0].toLocaleDateString('en-US', {
                        month: 'long'
                    })}
                </h1>
                <div className="dates-container">
                    {dates.map(date => {
                        let day = date.toLocaleDateString('en-US', {
                            weekday: 'long'
                        });

                        let formatDate = date
                            .toLocaleDateString('en-US')
                            .replace(/\//g, '-');
                        return (
                            <a
                                href={`day/${formatDate}`}
                                className={`date text-center ${
                                    new Date().getDate() === date.getDate()
                                        ? 'current-date'
                                        : mounted
                                        ? tileClassName(date)
                                        : ''
                                }`}
                                key={date}
                            >
                                <div className="text-bold">{day}</div>
                                <div className="mt-2">{date.getDate()}</div>
                            </a>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Calendar;
