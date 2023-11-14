import { Fragment, useEffect, useState } from 'react';
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
    let formatData = {};
    for (let i = 0; i < dates.length; i++) {
        if (!foodBlocks[dates[i]].length) {
            continue;
        }

        activeDates += 1;

        for (let j = 0; j < foodBlocks[dates[i]].length; j++) {
            const foodBlock = foodBlocks[dates[i]][j];
            if (foodBlock.amount === parseFloat(foodBlock.totalAmount)) {
                totalCalories += parseFloat(foodBlocks[dates[i]][j].calories);
            }
        }

        const year = dates[i].split('-')[2];
        const month = new Date(dates[i]).toLocaleDateString('en-US', {
            month: 'long'
        });
        if (!formatData[year] || !formatData[year][month]) {
            formatData[year] = {
                ...formatData[year],
                [month]: [dates[i]]
            };
        } else {
            formatData[year][month].push(dates[i]);
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

                    {Object.keys(formatData).map(year => {
                        return (
                            <Fragment key={year}>
                                <h3>{year}</h3>
                                {Object.keys(formatData[year]).map(month => {
                                    return (
                                        <Fragment key={month}>
                                            <div>{month}</div>

                                            <div className="dates-container">
                                                {formatData[year][month].map(
                                                    date => {
                                                        date = new Date(date);

                                                        const day =
                                                            date.toLocaleDateString(
                                                                'en-US',
                                                                {
                                                                    weekday:
                                                                        'long'
                                                                }
                                                            );

                                                        const formatDate = date
                                                            .toLocaleDateString(
                                                                'en-US'
                                                            )
                                                            .replace(
                                                                /\//g,
                                                                '-'
                                                            );
                                                        return (
                                                            <a
                                                                href={`day/${formatDate}`}
                                                                className="date text-center ml-0"
                                                                key={date}
                                                            >
                                                                <div className="text-bold">
                                                                    {day}
                                                                </div>
                                                                <div className="mt-2">
                                                                    {date.getDate()}
                                                                </div>
                                                            </a>
                                                        );
                                                    }
                                                )}
                                            </div>
                                        </Fragment>
                                    );
                                })}
                            </Fragment>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
