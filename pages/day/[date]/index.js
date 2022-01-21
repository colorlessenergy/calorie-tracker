import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import watermelonIcon from '../../../public/icons/watermelon.svg';

import Nav from '../../../shared/components/nav';
import Confetti from 'react-confetti'
import Modal from '../../../shared/components/modal';

import {
    addEmptyFoodBlockToLocalStorage,
    getFoodFromLocalStorage,
    removeFoodBlockFromLocalStorage,
    updateFoodBlockInLocalStorage,
    getFoodDictionaryFromLocalStorage,
} from '../../../shared/food/food';

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

    const [ foodDictionary, setFoodDictionary ] = useState([]);
    useEffect(() => {
        setFoodDictionary(getFoodDictionaryFromLocalStorage());
    }, []);

    const [ totalCalories, setTotalCalories ] = useState(0);
    const [ confetti, setConfetti ] = useState(null);
    useEffect(() => {
        let calories = 0;
        foodBlocks?.forEach(foodBlock => {
            if (foodBlock.amount >= foodBlock.totalAmount && parseFloat(foodBlock.calories)) {
                calories += parseFloat(foodBlock.calories);
            }
        });

        if (calories === calorieGoal && calorieGoal !== 0) {
            const width  = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
            const height = window.innerHeight|| document.documentElement.clientHeight || document.body.clientHeight
            setConfetti({
                width: width,
                height: height
            });
        }

        setTotalCalories(parseFloat(calories.toFixed(2)));
    }, [ foodBlocks ]);

    const [ calorieGoal, setCalorieGoal ] = useState(1);
    useEffect(() => {
        setCalorieGoal(parseFloat(localStorage.getItem('calorieGoal')) || 1);
    }, []);

    const updateAmountOfFood = ({ event, sign, index }) => {
        event.stopPropagation();

        let cloneFoodBlocks = JSON.parse(JSON.stringify(foodBlocks));
        if (cloneFoodBlocks[index].amount === 0 && Math.sign(sign) === 1) {
            cloneFoodBlocks[index].amount += parseFloat(cloneFoodBlocks[index].totalAmount);
            setFoodBlocks(cloneFoodBlocks);
            updateFoodBlockInLocalStorage({ date, foodBlock: cloneFoodBlocks[index], updatedWithButton: true });
        } else if (cloneFoodBlocks[index].amount === parseFloat(cloneFoodBlocks[index].totalAmount) && Math.sign(sign) === -1) {
            cloneFoodBlocks[index].amount -= cloneFoodBlocks[index].totalAmount;
            setFoodBlocks(cloneFoodBlocks);
            updateFoodBlockInLocalStorage({ date, foodBlock: cloneFoodBlocks[index], updatedWithButton: true });
        }
    }

    const [ isEditFoodBlockModalOpen, setIsEditFoodBlockModalOpen ] = useState(false);
    const toggleEditFoodBlockModal = (foodBlock) => {
        setFoodBlock(foodBlock);
        setIsEditFoodBlockModalOpen(previousIsEditFoodBlockModalOpen => !previousIsEditFoodBlockModalOpen);
    }

    const [ foodBlock, setFoodBlock ] = useState({
        ID: null,
        foodDictionaryID: null,
        name: '',
        calories: '',
        unit: '',
        amount: '',
        totalAmount: null,
        color: ''
    });

    const handleChange = (event) => { 
        setFoodBlock(previousFoodBlock => ({
                ...previousFoodBlock,
                [ event.target.id ]: event.target.value
            }
        ));
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
            ID: null,
            name: '',
            calories: '',
            unit: '',
            amount: '',
            totalAmount: null,
            color: ''
        });
    }

    const addEmptyFoodBlock = () => {
        addEmptyFoodBlockToLocalStorage(date);
        const foodBlocksFromLocalStorage = getFoodFromLocalStorage(date);
        setFoodBlocks(foodBlocksFromLocalStorage);

        toggleEditFoodBlockModal(foodBlocksFromLocalStorage[ foodBlocksFromLocalStorage.length-1 ]);
    }

    const removeFoodBlock = (foodBlockID) => {
        removeFoodBlockFromLocalStorage({ date, foodBlockID });

        setFoodBlocks(getFoodFromLocalStorage(date));

        toggleEditFoodBlockModal({
            ID: null,
            name: '',
            calories: '',
            unit: '',
            amount: '',
            totalAmount: null,
            color: ''
        });
    }

    const connectFoodDictionaryToFoodBlock = foodDictionaryID => {
        setFoodBlock(previousFoodBlock => ({
            ...previousFoodBlock,
            foodDictionaryID
        }));

    }

    return (
        <div className="container">
            <Nav link={{ link: `/day/${ date }`, text: date }} />

            <div className="mx-15 mt-1 mb-1 flex align-items-center">
                <div className="mr-1">
                    { totalCalories } total calories
                </div>
                <div>
                    { calorieGoal } calorie goal
                </div>

                <button
                    onClick={ () => addEmptyFoodBlock() }
                    className="add-food-block-button">
                    +
                </button>
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
                    <p className="text-center text-medium">
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
                            className="card cursor-pointer"
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
                                { foodBlock.amount } / { foodBlock.totalAmount } <span className="text-medium">{ foodBlock.unit }</span>
                            </div>

                            <div className="flex justify-content-between w-100">
                                <button
                                    onClick={(event) => { updateAmountOfFood({ event, sign: -1, index }) }}
                                    className="card-button">
                                    -
                                </button>
                                
                                <button
                                    onClick={(event) => { updateAmountOfFood({ event, sign: 1, index }) }}
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
                <Modal
                    outsideElements={
                        <div className="flex">
                            <button
                                type="button"
                                onClick={ () => {
                                    toggleEditFoodBlockModal({
                                        ID: null,
                                        name: '',
                                        calories: '',
                                        unit: '',
                                        amount: '',
                                        color: ''
                                    });
                                }}
                                className="button button-red flex-grow-1">
                                cancel
                            </button>

                            <button
                                type="button"
                                onClick={ () => {
                                    removeFoodBlock(foodBlock.ID);
                                } }
                                className="button button-pink flex-grow-1">
                                remove
                            </button>

                            <label
                                htmlFor="form-submit"
                                className="button button-green flex-grow-1 text-center cursor-pointer">
                                update
                            </label>
                        </div>
                    }
                    isOpen={ isEditFoodBlockModalOpen }>
                    <form
                        onSubmit={ handleSubmit }
                        className="flex flex-direction-column justify-content-between p-1"
                        style={{ borderTop: `20px solid ${ foodBlock.color }` }}>
                        <label htmlFor="name">
                            food
                        </label>
                        <input
                            onChange={ (event) => handleChange(event) }
                            value={ foodBlock.name }
                            type="text"
                            autoComplete="off"
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

                        <label htmlFor="totalAmount">
                            total amount
                        </label>
                        <input
                            onChange={ (event) => handleChange(event) }
                            value={ foodBlock.totalAmount }
                            type="number"
                            id="totalAmount"
                            name="total-amount"
                            required
                            min="1"
                            step="0.01" />

                        <label htmlFor="unit">
                            unit of measurement
                        </label>
                        <input
                            onChange={ (event) => handleChange(event) }
                            value={ foodBlock.unit }
                            type="text"
                            autoComplete="off"
                            id="unit"
                            name="unit" />

                        <div className="text-gray text-small ml-04 mb-04">
                            select a color
                        </div>
                        <div className="flex mb-1">
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

                        { foodBlock.name ? (
                            <React.Fragment>
                                <div className="text-gray text-small ml-04 mb-04">
                                    connect food dictionary
                                </div>
                                <div className="flex">
                                    { foodDictionary.filter(food => food.name.toLowerCase().includes(foodBlock.name.toLowerCase().trim())).map(food => {
                                        return (
                                            <div
                                                className={`card text-medium cursor-pointer ${ food.ID == foodBlock.foodDictionaryID ? ("b-color-orange") : ("") }`}
                                                onClick={() => connectFoodDictionaryToFoodBlock(food.ID) }
                                                key={ food.ID }>
                                                <div className="text-bold">   
                                                    { food.name } 
                                                </div>
                                                <div className="flex justify-content-between w-100">
                                                    <div>
                                                        { food.calories } calories
                                                    </div>

                                                    <div>
                                                        { food.amount } { food.unit } 
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    }) }
                                </div>
                            </React.Fragment>
                        ) : (null) }

                        <input
                            type="submit"
                            className="hidden"
                            id="form-submit" />
                    </form>
                </Modal>
            ) : (null) }
        </div> 
    );
}