import * as React from "react";
import Head from "next/head";
import { AppProps } from "next/app";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { CacheProvider, EmotionCache } from "@emotion/react";
import theme from "@/utils/theme";
import createEmotionCache from "@/utils/createEmotionCache";
import ResponsiveAppBar from "@/components/AppBar";
import { FC } from "react";
import Providers from "@/contexts";

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

export interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
  Component: FC<any> & { getLayout?: (page: JSX.Element) => JSX.Element };
}

export default function MyApp(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Cart Hive</title>
      </Head>
      <ThemeProvider theme={theme}>
        <Providers>
          <>
            <CssBaseline />

            {/* Check if component layout is defined */}
            {Component.getLayout ? (
              Component.getLayout(<Component {...pageProps} />)
            ) : (
              <>
                <ResponsiveAppBar />
                <Component {...pageProps} />
              </>
            )}
          </>
        </Providers>
      </ThemeProvider>
    </CacheProvider>
  );
}
