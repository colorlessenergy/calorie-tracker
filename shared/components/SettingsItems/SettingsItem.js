import Link from "next/link";
import Image from 'next/image';
import arrowheadIcon from '../../../public/icons/arrowhead.svg';

import classes from './SettingsItem.module.scss';

export default function SettingsItem ({ text, link }) {
    return (
        <Link href={ link }>
            <a className={ classes["item"] }>
                { text }

                <Image
                    src={ arrowheadIcon }
                    alt="arrowhead icon"
                    width={ 16 }
                    height={ 16 }
                    title="arrowhead icon" />
            </a>
        </Link>
    );
}