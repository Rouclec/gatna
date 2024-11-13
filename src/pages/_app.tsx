import '@/src/styles/globals.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { SessionProvider } from 'next-auth/react'
import type { AppProps } from 'next/app'

const client = new QueryClient()

export default function App ({
  Component,
  pageProps: { session, ...pageProps }
}: AppProps) {
  return (
    <QueryClientProvider client={client}>
      <SessionProvider session={session}>
        <ReactQueryDevtools initialIsOpen={false} />
        <Component {...pageProps} />
      </SessionProvider>
    </QueryClientProvider>
  )
}
