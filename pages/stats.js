import { useEffect, useState } from 'react';
import Head from 'next/head';

import { getAllFoodBlocksFromLocalStorage } from '../shared/food/food';

export default function Stats() {
    const [foodBlocks, setFoodBlocks] = useState(null);
    useEffect(() => {
        setFoodBlocks(getAllFoodBlocksFromLocalStorage());
    }, []);

    if (foodBlocks === null) {
        return;
    }

    const dates = Object.keys(foodBlocks);
    let activeDates = 0;
    let totalCalories = 0;
    for (let i = 0; i < dates.length; i++) {
        for (let j = 0; j < foodBlocks[dates[i]].length; j++) {
            const foodBlock = foodBlocks[dates[i]][j];
            if (foodBlock.amount === parseFloat(foodBlock.totalAmount)) {
                totalCalories += parseFloat(foodBlocks[dates[i]][j].calories);
            }
        }

        if (foodBlocks[dates[i]].length) {
            activeDates += 1;
        }
    }

    return (
        <div>
            <Head>
                <title>calorie tracker - stats</title>
                <meta name="description" content="calorie tracker - stats" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className="container">
                <div className="mx-15">
                    <h1 className="mt-1">stats</h1>

                    <h2 className="mb-1">food blocks</h2>

                    <p>
                        created food blocks for{' '}
                        <span className="text-bold">
                            {activeDates} {activeDates === 1 ? 'day' : 'days'}
                        </span>
                    </p>

                    <p>
                        <span className="text-bold">
                            {totalCalories} calories
                        </span>{' '}
                        eaten
                    </p>
                </div>
            </div>
        </div>
    );
}
