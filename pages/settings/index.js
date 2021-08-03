import SettingsItem from '../../shared/components/SettingsItems/SettingsItem';

export default function Settings() {
    return (
        <div className="container">
            <div className="mx-15">
                <h1>
                    settings
                </h1>

                <SettingsItem text="data" link="/settings/data" />
            </div>
        </div>
    );
}