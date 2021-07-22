import { useEffect, useState } from "react";
import { useRouter } from 'next/router';

import Nav from "../../shared/components/nav";

import { getFoodFromLocalStorage } from '../../shared/food/food';

export default function Date () {
    const router = useRouter();
    const date = router.query.date;
    const [ foodBlocks, setFoodBlocks ] = useState([]);

    useEffect(() => {
        if (date) {
            setFoodBlocks((getFoodFromLocalStorage(date)).blocks);
        }
    }, [ date ]);

    return (
        <>
            <Nav />

            <p className="mx-15">
                45 calories
            </p>

            { foodBlocks.map((foodBlock, index) => {
                return (
                    <div
                        key={ index } 
                        className="card card-light-orange">
                        <div>
                            <div>
                                { foodBlock.name }
                            </div>
                            <div className="text-bold">
                                { foodBlock.calories } calories
                            </div>
                        </div> 

                        <div>
                            <button>
                                -
                            </button>
                            <span className="mx-1">
                                { foodBlock.amount } / { foodBlock.limit } { foodBlock.unit }
                            </span>
                            <button>
                                +
                            </button>
                        </div>
                    </div>
                )
            }) }

        </> 
    );
}