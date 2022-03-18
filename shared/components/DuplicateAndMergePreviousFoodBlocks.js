import { useState } from 'react';
import { useRouter } from 'next/router';

import { 
    getFoodFromLocalStorage,
    duplicateAndMergeFoodBlocksFromPreviousDate
} from '../food/food';

const DuplicateAndMergeFoodBlocksFromPreviousDate = ({ allFoodBlocks, toggleModal, setFoodBlocks }) => {
    const router = useRouter();
    const date = router.query.date;

    const [ previousFoodBlockDate, setPreviousFoodBlockDate ] = useState('');
    const handlePreviousFoodBlockDateChange = event => {
        if (event.currentTarget.value) return setPreviousFoodBlockDate(event.currentTarget.value);
    }
    const handleDuplicateAndMergePreviousDateSubmit = event => {
        event.preventDefault();
        if (!previousFoodBlockDate) return;

        duplicateAndMergeFoodBlocksFromPreviousDate({ previousDate: previousFoodBlockDate, currentDate: date });
        setFoodBlocks(getFoodFromLocalStorage(date));
        toggleModal();
    }

    if (!allFoodBlocks || Object.keys(allFoodBlocks).length <= 1) {
        return null;
    }

    return (
        <form onSubmit={ handleDuplicateAndMergePreviousDateSubmit }>
            <div className="flex flex-direction-column mb-2">
                <label
                    className="text-black text-medium mb-1"
                    htmlFor="foodBlocksDate">duplicate previous food blocks</label>
                <select
                    onChange={ handlePreviousFoodBlockDateChange }
                    className="text-medium w-50"
                    id="foodBlocksDate">
                    <option value="">choose a date</option>
                    { Object.keys(allFoodBlocks).sort((dateOne, dateTwo) => {
                        return new Date(dateOne) - new Date(dateTwo);
                    }).slice(-10).map(foodBlockDate => {
                        if (foodBlockDate === date) return;

                        return (
                            <option
                                key={ foodBlockDate }
                                value={ foodBlockDate }>{ foodBlockDate }</option>
                        );
                    }) }
                </select>
            </div>

            <button className="button button-pink">duplicate</button>
        </form>
    );
}

export default DuplicateAndMergeFoodBlocksFromPreviousDate;