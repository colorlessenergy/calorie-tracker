import Image from 'next/image';
import watermelonIcon from '../../../public/icons/watermelon.svg';

const EmptyFoodBlocks = ({ addEmptyFoodBlock }) => {
    return (
        <>
            <div className="no-food-blocks-emoji">
                <Image
                    height={140}
                    width={140}
                    src={watermelonIcon}
                    alt="watermelon icon"
                />
            </div>
            <p className="text-center text-medium mb-1">no food blocks</p>
            <button
                className="dark-text text-large text-decoration-underline d-block m-center"
                onClick={() => addEmptyFoodBlock()}
            >
                add a food block
            </button>
        </>
    );
};

export default EmptyFoodBlocks;
