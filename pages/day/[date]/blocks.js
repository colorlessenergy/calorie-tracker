import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import Nav from '../../../shared/components/nav';
import Modal from '../../../shared/components/modal';

import { getFoodFromLocalStorage, setFoodBlockIntoLocalStorage, removeFoodBlockFromLocalStorage, addFoodBlockToLocalStorage, addPreviousFoodBlockToLocalStorage, removePreviousFoodBlockFromLocalStorage } from '../../../shared/food/food';

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
            calories = foodBlock.limit * foodBlock.calories;
        });
        setTotalCalories(calories);
    }, [ foodBlocks ]);

    const handleChange = ({ event, index }) => {
        let cloneFoodBlocks = JSON.parse(JSON.stringify(foodBlocks));
        cloneFoodBlocks[index][event.target.id] = event.target.value;
        setFoodBlocks(cloneFoodBlocks);
    }

    const handleSubmit = ({ event, index }) => {
        event.preventDefault();

        setFoodBlockIntoLocalStorage({ date, foodBlock: foodBlocks });
        addPreviousFoodBlockToLocalStorage({ foodBlock: foodBlocks[index], setPreviousFoodBlocks });
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
        addFoodBlockToLocalStorage(date);
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

    return (
        <div className="container">
            <Nav />
            <div className="flex justify-content-between mx-15 pt-3">
                <div>
                    food blocks
                    <button
                        onClick={ toggleModal }
                        className="add-food-block-button">+</button>
                </div>
                { totalCalories } calories
            </div>

            { foodBlocks.map((foodBlock, index) => {
                return (
                    <div key={ index }>
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
                                    id={`${ index }-name`} />

                                <label htmlFor={`${ index }-calories`}>
                                    calories
                                </label>
                                <input
                                    onChange={ (event) => handleChange({ event, index }) }
                                    value={ foodBlocks[index].calories }
                                    type="number"
                                    id={`${ index }-calories`} />

                                <label htmlFor={`${ index }-increment`}>
                                    increment
                                </label>
                                <input
                                    onChange={ (event) => handleChange({ event, index }) }
                                    value={ foodBlocks[index].increment }
                                    type="number"
                                    id={`${ index }-increment`} />

                                <label htmlFor={`${ index }-unit`}>
                                    unit
                                </label>
                                <input
                                    onChange={ (event) => handleChange({ event, index }) }
                                    value={ foodBlocks[index].unit }
                                    type="text"
                                    id={`${ index }-unit`} />

                                <label htmlFor={`${ index }-limit`}>
                                    limit
                                </label>
                                <input
                                    onChange={ (event) => handleChange({ event, index }) }
                                    value={ foodBlocks[index].limit }
                                    type="number"
                                    id={`${ index }-limit`} />
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
                <div className="flex flex-direction-column">
                    <button
                        onClick={ toggleModal }
                        className="align-self-end text-decoration-underline">
                        done
                    </button>

                    <button
                        onClick={ () => addFoodBlock(date) }
                        className="align-self-start text-decoration-underline mb-1">
                        add a new food block
                    </button>

                    <div className="text-medium">previous food blocks</div>

                    { previousFoodBlocks.map((foodBlock, index) => {
                        return (
                            <div key={index}>
                                <div
                                    className="ribbon mx-0"
                                    style={{ backgroundColor: foodBlock.ribbonColor }}></div>
                                <form
                                    onSubmit={ handleSubmit }
                                    className="flex justify-content-between">
                                    <div className="flex flex-direction-column align-items-start form-groups-container">
                                        <label htmlFor="name">
                                            food
                                        </label>
                                        <input
                                            disabled={ true }
                                            value={ foodBlock.name }
                                            type="text"
                                            id="name" />

                                        <label htmlFor="calories">
                                            calories
                                        </label>
                                        <input
                                            disabled={ true }
                                            value={ foodBlock.calories }
                                            type="number"
                                            id="calories" />

                                        <label htmlFor="increment">
                                            increment
                                        </label>
                                        <input
                                            disabled={ true }
                                            value={ foodBlock.increment }
                                            type="number"
                                            id="increment" />

                                        <label htmlFor="unit">
                                            unit
                                        </label>
                                        <input
                                            disabled={ true }
                                            value={ foodBlock.unit }
                                            type="text"
                                            id="unit" />

                                        <label htmlFor="limit">
                                            limit
                                        </label>
                                        <input
                                            disabled={ true }
                                            value={ foodBlock.limit }
                                            type="number"
                                            id="limit" />
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
            </Modal>
        </div>
    );
}