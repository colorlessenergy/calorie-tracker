import ReactConfetti from 'react-confetti';

import { useDayContext } from '../../contexts/DayContext';

const Confetti = ({ totalCalories }) => {
    const { calorieGoal } = useDayContext();

    if (totalCalories === calorieGoal && calorieGoal !== 0) {
        const width =
            window.innerWidth ||
            document.documentElement.clientWidth ||
            document.body.clientWidth;
        const height =
            window.innerHeight ||
            document.documentElement.clientHeight ||
            document.body.clientHeight;

        return (
            <ReactConfetti
                width={width}
                height={height}
                recycle={false}
                numberOfPieces={200}
            />
        );
    }

    return null;
};

export default Confetti;
