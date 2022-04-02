import Link from 'next/link';

const Banner = ({ text, link }) => {
    return (
        <Link href={ link }>
            <a className="banner" title={ text }>
                { text }
            </a>
        </Link>
    );
}

export default Banner;