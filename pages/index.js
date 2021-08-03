import { useEffect, useState } from 'react';
import Head from 'next/head'
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import gearIcon from '../public/icons/gear.svg';

import Calender from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Snackbar from '../shared/components/Snackbar/Snackbar';


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

    const [ snackbars, setSnackbars ] = useState({
        clear: {
            snackbar: null,
            timeout: null
        }
    });


    const clearLocalStorage = () => {
        let cloneSnackbars = JSON.parse(JSON.stringify(snackbars));
        if (cloneSnackbars.clear.timeout) {
            clearTimeout(snackbars.clear.timeout);
        }

        let message = 'cleared all data';
        cloneSnackbars.clear.snackbar = {
            message: message,
            className: 'snackbar-red'
        }

        let snackbarTimeout = setTimeout(() => {
            let cloneSnackbars = JSON.parse(JSON.stringify(snackbars));
            cloneSnackbars.clear.snackbar = null;
            cloneSnackbars.clear.timeout = null;
            setSnackbars(previousSnackbars => { 
                return {
                    ...previousSnackbars,
                    clear: cloneSnackbars.clear
                }
            });
        }, 5000);

        cloneSnackbars.clear.timeout = snackbarTimeout;
        setSnackbars(cloneSnackbars);

        localStorage.clear();
    }

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
                className="m-center" />

            <div className="data-buttons">
                <button
                    onClick={ clearLocalStorage }
                    className="button button-red flex-grow-1">clear data</button>
            </div>

            <div className="snackbars-container">
                { snackbars.clear.snackbar ? (
                    <Snackbar message={ snackbars.clear.snackbar.message } className={ snackbars.clear.snackbar.className } />
                ) : (null) }
            </div>
        </div>
    );
}
