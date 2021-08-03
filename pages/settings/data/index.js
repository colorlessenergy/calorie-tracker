import SettingsItem from '../../../shared/components/SettingsItems/SettingsItem';

export default function Data () {
    return (
        <div className="container">
            <div className="mx-15">
                <h1>
                    data 
                </h1>

                <SettingsItem text="export data" link="/settings/data/export-data" />
                <SettingsItem text="import data" link="/settings/data/import-data" />
                <SettingsItem text="clear data" link="/settings/data/clear-data" />
            </div>
        </div>
    );
}