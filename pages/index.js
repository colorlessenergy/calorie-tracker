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


    const exportData = () => {
        const foodBlocks = localStorage.getItem('foodBlocks');
        const previousFoodBlocks = localStorage.getItem('previousFoodBlocks');
        const data = {
            foodBlocks: foodBlocks,
            previousFoodBlocks: previousFoodBlocks
        }

        const filename = 'calorie-tracker-data.json';
        const JSONString = JSON.stringify(data);
        let anchorElement = document.createElement('a');
        anchorElement.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSONString));
        anchorElement.setAttribute('download', filename);
        anchorElement.style.display = 'none';
        document.body.appendChild(anchorElement);
        anchorElement.click();
        document.body.removeChild(anchorElement);
    }

    return (
        <div>
            <Head>
                <title>calorie tracker</title>
                <meta name="description" content="calorie tracker" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <h1 className="my-0 pt-3 text-center">calorie tracker</h1>
            <p className="my-0 mb-2 text-center">track calories for a day</p>

            <Calender
                onChange={ onChange }
                className="m-center" />
            
            <button
                onClick={ exportData }
                className="button button-green">export data</button>
        </div>
    );
}
