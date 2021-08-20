import { Fragment, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import orangeIcon from '../../../public/icons/orange.svg';

import Nav from '../../../shared/components/nav';
import Modal from '../../../shared/components/modal';
import Snackbar from '../../../shared/components/Snackbar/Snackbar';

import { getFoodFromLocalStorage, updateFoodBlockInLocalStorage, removeFoodBlockFromLocalStorage, addEmptyFoodBlockToLocalStorage, addPreviousFoodBlockToLocalStorage, removePreviousFoodBlockFromLocalStorage, addPreviousFoodBlockToFoodBlocksInLocalStorage } from '../../../shared/food/food';

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
            calories += foodBlock.limit * foodBlock.calories;
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
        addPreviousFoodBlockToLocalStorage({ foodBlock: foodBlocks[index], setPreviousFoodBlocks });
    }

    const updateColor = ({ index, color }) => {
        let cloneFoodBlocks = JSON.parse(JSON.stringify(foodBlocks));
        cloneFoodBlocks[index].color = color;
        setFoodBlocks(cloneFoodBlocks);
    }

    const removeFoodBlock = ({ date, index }) => {
        let cloneFoodBlocks = JSON.parse(JSON.stringify(foodBlocks));
        removeFoodBlockFromLocalStorage({ date, foodBlock: cloneFoodBlocks[index] });

        cloneFoodBlocks.splice(index, 1);
        setFoodBlocks(cloneFoodBlocks);
    }


    const [ isModalOpen, setIsModalOpen ] = useState(false);
    const toggleModal = () => {
        setIsModalOpen(previousIsModalOpen => {
            return !previousIsModalOpen;
        });
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

    const [ previousFoodBlocks, setPreviousFoodBlocks ] = useState([])
    useEffect(() => {
        setPreviousFoodBlocks(JSON.parse(localStorage.getItem('previousFoodBlocks')) || []);

        if (router.query.modalOpen === "true") {
            setIsModalOpen(true);
        }
    }, []);

    const removePreviousFoodBlock = (index) => {
        let clonePreviousFoodBlocks = JSON.parse(JSON.stringify(previousFoodBlocks));
        removePreviousFoodBlockFromLocalStorage(clonePreviousFoodBlocks[index].ID);

        clonePreviousFoodBlocks.splice(index, 1);
        setPreviousFoodBlocks(clonePreviousFoodBlocks);
    }

    const handlePreviousFoodBlocksSubmit = ({ event, index }) => {
        event.preventDefault();
        addPreviousFoodBlockToFoodBlocksInLocalStorage({ date, previousFoodBlockID: previousFoodBlocks[index].ID });
        setFoodBlocks(getFoodFromLocalStorage(date));

        addFoodBlockSnackbar();
    }

    const [ filterValue, setFilterValue ] = useState('');
    const handleFilterChange = (event) => {
        setFilterValue(event.target.value);
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
                                    calories
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

                                <label htmlFor={`${ index }-increment`}>
                                    increment
                                </label>
                                <input
                                    onChange={ (event) => handleChange({ event, index }) }
                                    value={ foodBlocks[index].increment }
                                    type="number"
                                    id={`${ index }-increment`}
                                    name="increment"
                                    required
                                    min="1" />

                                <label htmlFor={`${ index }-unit`}>
                                    unit of measurement
                                </label>
                                <input
                                    onChange={ (event) => handleChange({ event, index }) }
                                    value={ foodBlocks[index].unit }
                                    type="text"
                                    id={`${ index }-unit`}
                                    name="unit" />

                                <label htmlFor={`${ index }-limit`}>
                                    limit
                                </label>
                                <input
                                    onChange={ (event) => handleChange({ event, index }) }
                                    value={ foodBlocks[index].limit }
                                    type="number"
                                    id={`${ index }-limit`}
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

                    { previousFoodBlocks.length ? (
                        <Fragment>
                            <div className="text-medium mb-1">previous food blocks</div>

                            <input
                                type="text"
                                onChange={ handleFilterChange }
                                value={ filterValue }
                                placeholder="filter previous food blocks" />
                        </Fragment>
                    ) : (null) }

                    <div className="previous-food-blocks-container flex flex-wrap justify-content-between">
                        { previousFoodBlocks.map((foodBlock, index) => {
                            if (!(foodBlock.name.toLowerCase().trim().includes(filterValue.toLowerCase().trim()))) {
                                return null;
                            }

                            return (
                                <form
                                    key={ index }
                                    onSubmit={ (event) => handlePreviousFoodBlocksSubmit({ event, index }) }
                                    className="flex flex-direction-column justify-content-between mb-2 p-1 food-block-form"
                                    style={{ borderTop: `20px solid ${ foodBlock.color }` }}>
                                    <div className="flex flex-direction-column align-items-start">
                                        <label htmlFor={`${ index }-previous-name`}>
                                            food
                                        </label>
                                        <input
                                            disabled={ true }
                                            value={ foodBlock.name }
                                            type="text"
                                            id={`${ index }-previous-name`} />

                                        <label htmlFor={`${ index }-previous-calories`}>
                                            calories
                                        </label>
                                        <input
                                            disabled={ true }
                                            value={ foodBlock.calories }
                                            type="number"
                                            id={`${ index }-previous-calories`}
                                            step="0.01" />

                                        <label htmlFor={`${ index }-previous-increment`}>
                                            increment
                                        </label>
                                        <input
                                            disabled={ true }
                                            value={ foodBlock.increment }
                                            type="number"
                                            id={`${ index }-previous-increment`} />

                                        <label htmlFor={`${ index }-previous-unit`}>
                                            unit of measurement
                                        </label>
                                        <input
                                            disabled={ true }
                                            value={ foodBlock.unit }
                                            type="text"
                                            id={`${ index }-previous-unit`} />

                                        <label htmlFor={`${ index }-previous-limit`}>
                                            limit
                                        </label>
                                        <input
                                            disabled={ true }
                                            value={ foodBlock.limit }
                                            type="number"
                                            id={`${ index }-previous-limit`} />
                                    </div> 

                                    <div className="flex justify-content-between">
                                        <button
                                            type="button"
                                            onClick={ () => removePreviousFoodBlock(index) }
                                            className="button button-red">
                                            remove
                                        </button>
                                        <button className="button button-pink">
                                            add
                                        </button>
                                    </div>
                                </form>
                            );
                        }) }
                    </div>
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