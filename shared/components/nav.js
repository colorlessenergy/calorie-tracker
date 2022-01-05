import Link from 'next/link';
import { useRouter } from 'next/router';
import ThemeSelector from './ThemeSelector';

export default function Nav ({ link }) {
    const router = useRouter();
    const date = router.query.date;

    return (
        <nav className="flex justify-content-between align-items-center pt-1 mx-15 nav">
            <Link href="/">
                <a>
                    calendar
                </a>
            </Link>
            { link ? (
                <Link href={ link.link }>
                    <a>
                        { link.text }
                    </a>
                </Link>
            ) : (null) }

            <div className="flex align-items-center">
                <ThemeSelector />
                <Link href={`/day/${ date }/blocks`}>
                    <a>
                        blocks
                    </a>
                </Link>
            </div>
        </nav>
    );
}