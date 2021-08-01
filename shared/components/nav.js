import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Nav ({ link }) {
    const router = useRouter();
    const date = router.query.date;

    return (
        <div className="flex justify-content-between align-items-center pt-3 mx-15 nav">
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
            <Link href={`/day/${ date }/blocks`}>
                <a>
                    blocks
                </a>
            </Link>
        </div>
    );
}