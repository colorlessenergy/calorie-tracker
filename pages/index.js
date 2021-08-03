import { useEffect } from 'react';
import Head from 'next/head'
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import gearIcon from '../public/icons/gear.svg';

import Calender from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

export default function Home() {
    const router = useRouter();
    const onChange = (date) => {
        date = date.toLocaleDateString('en-US').replace(/\//g, '-');
        router.push(`day/${ date }`);
    }

    return (
        <div>
            <Head>
                <title>calorie tracker</title>
                <meta name="description" content="calorie tracker" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

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

            <h1 className="my-0 text-center">calorie tracker</h1>
            <p className="my-0 mb-2 text-center">track calories for a day</p>

            <Calender
                onChange={ onChange }
                className="m-center" />
        </div>
    );
}
