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
        <div className="container mx-15">
            <p>
                hello
            </p>
        </div>
    );
}