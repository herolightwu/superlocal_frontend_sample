/* eslint-disable react-hooks/exhaustive-deps */
import React, { createContext, useContext, useEffect } from "react";

import StampNFT from "../abis/StampNFT";
import getWeb3 from "./getWeb3";
import { useCustomWallet } from "./CustomWalletContext";
const Web3 = require('web3');
function ContractConfig() {

  const {
    address
  } = useCustomWallet();

  const [isInitStampLoading, setIsInitStampLoading] = React.useState(true);
  const [stampCont, setStampCont] = React.useState();

  const [stampSignedCont, setStampSignedCont] = React.useState();

  const [mintedStampCount, setMintedStampCount] = React.useState();
  const [mintStampPrice, setMintStampPrice] = React.useState();
  const [balanceStamp, setBalanceStamp] = React.useState();

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
    const _stamp = new web3Default.eth.Contract(StampNFT.abi, StampNFT.address);
    
    setStampCont(_stamp);    
  }

  /**
   * StampNFT APIs
   */ 

  /** Read functions */
  /// returns the minted total count
  const getMintedStampCount = async () => {
    try {
      const res = await stampCont.methods.totalSupply().call();
      console.log('getMintedStampCount :', res)
      setMintedStampCount(res + '');
      return res;
    } catch (ex) {
      console.log(ex);
      return null;
    }
  }

  /// returns the minted stamp count for address
  const stamp_balanceOf = async () => {
    try {
      const res = await stampCont.methods.balanceOf(address).call();
      console.log('stamp_balanceOf :', res)
      setBalanceStamp(res + '');
      return res;
    } catch (ex) {
      console.log(ex);
      return null;
    }
  }

  const tokenByIndex_stamp = async (index) => {

    try {
      const res = await stampCont.methods.tokenOfOwnerByIndex(address, index).call();
      console.log('tokenByIndex_stamp :', res)

      return res;
    } catch (ex) {
      console.log(ex);
      return null;
    }
  }

  /// returns the minted stamps for address
  const tokensOfOwner_stamp = async () => {
    try {
        const res = await stampCont.methods.tokensOfOwner(address).call();
        console.log('tokensOfOwner_stamp :', res);
        return res;
      } catch (ex) {
        console.error(ex);
      }
  }
 
  const tokenURI_stamp = async(tokenId)=>{

    try {
      const res = await stampCont.methods.tokenURI(tokenId).call();
      console.log('tokenURI_stamp :', res)

      return res;
    } catch (ex) {
      console.log(ex);
      return null;
    }
  }

  /// @dev Return the image url of the Stamp by StampNFT id
  /// @param _tokenId Token ID of the StampNFT
  const getStampImage = async(tokenId)=>{
    try {
      const res = await stampCont.methods.getStampImage(tokenId).call();
      console.log('getStampImage :', res)

      return res;
    } catch (ex) {
      console.log(ex);
      return null;
    }
  }

  /// @dev Return the level of the Stamp by StampNFT id
  /// @param tokenId ID of the StampNFT token
  const getStampLevel = async(tokenId)=> {
    try {
      const res = await stampCont.methods.getStampLevel(tokenId).call();
      console.log('getStampLevel :', res)

      return res;
    } catch (ex) {
      console.log(ex);
      return null;
    }
  }

  const getMintPrice = async () => {
    try {
        const res = await stampCont.methods.PRICE().call();
        console.log('getMintStampPrice:', res.toString());
        setMintStampPrice(res.toString());
      } catch (ex) {
        console.error(ex);
      }
  }

  /** Write functions */
  const mint_stamp = async (msgValue, transactionHashCallback) => {
    return new Promise((resolve, reject) => {
      let option = { from: address, }

      if (msgValue) {
        option.value = msgValue;
      }
      stampSignedCont.methods
        .mint()
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

  /**Admin functions */
  /// @dev non-payable mint function for owner only 
  ///     this function can mint one of Passport only at one time.
  const reverseMint_stamp = async (transactionHashCallback) => {
    return new Promise((resolve, reject) => {
      let option = { from: address, }

      stampSignedCont.methods
        .reserveMint()
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

  /// @dev set the image url of the Stamp by StampNFT id
  /// @param _tokenId Token ID of the StampNFT
  /// @param _imgUrl  New image path for the StampNFT
  const setStampImage = async (tokenId, imgUrl, transactionHashCallback) => {
    return new Promise((resolve, reject) => {
      let option = { from: address, }

      stampSignedCont.methods
        .setStampImage(tokenId, imgUrl)
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

  const withdrawFromStamp = async (transactionHashCallback) => {
    return new Promise((resolve, reject) => {
        let option = { from: address, value: 0 }
  
        stampSignedCont.methods
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

      const _stamp = new _web3.eth.Contract(
        StampNFT.abi,
        StampNFT.address
      );

      setStampSignedCont(_stamp);      

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

  const loadingStampData = async () => {
    await getMintedStampCount();
    await getMintPrice();
  }

  useEffect(() => {
    if (!stampCont) return;
    (async () => {

      await loadingStampData();
      setIsInitStampLoading(false)
      
    })();

  }, [stampCont])

  useEffect(()=>{
    if(stampCont && address) {
      (async()=>{
        await stamp_balanceOf(address);
        await tokensOfOwner_stamp(address);
      })();
    }
  }, [stampCont, address])


  return {
    web3,
    stampCont,
    balanceStamp,
    stamp_balanceOf,
    mintedStampCount,
    getMintedStampCount,
    tokenByIndex_stamp,
    tokensOfOwner_stamp,
    tokenURI_stamp,
    getStampImage,
    getStampLevel,
    mint_stamp,
    reverseMint_stamp,
    mintStampPrice,
    withdrawFromStamp,
    loadingStampData,
    isInitStampLoading,
    setStampImage

  };
}

const stampContext = createContext({
  web3: undefined,
  stampCont: undefined,
  balanceStamp: undefined,
  stamp_balanceOf: undefined,
  mintedStampCount: undefined,
  getMintedStampCount: undefined,
  tokenByIndex_stamp: undefined,
  tokensOfOwner_stamp: undefined,
  tokenURI_stamp: undefined,
  getStampImage: undefined,
  getStampLevel: undefined,
  mint_stamp: undefined,
  reverseMint_stamp: undefined,
  mintStampPrice: undefined,
  withdrawFromStamp: undefined,
  loadingStampData: undefined,
  isInitStampLoading: undefined,
  setStampImage: undefined
  
});

export const StampContractProvider = ({ children }) => {
  const value = ContractConfig();
  return (
    <stampContext.Provider value={value}>
      {children}
    </stampContext.Provider>
  );
};

export const useStampContract = () => useContext(stampContext);
