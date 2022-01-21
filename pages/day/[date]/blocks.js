import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import orangeIcon from '../../../public/icons/orange.svg';

import Nav from '../../../shared/components/nav';
import Modal from '../../../shared/components/modal';
import Snackbar from '../../../shared/components/Snackbar/Snackbar';

import {
    getFoodFromLocalStorage,
    updateFoodBlockInLocalStorage,
    removeFoodBlockFromLocalStorage,
    addEmptyFoodBlockToLocalStorage,
    duplicateAndMergeFoodBlocksFromPreviousDate,
    getFoodDictionaryFromLocalStorage
} from '../../../shared/food/food';

import useSnackbar from '../../../shared/hooks/useSnackbar';

const colors = ["#ffe58f", "#eaff8f", "#b7eb8f", "#87e8de", "#ffd6e7"];

export default function Blocks () {
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
    useEffect(() => {
        let calories = 0;
        foodBlocks?.forEach(foodBlock => {
            if (!Number.isNaN(parseFloat(foodBlock.calories))) {
                calories += parseFloat(foodBlock.calories);
            }
        });
        setTotalCalories(parseFloat(calories.toFixed(2)));
    }, [ foodBlocks ]);

    const handleChange = ({ event, index }) => {
        let cloneFoodBlocks = JSON.parse(JSON.stringify(foodBlocks));

        if (cloneFoodBlocks[index].foodDictionaryID && event.target.id === `${ index }-total-amount`) {
            cloneFoodBlocks[index].calories = getCaloriesFromFoodDictionary({ foodDictionaryID: cloneFoodBlocks[index].foodDictionaryID, foodBlockTotalAmount: event.target.value });
        }

        cloneFoodBlocks[index][event.target.name] = event.target.value;
        setFoodBlocks(cloneFoodBlocks);
    }

    const connectFoodDictionaryToFoodBlock = ({ foodDictionaryID, index }) => {
        const findFoodInFoodDictionary = foodDictionary.find(food => food.ID === foodDictionaryID);
        let cloneFoodBlocks = JSON.parse(JSON.stringify(foodBlocks));
        cloneFoodBlocks[index].foodDictionaryID = findFoodInFoodDictionary.ID;
        cloneFoodBlocks[index].name = findFoodInFoodDictionary.name;
        cloneFoodBlocks[index].calories = getCaloriesFromFoodDictionary({ foodDictionaryID, foodBlockTotalAmount: foodBlocks[index].totalAmount });

        setFoodBlocks(cloneFoodBlocks);
    }

    const removeFoodDictionaryFromFoodBlock = ({ foodDictionaryID, index }) => {
        let cloneFoodBlocks = JSON.parse(JSON.stringify(foodBlocks));

        delete cloneFoodBlocks[index].foodDictionaryID;

        setFoodBlocks(cloneFoodBlocks);
    }

    const getCaloriesFromFoodDictionary = ({ foodDictionaryID, foodBlockTotalAmount }) => {
        const findFoodInFoodDictionary = foodDictionary.find(food => food.ID === foodDictionaryID);
        const amountOfCaloriesPerUnit = findFoodInFoodDictionary.calories / findFoodInFoodDictionary.amount;
        return Math.round(amountOfCaloriesPerUnit * foodBlockTotalAmount);
    }

    const { snackbar: updateSnackbar, addSnackbar: addUpdateSnackbar } = useSnackbar({
        initialSnackbar: {
            className: 'snackbar-green',
            message: null,
            amountOfTimes: 0
        },
        message: {
            single: 'food block was updated',
            multiple: 'updates were made to food blocks'
        }
    });

    const handleSubmit = ({ event, index }) => {
        event.preventDefault();

        addUpdateSnackbar();
        updateFoodBlockInLocalStorage({ date, foodBlock: foodBlocks[index] });
    }

    const updateColor = ({ index, color }) => {
        let cloneFoodBlocks = JSON.parse(JSON.stringify(foodBlocks));
        cloneFoodBlocks[index].color = color;
        setFoodBlocks(cloneFoodBlocks);
    }

    const removeFoodBlock = ({ date, index }) => {
        let cloneFoodBlocks = JSON.parse(JSON.stringify(foodBlocks));
        removeFoodBlockFromLocalStorage({ date, foodBlockID: cloneFoodBlocks[index].ID });

        cloneFoodBlocks.splice(index, 1);
        setFoodBlocks(cloneFoodBlocks);
    }

    const { snackbar, addSnackbar } = useSnackbar({
        initialSnackbar: {
            className: 'snackbar-pink',
            message: null,
            amountOfTimes: 0
        },
        message: {
            single: 'a new food block was added',
            multiple: 'food blocks were added'
        }
    });

    const addFoodBlock = () => {
        addEmptyFoodBlockToLocalStorage(date);
        setFoodBlocks(getFoodFromLocalStorage(date));

        addSnackbar();
    }

    useEffect(() => {
        if (router.query.modalOpen === 'true') {
            setIsModalOpen(true);
        }

        setAllFoodBlocks(JSON.parse(localStorage.getItem('foodBlocks')));
    }, []);


    const [ isModalOpen, setIsModalOpen ] = useState(false);
    const toggleModal = () => {
        setIsModalOpen(previousIsModalOpen => !previousIsModalOpen);
    }

    const [ allFoodBlocks, setAllFoodBlocks ] = useState(null);
    const [ previousFoodBlockDate, setPreviousFoodBlockDate ] = useState('');
    const handlePreviousFoodBlockDateChange = event => {
        if (event.currentTarget.value) return setPreviousFoodBlockDate(event.currentTarget.value);
    }
    const handleDuplicateAndMergePreviousDateSubmit = event => {
        event.preventDefault();
        if (!previousFoodBlockDate) return;

        duplicateAndMergeFoodBlocksFromPreviousDate({ previousDate: previousFoodBlockDate, currentDate: date });
        setFoodBlocks(getFoodFromLocalStorage(date));
        toggleModal();
    }

    return (
        <div className="container">
            <Nav link={{ link: `/day/${ date }`, text: date }} />
            <div className="flex justify-content-between mx-15 pt-3">
                <div>
                    food blocks
                    <button
                        onClick={ toggleModal }
                        className="add-food-block-button">+</button>
                </div>
                { totalCalories } calories
            </div>

            { foodBlocks?.length === 0 ? (
                <>
                    <div className="no-food-blocks-emoji">
                        <Image
                            height={ 140 }
                            width={ 140 }
                            src={ orangeIcon }
                            alt="orange icon" />
                    </div>
                    <p className="text-center text-medium">
                        no food blocks
                    </p>

                    <button
                        onClick={ toggleModal }
                        className="add-food-block-button add-food-block-button--large d-block m-center">+</button>
                </>
            ) : (null) }

            <div className="flex flex-wrap justify-content-between mt-2 mx-15">
                { foodBlocks?.map((foodBlock, index) => {
                    const findFoodInFoodDictionary = foodBlock.foodDictionaryID ? foodDictionary.find(food => food.ID === foodBlock.foodDictionaryID) : (null);
                    const filterFoodDictionary = foodDictionary.filter(food => food.ID !== foodBlock.foodDictionaryID && food.name.toLowerCase().includes(foodBlock.name.toLowerCase().trim()));

                    return (
                        <form
                            key={ index }
                            onSubmit={ (event) => handleSubmit({ event, index }) }
                            className="flex flex-direction-column justify-content-between mb-2 p-1 food-block-form"
                            style={{ borderTop: `20px solid ${ foodBlock.color }` }}>
                            <div className="flex flex-direction-column align-items-start mb-2">
                                <label htmlFor={`${ index }-name`}>
                                    food
                                </label>
                                <input
                                    onChange={ (event) => handleChange({ event, index }) }
                                    value={ foodBlocks[index].name }
                                    type="text"
                                    autoComplete="off"
                                    id={`${ index }-name`}
                                    name="name"
                                    required />

                                <label htmlFor={`${ index }-calories`}>
                                    total calories
                                </label>
                                <input
                                    disabled={ foodBlocks[index].foodDictionaryID ? (true) : (false) }
                                    onChange={ (event) => handleChange({ event, index }) }
                                    value={ foodBlocks[index].calories }
                                    type="number"
                                    id={`${ index }-calories`}
                                    name="calories"
                                    required
                                    min="1"
                                    step="0.01" />

                                <label htmlFor={`${ index }-total-amount`}>
                                    total amount
                                </label>
                                <input
                                    onChange={ (event) => handleChange({ event, index }) }
                                    value={ foodBlocks[index].totalAmount }
                                    type="number"
                                    id={`${ index }-total-amount`}
                                    name="totalAmount"
                                    required
                                    min="1"
                                    step="0.01" />

                                <label htmlFor={`${ index }-unit`}>
                                    unit of measurement
                                </label>
                                <input
                                    onChange={ (event) => handleChange({ event, index }) }
                                    value={ foodBlocks[index].unit }
                                    type="text"
                                    autoComplete="off"
                                    id={`${ index }-unit`}
                                    name="unit" />

                                <div className="text-gray text-small mb-04">
                                    select a color
                                </div>
                                <div className="flex mb-1">
                                    { colors.map(color => {
                                        return (
                                            <div
                                                key={ color }
                                                onClick={ () => updateColor({ index, color }) }
                                                className="circle mr-1 cursor-pointer"
                                                style={{ backgroundColor: color, border: color === foodBlock.color ? "3px solid #000000" : null }}
                                                title={`${ color }`}>
                                            </div>
                                        );
                                    }) }
                                </div>

                                { (foodBlocks[index].name && filterFoodDictionary.length) || foodBlocks[index].foodDictionaryID ? (
                                    <div className="text-gray text-small mb-04">
                                        connect food dictionary
                                    </div>
                                ) : (null) }

                                <div className="flex flex-wrap overflow-y-100 w-100">
                                    { findFoodInFoodDictionary ? (
                                        <div
                                            onClick={() => removeFoodDictionaryFromFoodBlock({ foodDictionaryID: findFoodInFoodDictionary.ID, index }) }
                                            className="card card--blocks mx-0 cursor-pointer b-color-orange">
                                            <div className="text-bold">   
                                                { findFoodInFoodDictionary.name } 
                                            </div>
                                            <div className="flex justify-content-between w-100">
                                                <div>
                                                    { findFoodInFoodDictionary.calories } calories
                                                </div>

                                                <div>
                                                    { findFoodInFoodDictionary.amount } { findFoodInFoodDictionary.unit } 
                                                </div>
                                            </div>
                                        </div>
                                    ) : (null) }
                                    { foodBlocks[index].name ? (
                                        filterFoodDictionary
                                        .map(food => {
                                            return (
                                                <div
                                                    className={`card card--blocks mx-0 cursor-pointer ${ food.ID == foodBlock.foodDictionaryID ? ("b-color-orange") : ("") }`}
                                                    onClick={() => connectFoodDictionaryToFoodBlock({ foodDictionaryID: food.ID, index }) }
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
                                    })) : (null) }
                                </div>
                            </div> 

                            <div className="flex justify-content-between">
                                <button
                                    type="button"
                                    onClick={ () => removeFoodBlock({ date, index }) }
                                    className="button button-red">
                                    remove
                                </button>
                                <button className="button button-green">
                                    update
                                </button>
                            </div>
                    </form>
                    );
                }) }
            </div>
            <Modal isOpen={ isModalOpen }>
                <div className="flex flex-direction-column position-relative">
                    <button
                        onClick={ toggleModal }
                        className="modal-button-close">
                        done
                    </button>

                    <button
                        onClick={ () => addFoodBlock(date) }
                        className="align-self-start text-decoration-underline text-medium mb-1">
                        add a new food block
                    </button>

                    { allFoodBlocks && Object.keys(allFoodBlocks).length > 1 ? (
                        <form onSubmit={ handleDuplicateAndMergePreviousDateSubmit }>
                            <div className="flex flex-direction-column mb-2">
                                <label
                                    className="text-black text-medium mb-1"
                                    htmlFor="foodBlocksDate">duplicate previous day food blocks</label>
                                <select
                                    onChange={ handlePreviousFoodBlockDateChange }
                                    className="text-medium w-50"
                                    id="foodBlocksDate">
                                    <option value="">choose a date</option>
                                    { Object.keys(allFoodBlocks).sort((dateOne, dateTwo) => {
                                        return new Date(dateOne) - new Date(dateTwo);
                                    }).slice(-10).map(foodBlockDate => {
                                        if (foodBlockDate === date) return;

                                        return (
                                            <option
                                                key={ foodBlockDate }
                                                value={ foodBlockDate }>{ foodBlockDate }</option>
                                        )
                                    }) }
                                </select>
                            </div>

                            <button className="button button-pink">duplicate</button>
                        </form>
                    ) : (null) }

                </div> 
            </Modal>


            <div className="snackbars-container">
                { updateSnackbar.message ? (
                    <Snackbar message={ updateSnackbar.message } className={ updateSnackbar.className } />
                ) : (null) }
                { snackbar.message ? (
                    <Snackbar message={ snackbar.message } className={ snackbar.className } />
                ) : (null) }
            </div>
        </div>
    );
}