import SettingsNav from '../../../shared/components/SettingsNav';
import Snackbar from '../../../shared/components/Snackbar/Snackbar';

import useSnackbar from '../../../shared/hooks/useSnackbar';

export default function ClearData () {
    const { snackbar, addSnackbar } = useSnackbar({
        initialSnackbar: {
            className: 'snackbar-red',
            message: null,
        },
        message: {
            single: 'cleared all data',
        }
    });

    const clearLocalStorage = () => {
        addSnackbar();

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
                    { snackbar.message ? (
                        <Snackbar message={ snackbar.message } className={ snackbar.className } />
                    ) : (null) }
                </div>
            </div>
        </div>
    );
}