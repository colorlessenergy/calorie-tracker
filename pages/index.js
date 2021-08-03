import { useEffect, useState } from 'react';
import Head from 'next/head'
import { useRouter } from 'next/router';

import Calender from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Snackbar from '../shared/components/Snackbar/Snackbar';

import { addPreviousFoodBlockToLocalStorage, importFoodBlocks } from '../shared/food/food';

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


    const importData = (event) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const importedData = JSON.parse(e.target.result)
            const previousFoodBlocks = JSON.parse(importedData.previousFoodBlocks);

            previousFoodBlocks.forEach(previousFoodBlock => {
                addPreviousFoodBlockToLocalStorage({ foodBlock: previousFoodBlock })
            });

            const foodBlocks = JSON.parse(importedData.foodBlocks)
            importFoodBlocks(foodBlocks);
        }

        reader.readAsText(event.target.files[0]);
    }

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

            <h1 className="my-0 pt-3 text-center">calorie tracker</h1>
            <p className="my-0 mb-2 text-center">track calories for a day</p>

            <Calender
                onChange={ onChange }
                className="m-center" />

            <div className="import-export-buttons">
                <button
                    onClick={ exportData }
                    className="button button-green mb-1">export data</button>

                <label
                    htmlFor="import-data"
                    className="button button-pink cursor-pointer">import data</label>
                <input
                    type="file"
                    id="import-data"
                    accept=".json"
                    onChange={ importData }
                    className="hidden" />

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
