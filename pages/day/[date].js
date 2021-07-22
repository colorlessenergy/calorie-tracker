import Nav from "../../shared/components/nav";

export default function Date () {
    return (
        <>
            <Nav />

            <p className="mx-15">
                45 calories
            </p>

            <div className="card card-light-orange">
               <div>
                    <div>
                        beans
                    </div>
                    <div className="text-bold">
                        100 calories
                    </div>
                </div> 

                <div>
                    <button>
                        -
                    </button>
                    <span className="mx-1">
                        0 / 3 cans
                    </span>
                    <button>
                        +
                    </button>
                </div>
            </div>
        </> 
    );
}