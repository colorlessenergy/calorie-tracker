import Link from 'next/link';

import classes from './Banner.module.scss';

const Banner = ({ text, link }) => {
    return (
        <Link href={link}>
            <a className={classes['banner']} title={text}>
                {text}
            </a>
        </Link>
    );
};

export default Banner;
