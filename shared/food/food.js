function getFoodBlock (date) {
    let foodBlocks = JSON.parse(localStorage.getItem('foodBlocks'));
    if (foodBlocks[date]) {
        return foodBlocks[date];
    } else {
        foodBlocks[date] = [];
    }
    localStorage.setItem('foodBlocks', JSON.stringify(foodBlocks));
    return foodBlocks[date];
}

export function getFoodFromLocalStorage (date) {
    if (!date) return [];

    if (localStorage.getItem('foodBlocks')) {
        return getFoodBlock(date);
    }

    localStorage.setItem('foodBlocks', [
        JSON.stringify({
            [ date ]:  []
        })
    ]);

    return getFoodBlock(date);
}

export function updateFoodBlockInLocalStorage ({ date, index, foodBlock }) {
    if (!date) return;

    let foodBlocksFromLocalStorage = JSON.parse(localStorage.getItem('foodBlocks'));
    foodBlocksFromLocalStorage[date][index] = foodBlock;
    foodBlocksFromLocalStorage = JSON.stringify(foodBlocksFromLocalStorage);
    localStorage.setItem('foodBlocks', foodBlocksFromLocalStorage);
}

export function removeFoodBlockFromLocalStorage ({ date, index }) {
    if (!date) return;

    let foodBlocksFromLocalStorage = JSON.parse(localStorage.getItem('foodBlocks'));
    foodBlocksFromLocalStorage[date].splice(index, 1);
    foodBlocksFromLocalStorage = JSON.stringify(foodBlocksFromLocalStorage);
    localStorage.setItem('foodBlocks', foodBlocksFromLocalStorage);
}

const colors = ["#ffe58f", "#eaff8f", "#b7eb8f", "#87e8de", "#ffd6e7"];

export function addEmptyFoodBlockToLocalStorage (date) {
    if (!date) return;

    let foodBlocksFromLocalStorage = JSON.parse(localStorage.getItem('foodBlocks'));
    foodBlocksFromLocalStorage[date].push({
        name: '',
        calories: 1,
        increment: 1,
        unit: '',
        amount: 0,
        limit: 1,
        color: colors[Math.floor(Math.random() * colors.length)]
    });

    foodBlocksFromLocalStorage = JSON.stringify(foodBlocksFromLocalStorage);
    localStorage.setItem('foodBlocks', foodBlocksFromLocalStorage);
}

export function addPreviousFoodBlockToFoodBlocksInLocalStorage ({ date, index }) {
    if (!date) return;

    let foodBlocksFromLocalStorage = JSON.parse(localStorage.getItem('foodBlocks'));
    const previousFoodBlocksFromLocalStorage = JSON.parse(localStorage.getItem('previousFoodBlocks'));
    foodBlocksFromLocalStorage[date].push(previousFoodBlocksFromLocalStorage[index]);
    foodBlocksFromLocalStorage = JSON.stringify(foodBlocksFromLocalStorage);
    localStorage.setItem('foodBlocks', foodBlocksFromLocalStorage);
}

/**
 * 
 * add a single food blocks to previous food blocks in localStorage
 * 
 * @param { Object } foodBlock - a food block
 * @param { Function } setPreviousFoodBlocks - set previous food blocks for react UI
 */

export function addPreviousFoodBlockToLocalStorage ({ foodBlock, setPreviousFoodBlocks }) {
    if (!localStorage.getItem('previousFoodBlocks')) {
        localStorage.setItem('previousFoodBlocks', JSON.stringify([]));
    }

    let previousFoodBlocksFromLocalStorage = JSON.parse(localStorage.getItem('previousFoodBlocks'));

    let isFoodBlockNew = true;
    for (let i = 0; i < previousFoodBlocksFromLocalStorage.length; i++) {
        let previousFoodBlock = previousFoodBlocksFromLocalStorage[i];
        if (areFoodBlocksEqual(previousFoodBlock, foodBlock)) {
            isFoodBlockNew = false;
            break;
        }
    }

    if (isFoodBlockNew) {
        foodBlock.amount = 0;
        previousFoodBlocksFromLocalStorage.push(foodBlock);
        if (setPreviousFoodBlocks) setPreviousFoodBlocks(previousFoodBlocksFromLocalStorage);
    }

    localStorage.setItem('previousFoodBlocks', JSON.stringify(previousFoodBlocksFromLocalStorage));
}

const areFoodBlocksEqual = (foodBlockOne, foodBlockTwo) => {
    if (foodBlockOne.name === foodBlockTwo.name &&
        foodBlockOne.calories === foodBlockTwo.calories &&
        foodBlockOne.increment === foodBlockTwo.increment &&
        foodBlockOne.unit === foodBlockTwo.unit &&
        foodBlockOne.amount === foodBlockTwo.amount &&
        foodBlockOne.limit === foodBlockTwo.limit) {
            return true;
    }

    return false;
}

export function removePreviousFoodBlockFromLocalStorage (index) {
    let previousFoodBlocksFromLocalStorage = JSON.parse(localStorage.getItem('previousFoodBlocks'));
    previousFoodBlocksFromLocalStorage.splice(index, 1);
    previousFoodBlocksFromLocalStorage = JSON.stringify(previousFoodBlocksFromLocalStorage);
    localStorage.setItem('previousFoodBlocks', previousFoodBlocksFromLocalStorage);
}

export function importFoodBlocks (foodBlocks) {
    if (Object.keys(foodBlocks).length === 0) return;

    if (!localStorage.getItem('foodBlocks')) {
        localStorage.setItem('foodBlocks', JSON.stringify({}));
    }

    let foodBlocksFromLocalStorage = JSON.parse(localStorage.getItem('foodBlocks'));
    for (const date in foodBlocks) {
        if (!foodBlocksFromLocalStorage[date] || foodBlocksFromLocalStorage[date].length === 0) {
            foodBlocksFromLocalStorage[date] = foodBlocks[date];
            localStorage.setItem('foodBlocks', JSON.stringify(foodBlocksFromLocalStorage));
        } else {
            foodBlocks[date].forEach(foodBlock => {
                let doesFoodBlockExist = false;
                for (let i = 0; i < foodBlocksFromLocalStorage[date].length; i++) {
                    if (areFoodBlocksEqual(foodBlocksFromLocalStorage[date][i], foodBlock)) {
                        doesFoodBlockExist = true;
                        break;
                    }
                }

                if (doesFoodBlockExist === false) {
                    foodBlocksFromLocalStorage[date].push(foodBlock);
                }
            });

            localStorage.setItem('foodBlocks', JSON.stringify(foodBlocksFromLocalStorage));
        }
    }
}