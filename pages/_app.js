import { useEffect } from 'react';
import { useRouter } from 'next/router'

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

  return <Component {...pageProps} />
}

export default MyApp
