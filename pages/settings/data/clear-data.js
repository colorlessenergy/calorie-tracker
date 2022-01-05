import { useEffect, useState } from 'react';

import SettingsNav from '../../../shared/components/SettingsNav';
import Snackbar from '../../../shared/components/Snackbar/Snackbar';

export default function ClearData () {
    const [ snackbars, setSnackbars ] = useState({
        clear: {
            snackbar: null,
            timeout: null
        }
    });

    useEffect(() => {
        return () => {
            if (snackbars.clear.timeout) {
                clearTimeout(snackbars.clear.timeout);
            }
        }
    }, []);

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
        <div className="container">
            <SettingsNav />
            <div className="mx-15">
                <h1 className="mt-1">
                    clear data 
                </h1>

                <p className="text-medium">
                    clear food blocks
                </p>

                <button
                    onClick={ clearLocalStorage }
                    className="button button-red flex-grow-1">clear data</button>

                <div className="snackbars-container">
                    { snackbars.clear.snackbar ? (
                        <Snackbar message={ snackbars.clear.snackbar.message } className={ snackbars.clear.snackbar.className } />
                    ) : (null) }
                </div>
            </div>
        </div>
    );
}