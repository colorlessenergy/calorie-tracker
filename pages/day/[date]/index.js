import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import watermelonIcon from '../../../public/icons/watermelon.svg';

import Confetti from 'react-confetti';
import Modal from '../../../shared/components/modal';
import DuplicateAndMergeFoodBlocksFromPreviousDate from '../../../shared/components/DuplicateAndMergePreviousFoodBlocks';

import {
    getFoodFromLocalStorage,
    removeFoodBlockFromLocalStorage,
    updateFoodBlockInLocalStorage,
    getFoodDictionaryFromLocalStorage,
    addFoodBlockToLocalStorage
} from '../../../shared/food/food';

const colors = ['#ffe58f', '#eaff8f', '#b7eb8f', '#87e8de', '#ffd6e7'];

export default function Date() {
    const router = useRouter();
    const date = router.query.date;
    const [foodBlocks, setFoodBlocks] = useState(null);

    useEffect(() => {
        if (date) {
            setFoodBlocks(getFoodFromLocalStorage(date));
        }
    }, [date]);

    const [foodDictionary, setFoodDictionary] = useState([]);
    useEffect(() => {
        setFoodDictionary(getFoodDictionaryFromLocalStorage());
    }, []);

    const [totalCalories, setTotalCalories] = useState(0);
    const [confetti, setConfetti] = useState(null);
    useEffect(() => {
        let calories = 0;
        foodBlocks?.forEach(foodBlock => {
            if (
                foodBlock.amount >= foodBlock.totalAmount &&
                parseFloat(foodBlock.calories)
            ) {
                calories += parseFloat(foodBlock.calories);
            }
        });

        if (calories === calorieGoal && calorieGoal !== 0) {
            const width =
                window.innerWidth ||
                document.documentElement.clientWidth ||
                document.body.clientWidth;
            const height =
                window.innerHeight ||
                document.documentElement.clientHeight ||
                document.body.clientHeight;
            setConfetti({
                width: width,
                height: height
            });
        }

        setTotalCalories(parseFloat(calories.toFixed(2)));
    }, [foodBlocks]);

    const [calorieGoal, setCalorieGoal] = useState(1);
    useEffect(() => {
        setCalorieGoal(parseFloat(localStorage.getItem('calorieGoal')) || 1);
    }, []);

    const updateAmountOfFood = ({ event, sign, index }) => {
        event.stopPropagation();

        let cloneFoodBlocks = JSON.parse(JSON.stringify(foodBlocks));
        if (cloneFoodBlocks[index].amount === 0 && Math.sign(sign) === 1) {
            cloneFoodBlocks[index].amount += parseFloat(
                cloneFoodBlocks[index].totalAmount
            );
            setFoodBlocks(cloneFoodBlocks);
            updateFoodBlockInLocalStorage({
                date,
                foodBlock: cloneFoodBlocks[index],
                updatedWithButton: true
            });
        } else if (
            cloneFoodBlocks[index].amount ===
                parseFloat(cloneFoodBlocks[index].totalAmount) &&
            Math.sign(sign) === -1
        ) {
            cloneFoodBlocks[index].amount -= cloneFoodBlocks[index].totalAmount;
            setFoodBlocks(cloneFoodBlocks);
            updateFoodBlockInLocalStorage({
                date,
                foodBlock: cloneFoodBlocks[index],
                updatedWithButton: true
            });
        }
    };

    const [isEditFoodBlockModalOpen, setIsEditFoodBlockModalOpen] =
        useState(false);
    const toggleEditFoodBlockModal = foodBlock => {
        setFoodBlock(foodBlock);
        setIsEditFoodBlockModalOpen(
            previousIsEditFoodBlockModalOpen =>
                !previousIsEditFoodBlockModalOpen
        );
    };

    const [foodBlock, setFoodBlock] = useState({
        ID: null,
        foodDictionaryID: null,
        name: '',
        calories: '',
        unit: '',
        amount: '',
        totalAmount: null,
        color: ''
    });

    const handleChange = event => {
        if (foodBlock.foodDictionaryID && event.target.id == 'totalAmount') {
            return setFoodBlock(previousFoodBlock => ({
                ...previousFoodBlock,
                totalAmount: event.target.value,
                calories: getCaloriesFromFoodDictionary({
                    foodDictionaryID: foodBlock.foodDictionaryID,
                    foodBlockTotalAmount: event.target.value
                })
            }));
        }

        setFoodBlock(previousFoodBlock => ({
            ...previousFoodBlock,
            [event.target.id]: event.target.value
        }));
    };

    const connectFoodDictionaryToFoodBlock = foodDictionaryID => {
        const findFoodInFoodDictionary = foodDictionary.find(
            food => food.ID === foodDictionaryID
        );
        setFoodBlock(previousFoodBlock => ({
            ...previousFoodBlock,
            foodDictionaryID,
            name: findFoodInFoodDictionary.name,
            calories: getCaloriesFromFoodDictionary({
                foodDictionaryID,
                foodBlockTotalAmount: foodBlock.totalAmount
            }),
            unit: findFoodInFoodDictionary.unit
        }));
    };

    const removeFoodDictionaryFromFoodBlock = () => {
        let cloneFoodBlock = JSON.parse(JSON.stringify(foodBlock));

        delete cloneFoodBlock.foodDictionaryID;

        setFoodBlock(cloneFoodBlock);
    };

    const getCaloriesFromFoodDictionary = ({
        foodDictionaryID,
        foodBlockTotalAmount
    }) => {
        const findFoodInFoodDictionary = foodDictionary.find(
            food => food.ID === foodDictionaryID
        );
        const amountOfCaloriesPerUnit =
            findFoodInFoodDictionary.calories / findFoodInFoodDictionary.amount;
        return Math.round(amountOfCaloriesPerUnit * foodBlockTotalAmount);
    };

    const updateColor = color => {
        setFoodBlock(previousFoodBlock => ({
            ...previousFoodBlock,
            color: color
        }));
    };

    const handleSubmit = event => {
        event.preventDefault();

        if (foodBlock.ID === null) {
            addFoodBlockToLocalStorage({ date, foodBlock });
        } else {
            updateFoodBlockInLocalStorage({ date, foodBlock });
        }

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
    };

    const addEmptyFoodBlock = () => {
        toggleEditFoodBlockModal({
            ID: null,
            name: '',
            calories: 1,
            unit: '',
            amount: 0,
            totalAmount: 0,
            color: colors[Math.floor(Math.random() * colors.length)]
        });
    };

    const removeFoodBlock = foodBlockID => {
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
    };

    const findFoodInFoodDictionary = foodBlock.foodDictionaryID
        ? foodDictionary.find(food => food.ID === foodBlock.foodDictionaryID)
        : null;
    const filterFoodDictionary = foodDictionary.filter(
        food =>
            food.ID !== foodBlock.foodDictionaryID &&
            food.name
                .toLowerCase()
                .includes(foodBlock.name.toLowerCase().trim())
    );

    const [allFoodBlocks, setAllFoodBlocks] = useState(null);
    useEffect(() => {
        setAllFoodBlocks(JSON.parse(localStorage.getItem('foodBlocks')));
    }, []);

    const [
        isDuplicatePreviousFoodBlocksModalOpen,
        setIsDuplicatePreviousFoodBlocksModalOpen
    ] = useState(false);
    const toggleDuplicatePreviousFoodBlocksModal = () => {
        setIsDuplicatePreviousFoodBlocksModalOpen(
            previousIsDuplicatePreviousFoodBlocksModalOpen =>
                !previousIsDuplicatePreviousFoodBlocksModalOpen
        );
    };

    return (
        <div className="container">
            <div className="mx-15 mt-1 mb-1 flex align-items-center flex-wrap">
                <div className="mr-1">{totalCalories} total calories</div>
                <div className="mr-1">{calorieGoal} calorie goal</div>

                <button
                    onClick={() => addEmptyFoodBlock()}
                    title="add food block"
                    className="icon mr-1"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width="24"
                        height="24"
                    >
                        <path fill="none" d="M0 0h24v24H0z" />
                        <path d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2z" />
                    </svg>
                </button>

                {allFoodBlocks && Object.keys(allFoodBlocks).length > 1 ? (
                    <button
                        onClick={toggleDuplicatePreviousFoodBlocksModal}
                        title="duplicate previous food blocks"
                        className="icon"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            width="24"
                            height="24"
                        >
                            <path fill="none" d="M0 0h24v24H0z" />
                            <path d="M7 6V3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-3v3c0 .552-.45 1-1.007 1H4.007A1.001 1.001 0 0 1 3 21l.003-14c0-.552.45-1 1.007-1H7zm2 0h8v10h2V4H9v2z" />
                        </svg>
                    </button>
                ) : null}
            </div>

            {foodBlocks?.length === 0 ? (
                <>
                    <div className="no-food-blocks-emoji">
                        <Image
                            height={140}
                            width={140}
                            src={watermelonIcon}
                            alt="watermelon icon"
                        />
                    </div>
                    <p className="text-center text-medium">no food blocks</p>
                    <button
                        className="dark-text text-large text-decoration-underline d-block m-center"
                        onClick={() => addEmptyFoodBlock()}
                    >
                        add a food block
                    </button>
                </>
            ) : null}

            <div className="flex flex-wrap">
                {foodBlocks?.map((foodBlock, index) => {
                    foodBlock.index = index;

                    return (
                        <div
                            key={index}
                            className="card cursor-pointer"
                            style={{ backgroundColor: foodBlock.color }}
                            onClick={() => toggleEditFoodBlockModal(foodBlock)}
                        >
                            <div className="flex justify-content-between w-100">
                                <div>{foodBlock.name}</div>
                                <div className="text-bold">
                                    {foodBlock.calories} calories
                                </div>
                            </div>

                            <div className="mx-1 text-large">
                                {foodBlock.amount} / {foodBlock.totalAmount}{' '}
                                <span className="text-medium">
                                    {foodBlock.unit}
                                </span>
                            </div>

                            <div className="flex justify-content-between w-100">
                                <button
                                    onClick={event => {
                                        updateAmountOfFood({
                                            event,
                                            sign: -1,
                                            index
                                        });
                                    }}
                                    className="card-button"
                                >
                                    -
                                </button>

                                <button
                                    onClick={event => {
                                        updateAmountOfFood({
                                            event,
                                            sign: 1,
                                            index
                                        });
                                    }}
                                    className="card-button"
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
            {confetti ? (
                <Confetti
                    width={confetti.width}
                    height={confetti.height}
                    recycle={false}
                    numberOfPieces={200}
                    onConfettiComplete={() => setConfetti(null)}
                />
            ) : null}

            {isEditFoodBlockModalOpen ? (
                <Modal
                    outsideElements={
                        <div className="flex">
                            <button
                                type="button"
                                onClick={() => {
                                    toggleEditFoodBlockModal({
                                        ID: null,
                                        name: '',
                                        calories: '',
                                        unit: '',
                                        amount: '',
                                        color: ''
                                    });
                                }}
                                className="button button-left button-red flex-grow-1"
                            >
                                cancel
                            </button>

                            {foodBlock.ID !== null ? (
                                <button
                                    type="button"
                                    onClick={() => {
                                        removeFoodBlock(foodBlock.ID);
                                    }}
                                    className="button button-middle button-purple flex-grow-1"
                                >
                                    remove
                                </button>
                            ) : null}

                            <label
                                htmlFor="form-submit"
                                className="button button-right button-green flex-grow-1 text-center cursor-pointer"
                            >
                                {foodBlock.ID === null ? 'add' : 'update'}
                            </label>
                        </div>
                    }
                    isOpen={isEditFoodBlockModalOpen}
                >
                    <form
                        onSubmit={handleSubmit}
                        className="flex flex-direction-column justify-content-between p-1"
                        style={{ borderTop: `20px solid ${foodBlock.color}` }}
                    >
                        <label htmlFor="name">food</label>
                        <input
                            onChange={event => handleChange(event)}
                            value={foodBlock.name}
                            type="text"
                            autoComplete="off"
                            id="name"
                            name="name"
                            required
                        />

                        <label htmlFor="calories">total calories</label>
                        <input
                            disabled={foodBlock.foodDictionaryID ? true : false}
                            onChange={event => handleChange(event)}
                            value={foodBlock.calories}
                            type="number"
                            id="calories"
                            name="calories"
                            required
                            min="1"
                            step="0.01"
                        />

                        <label htmlFor="totalAmount">total amount</label>
                        <input
                            onChange={event => handleChange(event)}
                            value={foodBlock.totalAmount}
                            type="number"
                            id="totalAmount"
                            name="total-amount"
                            required
                            min="1"
                            step="0.01"
                        />

                        <label htmlFor="unit">unit of measurement</label>
                        <input
                            disabled={foodBlock.foodDictionaryID ? true : false}
                            onChange={event => handleChange(event)}
                            value={foodBlock.unit}
                            type="text"
                            autoComplete="off"
                            id="unit"
                            name="unit"
                        />

                        <div className="text-gray text-small mb-04">
                            select a color
                        </div>
                        <div className="flex mb-1">
                            {colors.map(color => {
                                return (
                                    <div
                                        key={color}
                                        onClick={() => updateColor(color)}
                                        className="circle mr-1 cursor-pointer"
                                        style={{
                                            backgroundColor: color,
                                            border:
                                                color === foodBlock.color
                                                    ? '3px solid #000000'
                                                    : null
                                        }}
                                        title={`${color}`}
                                    ></div>
                                );
                            })}
                        </div>

                        {(foodBlock.name && filterFoodDictionary.length) ||
                        foodBlock.foodDictionaryID ? (
                            <div className="text-gray text-small mb-04">
                                connect food dictionary
                            </div>
                        ) : null}

                        <div className="flex flex-wrap overflow-y-100 offset-cards">
                            {findFoodInFoodDictionary ? (
                                <div
                                    onClick={removeFoodDictionaryFromFoodBlock}
                                    className="card text-medium cursor-pointer b-color-orange"
                                >
                                    <div className="text-bold">
                                        {findFoodInFoodDictionary.name}
                                    </div>
                                    <div className="flex justify-content-between w-100">
                                        <div>
                                            {findFoodInFoodDictionary.calories}{' '}
                                            calories
                                        </div>

                                        <div>
                                            {findFoodInFoodDictionary.amount}{' '}
                                            {findFoodInFoodDictionary.unit}
                                        </div>
                                    </div>
                                </div>
                            ) : null}

                            {foodBlock.name
                                ? filterFoodDictionary.map(food => {
                                      return (
                                          <div
                                              className={`card text-medium cursor-pointer ${
                                                  food.ID ==
                                                  foodBlock.foodDictionaryID
                                                      ? 'b-color-orange'
                                                      : ''
                                              }`}
                                              onClick={() =>
                                                  connectFoodDictionaryToFoodBlock(
                                                      food.ID
                                                  )
                                              }
                                              key={food.ID}
                                          >
                                              <div className="text-bold">
                                                  {food.name}
                                              </div>
                                              <div className="flex justify-content-between w-100">
                                                  <div>
                                                      {food.calories} calories
                                                  </div>

                                                  <div>
                                                      {food.amount} {food.unit}
                                                  </div>
                                              </div>
                                          </div>
                                      );
                                  })
                                : null}
                        </div>

                        <input
                            type="submit"
                            className="hidden"
                            id="form-submit"
                        />
                    </form>
                </Modal>
            ) : null}

            {isDuplicatePreviousFoodBlocksModalOpen ? (
                <Modal
                    topElements={
                        <button
                            onClick={toggleDuplicatePreviousFoodBlocksModal}
                            className="modal-button-close"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                width="24"
                                height="24"
                            >
                                <path fill="none" d="M0 0h24v24H0z" />
                                <path d="M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636z" />
                            </svg>
                        </button>
                    }
                    isOpen={isDuplicatePreviousFoodBlocksModalOpen}
                >
                    <div className="flex flex-direction-column">
                        <DuplicateAndMergeFoodBlocksFromPreviousDate
                            allFoodBlocks={allFoodBlocks}
                            toggleModal={toggleDuplicatePreviousFoodBlocksModal}
                            setFoodBlocks={setFoodBlocks}
                        />
                    </div>
                </Modal>
            ) : null}
        </div>
    );
}
