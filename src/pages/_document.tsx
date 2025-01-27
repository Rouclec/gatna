import { Html, Head, Main, NextScript } from 'next/document'

// export const metadata: Metadata = {
//   title: 'Gatna.io',
//   // description: "A Frontend Developer Portfolio",
//   //line 5 to 8 is only addition to make in layout.js
//   icons: {
//     icon: '/images/logo-icon.png'
//   }
// }

export default function Document () {
  return (
    <Html lang='en'>
      <Head>
        <link
          rel='icon'
          type='image/png'
          href='/favicon-96x96.png'
          sizes='96x96'
        />
        <link rel='icon' type='image/svg+xml' href='/favicon.svg' />
        <link rel='shortcut icon' href='/favicon.ico' />
        <link
          rel='apple-touch-icon'
          sizes='180x180'
          href='/apple-touch-icon.png'
        />
        <link rel='manifest' href='/site.webmanifest' />
        <script src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAP_API}&libraries=places&callback=initMap`} async></script>
      </Head>
      <body className='antialiased'>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
