import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';

import SettingsNav from '../../shared/components/SettingsNav';
import Snackbar from '../../shared/components/Snackbar/Snackbar';

export default function CalorieGoal () {
    const [ calorieGoal, setCalorieGoal ] = useState(1);
    const handleInputChange = (event) => {
        if (!event.currentTarget.valueAsNumber) return setCalorieGoal('');

        setCalorieGoal(event.currentTarget.valueAsNumber);
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        localStorage.setItem('calorieGoal', calorieGoal);

        addSnackbar();
    }

    const [ snackbar, setSnackbar ] = useState(null);
    const snackbarTimeoutRef = useRef(null);
    useEffect(() => {
        return () => {
            if (snackbarTimeoutRef.current) {
                clearTimeout(snackbarTimeoutRef.current);
            }
        }
    }, []);

    const addSnackbar = () => {
        if (snackbarTimeoutRef.current) {
            clearTimeout(snackbarTimeoutRef.current);
        }

        const snackbarTimeout = setTimeout(() => {
            snackbarTimeoutRef.current = null;
            setSnackbar(null);
        }, 5000);

        snackbarTimeoutRef.current = snackbarTimeout;

        let cloneSnackbar = JSON.parse(JSON.stringify(snackbar));
        cloneSnackbar = {
            message: 'calorie goal is set',
            className: 'snackbar-green'
        }
        setSnackbar(cloneSnackbar);
    }

    return (
        <div>
            <Head>
                <title>calorie tracker - set calorie goal</title>
                <meta name="description" content="calorie tracker - set calorie goal" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className="container">
                <SettingsNav />

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
                { snackbar ? (
                    <Snackbar message={ snackbar.message } className={ snackbar.className } />
                ) : (null) }
            </div>
        </div>
    );
}