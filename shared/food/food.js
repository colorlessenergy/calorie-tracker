export function getFoodFromLocalStorage(date) {
    if (!date) return [];

    let foodBlocks = JSON.parse(localStorage.getItem('foodBlocks'));
    if (localStorage.getItem('foodBlocks')) {
        if (foodBlocks[date]) {
            return foodBlocks[date];
        }

        foodBlocks[date] = [];
        localStorage.setItem('foodBlocks', JSON.stringify(foodBlocks));
    } else if (!localStorage.getItem('foodBlocks')) {
        localStorage.setItem('foodBlocks', [
            JSON.stringify({
                [date]: []
            })
        ]);
    }

    return [];
}

export function updateFoodBlockInLocalStorage({
    date,
    foodBlock,
    updatedWithButton = false
}) {
    if (!date) return;

    let foodBlocksFromLocalStorage = JSON.parse(
        localStorage.getItem('foodBlocks')
    );
    const index = foodBlocksFromLocalStorage[date].findIndex(
        foodBlockFromLocalStorage =>
            foodBlockFromLocalStorage.ID === foodBlock.ID
    );

    if (
        foodBlocksFromLocalStorage[date][index].amount !== 0 &&
        updatedWithButton === false
    ) {
        foodBlock.amount = parseFloat(foodBlock.totalAmount);
    }

    foodBlocksFromLocalStorage[date][index] = foodBlock;
    foodBlocksFromLocalStorage = JSON.stringify(foodBlocksFromLocalStorage);
    localStorage.setItem('foodBlocks', foodBlocksFromLocalStorage);
}

export function removeFoodBlockFromLocalStorage({ date, foodBlockID }) {
    if (!date) return;

    let foodBlocksFromLocalStorage = JSON.parse(
        localStorage.getItem('foodBlocks')
    );
    const index = foodBlocksFromLocalStorage[date].findIndex(
        foodBlockFromLocalStorage =>
            foodBlockFromLocalStorage.ID === foodBlockID
    );
    foodBlocksFromLocalStorage[date].splice(index, 1);
    foodBlocksFromLocalStorage = JSON.stringify(foodBlocksFromLocalStorage);
    localStorage.setItem('foodBlocks', foodBlocksFromLocalStorage);
}

export function addFoodBlockToLocalStorage({ date, foodBlock }) {
    if (!date) return;

    if (!localStorage.getItem('ID')) {
        localStorage.setItem('ID', JSON.stringify(0));
    }

    let ID = JSON.parse(localStorage.getItem('ID'));
    ID += 1;
    foodBlock.ID = ID;
    let foodBlocksFromLocalStorage = JSON.parse(
        localStorage.getItem('foodBlocks')
    );
    foodBlocksFromLocalStorage[date].push(foodBlock);

    foodBlocksFromLocalStorage = JSON.stringify(foodBlocksFromLocalStorage);
    localStorage.setItem('foodBlocks', foodBlocksFromLocalStorage);
    localStorage.setItem('ID', JSON.stringify(ID));
}

const areFoodBlocksEqual = (foodBlockOne, foodBlockTwo) => {
    if (
        foodBlockOne.name === foodBlockTwo.name &&
        foodBlockOne.calories === foodBlockTwo.calories &&
        foodBlockOne.totalAmount === foodBlockTwo.totalAmount &&
        foodBlockOne.unit === foodBlockTwo.unit
    ) {
        return true;
    }

    return false;
};

export function importFoodDictionary(foodDictionary) {
    if (!foodDictionary) return;

    if (foodDictionary.length === 0) return;

    if (!localStorage.getItem('foodDictionary')) {
        localStorage.setItem('foodDictionary', JSON.stringify([]));
    }

    if (!localStorage.getItem('foodDictionaryID')) {
        localStorage.setItem('foodDictionaryID', JSON.stringify(0));
    }

    let ID = JSON.parse(localStorage.getItem('foodDictionaryID'));

    let foodDictionaryFromLocalStorage = JSON.parse(
        localStorage.getItem('foodDictionary')
    );
    for (let i = 0; i < foodDictionary.length; i++) {
        ID += 1;
        foodDictionary[i].ID = ID;
    }

    foodDictionaryFromLocalStorage = [
        ...foodDictionaryFromLocalStorage,
        ...foodDictionary
    ];

    localStorage.setItem(
        'foodDictionary',
        JSON.stringify(foodDictionaryFromLocalStorage)
    );
    localStorage.setItem('foodDictionaryID', JSON.stringify(ID));
}

