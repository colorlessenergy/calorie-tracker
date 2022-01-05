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

export function updateFoodBlockInLocalStorage ({ date, foodBlock, updatedWithButton = false }) {
    if (!date) return;

    let foodBlocksFromLocalStorage = JSON.parse(localStorage.getItem('foodBlocks'));
    const index = foodBlocksFromLocalStorage[date].findIndex(foodBlockFromLocalStorage => foodBlockFromLocalStorage.ID === foodBlock.ID);

    if (foodBlocksFromLocalStorage[date][index].amount !== 0 && updatedWithButton === false) {
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

const areFoodBlocksEqual = (foodBlockOne, foodBlockTwo) => {
    if (foodBlockOne.name === foodBlockTwo.name &&
        foodBlockOne.calories === foodBlockTwo.calories &&
        foodBlockOne.totalAmount === foodBlockTwo.totalAmount &&
        foodBlockOne.unit === foodBlockTwo.unit) {
            return true;
    }

    return false;
}

export function importFoodBlocks (foodBlocks) {
    if (!foodBlocks) return;

    if (Object.keys(foodBlocks).length === 0) return;

    if (!localStorage.getItem('foodBlocks')) {
        localStorage.setItem('foodBlocks', JSON.stringify({}));
    }
    
    if (!localStorage.getItem('ID')) {
        localStorage.setItem('ID', JSON.stringify(0));
    }

    let ID = JSON.parse(localStorage.getItem('ID'));

    let foodBlocksFromLocalStorage = JSON.parse(localStorage.getItem('foodBlocks'));
    for (const date in foodBlocks) {
        if (!foodBlocksFromLocalStorage[date] || foodBlocksFromLocalStorage[date].length === 0) {
            foodBlocks[date].forEach(foodBlock => {
                ID += 1;
                foodBlock.ID = ID;
            });
            foodBlocksFromLocalStorage[date] = foodBlocks[date];
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
                    foodBlocksFromLocalStorage[date].push(foodBlock);
                }
            });
        }
    }

    localStorage.setItem('foodBlocks', JSON.stringify(foodBlocksFromLocalStorage));
    localStorage.setItem('ID', JSON.stringify(ID));
}

export function duplicateAndMergeFoodBlocksFromPreviousDate ({ previousDate, currentDate }) {
    let foodBlocksFromLocalStorage = JSON.parse(localStorage.getItem('foodBlocks'));

    const foodBlocksFromPreviousDate = foodBlocksFromLocalStorage[ previousDate ];
    if (!foodBlocksFromPreviousDate) return;
    let currentDayFoodBlocks = foodBlocksFromLocalStorage[ currentDate ];
    if (!currentDayFoodBlocks) currentDayFoodBlocks = [];

    let ID = JSON.parse(localStorage.getItem('ID'));
    foodBlocksFromPreviousDate.forEach(foodBlockFromPreviousDate => {
        let cloneFoodBlockFromPreviousDate = JSON.parse(JSON.stringify(foodBlockFromPreviousDate));
        ID += 1;
        cloneFoodBlockFromPreviousDate.ID = ID;
        currentDayFoodBlocks.push(cloneFoodBlockFromPreviousDate);
    });

    localStorage.setItem('foodBlocks', JSON.stringify(foodBlocksFromLocalStorage));
    localStorage.setItem('ID', JSON.stringify(ID));
}