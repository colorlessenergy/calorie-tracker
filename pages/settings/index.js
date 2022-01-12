import SettingsNav from '../../shared/components/SettingsNav';
import SettingsItem from '../../shared/components/SettingsItems/SettingsItem';

export default function Settings() {
    return (
        <div className="container">
            <SettingsNav />
            <div className="mx-15">
                <h1 className="mt-1">
                    settings
                </h1>

                <SettingsItem text="data" link="/settings/data" />
                <SettingsItem text="calorie goal" link="/settings/calorie-goal" />
                <SettingsItem text="food dictionary" link="/settings/food-dictionary" />
            </div>
        </div>
    );
}