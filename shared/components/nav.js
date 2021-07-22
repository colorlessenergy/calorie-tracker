import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Nav () {
    const router = useRouter();
    const date = router.query.date;

    return (
        <div className="flex justify-content-between align-items-center pt-3 mx-15">
            <Link href="/">
                <a>
                    home
                </a>
            </Link>
            <Link href={`/day/${ date }/blocks`}>
                <a>
                    blocks
                </a>
            </Link>
        </div>
    );
}