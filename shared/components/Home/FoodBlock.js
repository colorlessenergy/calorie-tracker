import { updateFoodBlockInLocalStorage } from '../../food/food';

const FoodBlock = ({
    foodBlock,
    foodBlocks,
    setFoodBlocks,
    toggleEditFoodBlockModal,
    date
}) => {
    const updateAmountOfFood = ({ event, sign }) => {
        event.stopPropagation();

        const index = foodBlock.index;
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

    return (
        <div
            className="card cursor-pointer"
            style={{ backgroundColor: foodBlock.color }}
            onClick={() => toggleEditFoodBlockModal(foodBlock)}
        >
            <div className="flex justify-content-between w-100">
                <div>{foodBlock.name}</div>
                <div className="text-bold">{foodBlock.calories} calories</div>
            </div>

            <div className="mx-1 text-large">
                {foodBlock.amount} / {foodBlock.totalAmount}{' '}
                <span className="text-medium">{foodBlock.unit}</span>
            </div>

            <div className="flex justify-content-between w-100">
                <button
                    onClick={event => {
                        updateAmountOfFood({
                            event,
                            sign: -1
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
                            sign: 1
                        });
                    }}
                    className="card-button"
                >
                    +
                </button>
            </div>
        </div>
    );
};

export default FoodBlock;
