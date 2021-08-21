import { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import watermelonIcon from '../../../public/icons/watermelon.svg';

import Nav from '../../../shared/components/nav';
import Confetti from 'react-confetti'
import Modal from "../../../shared/components/modal";

import { getFoodFromLocalStorage, updateFoodBlockInLocalStorage } from '../../../shared/food/food';

const colors = ["#ffe58f", "#eaff8f", "#b7eb8f", "#87e8de", "#ffd6e7"];

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
            if (foodBlock.amount >= foodBlock.limit && parseFloat(foodBlock.calories)) {
                calories += parseFloat(foodBlock.calories);
            }
        });

        if (calories === goalCalories && goalCalories !== 0) {
            const width  = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
            const height = window.innerHeight|| document.documentElement.clientHeight || document.body.clientHeight
            setConfetti({
                width: width,
                height: height
            });
        }

        setTotalCalories(parseFloat(calories.toFixed(2)));
    }, [ foodBlocks ]);

    const [ goalCalories, setGoalCalories ] = useState(0);
    useEffect(() => {
        let calories = 0;
        foodBlocks?.forEach(foodBlock => {
            if (parseFloat(foodBlock.calories)) {
                calories += parseFloat(foodBlock.calories);
            }
        });
        setGoalCalories(parseFloat(calories.toFixed(2)));
    }, [ foodBlocks ])

    const updateAmountOfFood = ({ event, amount, index }) => {
        event.stopPropagation();

        amount = Number(amount);
        let cloneFoodBlocks = JSON.parse(JSON.stringify(foodBlocks));
        if (cloneFoodBlocks[index].amount === 0 && Math.sign(amount) === -1) {
            return;
        }

        cloneFoodBlocks[index].amount += amount;
        setFoodBlocks(cloneFoodBlocks);
        updateFoodBlockInLocalStorage({ date, foodBlock: cloneFoodBlocks[index] });
    }

    const [ isEditFoodBlockModalOpen, setIsEditFoodBlockModalOpen ] = useState(false);
    const toggleEditFoodBlockModal = (foodBlock) => {
        setFoodBlock(foodBlock);
        setIsEditFoodBlockModalOpen(previousIsEditFoodBlockModalOpen => !previousIsEditFoodBlockModalOpen);
    }

    const [ foodBlock, setFoodBlock ] = useState({
        name: '',
        calories: '',
        increment: '',
        unit: '',
        amount: '',
        limit: '',
        color: ''
    });

    const handleChange = (event) => {
        setFoodBlock(previousFoodBlock => ({
            ...previousFoodBlock,
            [ event.target.id ]: event.target.value
        }));
    }

    const updateColor = (color) => {
        setFoodBlock(previousFoodBlock => ({
            ...previousFoodBlock,
            color: color
        }));
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        updateFoodBlockInLocalStorage({ date, foodBlock: foodBlock });
        setFoodBlocks(getFoodFromLocalStorage(date));
        toggleEditFoodBlockModal({
            name: '',
            calories: '',
            increment: '',
            unit: '',
            amount: '',
            limit: '',
            color: ''
        });
    }

    return (
        <div className="container">
            <Nav link={{ link: `/day/${ date }`, text: date }} />

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
                    foodBlock.index = index;

                    return (
                        <div
                            key={ index } 
                            className="card"
                            style={{ backgroundColor: foodBlock.color }}
                            onClick={ () => toggleEditFoodBlockModal(foodBlock) }>
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
                                    onClick={(event) => { updateAmountOfFood({ event, amount: -foodBlock.increment, index }) }}
                                    className="card-button">
                                    -
                                </button>
                                
                                <button
                                    onClick={(event) => { updateAmountOfFood({ event, amount: foodBlock.increment, index }) }}
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

            { isEditFoodBlockModalOpen ? (
                <Modal isOpen={ isEditFoodBlockModalOpen }>
                    <form
                        onSubmit={ handleSubmit }
                        className="flex flex-direction-column justify-content-between mb-2 p-1"
                        style={{ borderTop: `20px solid ${ foodBlock.color }` }}>
                        <div className="flex flex-direction-column align-items-start mb-2">
                            <label htmlFor="name">
                                food
                            </label>
                            <input
                                onChange={ (event) => handleChange(event) }
                                value={ foodBlock.name }
                                type="text"
                                id="name"
                                name="name"
                                required />

                            <label htmlFor="calories">
                                total calories
                            </label>
                            <input
                                onChange={ (event) => handleChange(event) }
                                value={ foodBlock.calories }
                                type="number"
                                id="calories"
                                name="calories"
                                required
                                min="1"
                                step="0.01" />

                            <label htmlFor="increment">
                                increment
                            </label>
                            <input
                                onChange={ (event) => handleChange(event) }
                                value={ foodBlock.increment }
                                type="number"
                                id="increment"
                                name="increment"
                                required
                                min="1" />

                            <label htmlFor="unit">
                                unit of measurement
                            </label>
                            <input
                                onChange={ (event) => handleChange(event) }
                                value={ foodBlock.unit }
                                type="text"
                                id="unit"
                                name="unit" />

                            <label htmlFor="limit">
                                limit
                            </label>
                            <input
                                onChange={ (event) => handleChange(event) }
                                value={ foodBlock.limit }
                                type="number"
                                id="limit"
                                name="limit"
                                required
                                min="1" />
                            <div className="text-gray text-small ml-04 mb-04">
                                select a color
                            </div>
                            <div className="flex">
                                { colors.map(color => {
                                    return (
                                        <div
                                            key={ color }
                                            onClick={ () => updateColor(color) }
                                            className="circle mr-1 cursor-pointer"
                                            style={{ backgroundColor: color, border: color === foodBlock.color ? "3px solid #000000" : null }}
                                            title={`${ color }`}>
                                        </div>
                                    );
                                }) }
                            </div>
                        </div> 

                        <div className="flex justify-content-between">
                            <button
                                type="button"
                                onClick={ () => {
                                    toggleEditFoodBlockModal({
                                        name: '',
                                        calories: '',
                                        increment: '',
                                        unit: '',
                                        amount: '',
                                        limit: '',
                                        color: ''
                                    })
                                }}
                                className="button button-red">
                                cancel
                            </button>
                            <button className="button button-green">
                                update
                            </button>
                        </div>
                    </form>
                </Modal>
            ) : (null) }
        </div> 
    );
}