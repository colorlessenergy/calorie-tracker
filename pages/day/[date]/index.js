import { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import watermelonIcon from '../../../public/icons/watermelon.svg';

import Nav from '../../../shared/components/nav';
import Confetti from 'react-confetti'

import { getFoodFromLocalStorage, setFoodBlockIntoLocalStorage } from '../../../shared/food/food';

export default function Date () {
    const router = useRouter();
    const date = router.query.date;
    const [ foodBlocks, setFoodBlocks ] = useState(null);

    useEffect(() => {
        if (date) {
            setFoodBlocks(getFoodFromLocalStorage(date));
        }
    }, [ date ]);

    const [ totalCalories, setTotalCalories ] = useState(0);
    const [ confetti, setConfetti ] = useState(null);
    useEffect(() => {
        let calories = 0;
        foodBlocks?.forEach(foodBlock => {
            calories += foodBlock.amount * foodBlock.calories;
        });

        if (calories === goalCalories) {
            const width  = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
            const height = window.innerHeight|| document.documentElement.clientHeight || document.body.clientHeight
            setConfetti({
                width: width,
                height: height
            });
        }

        setTotalCalories(calories);
    }, [ foodBlocks ]);

    const [ goalCalories, setGoalCalories ] = useState(0);
    useEffect(() => {
        let calories = 0;
        foodBlocks?.forEach(foodBlock => {
            calories += foodBlock.limit * foodBlock.calories;
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
        <div className="container">
            <Nav />

            <div className="mx-15 mt-1 mb-1 flex">
                <div className="mr-1">
                    { totalCalories } total calories
                </div>
                <div>
                    { goalCalories } calorie goal
                </div>
            </div>

            { foodBlocks?.length === 0 ? (
                <>
                    <div className="no-food-blocks-emoji">
                        <Image
                            height={ 140 }
                            width={ 140 }
                            src={ watermelonIcon }
                            alt="watermelon icon" />
                    </div>
                    <p className="text-center text-medium text-gray">
                        no food blocks
                    </p>
                    <Link href={`/day/${ date }/blocks?modalOpen=true`}>
                        <a className="text-center text-large d-block">add a food block</a>
                    </Link>
                </>
            ) : (null) }

            <div className="flex flex-wrap justify-content-between">
                { foodBlocks?.map((foodBlock, index) => {
                    return (
                        <div
                            key={ index } 
                            className="card"
                            style={{ backgroundColor: foodBlock.color }}>
                            <div className="flex justify-content-between w-100">
                                <div>
                                    { foodBlock.name }
                                </div>
                                <div className="text-bold">
                                    { foodBlock.calories } calories
                                </div>
                            </div> 

                            <div className="mx-1 text-large">
                                { foodBlock.amount } / { foodBlock.limit } <span className="text-medium">{ foodBlock.unit }</span>
                            </div>

                            <div className="flex justify-content-between w-100">
                                <button
                                    onClick={() => { updateAmountOfFood({ amount: -foodBlock.increment, index }) }}
                                    className="card-button">
                                    -
                                </button>
                                
                                <button
                                    onClick={() => { updateAmountOfFood({ amount: foodBlock.increment, index }) }}
                                    className="card-button">
                                    +
                                </button>
                            </div>
                        </div>
                    )
                }) }
            </div>
            { confetti ? (
                <Confetti
                    width={ confetti.width }
                    height={ confetti.height }
                    recycle={ false }
                    numberOfPieces={ 200 }
                    onConfettiComplete={ () => setConfetti(null) } />
            ) : (null) }
        </div> 
    );
}