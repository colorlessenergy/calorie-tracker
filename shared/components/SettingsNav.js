import Link from 'next/link';
import Image from 'next/image';
import gearIcon from '../../public/icons/gear.svg';

export default function SettingsNav () {
    return (
        <div className="flex justify-content-between align-items-center mx-15 py-0 nav">
            <Link href="/">
                <a>
                    calendar
                </a>
            </Link>
            <Link href="/settings">
                <a className="d-block text-right">
                    <Image
                        src={ gearIcon }
                        alt="gear icon"
                        width={ 50 }
                        height={ 50 }
                        title="gear icon" />
                </a>
            </Link>
        </div>
    );
}
