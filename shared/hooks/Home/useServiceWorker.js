import { useEffect } from 'react';

const useServiceWorker = () => {
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
};

export default useServiceWorker;
