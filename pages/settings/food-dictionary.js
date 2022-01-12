
import { useState  } from 'react';
import Head from 'next/head';

import SettingsNav from '../../shared/components/SettingsNav';
import Modal from '../../shared/components/modal';

import { addFoodBlockToFoodDictionary } from '../../shared/food/food';

export default function foodDictionary () {
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

        toggleEditFoodBlockModal(foodBlock);
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
                        className="button button-green">add food</button>
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