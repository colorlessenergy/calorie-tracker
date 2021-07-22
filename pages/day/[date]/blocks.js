import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import Nav from '../../../shared/components/nav';

import { getFoodFromLocalStorage } from '../../../shared/food/food';

export default function Blocks () {
    const router = useRouter();
    const date = router.query.date;
    const [ foodBlocks, setFoodBlocks ] = useState([]);
    useEffect(() => {
        if (date) {
            setFoodBlocks((getFoodFromLocalStorage(date)).blocks);
        }
    }, [ date ]);

    const [ totalCalories, setTotalCalories ] = useState(0);
    useEffect(() => {
        let calories = 0;
        foodBlocks.forEach((foodBlock) => {
            calories = foodBlock.limit * foodBlock.calories;
        });
        setTotalCalories(calories);
    }, [ foodBlocks ]);

    return (
        <div className="container">
            <Nav />
            <div className="flex justify-content-between mx-15 pt-3">
                <div>
                    food blocks
                    <button className="add-food-block-button">+</button>
                </div>
                { totalCalories } calories
            </div>

            { foodBlocks.map((foodBlock, index) => {
                return (
                    <div key={index}>
                        <div
                            className="ribbon"
                            style={{ backgroundColor: foodBlock.ribbonColor }}></div>
                        <form className="flex justify-content-between mx-15">
                            <div className="flex flex-direction-column align-items-start form-groups-container">
                                <label htmlFor="food">
                                    food
                                </label>
                                <input
                                    value={ foodBlocks[index].name }
                                    type="text"
                                    id="food" />

                                <label htmlFor="calories">
                                    calories
                                </label>
                                <input
                                    value={ foodBlocks[index].calories }
                                    type="number"
                                    id="calorie" />

                                <label htmlFor="increment">
                                    increment
                                </label>
                                <input
                                    value={ foodBlocks[index].increment }
                                    type="number"
                                    id="increment" />

                                <label htmlFor="unit">
                                    unit
                                </label>
                                <input
                                    value={ foodBlocks[index].unit }
                                    type="text"
                                    id="unit" />

                                <label htmlFor="limit">
                                    limit
                                </label>
                                <input
                                    value={ foodBlocks[index].limit }
                                    type="number"
                                    id="limit" />
                            </div> 

                            <div className="flex flex-direction-column">
                                <button
                                    type="button"
                                    className="button button-red mb-2">
                                    remove
                                </button>
                                <button className="button button-green">
                                    update
                                </button>
                            </div>
                        </form>
                    </div>
                );
            }) }
        </div>
    );
}