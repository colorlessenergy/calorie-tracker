import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Introduction () { 
    const router = useRouter();
    useEffect(() => {
        if (localStorage.getItem('calorieGoal')) {
            return router.push('/');
        }

        localStorage.setItem('calorieGoal', '1');
    }, []);

    return (
        <div className="container">
            <div className="mx-15">
                <h1>welcome to calorie tracker</h1>
                <p className="text-medium">
                    input a calorie goal below to get started. The calorie goal can be updated in the settings.
                </p>

                <form className="w-50-md">
                    <div>
                        <label htmlFor="calorieGoal">calorie goal</label>
                        <input
                            type="number"
                            id="calorieGoal"
                            name="calorieGoal"
                            min="1"
                            defaultValue="1"
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