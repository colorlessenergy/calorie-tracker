
import { useEffect, useState  } from 'react';
import Head from 'next/head';

import SettingsNav from '../../shared/components/SettingsNav';
import Modal from '../../shared/components/modal';

import {
    addFoodBlockToFoodDictionary,
    getFoodDictionaryFromLocalStorage,
    removeFoodBlockFromFoodDictionary
} from '../../shared/food/food';

export default function FoodDictionary () {
    const [ foodBlock, setFoodBlock ] = useState({
        ID: null,
        name: '',
        calories: '',
        unit: '',
        amount: ''
    });

    const handleChange = (event) => { 
        setFoodBlock(previousFoodBlock => ({
                ...previousFoodBlock,
                [ event.target.id ]: event.target.value
            }
        ));
    }

    const [ isEditFoodBlockModalOpen, setIsEditFoodBlockModalOpen ] = useState(false);
    const toggleEditFoodBlockModal = (foodBlock) => {
        setFoodBlock(foodBlock);
        setIsEditFoodBlockModalOpen(previousIsEditFoodBlockModalOpen => !previousIsEditFoodBlockModalOpen);
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        addFoodBlockToFoodDictionary(foodBlock);

        setFoodDictionary(getFoodDictionaryFromLocalStorage());

        toggleEditFoodBlockModal({
            ID: null,
            name: '',
            calories: '',
            unit: '',
            amount: ''
        });
    }

    const addNewFoodBlock = () => {
        const foodBlock = addFoodBlockToFoodDictionary({
            ID: null,
            name: '',
            calories: '',
            unit: '',
            amount: ''
        });

        setFoodDictionary(getFoodDictionaryFromLocalStorage());

        toggleEditFoodBlockModal(foodBlock);
    }

    const removeFoodBlock = (foodBlockID) => {
        removeFoodBlockFromFoodDictionary(foodBlockID);

        setFoodDictionary(getFoodDictionaryFromLocalStorage());

        toggleEditFoodBlockModal({
            ID: null,
            name: '',
            calories: '',
            unit: '',
            amount: ''
        });
    }

    const [ foodDictionary, setFoodDictionary ] = useState([]);
    useEffect(() => {
        setFoodDictionary(getFoodDictionaryFromLocalStorage());
    }, []);

    const [ amountOfCaloriesPerUnit, setAmountOfCaloriesPerUnit ] = useState({});
    const handleCalculateCalories = ({ value, foodBlock }) => {
        const amountOfCaloriesPerUnit = foodBlock.calories / foodBlock.amount;

        setAmountOfCaloriesPerUnit(previousAmountOfCaloriesPerUnit => ({
            ...previousAmountOfCaloriesPerUnit,
            [ foodBlock.ID ]: (amountOfCaloriesPerUnit * value).toFixed(2)
        }));
    }

    return (
        <div>
            <Head>
                <title>calorie tracker - food dictionary</title>
                <meta name="description" content="calorie tracker - food dictionary" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className="container">
                <SettingsNav />

                <div className="mx-15">
                    <h1 className="mt-1">
                        food dictionary
                    </h1>

                    <button
                        onClick={ addNewFoodBlock }
                        className="button button-green mb-1">add food</button>
                </div>

                <div className="flex flex-wrap justify-content-between">
                    { foodDictionary.length ? (foodDictionary.map(foodBlock => {
                        return (
                            <div
                                className="card text-medium"
                                key={ foodBlock.ID }>
                                <div
                                    onClick={ () => toggleEditFoodBlockModal(foodBlock) }
                                    className="text-bold cursor-pointer">   
                                    { foodBlock.name } 
                                </div>
                                <div
                                    onClick={ () => toggleEditFoodBlockModal(foodBlock) }
                                    className="flex justify-content-between w-100 mb-1 cursor-pointer">
                                    <div>
                                        { foodBlock.calories } calories
                                    </div>

                                    <div>
                                        { foodBlock.amount } { foodBlock.unit } 
                                    </div>
                                </div>

                                <div className="align-self-start w-100">
                                    <label htmlFor={`calculateCalories-${ foodBlock.ID }`}>calculate calories</label>
                                    <input
                                        onChange={ event => handleCalculateCalories({ value: event.currentTarget.value, foodBlock }) }
                                        type="number"
                                        id={`calculateCalories-${ foodBlock.ID }`}
                                        name={`calculateCalories-${ foodBlock.ID }`}
                                        min="1"
                                        step="0.01"
                                        placeholder="amount" />
                                </div>

                                { amountOfCaloriesPerUnit[ foodBlock.ID ] ? (
                                    <div className="align-self-start">{ amountOfCaloriesPerUnit[ foodBlock.ID ] } calories</div>
                                ) : (null) }
                            </div>
                        );
                    })) : (null) }
                </div>
            </div>


            { isEditFoodBlockModalOpen ? (
                <Modal isOpen={ isEditFoodBlockModalOpen }>
                    <form
                        onSubmit={ handleSubmit }
                        className="flex flex-direction-column justify-content-between p-1">
                        <div className="flex flex-direction-column align-items-start mb-2">
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
                                calories
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

                            <label htmlFor="amount">
                                amount
                            </label>
                            <input
                                onChange={ (event) => handleChange(event) }
                                value={ foodBlock.amount }
                                type="number"
                                id="amount"
                                name="amount"
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
                        </div> 

                        <div className="flex justify-content-between">
                            <button
                                type="button"
                                onClick={ () => {
                                    toggleEditFoodBlockModal({
                                        ID: null,
                                        name: '',
                                        calories: '',
                                        unit: '',
                                        amount: '',
                                    });
                                }}
                                className="button button-red">
                                cancel
                            </button>

                            <button
                                type="button"
                                onClick={ () => removeFoodBlock(foodBlock.ID) }
                                className="button button-pink">
                                remove
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