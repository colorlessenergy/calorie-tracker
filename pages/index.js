import { useEffect, useState } from 'react';
import Head from 'next/head'
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import gearIcon from '../public/icons/gear.svg';

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
        if (typeof window !== 'undefined') {
            if (view === 'month') {
                const foodBlocks = localStorage.getItem('foodBlocks');
                if (foodBlocks) {
                    const dates = Object.keys(JSON.parse(foodBlocks));
                    
                    let isDateInLocalStorage = false;
                    for (let i = 0; i < dates.length; i++) {
                        let [ month, day ] = dates[i].split('-');

                        if (month == date.getMonth() + 1 && day == date.getDate()) {
                            isDateInLocalStorage = true;
                            break;
                        }
                    }

                    if (isDateInLocalStorage) {
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

            <Link href="/settings">
                <a className="d-block text-right">
                    <Image
                        src={ gearIcon }
                        alt="gear icon"
                        width={ 50 }
                        height={ 50 }
                        title="gear icon" />
                </a>
            </Link>

            <h1 className="my-0 text-center">calorie tracker</h1>
            <p className="my-0 mb-2 text-center">track calories for a day</p>

            <Calender
                onChange={ onChange }
                className="m-center"
                defaultValue={ new Date() }
                tileClassName={ mounted ? (tileClassName) : (null) } />
        </div>
    );
}
