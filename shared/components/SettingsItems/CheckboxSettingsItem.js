import classes from './SettingsItem.module.scss';

export default function CheckboxSettingsItem({ text, state, setState }) {
    const handleCheckboxChange = () => {
        setState(previousState => {
            localStorage.setItem('goToFoodBlocks', !previousState);
            return !previousState;
        });
    };

    return (
        <label className={classes['item']}>
            {text}
            <input
                onChange={handleCheckboxChange}
                type="checkbox"
                id="foodBlock"
                checked={state}
            />
        </label>
    );
}
