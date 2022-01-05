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
    duplicateAndMergeFoodBlocksFromPreviousDate
} from '../../../shared/food/food';

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

        cloneFoodBlocks[index][event.target.name] = event.target.value;
        setFoodBlocks(cloneFoodBlocks);
    }

    const [ snackbars, setSnackbars ] = useState({
        update: {
            snackbar: null,
            timeout: null,
            amountOfTimesUpdated: 0
        },
        add: {
            snackbar: null,
            timeout: null,
            amountOfTimesAdded: 0
        }
    });

    useEffect(() => {
        return () => {
            if (snackbars.update.timeout) {
                clearTimeout(snackbars.update.timeout);
            }

            if (snackbars.add.timeout) {
                clearTimeout(snackbars.add.timeout);
            }
        }
    }, []);

    const handleSubmit = ({ event, index }) => {
        event.preventDefault();

        let cloneSnackbars = JSON.parse(JSON.stringify(snackbars));
        if (cloneSnackbars.update.timeout) {
            clearTimeout(snackbars.update.timeout);
        }

        let message = 'food block was updated';
        if (cloneSnackbars.update.amountOfTimesUpdated >= 1) {
            message = `${ cloneSnackbars.update.amountOfTimesUpdated + 1 } updates were made to food blocks`;
        }

        cloneSnackbars.update.snackbar = {
            message: message,
            className: 'snackbar-green'
        }

        let snackbarTimeout = setTimeout(() => {
            let cloneSnackbars = JSON.parse(JSON.stringify(snackbars));
            cloneSnackbars.update.snackbar = null;
            cloneSnackbars.update.timeout = null;
            cloneSnackbars.update.amountOfTimesUpdated = 0;
            setSnackbars(previousSnackbars => { 
                return {
                    ...previousSnackbars,
                    update: cloneSnackbars.update
                }
            });
        }, 5000);

        cloneSnackbars.update.timeout = snackbarTimeout;
        cloneSnackbars.update.amountOfTimesUpdated += 1;

        setSnackbars(cloneSnackbars);
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

    const addFoodBlockSnackbar = () => {
        let cloneSnackbars = JSON.parse(JSON.stringify(snackbars));
        if (cloneSnackbars.add.timeout) {
            clearTimeout(cloneSnackbars.add.timeout);
        }

        let message = 'a new food block was added';
        if (cloneSnackbars.add.amountOfTimesAdded >= 1) {
            message = `${ cloneSnackbars.add.amountOfTimesAdded + 1 } food blocks were added`;
        }

        cloneSnackbars.add.snackbar = {
            message: message,
            className: 'snackbar-pink'
        }

        let snackbarTimeout = setTimeout(() => {
            let cloneSnackbars = JSON.parse(JSON.stringify(snackbars));
            cloneSnackbars.add.snackbar = null;
            cloneSnackbars.add.timeout = null;
            cloneSnackbars.add.amountOfTimesAdded = 0;
            setSnackbars(previousSnackbars => { 
                return {
                    ...previousSnackbars,
                    add: cloneSnackbars.add
                }
            });
        }, 5000);

        cloneSnackbars.add.timeout = snackbarTimeout;
        cloneSnackbars.add.amountOfTimesAdded += 1;
        setSnackbars(cloneSnackbars);
    }

    const addFoodBlock = () => {
        addEmptyFoodBlockToLocalStorage(date);
        setFoodBlocks(getFoodFromLocalStorage(date));

        addFoodBlockSnackbar();
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

    const [ allFoodBlocks, setAllFoodBlocks ] = useState({});
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
                    <p className="text-center text-medium text-gray">
                        no food blocks
                    </p>

                    <button
                        onClick={ toggleModal }
                        className="add-food-block-button add-food-block-button--large d-block m-center">+</button>
                </>
            ) : (null) }

            <div className="flex flex-wrap justify-content-between mt-2 mx-15">
                { foodBlocks?.map((foodBlock, index) => {
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
                                    id={`${ index }-name`}
                                    name="name"
                                    required />

                                <label htmlFor={`${ index }-calories`}>
                                    total calories
                                </label>
                                <input
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
                                    id={`${ index }-unit`}
                                    name="unit" />

                                <div className="text-gray text-small ml-04 mb-04">
                                    select a color
                                </div>
                                <div className="flex">
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
                                { allFoodBlocks ? (Object.keys(allFoodBlocks).map(foodBlockDate => {
                                    if (foodBlockDate === date) return;

                                    return (
                                        <option
                                            key={ foodBlockDate }
                                            value={ foodBlockDate }>{ foodBlockDate }</option>
                                    )
                                })) : (null) }
                            </select>
                        </div>

                        <button className="button button-pink">duplicate</button>
                    </form>

                </div> 
            </Modal>


            <div className="snackbars-container">
                { snackbars.update.snackbar ? (
                    <Snackbar message={ snackbars.update.snackbar.message } className={ snackbars.update.snackbar.className } />
                ) : (null) }
                { snackbars.add.snackbar ? (
                    <Snackbar message={ snackbars.add.snackbar.message } className={ snackbars.add.snackbar.className } />
                ) : (null) }
            </div>
        </div>
    );
}