function getFoodBlock (date) {
    const foodBlocks = JSON.parse(localStorage.getItem('foodBlocks'));
    if (foodBlocks[date]) {
        return foodBlocks[date];
    }
}

export function getFoodFromLocalStorage (date) {
    if (!date) return [];

    if (localStorage.getItem('foodBlocks')) {
        return getFoodBlock(date);
    }

    localStorage.setItem('foodBlocks', [
        JSON.stringify({
            [ date ]: {
                blocks: [
                    {
                        name: 'beans',
                        calories: 100,
                        increment: 1,
                        unit: 'cans',
                        amount: 0,
                        limit: 3,
                    }
                ]
            }
        })
    ]);

    return getFoodBlock(date);
}