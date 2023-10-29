import { BaseLayout } from '@/components/layout/BaseLayout'
import { HotToastConfig } from '@/components/layout/HotToastConfig'
import { env } from '@/config/environment'
import { getDeployments } from '@/deployments/deployments'
import GlobalStyles from '@/styles/GlobalStyles'
import { ChakraProvider, DarkMode, background } from '@chakra-ui/react'
import { cache } from '@emotion/css'
import { CacheProvider } from '@emotion/react'
import { UseInkathonProvider } from '@scio-labs/use-inkathon'
import { DefaultSeo } from 'next-seo'
import type { AppProps } from 'next/app'
import { Inconsolata } from 'next/font/google'
import Head from 'next/head'

// Google Font(s) via `next/font`
const inconsolata = Inconsolata({ subsets: ['latin'] })

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      {/* TODO SEO */}
      <DefaultSeo
        dangerouslySetAllPagesToNoFollow={!env.isProduction}
        dangerouslySetAllPagesToNoIndex={!env.isProduction}
        defaultTitle="Auction House" // TODO
        // titleTemplate="%s | ink!athon" // TODO
        description="Sell Your Demand!" // TODO
        openGraph={{
          type: 'website',
          locale: 'en',
          url: env.url,
          site_name: 'Auction House', // TODO
          images: [
            {
              url: `${env.url}/images/cover.jpg`, // TODO
              width: 1200,
              height: 675,
            },
          ],
        }}
        twitter={{
          handle: '', // TODO
        }}
      />

      <Head>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />

        {/* Set Font Variables */}
        <style>{`
          :root {
            --font-inconsolata: ${inconsolata.style.fontFamily}, 'Inconsolata';
          }
        `}</style>
      </Head>

      <UseInkathonProvider
        appName="Auction House" // TODO
        connectOnInit={true}
        defaultChain={env.defaultChain}
        deployments={getDeployments()}
      >
        <CacheProvider value={cache}>
          <ChakraProvider>
            <DarkMode>
              <GlobalStyles />

              <BaseLayout>
                <Component {...pageProps} />
              </BaseLayout>

              <HotToastConfig />
            </DarkMode>
          </ChakraProvider>
        </CacheProvider>
      </UseInkathonProvider>
    </>
  )
}

export default MyApp
