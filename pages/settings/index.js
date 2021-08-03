import SettingsNav from '../../shared/components/SettingsNav';
import SettingsItem from '../../shared/components/SettingsItems/SettingsItem';

export default function Settings() {
    return (
        <div className="container">
            <SettingsNav />
            <div className="mx-15">
                <h1 className="mt-0">
                    settings
                </h1>

                <SettingsItem text="data" link="/settings/data" />
            </div>
        </div>
    );
}