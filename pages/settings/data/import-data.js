import { useState } from 'react';

import SettingsNav from '../../../shared/components/SettingsNav';
import Snackbar from '../../../shared/components/Snackbar/Snackbar';

import { addPreviousFoodBlockToLocalStorage, importFoodBlocks } from '../../../shared/food/food';

export default function ImportData () {
    const [ snackbars, setSnackbars ] = useState({
        add: {
            snackbar: null,
            timeout: null
        }
    });

    const createAddSnackbar = (message) => {
        let cloneSnackbars = JSON.parse(JSON.stringify(snackbars));
        if (cloneSnackbars.add.timeout) {
            clearTimeout(snackbars.add.timeout);
        }

        cloneSnackbars.add.snackbar = {
            message: message,
            className: 'snackbar-pink'
        }

        let snackbarTimeout = setTimeout(() => {
            let cloneSnackbars = JSON.parse(JSON.stringify(snackbars));
            cloneSnackbars.add.snackbar = null;
            cloneSnackbars.add.timeout = null;
            setSnackbars(previousSnackbars => { 
                return {
                    ...previousSnackbars,
                    add: cloneSnackbars.add
                }
            });
        }, 5000);

        cloneSnackbars.add.timeout = snackbarTimeout;
        setSnackbars(cloneSnackbars);
    }

    const importData = (event) => {
        createAddSnackbar('started to import data');

        const reader = new FileReader();
        reader.onload = (e) => {
            const importedData = JSON.parse(e.target.result)
            const previousFoodBlocks = JSON.parse(importedData.previousFoodBlocks);

            previousFoodBlocks.forEach(previousFoodBlock => {
                addPreviousFoodBlockToLocalStorage({ foodBlock: previousFoodBlock })
            });

            const foodBlocks = JSON.parse(importedData.foodBlocks)
            importFoodBlocks(foodBlocks);
            createAddSnackbar('all data imported');
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
                <h1 className="mt-0">
                    import data 
                </h1>

                <p>
                    import food blocks and previous food blocks
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
                { snackbars.add.snackbar ? (
                    <Snackbar message={ snackbars.add.snackbar.message } className={ snackbars.add.snackbar.className } />
                ) : (null) }
            </div>
        </div>
    );
}