export function importFoodBlocks(foodBlocks) {
    if (!foodBlocks) return;

    if (Object.keys(foodBlocks).length === 0) return;

    if (!localStorage.getItem('foodBlocks')) {
        localStorage.setItem('foodBlocks', JSON.stringify({}));
    }

    if (!localStorage.getItem('ID')) {
        localStorage.setItem('ID', JSON.stringify(0));
    }

    let ID = JSON.parse(localStorage.getItem('ID'));

    let foodBlocksFromLocalStorage = JSON.parse(
        localStorage.getItem('foodBlocks')
    );
    for (const date in foodBlocks) {
        if (
            !foodBlocksFromLocalStorage[date] ||
            foodBlocksFromLocalStorage[date].length === 0
        ) {
            foodBlocks[date].forEach(foodBlock => {
                ID += 1;
                foodBlock.ID = ID;
            });
            foodBlocksFromLocalStorage[date] = foodBlocks[date];
        } else {
            foodBlocks[date].forEach(foodBlock => {
                let doesFoodBlockExist = false;
                for (
                    let i = 0;
                    i < foodBlocksFromLocalStorage[date].length;
                    i++
                ) {
                    if (
                        areFoodBlocksEqual(
                            foodBlocksFromLocalStorage[date][i],
                            foodBlock
                        )
                    ) {
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

    localStorage.setItem(
        'foodBlocks',
        JSON.stringify(foodBlocksFromLocalStorage)
    );
    localStorage.setItem('ID', JSON.stringify(ID));
}

export function duplicateAndMergeFoodBlocksFromPreviousDate({
    previousDate,
    currentDate
}) {
    let foodBlocksFromLocalStorage = JSON.parse(
        localStorage.getItem('foodBlocks')
    );

    const foodBlocksFromPreviousDate = foodBlocksFromLocalStorage[previousDate];
    if (!foodBlocksFromPreviousDate) return;
    let currentDayFoodBlocks = foodBlocksFromLocalStorage[currentDate];
    if (!currentDayFoodBlocks) currentDayFoodBlocks = [];

    let ID = JSON.parse(localStorage.getItem('ID'));
    foodBlocksFromPreviousDate.forEach(foodBlockFromPreviousDate => {
        let cloneFoodBlockFromPreviousDate = JSON.parse(
            JSON.stringify(foodBlockFromPreviousDate)
        );
        ID += 1;
        cloneFoodBlockFromPreviousDate.ID = ID;
        currentDayFoodBlocks.push(cloneFoodBlockFromPreviousDate);
    });

    localStorage.setItem(
        'foodBlocks',
        JSON.stringify(foodBlocksFromLocalStorage)
    );
    localStorage.setItem('ID', JSON.stringify(ID));
}

const initFoodDictionary = () => {
    if (!localStorage.getItem('foodDictionary')) {
        localStorage.setItem('foodDictionary', JSON.stringify([]));
    }

    if (!localStorage.getItem('foodDictionaryID')) {
        localStorage.setItem('foodDictionaryID', JSON.stringify(0));
    }
};

export function getFoodDictionaryFromLocalStorage() {
    initFoodDictionary();

    return JSON.parse(localStorage.getItem('foodDictionary'));
}

export function addFoodBlockToFoodDictionary(foodBlock) {
    initFoodDictionary();

    let foodDictionary = JSON.parse(localStorage.getItem('foodDictionary'));

    if (foodBlock.ID) {
        const index = foodDictionary.findIndex(
            foodBlockFromLocalStorage =>
                foodBlockFromLocalStorage.ID === foodBlock.ID
        );
        foodDictionary[index] = foodBlock;
    } else {
        let foodDictionaryID = JSON.parse(
            localStorage.getItem('foodDictionaryID')
        );
        foodDictionaryID += 1;
        foodBlock = {
            ...foodBlock,
            ID: foodDictionaryID
        };
        foodDictionary.push(foodBlock);
        localStorage.setItem(
            'foodDictionaryID',
            JSON.stringify(foodDictionaryID)
        );
    }

    localStorage.setItem('foodDictionary', JSON.stringify(foodDictionary));

    return foodBlock;
}

export function removeFoodBlockFromFoodDictionary(foodBlockID) {
    let foodDictionary = JSON.parse(localStorage.getItem('foodDictionary'));

    const index = foodDictionary.findIndex(
        foodBlockFromLocalStorage =>
            foodBlockFromLocalStorage.ID === foodBlockID
    );
    foodDictionary.splice(index, 1);

    localStorage.setItem('foodDictionary', JSON.stringify(foodDictionary));
}
