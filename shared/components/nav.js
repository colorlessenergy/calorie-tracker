import Link from 'next/link';

export default function Nav () {
    return (
        <div className="flex justify-content-between align-items-center pt-3 mx-15">
            <Link href="/">
                <a>
                    home
                </a>
            </Link>
            <Link href="/blocks">
                <a>
                    blocks
                </a>
            </Link>
        </div>
    );
}