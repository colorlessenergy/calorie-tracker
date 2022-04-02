import { useEffect, useState  } from 'react';
import Head from 'next/head';

import Snackbar from '../../shared/components/Snackbar/Snackbar';

import useSnackbar from '../../shared/hooks/useSnackbar';

export default function CalorieGoal ({ setShowCalorieGoalBanner }) {
    const [ calorieGoal, setCalorieGoal ] = useState(1);

    useEffect(() => {
        setCalorieGoal(localStorage.getItem('calorieGoal') || 1);
    }, []);

    const handleInputChange = (event) => {
        if (!event.currentTarget.valueAsNumber) return setCalorieGoal('');

        setCalorieGoal(event.currentTarget.valueAsNumber);
    }

    const { snackbar, addSnackbar } = useSnackbar({
        initialSnackbar: {
            className: 'snackbar-green',
            message: null
        },
        message: {
            single: 'calorie goal is set'
        }
    });

    const handleSubmit = (event) => {
        event.preventDefault();

        localStorage.setItem('calorieGoal', calorieGoal);

        setShowCalorieGoalBanner(false);

        addSnackbar();
    }

    return (
        <div>
            <Head>
                <title>calorie tracker - set calorie goal</title>
                <meta name="description" content="calorie tracker - set calorie goal" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className="container">
                <h1 className="mt-1 mx-15">
                    calorie goal
                </h1>

                <form
                    onSubmit={ handleSubmit }
                    className="mx-15 w-50-md">
                    <label
                        className="dark-label"
                        htmlFor="calorieGoal">set calorie goal</label>
                    <input
                        type="number"
                        id="calorieGoal"
                        name="calorieGoal"
                        min="1"
                        required
                        placeholder="calorie goal"
                        onChange={ handleInputChange }
                        value={ calorieGoal } />
                    
                    <button className="button button-green">
                        submit
                    </button>
                </form>
            </div>

            <div className="snackbars-container">
                { snackbar.message ? (
                    <Snackbar message={ snackbar.message } className={ snackbar.className } />
                ) : (null) }
            </div>
        </div>
    );
}