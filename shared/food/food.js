function getFoodBlock (date) {
    let foodBlocks = JSON.parse(localStorage.getItem('foodBlocks'));
    if (foodBlocks[date]) {
        return foodBlocks[date];
    } 

    foodBlocks[date] = [];
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

export function updateFoodBlockInLocalStorage ({ date, foodBlock }) {
    if (!date) return;

    let foodBlocksFromLocalStorage = JSON.parse(localStorage.getItem('foodBlocks'));
    const index = foodBlocksFromLocalStorage[date].findIndex(foodBlockFromLocalStorage => foodBlockFromLocalStorage.ID === foodBlock.ID);

    if (foodBlocksFromLocalStorage[date][index].amount !== 0) {
        foodBlock.amount = parseFloat(foodBlock.totalAmount);
    }

    foodBlocksFromLocalStorage[date][index] = foodBlock;
    foodBlocksFromLocalStorage = JSON.stringify(foodBlocksFromLocalStorage);
    localStorage.setItem('foodBlocks', foodBlocksFromLocalStorage);
}

export function removeFoodBlockFromLocalStorage ({ date, foodBlockID }) {
    if (!date) return;

    let foodBlocksFromLocalStorage = JSON.parse(localStorage.getItem('foodBlocks'));
    const index = foodBlocksFromLocalStorage[date].findIndex(foodBlockFromLocalStorage => foodBlockFromLocalStorage.ID === foodBlockID);
    foodBlocksFromLocalStorage[date].splice(index, 1);
    foodBlocksFromLocalStorage = JSON.stringify(foodBlocksFromLocalStorage);
    localStorage.setItem('foodBlocks', foodBlocksFromLocalStorage);
}

const colors = ["#ffe58f", "#eaff8f", "#b7eb8f", "#87e8de", "#ffd6e7"];

export function addEmptyFoodBlockToLocalStorage (date) {
    if (!date) return;

    if (!localStorage.getItem('ID')) {
        localStorage.setItem('ID', JSON.stringify(0));
    }

    let ID = JSON.parse(localStorage.getItem('ID'));
    ID += 1;
    let foodBlocksFromLocalStorage = JSON.parse(localStorage.getItem('foodBlocks'));
    foodBlocksFromLocalStorage[date].push({
        ID,
        name: '',
        calories: 1,
        unit: '',
        amount: 0,
        totalAmount: 0,
        color: colors[Math.floor(Math.random() * colors.length)]
    });

    foodBlocksFromLocalStorage = JSON.stringify(foodBlocksFromLocalStorage);
    localStorage.setItem('foodBlocks', foodBlocksFromLocalStorage);
    localStorage.setItem('ID', JSON.stringify(ID));
}

export function addPreviousFoodBlockToFoodBlocksInLocalStorage ({ date, previousFoodBlockID }) {
    if (!date) return;

    let foodBlocksFromLocalStorage = JSON.parse(localStorage.getItem('foodBlocks'));
    const previousFoodBlocksFromLocalStorage = JSON.parse(localStorage.getItem('previousFoodBlocks'));
    const index = previousFoodBlocksFromLocalStorage.findIndex(previousFoodBlockFromLocalStorage => previousFoodBlockFromLocalStorage.ID === previousFoodBlockID);
    let ID = JSON.parse(localStorage.getItem('ID'));
    ID += 1;
    let clonePreviousFoodBlock = JSON.parse(JSON.stringify(previousFoodBlocksFromLocalStorage[index]));
    clonePreviousFoodBlock.ID = ID;
    foodBlocksFromLocalStorage[date].push(clonePreviousFoodBlock);
    foodBlocksFromLocalStorage = JSON.stringify(foodBlocksFromLocalStorage);
    localStorage.setItem('foodBlocks', foodBlocksFromLocalStorage);
    localStorage.setItem('ID', JSON.stringify(ID));
}

/**
 * 
 * add a single food blocks to previous food blocks in localStorage
 * 
 * @param { Object } foodBlock - a food block
 * @param { Function } setPreviousFoodBlocks - set previous food blocks for react UI
 * @param { Boolean } isImported - if food block is imported set previous ID property to null
 */

export function addPreviousFoodBlockToLocalStorage ({ foodBlock, setPreviousFoodBlocks, isImported }) {
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
        let ID = JSON.parse(localStorage.getItem('ID'));
        ID += 1;
        foodBlock.amount = 0;
        if (isImported) {
            foodBlock.previousID = null;
        } else {
            foodBlock.previousID = foodBlock.ID;
        }
        foodBlock.ID = ID;
        previousFoodBlocksFromLocalStorage.push(foodBlock);
        localStorage.setItem('ID', JSON.stringify(ID));
        if (setPreviousFoodBlocks) setPreviousFoodBlocks(previousFoodBlocksFromLocalStorage);
    }

    localStorage.setItem('previousFoodBlocks', JSON.stringify(previousFoodBlocksFromLocalStorage));
}

const areFoodBlocksEqual = (foodBlockOne, foodBlockTwo) => {
    if (foodBlockOne.name === foodBlockTwo.name &&
        foodBlockOne.calories === foodBlockTwo.calories &&
        foodBlockOne.totalAmount === foodBlockTwo.totalAmount &&
        foodBlockOne.unit === foodBlockTwo.unit) {
            return true;
    }

    return false;
}

export function removePreviousFoodBlockFromLocalStorage (previousFoodBlockID) {
    let previousFoodBlocksFromLocalStorage = JSON.parse(localStorage.getItem('previousFoodBlocks'));
    const index = previousFoodBlocksFromLocalStorage.findIndex(previousFoodBlockFromLocalStorage => previousFoodBlockFromLocalStorage.ID === previousFoodBlockID);
    previousFoodBlocksFromLocalStorage.splice(index, 1);
    previousFoodBlocksFromLocalStorage = JSON.stringify(previousFoodBlocksFromLocalStorage);
    localStorage.setItem('previousFoodBlocks', previousFoodBlocksFromLocalStorage);
}

export function importFoodBlocks (foodBlocks) {
    if (Object.keys(foodBlocks).length === 0) return;

    if (!localStorage.getItem('foodBlocks')) {
        localStorage.setItem('foodBlocks', JSON.stringify({}));
    }
    
    if (!localStorage.getItem('ID')) {
        localStorage.setItem('foodBlocks', JSON.stringify(0));
    }

    let ID = JSON.parse(localStorage.getItem('ID'));

    let foodBlocksFromLocalStorage = JSON.parse(localStorage.getItem('foodBlocks'));
    for (const date in foodBlocks) {
        if (!foodBlocksFromLocalStorage[date] || foodBlocksFromLocalStorage[date].length === 0) {
            foodBlocks[date].forEach(foodBlock => {
                ID += 1;
                foodBlock.ID = ID;
                foodBlock.previousID = null;
            });
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
                    ID += 1;
                    foodBlock.ID = ID;
                    foodBlock.previousID = null;
                    foodBlocksFromLocalStorage[date].push(foodBlock);
                }
            });

            localStorage.setItem('foodBlocks', JSON.stringify(foodBlocksFromLocalStorage));
            localStorage.setItem('ID', JSON.stringify(ID));
        }
    }
}