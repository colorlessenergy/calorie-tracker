import Head from 'next/head';

import SettingsNav from '../../../shared/components/SettingsNav';

export default function ExportData () {
    const exportData = () => {
        const foodBlocks = JSON.parse(localStorage.getItem('foodBlocks'));
        for (const date in foodBlocks) {
            foodBlocks[date].forEach(foodBlock => {
                if (!foodBlock.hasOwnProperty('foodDictionaryID')) {
                    return;
                }

                delete foodBlock.foodDictionaryID;
            });
        }

        const calorieGoal = localStorage.getItem('calorieGoal');
        const foodDictionary = localStorage.getItem('foodDictionary');
        const data = {
            foodBlocks: JSON.stringify(foodBlocks),
            calorieGoal,
            foodDictionary
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
                <title>calorie tracker - export data</title>
                <meta name="description" content="calorie tracker - export data" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className="container">
                <SettingsNav />
                <div className="mx-15">
                    <h1 className="mt-1">
                        export data 
                    </h1>

                    <p className="text-medium">
                        export food blocks
                    </p>

                    <p className="text-bold text-medium">
                        note: a web browser is needed to export your data 
                    </p>

                    <button
                        onClick={ exportData }
                        className="button button-green">export data</button>
                </div>
            </div>
        </div>
    );
}