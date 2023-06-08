import browser from "webextension-polyfill";
import * as U from '../util'
import { ethers, Contract } from "ethers";
import abi from "../util/abi";
import { pushNftCard } from './ui'

class ContentScript {
  contract: Contract

  constructor() {
  }

  listenWebPageMessages() {
    window.addEventListener("message", async function (msg) {
      if (msg.data.admeta) {
        U.Messenger.sendMessageToBackground(msg.data.type, msg.data.data)
      }
    })
  }

  listenBackageMessages() {
    browser.runtime.onMessage.addListener((message, sender) => {
      console.log(message, sender)
      const l = localStorage.getItem('sync_data')
      if (l) {
        const d = JSON.stringify({ ...JSON.parse(l), ...message.data })
        localStorage.setItem('sync_data', d)
      } else {
        localStorage.setItem('sync_data', JSON.stringify(message.data))
      }

    })
  }

  connectContract() {
    // connect test network
    const p = new ethers.providers.JsonRpcProvider('https://eth-sepolia.public.blastapi.io');
    this.contract = new ethers.Contract(U.CONTRACT_ADDRESS, abi, p);
  }

  pushAd(address: string) {
    // TODO Ad Display Rules
    const oneDay = 24 * 60 * 60 * 1000;
    const now = new Date();
    const timeUntilTomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1) - now;

    const timer = setTimeout(() => {
      // call contract match ad
      this.contract?.matchAd(address).then((a: any) => {
        pushNftCard()
      })

      clearTimeout(timer)
      this.pushAd(address);
    }, oneDay);

  }


  async init() {

    this.listenWebPageMessages()
    this.listenBackageMessages()

    this.connectContract()
  }
}

new ContentScript().init()
