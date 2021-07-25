import { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import Link from 'next/link';

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
            if (Number.isInteger(Number(foodBlock.limit))) {
                calories += foodBlock.amount * foodBlock.calories;
            } else {
                let amountOfTimesAddedOrRemoved = foodBlock.amount / foodBlock.increment;
                calories += amountOfTimesAddedOrRemoved * foodBlock.calories;
            }
        });
        setTotalCalories(calories);
    }, [ foodBlocks ]);

    const [ goalCalories, setGoalCalories ] = useState(0);
    useEffect(() => {
        let calories = 0;
        foodBlocks.forEach((foodBlock) => {
            if (Number.isInteger(Number(foodBlock.limit)) && Number.isInteger(Number(foodBlock.increment))) {
                calories += foodBlock.limit * foodBlock.calories;
            } else {
                let amountOfTimesAddedOrRemoved = foodBlock.limit / foodBlock.increment;
                calories += amountOfTimesAddedOrRemoved * foodBlock.calories;
            }
        });
        setGoalCalories(calories);
    }, [ foodBlocks ])

    const updateAmountOfFood = ({ amount, index }) => {
        amount = Number(amount);
        let cloneFoodBlocks = JSON.parse(JSON.stringify(foodBlocks));
        if (cloneFoodBlocks[index].amount === 0 && Math.sign(amount) === -1) {
            return;
        }

        cloneFoodBlocks[index].amount += amount;
        setFoodBlocks(cloneFoodBlocks);
        setFoodBlockIntoLocalStorage({ date, foodBlock: cloneFoodBlocks });
    }

    return (
        <>
            <Nav />

            <div className="mx-15 mt-1 mb-1 flex">
                <div className="mr-1">
                    { totalCalories } total calories
                </div>
                <div>
                    { goalCalories } goal calories
                </div>
            </div>

            { foodBlocks.length === 0 ? (
                <>
                    <div className="no-food-blocks-emoji">
                        🍉
                    </div>
                    <p className="text-center text-medium text-gray">
                        no food blocks
                    </p>
                    <Link href={`/day/${ date }/blocks`}>
                        <a className="text-center text-large d-block">add a food block</a>
                    </Link>
                </>
            ) : (null) }

            <div className="flex flex-wrap justify-content-between">
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
            </div>
        </> 
    );
}