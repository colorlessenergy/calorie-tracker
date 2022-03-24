import React, { useEffect } from 'react';
import { useRouter } from 'next/router'

import Nav from '../shared/components/Nav';

import '../styles/globals.scss';

function MyApp({ Component, pageProps }) {
    const router = useRouter();
    useEffect(() => {
        if (!localStorage.getItem('theme')) {
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                localStorage.setItem('theme', 'dark');
            } else {
                localStorage.setItem('theme', 'light');
            }
        }

        if (localStorage.getItem('theme') === 'dark') {
            document.body.classList.add('dark');
        }

        if (!localStorage.getItem('calorieGoal')) {
            router.push('/introduction');
        }
  }, []);

  return (
        <React.Fragment>
            <Nav />
            <Component {...pageProps} />
        </React.Fragment>
    );
}

export default MyApp
