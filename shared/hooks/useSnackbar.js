import { useEffect, useRef, useState } from 'react';

const useSnackbar = ({ initialSnackbar, message }) => {
    const [snackbar, setSnackbar] = useState(initialSnackbar);
    const snackbarTimeoutRef = useRef(null);
    useEffect(() => {
        return () => {
            if (snackbarTimeoutRef.current) {
                clearTimeout(snackbarTimeoutRef.current);
            }
        };
    }, []);

    const addSnackbar = () => {
        if (snackbarTimeoutRef.current) {
            clearTimeout(snackbarTimeoutRef.current);
        }

        const snackbarTimeout = setTimeout(() => {
            snackbarTimeoutRef.current = null;
            setSnackbar({
                ...snackbar,
                message: null
            });
        }, 5000);

        snackbarTimeoutRef.current = snackbarTimeout;

        let cloneSnackbar = JSON.parse(JSON.stringify(snackbar));
        if (message.multiple) {
            if (snackbar.amountOfTimes >= 1) {
                cloneSnackbar = {
                    ...cloneSnackbar,
                    message: `${snackbar.amountOfTimes + 1} ${message.multiple}`
                };
            } else {
                cloneSnackbar = {
                    ...cloneSnackbar,
                    message: message.single
                };
            }

            cloneSnackbar.amountOfTimes += 1;
        } else if (message.single) {
            cloneSnackbar = {
                ...cloneSnackbar,
                message: message.single
            };
        }

        setSnackbar(cloneSnackbar);
    };

    return {
        snackbar,
        addSnackbar
    };
};

export default useSnackbar;
