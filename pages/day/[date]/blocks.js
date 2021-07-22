import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import Nav from '../../../shared/components/nav';

import { getFoodFromLocalStorage, setFoodBlockIntoLocalStorage, removeFoodBlockFromLocalStorage } from '../../../shared/food/food';

export default function Blocks () {
    const router = useRouter();
    const date = router.query.date;
    const [ foodBlocks, setFoodBlocks ] = useState([]);
    useEffect(() => {
        if (date) {
            setFoodBlocks(getFoodFromLocalStorage(date));
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

    const handleChange = ({ event, index }) => {
        let cloneFoodBlocks = JSON.parse(JSON.stringify(foodBlocks));
        cloneFoodBlocks[index][event.target.id] = event.target.value;
        setFoodBlocks(cloneFoodBlocks);
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        setFoodBlockIntoLocalStorage({ date, foodBlock: foodBlocks });
    }

    const removeFoodBlock = ({ date, index }) => {
        let cloneFoodBlocks = JSON.parse(JSON.stringify(foodBlocks));
        cloneFoodBlocks.splice(index, 1);
        setFoodBlocks(cloneFoodBlocks);

        removeFoodBlockFromLocalStorage({ date, index });
    }

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
                        <form
                            onSubmit={ handleSubmit }
                            className="flex justify-content-between mx-15">
                            <div className="flex flex-direction-column align-items-start form-groups-container">
                                <label htmlFor="name">
                                    food
                                </label>
                                <input
                                    onChange={ (event) => handleChange({ event, index }) }
                                    value={ foodBlocks[index].name }
                                    type="text"
                                    id="name" />

                                <label htmlFor="calories">
                                    calories
                                </label>
                                <input
                                    onChange={ (event) => handleChange({ event, index }) }
                                    value={ foodBlocks[index].calories }
                                    type="number"
                                    id="calories" />

                                <label htmlFor="increment">
                                    increment
                                </label>
                                <input
                                    onChange={ (event) => handleChange({ event, index }) }
                                    value={ foodBlocks[index].increment }
                                    type="number"
                                    id="increment" />

                                <label htmlFor="unit">
                                    unit
                                </label>
                                <input
                                    onChange={ (event) => handleChange({ event, index }) }
                                    value={ foodBlocks[index].unit }
                                    type="text"
                                    id="unit" />

                                <label htmlFor="limit">
                                    limit
                                </label>
                                <input
                                    onChange={ (event) => handleChange({ event, index }) }
                                    value={ foodBlocks[index].limit }
                                    type="number"
                                    id="limit" />
                            </div> 

                            <div className="flex flex-direction-column">
                                <button
                                    type="button"
                                    onClick={ () => removeFoodBlock({ date, index }) }
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