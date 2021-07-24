import { useEffect, useState } from "react";
import { useRouter } from 'next/router';

import Nav from '../../../shared/components/nav';

import { getFoodFromLocalStorage, setFoodBlockIntoLocalStorage } from '../../../shared/food/food';

export default function Date () {
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
            calories = foodBlock.amount * foodBlock.calories;
        });
        setTotalCalories(calories);
    }, [ foodBlocks ]);

    const updateAmountOfFood = ({ amount, index }) => {
        let cloneFoodBlocks = JSON.parse(JSON.stringify(foodBlocks));
        if (cloneFoodBlocks[index].amount === 0 && Math.sign(foodBlocks[index].amount) === -1) {
            return;
        }

        cloneFoodBlocks[index].amount += amount;
        setFoodBlocks(cloneFoodBlocks);
        setFoodBlockIntoLocalStorage({ date, foodBlock: cloneFoodBlocks });
    }

    return (
        <>
            <Nav />

            <p className="mx-15">
                { totalCalories } calories
            </p>

            { foodBlocks.map((foodBlock, index) => {
                return (
                    <div
                        key={ index } 
                        className="card"
                        style={{ backgroundColor: foodBlock.ribbonColor }}>
                        <div>
                            <div>
                                { foodBlock.name }
                            </div>
                            <div className="text-bold">
                                { foodBlock.calories } calories
                            </div>
                        </div> 

                        <div>
                            <button onClick={() => { updateAmountOfFood({ amount: -foodBlock.increment, index }) }}>
                                -
                            </button>
                            <span className="mx-1">
                                { foodBlock.amount } / { foodBlock.limit } { foodBlock.unit }
                            </span>
                            <button onClick={() => { updateAmountOfFood({ amount: foodBlock.increment, index }) }}>
                                +
                            </button>
                        </div>
                    </div>
                )
            }) }

        </> 
    );
}