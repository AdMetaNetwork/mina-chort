import * as U from './'

declare global {
  interface Window {
    mina: any
  }
}

export const formatAddress = (address: string): string => {
  if (!address) {
    return ''
  }
  const str_1 = address.substring(0, 4)
  const str_2 = address.substring(address.length - 4)
  return `${ str_1 }......${ str_2 }`
}

export const connectPolkadotWallet = async (callback: (arg0: U.T.Wallet[]) => void) => {
  if (typeof window !== 'undefined') {
    const { web3Enable, web3Accounts } = await import(
      '@polkadot/extension-dapp'
      )
    const extensions = await web3Enable(U.C.EXTENSION_NAME)
    if (extensions.length === 0) {
      console.log('No extension found')
      return
    }
    const allAccounts = (await web3Accounts()) as U.T.Wallet[]
    callback(allAccounts)
  }
}

export const connectMinaWallet = async (callback: (arg0: string[]) => void) => {
  if (typeof window !== 'undefined') {
    const allAccounts = await window.mina.requestAccounts()
    callback(allAccounts)
  }
}

export const calculationAllLevel = (scoreMap: {}) => {
  const max_level = U.C.MAX_LEVEL
  let score = 0
  Object.keys(scoreMap).map((key) => {
    score += scoreMap[key]
  })

  return [max_level.findIndex(v => score < v) + 1, score]

}

export const calculationSingleLevel = (score: number) => {
  if (score === 0) {
    return 0
  }
  return U.C.MIN_LEVEL.findIndex(v => score < v) + 1
}
