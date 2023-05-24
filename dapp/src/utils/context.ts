import { createContext } from 'react'

interface BaseData {
  minaAddress?: string,
  setMinaAddress?: (v: string) => void,
  adMetaAddress?: string,
  setAdMetaAddress?: (v: string) => void,
}

const initialState: BaseData = {
  minaAddress: '',
  adMetaAddress: '',
}


const BaseCtx = createContext(initialState);

export default BaseCtx;
