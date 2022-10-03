/* eslint-disable react-hooks/exhaustive-deps */
import React, { createContext, useContext, useEffect } from "react";

import Mayorship from "../abis/Mayorship";
import getWeb3 from "./getWeb3";
import { useCustomWallet } from "./CustomWalletContext";
const Web3 = require('web3');
export const ZERO_ADDR = "0x0000000000000000000000000000000000000000";

function ContractConfig() {

  const {
    address
  } = useCustomWallet();

  const [isInitLoading, setIsInitLoading] = React.useState(true);
  const [mayorshipCont, setMayorshipCont] = React.useState();

  const [mayorshipSignedCont, setMayorshipSignedCont] = React.useState();

  const [mintedCount, setMintedCount] = React.useState();
  const [mintPrice, setMintPrice] = React.useState();
  const [balance, setBalance] = React.useState();

  const [web3, setWeb3] = React.useState();


  const _getProviderUrls = () => {
    return process.env.REACT_APP_NETWORK !== 'live' ?
      [
        process.env.REACT_APP_RINKEBY_ALCHEMY_HTTP,
        process.env.REACT_APP_RINKEBY_ALCHEMY_WEBSOCKET
      ] : [
        process.env.REACT_APP_MAINNET_ALCHEMY_HTTP,
        process.env.REACT_APP_MAINNET_ALCHEMY_WEBSOCKET
      ];
  }

  const initContracts = async () => {
    let web3Default;
    console.log('_getProviderUrls()[0]:', _getProviderUrls()[0])
    web3Default = new Web3(new Web3.providers.HttpProvider(_getProviderUrls()[0]));
    const _mayorship = new web3Default.eth.Contract(Mayorship.abi, Mayorship.address);
    
    setMayorshipCont(_mayorship);
  }

  /**
   * Mayorship APIs
   */ 

  /** Read functions */
  /// returns the minted total count
  const getMintedCount = async () => {
    try {
      const res = await mayorshipCont.methods.totalSupply().call();
      console.log('getMintedCount :', res)
      setMintedCount(res + '');
      return res;
    } catch (ex) {
      console.log(ex);
      return null;
    }
  }

  /// returns the minted mayorship count for address
  const balanceOf = async () => {
    try {
      const res = await mayorshipCont.methods.balanceOf(address).call();
      console.log('balanceOf :', res)
      setBalance(res);
      return res;
    } catch (ex) {
      console.log(ex);
      return null;
    }
  }

  const tokenByIndex = async (index) => {

    try {
      const res = await mayorshipCont.methods.tokenOfOwnerByIndex(address, index).call();
      console.log('tokenByIndex :', res)

      return res;
    } catch (ex) {
      console.log(ex);
      return null;
    }
  }

  /// returns the minted Mayorship NFT token IDs for address
  const tokensOfOwner = async () => {
    try {
        const res = await mayorshipCont.methods.tokensOfOwner(address).call();
        console.log('tokensOfOwner:', res);
        return res;
      } catch (ex) {
        console.error(ex);
      }
  }
 
  const tokenURI = async(tokenId)=>{

    try {
      const res = await mayorshipCont.methods.tokenURI(tokenId).call();
      console.log('tokenURI :', res)

      return res;
    } catch (ex) {
      console.log(ex);
      return null;
    }
  }

  /// @dev get the Place id by token id
  /// @param _tokenId token id of Mayorship
  const getPlaceIdByToken = async(tokenId)=>{
    try {
      const res = await mayorshipCont.methods.getPlaceIdByToken(tokenId).call();
      console.log('getPlaceIdByToken :', res)

      return res;
    } catch (ex) {
      console.log(ex);
      return null;
    }
  }

  /// @dev get the token id by place id
  /// @param _placeId place id of Mayorship
  const getTokenIdByPlace = async(placeId)=> {
    try {
      const res = await mayorshipCont.methods.getTokenIdByPlace(placeId).call();
      console.log('getTokenIdByPlace :', res)

      return res;
    } catch (ex) {
      console.log(ex);
      return null;
    }
  }

  const getMintPrice = async () => {
    try {
        const res = await mayorshipCont.methods.PRICE().call();
        console.log('getMintPrice:', res.toString());
        setMintPrice(res.toString());
      } catch (ex) {
        console.error(ex);
      }
  }

  /** Write functions */
  const mint = async (placeId, msgValue, transactionHashCallback) => {
    return new Promise((resolve, reject) => {
      let option = { from: address, }

      if (msgValue) {
        option.value = msgValue;
      }
      mayorshipSignedCont.methods
        .mint(placeId)
        .send(option)
        .on("transactionHash", function (hash) {
          if (transactionHashCallback) {
            transactionHashCallback(hash);
          }
        })
        .on("error", function (error, receipt) {
          reject({ error, receipt });
        })
        .then((receipt) => {

          resolve(receipt);
        });

    })
  }
  
  /// @Admin
  const reverseMint = async (placeId, transactionHashCallback) => {
    return new Promise((resolve, reject) => {
      let option = { from: address, }

      mayorshipSignedCont.methods
        .reserveMint(placeId)
        .send(option)
        .on("transactionHash", function (hash) {
          if (transactionHashCallback) {
            transactionHashCallback(hash);
          }
        })
        .on("error", function (error, receipt) {
          reject({ error, receipt });
        })
        .then((receipt) => {

          resolve(receipt);
        });

    })
  }

  const withdraw = async (transactionHashCallback) => {
    return new Promise((resolve, reject) => {
        let option = { from: address, value: 0 }
  
        mayorshipSignedCont.methods
          .withdraw()
          .send(option)
          .on("transactionHash", function (hash) {
            if (transactionHashCallback) {
              transactionHashCallback(hash);
            }
          })
          .on("error", function (error, receipt) {
            reject({ error, receipt });
          })
          .then((receipt) => {
  
            resolve(receipt);
          });
  
      })
  }
  

  const initSignedContract = async () => {

    try {
      const _web3 = await getWeb3();
      setWeb3(_web3);
      
      const _mayorship = new _web3.eth.Contract(
        Mayorship.abi,
        Mayorship.address
      );
      setMayorshipSignedCont(_mayorship);

      return true;
    } catch (ex) {
      return false;
    }
  };

  useEffect(() => {
    (async () => {
      await initContracts();
    })();

    return () => { }
  }, []);

  useEffect(() => {
    if (!address) return;
    (async () => {
      await initSignedContract();
    })();
  }, [address])

  const loadingData = async () => {
    await getMintedCount();
    await getMintPrice();
  }

  useEffect(() => {
    if (!mayorshipCont) return;
    (async () => {

      await loadingData();
      setIsInitLoading(false)
      
    })();

  }, [mayorshipCont])

  useEffect(()=>{
    if(mayorshipCont && address) {
      (async()=>{
        await balanceOf(address);
        await tokensOfOwner(address);
      })();
    }
  }, [mayorshipCont, address])
  

  return {
    web3,
    mayorshipCont,
    balance,
    balanceOf,
    mintedCount,
    getMintedCount,
    tokenByIndex,
    tokensOfOwner,
    tokenURI,
    getPlaceIdByToken,
    getTokenIdByPlace,
    mint,
    reverseMint,
    mintPrice,
    withdraw,
    loadingData,
    isInitLoading
  };
}

const mayorshipContext = createContext({
  web3: undefined,
  mayorshipCont: undefined,
  balance: undefined,
  balanceOf: undefined,
  mintedCount: undefined,
  getMintedCount: undefined,
  tokenByIndex: undefined,
  tokensOfOwner: undefined,
  tokenURI: undefined,
  getPlaceIdByToken: undefined,
  getTokenIdByPlace: undefined,
  mint: undefined,
  reverseMint: undefined,
  mintPrice: undefined,
  withdraw: undefined,
  loadingData: undefined,
  isInitLoading: undefined
});

export const MayorshipContractProvider = ({ children }) => {
  const value = ContractConfig();
  return (
    <mayorshipContext.Provider value={value}>
      {children}
    </mayorshipContext.Provider>
  );
};

export const useMayorshipContract = () => useContext(mayorshipContext);
