function getFoodBlock (date) {
    let foodBlocks = JSON.parse(localStorage.getItem('foodBlocks'));
    if (foodBlocks[date]) {
        return foodBlocks[date];
    } else {
        foodBlocks[date] = [
                {
                    name: 'beans',
                    calories: 100,
                    increment: 1,
                    unit: 'cans',
                    amount: 0,
                    limit: 3,
                    ribbonColor: '#ffccc7'
                }
            ];
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
            [ date ]:  [
                    {
                        name: 'beans',
                        calories: 100,
                        increment: 1,
                        unit: 'cans',
                        amount: 0,
                        limit: 3,
                        ribbonColor: '#ffd8bf'
                    }
                ]
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

export function removeFoodBlockFromLocalStorage ({ date, index }) {
    if (!date) return;

    let foodBlocksFromLocalStorage = JSON.parse(localStorage.getItem('foodBlocks'));
    foodBlocksFromLocalStorage[date].splice(index, 1);
    foodBlocksFromLocalStorage = JSON.stringify(foodBlocksFromLocalStorage);
    localStorage.setItem('foodBlocks', foodBlocksFromLocalStorage);
}

export function addFoodBlockToLocalStorage (date) {
    if (!date) return;

    let foodBlocksFromLocalStorage = JSON.parse(localStorage.getItem('foodBlocks'));
    foodBlocksFromLocalStorage[date].push({
        name: '',
        calories: 0,
        increment: 0,
        unit: '0',
        amount: 0,
        limit: 1,
        ribbonColor: '#ffd8bf'
    });

    foodBlocksFromLocalStorage = JSON.stringify(foodBlocksFromLocalStorage);
    localStorage.setItem('foodBlocks', foodBlocksFromLocalStorage);
}