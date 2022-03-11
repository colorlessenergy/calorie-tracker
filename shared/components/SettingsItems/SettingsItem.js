import Link from 'next/link';

import classes from './SettingsItem.module.scss';

export default function SettingsItem ({ text, link }) {
    return (
        <Link href={ link }>
            <a className={ classes["item"] }>
                { text }

                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    className="arrow-icon">
                    <path fill="none" d="M0 0h24v24H0z"/>
                    <path d="M13.172 12l-4.95-4.95 1.414-1.414L16 12l-6.364 6.364-1.414-1.414z"/>
                </svg>
            </a>
        </Link>
    );
}