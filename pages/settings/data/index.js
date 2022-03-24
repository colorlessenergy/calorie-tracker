import Head from 'next/head';

import SettingsItem from '../../../shared/components/SettingsItems/SettingsItem';

export default function Data () {
    return (
        <div>
            <Head>
                <title>calorie tracker - data</title>
                <meta name="description" content="calorie tracker - data" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className="container">
                <div className="mx-15">
                    <h1 className="mt-1">
                        data 
                    </h1>

                    <SettingsItem text="export data" link="/settings/data/export-data" />
                    <SettingsItem text="import data" link="/settings/data/import-data" />
                    <SettingsItem text="clear data" link="/settings/data/clear-data" />
                </div>
            </div>
        </div>
    );
}