import { useEffect } from 'react';
import Head from 'next/head';

import Calendar from '../shared/components/Home/Calendar';

export default function Home() {
    useEffect(() => {
        if (
            typeof window !== 'undefined' &&
            'serviceWorker' in navigator &&
            window.workbox !== undefined
        ) {
            const wb = window.workbox;
            const installNewVersion = () => {
                wb.addEventListener('controlling', () => {
                    window.location.reload();
                });

                wb.messageSkipWaiting();
            };

            wb.addEventListener('waiting', installNewVersion);
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

            <div className="container pt-1">
                <Calendar />
            </div>
        </div>
    );
}
