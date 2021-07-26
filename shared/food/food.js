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

export function setFoodBlockIntoLocalStorage ({ date, foodBlock }) {
    if (!date) return;

    let foodBlocksFromLocalStorage = JSON.parse(localStorage.getItem('foodBlocks'));
    foodBlocksFromLocalStorage[date] = foodBlock;
    foodBlocksFromLocalStorage = JSON.stringify(foodBlocksFromLocalStorage);
    localStorage.setItem('foodBlocks', foodBlocksFromLocalStorage);
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

const colors = ["#ffe58f", "#eaff8f", "#b7eb8f", "#87e8de", "#ffadd2"];

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
        ribbonColor: colors[Math.floor(Math.random() * colors.length)]
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

export function addPreviousFoodBlockToLocalStorage ({ foodBlock, setPreviousFoodBlocks }) {
    if (!localStorage.getItem('previousFoodBlocks')) {
        localStorage.setItem('previousFoodBlocks', JSON.stringify([]));
    }

    let previousFoodBlocksFromLocalStorage = JSON.parse(localStorage.getItem('previousFoodBlocks'));

    let isFoodBlockNew = true;
    for (let i = 0; i < previousFoodBlocksFromLocalStorage.length; i++) {
        let previousFoodBlock = previousFoodBlocksFromLocalStorage[i];

        if (previousFoodBlock.name === foodBlock.name &&
            previousFoodBlock.calories === foodBlock.calories &&
            previousFoodBlock.increment === foodBlock.increment &&
            previousFoodBlock.unit === foodBlock.unit &&
            previousFoodBlock.amount === foodBlock.amount &&
            previousFoodBlock.limit === foodBlock.limit) {
                isFoodBlockNew = false;
            }
    }

    if (isFoodBlockNew) {
        previousFoodBlocksFromLocalStorage.push(foodBlock);
        setPreviousFoodBlocks(previousFoodBlocksFromLocalStorage);
    }

    localStorage.setItem('previousFoodBlocks', JSON.stringify(previousFoodBlocksFromLocalStorage));
}

export function removePreviousFoodBlockFromLocalStorage (index) {
    let previousFoodBlocksFromLocalStorage = JSON.parse(localStorage.getItem('previousFoodBlocks'));
    previousFoodBlocksFromLocalStorage.splice(index, 1);
    previousFoodBlocksFromLocalStorage = JSON.stringify(previousFoodBlocksFromLocalStorage);
    localStorage.setItem('previousFoodBlocks', previousFoodBlocksFromLocalStorage);
}