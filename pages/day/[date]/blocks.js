import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import Nav from '../../../shared/components/nav';
import Modal from '../../../shared/components/modal';

import { getFoodFromLocalStorage, updateFoodBlockInLocalStorage, removeFoodBlockFromLocalStorage, addEmptyFoodBlockToLocalStorage, addPreviousFoodBlockToLocalStorage, removePreviousFoodBlockFromLocalStorage, addPreviousFoodBlockToFoodBlocksInLocalStorage } from '../../../shared/food/food';

const colors = ["#ffe58f", "#eaff8f", "#b7eb8f", "#87e8de", "#ffadd2"];

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
            if (Number.isInteger(Number(foodBlock.limit)) && Number.isInteger(Number(foodBlock.increment))) {
                calories += foodBlock.limit * foodBlock.calories;
            } else {
                let amountOfTimesAddedOrRemoved = foodBlock.limit / foodBlock.increment;
                calories += amountOfTimesAddedOrRemoved * foodBlock.calories;
            }
        });
        setTotalCalories(calories);
    }, [ foodBlocks ]);

    const handleChange = ({ event, index }) => {
        let cloneFoodBlocks = JSON.parse(JSON.stringify(foodBlocks));
        cloneFoodBlocks[index][event.target.name] = event.target.value;
        setFoodBlocks(cloneFoodBlocks);
    }

    const handleSubmit = ({ event, index }) => {
        event.preventDefault();

        updateFoodBlockInLocalStorage({ date, index, foodBlock: foodBlocks[index] });
        addPreviousFoodBlockToLocalStorage({ foodBlock: foodBlocks[index], setPreviousFoodBlocks });
    }

    const updateColor = ({ index, color }) => {
        let cloneFoodBlocks = JSON.parse(JSON.stringify(foodBlocks));
        cloneFoodBlocks[index].ribbonColor = color;
        setFoodBlocks(cloneFoodBlocks);
    }

    const removeFoodBlock = ({ date, index }) => {
        let cloneFoodBlocks = JSON.parse(JSON.stringify(foodBlocks));
        cloneFoodBlocks.splice(index, 1);
        setFoodBlocks(cloneFoodBlocks);

        removeFoodBlockFromLocalStorage({ date, index });
    }


    const [ isModalOpen, setIsModalOpen ] = useState(false);
    const toggleModal = () => {
        setIsModalOpen(previousIsModalOpen => {
            return !previousIsModalOpen;
        });
    }

    const addFoodBlock = () => {
        addEmptyFoodBlockToLocalStorage(date);
        setFoodBlocks(getFoodFromLocalStorage(date));
    }

    const [ previousFoodBlocks, setPreviousFoodBlocks ] = useState([])
    useEffect(() => {
        setPreviousFoodBlocks(JSON.parse(localStorage.getItem('previousFoodBlocks')) || []);
    }, []);

    const removePreviousFoodBlock = (index) => {
        let clonePreviousFoodBlocks = JSON.parse(JSON.stringify(previousFoodBlocks));
        clonePreviousFoodBlocks.splice(index, 1);
        setPreviousFoodBlocks(clonePreviousFoodBlocks);

        removePreviousFoodBlockFromLocalStorage(index);
    }

    const handlePreviousFoodBlocksSubmit = ({ event, index }) => {
        event.preventDefault();
        addPreviousFoodBlockToFoodBlocksInLocalStorage({ date, index });
        setFoodBlocks(getFoodFromLocalStorage(date));
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

            { foodBlocks.length === 0 ? (
                <>
                    <div className="no-food-blocks-emoji">
                        🍋
                    </div>
                    <p className="text-center text-medium text-gray">
                        no food blocks
                    </p>

                    <button
                        onClick={ toggleModal }
                        className="add-food-block-button add-food-block-button--large d-block m-center">+</button>
                </>
            ) : (null) }

            { foodBlocks.map((foodBlock, index) => {
                return (
                    <div
                        key={ index }
                        className="mb-1">
                        <div
                            className="ribbon"
                            style={{ backgroundColor: foodBlock.ribbonColor }}></div>
                        <form
                            onSubmit={ (event) => handleSubmit({ event, index }) }
                            className="flex justify-content-between mx-15">
                            <div className="flex flex-direction-column align-items-start form-groups-container">
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
                                    min="1" />

                                <label htmlFor={`${ index }-increment`}>
                                    increment
                                </label>
                                <input
                                    onChange={ (event) => handleChange({ event, index }) }
                                    value={ foodBlocks[index].increment }
                                    type="number"
                                    id={`${ index }-increment`}
                                    name="increment"
                                    required />

                                <label htmlFor={`${ index }-unit`}>
                                    unit
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
                                    required />
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
                                                style={{ backgroundColor: color }}
                                                title={`${ color }`}>
                                            </div>
                                        );
                                    }) }
                                </div>
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

            <Modal isOpen={ isModalOpen }>
                <div className="flex flex-direction-column position-relative">
                    <button
                        onClick={ toggleModal }
                        className="modal-button-close">
                        done
                    </button>

                    <button
                        onClick={ () => addFoodBlock(date) }
                        className="align-self-start text-decoration-underline mb-1">
                        add a new food block
                    </button>

                    <div className="text-medium">previous food blocks</div>

                    <div className="previous-food-blocks-container">
                        { previousFoodBlocks.map((foodBlock, index) => {
                            return (
                                <div key={index}>
                                    <div
                                        className="ribbon mx-0"
                                        style={{ backgroundColor: foodBlock.ribbonColor }}></div>
                                    <form
                                        onSubmit={ (event) => handlePreviousFoodBlocksSubmit({ event, index }) }
                                        className="flex justify-content-between">
                                        <div className="flex flex-direction-column align-items-start form-groups-container">
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
                                                id={`${ index }-previous-calories`} />

                                            <label htmlFor={`${ index }-previous-increment`}>
                                                increment
                                            </label>
                                            <input
                                                disabled={ true }
                                                value={ foodBlock.increment }
                                                type="number"
                                                id={`${ index }-previous-increment`} />

                                            <label htmlFor={`${ index }-previous-unit`}>
                                                unit
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

                                        <div className="flex flex-direction-column">
                                            <button
                                                type="button"
                                                onClick={ () => removePreviousFoodBlock(index) }
                                                className="button button-red mb-2">
                                                remove
                                            </button>
                                            <button className="button button-pink">
                                                add
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            );
                        }) }
                    </div>
                </div> 
            </Modal>
        </div>
    );
}