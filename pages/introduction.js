import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Introduction () { 
    const router = useRouter();
    useEffect(() => {
        if (localStorage.getItem('calorieGoal')) {
            return router.push('/');
        }

        localStorage.setItem('calorieGoal', '1');
    }, []);

    const [ calorieGoal, setCalorieGoal ] = useState(1);
    const handleInputChange = (event) => {
        if (!event.currentTarget.valueAsNumber) return setCalorieGoal('');

        setCalorieGoal(event.currentTarget.valueAsNumber);
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        localStorage.setItem('calorieGoal', calorieGoal);

        router.push('/');
    }

    return (
        <div className="container">
            <div className="mx-15">
                <h1>welcome to calorie tracker</h1>
                <p className="text-medium">
                    input a calorie goal below to get started. The calorie goal can be updated in the settings.
                </p>

                <form
                    onSubmit={ handleSubmit }
                    className="w-50-md">
                    <div>
                        <label htmlFor="calorieGoal">calorie goal</label>
                        <input
                            type="number"
                            id="calorieGoal"
                            name="calorieGoal"
                            onChange={ handleInputChange }
                            value={ calorieGoal }
                            required
                            placeholder="calorie goal" />
                    </div>

                    <button
                        className="button button-green">add</button>
                </form>
            </div>
        </div>
    );
}