import { useEffect } from 'react';
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
            const wb = window.workbox
            const promptNewVersionAvailable = () => {
                if (confirm('A newer version of this web app is available, reload to update?')) {
                    wb.addEventListener('controlling', () => {
                        window.location.reload()
                    });

                    wb.messageSkipWaiting();
                } 
            }

            wb.addEventListener('waiting', promptNewVersionAvailable);

            wb.register();
        }
    }, []);

    return (
        <div>
            <Head>
                <title>calorie tracker</title>
                <meta name="description" content="calorie tracker" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <h1 className="my-0 pt-3 text-center">calorie tracker</h1>
            <p className="my-0 text-center">track calories for a day</p>

            <Calender
                onChange={ onChange }
                className="m-center" />
        </div>
    );
}
