import Head from 'next/head';

import SettingsItem from '../../shared/components/SettingsItems/SettingsItem';

export default function Settings() {
    return (
        <div>
            <Head>
                <title>calorie tracker - settings</title>
                <meta name="description" content="calorie tracker - settings" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className="container">
                <div className="mx-15">
                    <h1 className="mt-1">
                        settings
                    </h1>

                    <SettingsItem text="data" link="/settings/data" />
                    <SettingsItem text="calorie goal" link="/settings/calorie-goal" />
                    <SettingsItem text="food dictionary" link="/settings/food-dictionary" />
                </div>
            </div>
        </div>
    );
}