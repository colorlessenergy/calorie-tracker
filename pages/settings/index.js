import { useEffect, useState } from 'react';
import Head from 'next/head';

import SettingsItem from '../../shared/components/SettingsItems/SettingsItem';
import CheckboxSettingsItem from '../../shared/components/SettingsItems/CheckboxSettingsItem';

export default function Settings() {
    const [goToFoodBlocks, setGoToFoodBlocks] = useState(false);
    useEffect(() => {
        if (!localStorage.getItem('goToFoodBlocks')) {
            localStorage.setItem('goToFoodBlocks', false);
        }

        setGoToFoodBlocks(JSON.parse(localStorage.getItem('goToFoodBlocks')));
    }, []);

    return (
        <div>
            <Head>
                <title>calorie tracker - settings</title>
                <meta name="description" content="calorie tracker - settings" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className="container">
                <div className="mx-15">
                    <h1 className="mt-1">settings</h1>

                    <SettingsItem text="data" link="/settings/data" />
                    <SettingsItem
                        text="calorie goal"
                        link="/settings/calorie-goal"
                    />
                    <SettingsItem
                        text="food dictionary"
                        link="/settings/food-dictionary"
                    />

                    <CheckboxSettingsItem
                        text="automatically go to food blocks"
                        state={goToFoodBlocks}
                        setState={setGoToFoodBlocks}
                    />
                </div>
            </div>
        </div>
    );
}
