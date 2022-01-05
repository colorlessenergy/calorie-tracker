import { useEffect, useState } from 'react';
import Head from 'next/head'
import { useRouter } from 'next/router';
import Link from 'next/link';

import Calender from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import ThemeSelector from '../shared/components/ThemeSelector';

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
        if (typeof window !== 'undefined') {
            if (view === 'month') {
                const foodBlocks = JSON.parse(localStorage.getItem('foodBlocks'));
                if (foodBlocks) {
                    const dates = Object.keys(foodBlocks);
                    
                    let isValidPreviousDate = false;
                    for (let i = 0; i < dates.length; i++) {
                        let [ month, day ] = dates[i].split('-');

                        if (month == date.getMonth() + 1 && day == date.getDate() && foodBlocks[dates[i]].length) {
                            isValidPreviousDate = true;
                            break;
                        }
                    }

                    if (isValidPreviousDate) {
                        return 'active-date';
                    }
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

            <nav className="flex align-items-center justify-content-end pt-1 mx-15 nav">
                <ThemeSelector />
                <Link href="/settings">
                    <a>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            width="36"
                            height="36"
                            className="icon">
                            <path fill="none" d="M0 0h24v24H0z"/>
                            <path d="M9.954 2.21a9.99 9.99 0 0 1 4.091-.002A3.993 3.993 0 0 0 16 5.07a3.993 3.993 0 0 0 3.457.261A9.99 9.99 0 0 1 21.5 8.876 3.993 3.993 0 0 0 20 12c0 1.264.586 2.391 1.502 3.124a10.043 10.043 0 0 1-2.046 3.543 3.993 3.993 0 0 0-3.456.261 3.993 3.993 0 0 0-1.954 2.86 9.99 9.99 0 0 1-4.091.004A3.993 3.993 0 0 0 8 18.927a3.993 3.993 0 0 0-3.457-.26A9.99 9.99 0 0 1 2.5 15.121 3.993 3.993 0 0 0 4 11.999a3.993 3.993 0 0 0-1.502-3.124 10.043 10.043 0 0 1 2.046-3.543A3.993 3.993 0 0 0 8 5.071a3.993 3.993 0 0 0 1.954-2.86zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
                        </svg>
                    </a>
                </Link>
            </nav>

            <h1 className="mt-1 my-0 text-center">calorie tracker</h1>
            <p className="my-0 mb-2 text-center">track calories for a day</p>

            <Calender
                onChange={ onChange }
                className="m-center"
                value={ mounted ? (new Date()) : (null) }
                tileClassName={ mounted ? (tileClassName) : (null) } />
        </div>
    );
}
