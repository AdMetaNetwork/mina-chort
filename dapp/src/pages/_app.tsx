import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import BaseCtx from "@/utils/context";
import { useState } from "react";
import { WagmiConfig, createConfig, mainnet } from 'wagmi'
import { createPublicClient, http } from 'viem'


const config = createConfig({
  autoConnect: true,
  publicClient: createPublicClient({
    chain: mainnet,
    transport: http()
  }),
})


export default function App({ Component, pageProps }: AppProps) {
  const [minaAddress, setMinaAddress] = useState('')
  const [adMetaAddress, setAdMetaAddress] = useState('')

  return <WagmiConfig config={config}>
  <BaseCtx.Provider value={ { minaAddress, setMinaAddress, adMetaAddress, setAdMetaAddress } }>
    <Component { ...pageProps } />
  </BaseCtx.Provider>
  </WagmiConfig>

}
