import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
    render() {
        return (
            <Html lang="en">
                <Head>
                    <link
                        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap"
                        rel="stylesheet"
                    />

                    <meta name="application-name" content="calorie tracker" />
                    <meta name="apple-mobile-web-app-capable" content="yes" />
                    <meta
                        name="apple-mobile-web-app-status-bar-style"
                        content="default"
                    />
                    <meta
                        name="apple-mobile-web-app-title"
                        content="calorie tracker"
                    />
                    <meta name="format-detection" content="telephone=no" />
                    <meta name="mobile-web-app-capable" content="yes" />
                    <meta name="msapplication-TileColor" content="#2B5797" />
                    <meta name="msapplication-tap-highlight" content="no" />
                    <meta name="theme-color" content="#222222" />
                    <link rel="apple-touch-icon" href="/icons/192.png" />

                    <link rel="manifest" href="/manifest.json" />

                    <meta property="og:type" content="website" />
                    <meta property="og:title" content="calorie tracker" />
                    <meta property="og:description" content="calorie tracker" />
                    <meta property="og:site_name" content="calorie tracker" />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}

export default MyDocument;
