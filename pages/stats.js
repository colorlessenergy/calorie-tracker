import Head from 'next/head';

export default function Stats() {
    return (
        <div>
            <Head>
                <title>calorie tracker - stats</title>
                <meta name="description" content="calorie tracker - stats" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className="container">
                <div className="mx-15">
                    <h1 className="mt-1">stats</h1>
                </div>
            </div>
        </div>
    );
}
