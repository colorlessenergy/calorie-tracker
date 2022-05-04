import React, { useEffect, useState } from 'react';

import Nav from '../shared/components/Nav';
import Banner from '../shared/components/Banner';

import '../styles/globals.scss';

function MyApp({ Component, pageProps }) {
    const [showCalorieGoalBanner, setShowCalorieGoalBanner] = useState(false);
    useEffect(() => {
        if (!localStorage.getItem('theme')) {
            if (
                window.matchMedia &&
                window.matchMedia('(prefers-color-scheme: dark)').matches
            ) {
                localStorage.setItem('theme', 'dark');
            } else {
                localStorage.setItem('theme', 'light');
            }
        }

        if (localStorage.getItem('theme') === 'dark') {
            document.body.classList.add('dark');
        }

        if (!localStorage.getItem('calorieGoal')) {
            setShowCalorieGoalBanner(true);
        } else {
            setShowCalorieGoalBanner(false);
        }
    }, []);

    return (
        <React.Fragment>
            <Nav />
            <Component
                {...pageProps}
                setShowCalorieGoalBanner={setShowCalorieGoalBanner}
            />

            {showCalorieGoalBanner ? (
                <Banner
                    text="create a calorie goal"
                    link="/settings/calorie-goal"
                />
            ) : null}
        </React.Fragment>
    );
}

export default MyApp;
