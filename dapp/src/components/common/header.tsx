import { FC, useContext } from 'react'
import LogoSVG from "@/components/svg/logo";
import BaseCtx from "@/utils/context";
import * as U from '@/utils'

const Header: FC = () => {
  const { adMetaAddress, minaAddress } = useContext(BaseCtx)

  return (
    <div className={ 'flex justify-between items-center px-10 h-20 sticky top-0' }>
      <LogoSVG/>
      {
        adMetaAddress && minaAddress
        &&
        <div className={ 'flex items-center' }>
          <div className={ 'flex px-4 py-1 rounded-full items-center' }>
            <div className={ 'text-xl text-white mr-2 text-yellow-500 font-semibold' }>AdMeta:</div>
            <div className={ 'text-white text-yellow-500 font-semibold' }>{U.H.formatAddress(adMetaAddress)}</div>
          </div>
          <div className={ 'w-2' }></div>
          <div className={ 'flex px-4 py-1 rounded-full items-center opacity-80' }>
            <div className={ 'text-xl text-white mr-2 text-blue-500 font-semibold' }>Mina:</div>
            <div className={ 'text-white text-blue-500 font-semibold' }>{U.H.formatAddress(minaAddress)}</div>
          </div>
        </div>
      }

    </div>
  )
}


export default Header
