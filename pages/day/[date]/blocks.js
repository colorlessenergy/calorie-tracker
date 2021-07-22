import Nav from '../../../shared/components/nav';

export default function Blocks () {
    return (
        <div className="container">
            <Nav />
            <div className="flex justify-content-between mx-15 pt-3">
                <div>
                    food blocks
                    <button className="add-food-block-button">+</button>
                </div>
                405 calories
            </div>

            <div className="ribbon"></div>
            <form className="flex justify-content-between mx-15">
               <div className="flex flex-direction-column align-items-start form-groups-container">
                    <label htmlFor="food">
                        food
                    </label>
                    <input
                        type="text"
                        id="food" />

                    <label htmlFor="calories">
                        calories
                    </label>
                    <input
                        type="number"
                        id="calorie" />

                    <label htmlFor="increment">
                        increment
                    </label>
                    <input
                        type="number"
                        id="increment" />

                    <label htmlFor="unit">
                        unit
                    </label>
                    <input
                        type="text"
                        id="unit" />

                    <label htmlFor="limit">
                        limit
                    </label>
                    <input
                        type="text"
                        id="limit" />
                </div> 

                <div className="flex flex-direction-column">
                    <button
                        type="button"
                        className="button button-red mb-2">
                        remove
                    </button>
                    <button className="button button-green">
                        update
                    </button>
                </div>
            </form>
        </div>
    );
}