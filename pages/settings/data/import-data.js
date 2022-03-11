import Head from 'next/head';

import Nav from '../../../shared/components/Nav';
import Snackbar from '../../../shared/components/Snackbar/Snackbar';

import { importFoodBlocks, importFoodDictionary } from '../../../shared/food/food';

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
            const importedData = JSON.parse(e.target.result);

            const calorieGoal = JSON.parse(importedData.calorieGoal);
            if (calorieGoal) {
                localStorage.setItem('calorieGoal', calorieGoal);
            }

            const foodBlocks = JSON.parse(importedData.foodBlocks);
            importFoodBlocks(foodBlocks);

            const foodDictionary = JSON.parse(importedData.foodDictionary);
            importFoodDictionary(foodDictionary);

            addSnackbarFinished();
        }

        reader.readAsText(event.target.files[0]);
    }

    const setValueToNull = event => { 
        event.target.value = null;
    }

    return (
        <div>
            <Head>
                <title>calorie tracker - import data</title>
                <meta name="description" content="calorie tracker - import data" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className="container">
                <Nav />

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
        </div>
    );
}