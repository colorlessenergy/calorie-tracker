import SettingsNav from '../../../shared/components/SettingsNav';
import Snackbar from '../../../shared/components/Snackbar/Snackbar';

import { importFoodBlocks } from '../../../shared/food/food';

import useSnackbar from '../../../shared/hooks/useSnackbar';

export default function ImportData () {
    const { snackbar: snackbarStarted, addSnackbar: addSnackbarStarted } = useSnackbar({
        initialSnackbar: {
            className: 'snackbar-pink',
            message: null,
        },
        message: {
            single: 'started to import data',
        }
    });

    const { snackbar: snackbarFinished, addSnackbar: addSnackbarFinished } = useSnackbar({
        initialSnackbar: {
            className: 'snackbar-pink',
            message: null,
        },
        message: {
            single: 'all data imported',
        }
    });

    const importData = (event) => {
        addSnackbarStarted();

        const reader = new FileReader();
        reader.onload = (e) => {
            const importedData = JSON.parse(e.target.result)

            const foodBlocks = JSON.parse(importedData.foodBlocks)
            importFoodBlocks(foodBlocks);
            addSnackbarFinished();
        }

        reader.readAsText(event.target.files[0]);
    }

    const setValueToNull = event => { 
        event.target.value = null;
    }

    return (
        <div className="container">
            <SettingsNav />
            <div className="mx-15">
                <h1 className="mt-1">
                    import data 
                </h1>

                <p className="text-medium">
                    import food blocks
                </p>

                <label
                    htmlFor="import-data"
                    className="button button-pink cursor-pointer d-inline-block">import data</label>
                <input
                    type="file"
                    id="import-data"
                    accept=".json"
                    onChange={ importData }
                    onClick={ setValueToNull }
                    className="hidden" />
            </div>


            <div className="snackbars-container">
                { snackbarStarted.message ? (
                    <Snackbar message={ snackbarStarted.message } className={ snackbarStarted.className } />
                ) : (null) }
                
                { snackbarFinished.message ? (
                    <Snackbar message={ snackbarFinished.message } className={ snackbarFinished.className } />
                ) : (null) }
            </div>
        </div>
    );
}