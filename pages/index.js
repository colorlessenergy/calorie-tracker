import { useEffect, useState } from 'react';
import Head from 'next/head'
import { useRouter } from 'next/router';

import Calender from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

export default function Home() {
    const router = useRouter();
    const onChange = (date) => {
        date = date.toLocaleDateString('en-US').replace(/\//g, '-');
        router.push(`day/${ date }`);
    }

    useEffect(() => {
        if (typeof window !== 'undefined' && 'serviceWorker' in navigator && window.workbox !== undefined) {
            const wb = window.workbox;
            const installNewVersion = () => {
                wb.addEventListener('controlling', () => {
                    window.location.reload();
                });
                
                wb.messageSkipWaiting();
            }

            wb.addEventListener('waiting', installNewVersion);
            wb.register();
        }
    }, []);

    const tileClassName = ({ date, view }) => {
        if (typeof window !== 'undefined' && view === 'month') {
            const foodBlocks = JSON.parse(localStorage.getItem('foodBlocks'));

            if (!foodBlocks) {
                return;
            }

            const dates = Object.keys(foodBlocks);
            for (let i = 0; i < dates.length; i++) {
                let [ month, day, year ] = dates[i].split('-');
                if (month == date.getMonth() + 1 &&
                    day == date.getDate() &&
                    year == date.getFullYear() &&
                    foodBlocks[dates[i]].length) {
                    return 'active-date';
                }
            }
        }
    }

    const [ mounted, setMounted ] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <div>
            <Head>
                <title>calorie tracker</title>
                <meta name="description" content="calorie tracker" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className="container">
                <h1 className="mt-1 my-0 text-center">calorie tracker</h1>

                <Calender
                    onChange={ onChange }
                    className="ml-1"
                    value={ mounted ? (new Date()) : (null) }
                    tileClassName={ mounted ? (tileClassName) : (null) } />
            </div>
        </div>
    );
}
