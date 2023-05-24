import { FC, useContext } from 'react'
import BaseBtn from "@/components/ui/base-btn";
import BaseCtx from "@/utils/context";
import * as U from '@/utils'
import { useRouter } from "next/router";
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'

const ConnectWallet: FC = () => {
  const { adMetaAddress, setAdMetaAddress, minaAddress, setMinaAddress } = useContext(BaseCtx)
  const router = useRouter()
  const { address, isConnected } = useAccount()
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  })

  return (
    <div className={ 'px-10' }>
      <div className={ 'text-white font-semibold text-xl mt-4 mb-10' }>Welcome, First, please connect your Mina Auro
        wallet and Metamask wallet,
        <br/>if you don&apos;t have one you can create one, here is link to install.
      </div>
      <div className={ 'flex items-center mb-20' }>
        <BaseBtn
          label={ 'Install auro extension and create a account' }
          handleClick={ () => {
            window.open('https://www.aurowallet.com/')

          } }
        />
        <div className={ 'w-2' }></div>
        <BaseBtn
          label={ 'Install Metamask extension and create a account' }
          handleClick={ () => {
            window.open('https://metamask.io/download/')
          } }
        />
      </div>
      <div>
        <div className={ 'text-white font-semibold text-xl mt-4 mb-10' }>Connect wallet</div>
        <div className={ 'flex items-center mb-20' }>
          {
            address
              ?
              <div className={ 'text-yellow-500 font-semibold' }>AdMetaWallt: { address }</div>
              :
              <BaseBtn
                label={ 'Connect MetaMask' }
                handleClick={ () => {
                  connect()
                } }
              />
          }
          <div className={ 'w-2' }></div>
          {
            minaAddress
              ?
              <div className={ 'text-blue-500 font-semibold' }>MinaWallt: { minaAddress }</div>
              :
              <BaseBtn
                label={ 'Connect Mina' }
                handleClick={ () => {
                  U.Messager.sendMessageToContent(U.C.ADMETA_MSG_HACKATHON_ACCOUNT, { address })
                  U.H.connectMinaWallet((address) => {
                    setMinaAddress!(address[0])
                    if (isConnected && address) {
                      router.push('/')
                    }
                  })
                } }
              />
          }
        </div>
      </div>
    </div>
  )
}

export default ConnectWallet
