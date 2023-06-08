import { FC, useContext, useEffect, useState } from 'react'
import BaseTag from "@/components/ui/base-tag";
import ItemSVG1 from "@/components/svg/item1";
import BaseBtn from "@/components/ui/base-btn";
import BaseCtx from "@/utils/context";
import { useRouter } from "next/router";
import { useAccount, useConnect } from 'wagmi'
import * as U from '@/utils'
import { BigNumber } from "ethers";

const Dashboard: FC = () => {
  const { adMetaAddress, minaAddress } = useContext(BaseCtx)
  const [scoreMap, setScoreMap] = useState({})
  const router = useRouter()
  const { address } = useAccount()

  const step = (index: number, arr: number[]) => {
    console.log(index)
    if (index === 0) {
      return [0, 100]
    }
    let s = parseInt(((arr[index] - arr[index - 1]) / arr[index]* 100) + '')
    let e = 100 - s
    // console.log((arr[index] - arr[index - 1]) / arr[index]  * 100)
    return [s, e]
  }


  return address && minaAddress
    ?
    <div className={ 'px-10' }>
      <div className={ 'text-white my-10 font-semibold text-2xl' }>Dashboard</div>
      <div className={ 'flex items-center ' }>
        <div className={ 'bg-[#18191D] p-8 rounded-[20px] h-[160px] flex-col mr-10 justify-between' }>
          <div className={ 'flex items-center' }>
            <ItemSVG1/>
            <div className={ 'w-2' }></div>
            <div className={ 'text-white' }>Total earnings</div>
          </div>
          <div className={ 'flex items-center my-4' }>
            <div className={ 'text-blue-500 font-semibold text-xl' }>{Math.ceil(Math.random()*10) / 100}</div>
            <div className={ 'w-2' }></div>
            <BaseTag label={ 'ADM' } bg={ '#58BD7D' }/>
          </div>
          {/*<div className={ 'text-gray-600' }>$18.1</div>*/}
        </div>
        <div className={ 'bg-[#18191D] p-8 rounded-[20px] h-[160px] flex-col mr-10 justify-between' }>
          <div className={ 'flex items-center' }>
            <ItemSVG1/>
            <div className={ 'w-2' }></div>
            <div className={ 'text-white' }>Completed ad tasks</div>
          </div>
          <div className={ 'flex items-center my-4' }>
            <div className={ 'text-blue-500 font-semibold text-xl' }>{Math.ceil(Math.random()*10)}</div>
          </div>
          <div className={ 'w-full bg-gray-700 h-0.5' }>
            <div className={ 'bg-blue-500 w-1/3 h-0.5' }></div>
          </div>
        </div>
        <div className={ 'bg-[#18191D] p-8 rounded-[20px] h-[160px] flex-col mr-10 justify-between' }>
          <div className={ 'flex items-center' }>
            <ItemSVG1/>
            <div className={ 'w-2' }></div>
            <div className={ 'text-white' }>Earned NFT badges</div>
          </div>
          <div className={ 'flex items-center my-4' }>
            {
              Object.keys(scoreMap).map((key) => (
                U.H.calculationSingleLevel(scoreMap[key])
                  ?
                  <div className={ 'mr-8' } key={ key }>
                    <div className={ 'w-[40px] h-[40px] bg-orange-400 rounded mb-2' }></div>
                    <div className={ 'text-white text-xs' }>{ key }<br/>LV:{ U.H.calculationSingleLevel(scoreMap[key]) }
                    </div>
                  </div>
                  :
                  <></>
              ))
            }
          </div>
        </div>
      </div>
      <div>
        <div className={ 'text-white mt-20 mb-10 font-semibold text-2xl' }>Current All Level</div>
        <div className={'flex justify-start items-center'}>
          <div className={ `h-2 w-[50%] bg-gray-700` }>
            <div className={ `h-2 bg-blue-500 w-[${step(U.H.calculationAllLevel(scoreMap)[0], U.C.MAX_LEVEL)[0]}%]` }></div>
          </div>
          <div className={ 'text-yellow-500 ml-8 ' }>Lv.{ U.H.calculationAllLevel(scoreMap) }</div>
          <div className={ 'text-yellow-500 ml-8' }>All Score: {U.H.calculationAllLevel(scoreMap)[1] }</div>
        </div>

      </div>
      <div>
        <div className={ 'text-white mt-20 mb-10 font-semibold text-2xl' }>Current Single Level</div>
        {
          Object.keys(scoreMap).map((key) => (
            <div className={ 'flex items-center mb-4' } key={ key }>
              <div className={ 'text-white mr-8 font-semibold w-[200px]' }>{ key } Score</div>
              <div className={ 'text-gray-500 mr-8 w-[50px]' }>{ scoreMap[key] }</div>
              <div className={ 'text-yellow-500 mr-8 w-[50px]' }>Lv.{ U.H.calculationSingleLevel(scoreMap[key]) }</div>
              <div className={ `h-2 w-[60%] bg-gray-700` }>
                <div className={ `h-2 bg-blue-500 w-[${step(U.H.calculationSingleLevel(scoreMap[key]), U.C.MIN_LEVEL)[0]}%]` }></div>
              </div>
            </div>
          ))
        }
      </div>
      <div className={ 'flex mt-20 w-full justify-center mb-20' }>
        <BaseBtn
          label={ 'Data Sync' }
          handleClick={ () => {
            let score = localStorage.getItem('sync_data')
            if (!score) {
              score = JSON.stringify({
                DeFi: 0,
                GameFi: 0,
                NFT: 0,
                Metaverse: 0,
                OnChainData: 0
              })
            }
            console.log(score)
            const c = new U.CallEVM()


            c.init().then(async () => {
                const r = await c.getUserLevel()
                const o = JSON.parse(r[3])
                const s = JSON.parse(score)
                Object.keys(o).map((key) => {
                  o[key] += s[key]
                })
                setScoreMap(o)

                const level = BigNumber.from(U.H.calculationAllLevel(o)[0])
                const allScore = BigNumber.from(U.H.calculationAllLevel(o)[1])
                const categoryScore = JSON.stringify(o)
                console.log(level, allScore, categoryScore)
                c.setUserLevel(level, allScore, categoryScore).then()
                localStorage.removeItem('sync_data')
            })
          } }
        />
      </div>
    </div>
    :
    <div className={ 'flex flex-col w-full justify-center items-center w-full h-[90vh]' }>
      <div className={ 'text-white text-2xl mb-10 font-semibold' }>Before using this module, please connect your
        wallet.
      </div>
      <BaseBtn
        label={ 'Connect Wallet' }
        handleClick={ () => {
          router.push('/connect')
        } }
      />
    </div>
}

export default Dashboard
