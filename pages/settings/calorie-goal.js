import Head from 'next/head';

import Snackbar from '../../shared/components/Snackbar/Snackbar';

import useSnackbar from '../../shared/hooks/useSnackbar';
import { useDayContext } from '../../shared/contexts/DayContext';

export default function CalorieGoal() {
    const { calorieGoal, setCalorieGoal } = useDayContext();

    const handleInputChange = event => {
        if (!event.currentTarget.valueAsNumber) return setCalorieGoal('');

        setCalorieGoal(event.currentTarget.valueAsNumber);
    };

    const { snackbar, addSnackbar } = useSnackbar({
        initialSnackbar: {
            className: 'snackbar-green',
            message: null
        },
        message: {
            single: 'calorie goal set'
        }
    });

    const handleSubmit = event => {
        event.preventDefault();

        localStorage.setItem('calorieGoal', calorieGoal);

        addSnackbar();
    };

    return (
        <div>
            <Head>
                <title>calorie tracker - set calorie goal</title>
                <meta
                    name="description"
                    content="calorie tracker - set calorie goal"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className="container">
                <h1 className="mt-1 mx-15">calorie goal</h1>

                <form
                    onSubmit={handleSubmit}
                    className="mx-15 w-50-md flex flex-direction-column align-items-start"
                >
                    <label className="dark-label" htmlFor="calorieGoal">
                        set calorie goal
                    </label>
                    <input
                        type="number"
                        id="calorieGoal"
                        name="calorieGoal"
                        min="1"
                        required
                        placeholder="calorie goal"
                        onChange={handleInputChange}
                        value={calorieGoal}
                        className="calorie-goal-input"
                    />

                    <button className="button button-green">submit</button>
                </form>
            </div>

            <div className="snackbars-container">
                {snackbar.message ? (
                    <Snackbar
                        message={snackbar.message}
                        className={snackbar.className}
                    />
                ) : null}
            </div>
        </div>
    );
}
