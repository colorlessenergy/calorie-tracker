import Link from 'next/link';

import { useDayContext } from '../../contexts/DayContext';

const CalorieGoal = () => {
    const { calorieGoal } = useDayContext();

    if (calorieGoal === 0) {
        return (
            <Link href="/settings/calorie-goal" className="mr-1">
                create calorie goal
            </Link>
        );
    }

    return <div className="mr-1">{calorieGoal} calorie goal</div>;
};

export default CalorieGoal;
