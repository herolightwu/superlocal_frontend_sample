/* eslint-disable react-hooks/exhaustive-deps */
import React, { createContext, useContext, useEffect } from "react";

import PassportNFT from "../abis/PassportNFT";
import getWeb3 from "./getWeb3";
import { useCustomWallet } from "./CustomWalletContext";
const Web3 = require('web3');

function ContractConfig() {

  const {
    address
  } = useCustomWallet();

  const [isInitPassportLoading, setIsInitPassportLoading] = React.useState(true);
  const [passportCont, setPassportCont] = React.useState();

  const [passportSignedCont, setPassportSignedCont] = React.useState();

  const [mintedPassportCount, setMintedPassportCount] = React.useState();
  const [mintPassportPrice, setMintPassportPrice] = React.useState();
  const [balancePassport, setBalancePassport] = React.useState();
  const [maxApplyStampCount, setMaxApplyStampCount] = React.useState();

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
    const _passport = new web3Default.eth.Contract(PassportNFT.abi, PassportNFT.address);
    
    setPassportCont(_passport);    
  }

  /**
   * PassportNFT APIs
   */ 

  /** Read functions */
  /// returns the minted total count
  const getMintedPassportCount = async () => {
    try {
      const res = await passportCont.methods.totalSupply().call();
      console.log('getMintedPassportCount :', res)
      setMintedPassportCount(res + '');
      return res;
    } catch (ex) {
      console.log(ex);
      return null;
    }
  }

  /// returns the minted Passport count for address
  const passport_balanceOf = async () => {
    try {
      const res = await passportCont.methods.balanceOf(address).call();
      console.log('passport_balanceOf :', res)
      setBalancePassport(res + '');
      return res;
    } catch (ex) {
      console.log(ex);
      return null;
    }
  }

  const tokenByIndex_passport = async (index) => {

    try {
      const res = await passportCont.methods.tokenOfOwnerByIndex(address, index).call();
      console.log('tokenByIndex_passport :', res)

      return res;
    } catch (ex) {
      console.log(ex);
      return null;
    }
  }

  /// returns the minted Passport token IDs for address
  const tokensOfOwner_passport = async () => {
    try {
        const res = await passportCont.methods.tokensOfOwner(address).call();
        console.log('tokensOfOwner_passport :', res);
        return res;
      } catch (ex) {
        console.error(ex);
      }
  }
 
  const tokenURI_passport = async(tokenId)=>{

    try {
      const res = await passportCont.methods.tokenURI(tokenId).call();
      console.log('tokenURI_passport :', res)

      return res;
    } catch (ex) {
      console.log(ex);
      return null;
    }
  }

  /// @dev Return the count of the applied stamps on Passport by Passport id
  /// @param _tokenId Token ID of the Passport
  const getAppliedStampCount = async(tokenId)=>{
    try {
      const res = await passportCont.methods.getAppliedStampCount(tokenId).call();
      console.log('getAppliedStampCount :', res)

      return res;
    } catch (ex) {
      console.log(ex);
      return null;
    }
  }

  /// @dev get the appliable stamp count
  const getMaxApplyStamp = async()=> {
    try {
      const res = await passportCont.methods.getMaxApplyStamp().call();
      console.log('getMaxApplyStamp :', res)
      setMaxApplyStampCount(res)
      return res;
    } catch (ex) {
      console.log(ex);
      return null;
    }
  }

  /// @dev Return the decay degree (as 10..0)for available time (as seconds) of the Passport by Passport id
  ///      If renewal date is expired, return 0.
  /// @param _tokenId Token ID of the Passport
  const getPassportDecay = async(tokenId) => {
    try {
      const res = await passportCont.methods.getPassportDecay(tokenId).call();
      console.log('getPassportDecay :', res)

      return res;
    } catch (ex) {
      console.log(ex);
      return null;
    }
  }

  /// @dev Return the image url of the Passport by id
  /// @param _tokenId Token ID of the PassportNFT
  const getPassportImage = async(tokenId)=>{
    try {
      const res = await passportCont.methods.getPassportImage(tokenId).call();
      console.log('getPassportImage :', res)

      return res;
    } catch (ex) {
      console.log(ex);
      return null;
    }
  }

  /// @dev Return the level of the Passport by Passport id
  /// @param _tokenId Token ID of the Passport
  const getPassportLevel = async(tokenId)=> {
    try {
      const res = await passportCont.methods.getPassportLevel(tokenId).call();
      console.log('getPassportLevel :', res)

      return res;
    } catch (ex) {
      console.log(ex);
      return null;
    }
  }

  /// @dev Return the luck of the Passport by Passport id
  /// @param _tokenId Token ID of the Passport
  const getPassportLuck = async(tokenId)=> {
    try {
      const res = await passportCont.methods.getPassportLuck(tokenId).call();
      console.log('getPassportLuck :', res)

      return res;
    } catch (ex) {
      console.log(ex);
      return null;
    }
  }

  /// @dev Return the applied stamp token IDs on Passport by Passport id
    /// @param _tokenId Token ID of the Passport
  const getPassportStamps = async(tokenId)=> {
    try {
      const res = await passportCont.methods.getPassportStamps(tokenId).call();
      console.log('getPassportStamps :', res)

      return res;
    } catch (ex) {
      console.log(ex);
      return null;
    }
  }

  const getMintPrice = async () => {
    try {
        const res = await passportCont.methods.PRICE().call();
        console.log('getMintPassportPrice:', res.toString());
        setMintPassportPrice(res.toString());
      } catch (ex) {
        console.error(ex);
      }
  }

  /** Write functions */
  const mint_passport = async (msgValue, transactionHashCallback) => {
    return new Promise((resolve, reject) => {
      let option = { from: address, }

      if (msgValue) {
        option.value = msgValue;
      }
      passportSignedCont.methods
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

  /// @dev level up the level of the Passport by Passport id
  /// @param _tokenId     Token ID of the Passport
  /// will add to check the amount of user's local token later
  const levelUpPassport = async (tokenId, msgValue, transactionHashCallback) => {
    return new Promise((resolve, reject) => {
      let option = { from: address, }

      if (msgValue) {
        option.value = msgValue;
      }
      passportSignedCont.methods
        .levelUpPassport(tokenId)
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

  /// @dev apply Stamp NFT to passport
  /// @param _tokenId Token ID of the Passport
  /// @param _stampId Token ID of the Stamp
  const setStamp = async (tokenId, stampId, transactionHashCallback) => {
    return new Promise((resolve, reject) => {
      let option = { from: address, }

      passportSignedCont.methods
        .setStamp(tokenId, stampId)
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
  const reverseMint_passport = async (transactionHashCallback) => {
    return new Promise((resolve, reject) => {
      let option = { from: address, }

      passportSignedCont.methods
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

  /// @dev set the image url of the Passport by id
  /// @param _tokenId Token ID of the PassportNFT
  /// @param _imgUrl  New image path for the PassportNFT
  const setPassportImage = async (tokenId, imgUrl, transactionHashCallback) => {
    return new Promise((resolve, reject) => {
      let option = { from: address, }

      passportSignedCont.methods
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

  /// @dev Set the available time (as seconds) of the Passport by Passport id
  /// @param _tokenId Token ID of the Passport
  /// @param _newRenewal new available timestamp of the Passport (max : now() + 10 days)
  const setPassportRenwal = async (tokenId, newRenewal, transactionHashCallback) => {
    return new Promise((resolve, reject) => {
      let option = { from: address, }

      passportSignedCont.methods
        .setPassportRenwal(tokenId, newRenewal)
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


  /// @dev set the luck of the Passport by Passport id
  /// @param _tokenId Token ID of the Passport
  /// @param _luck    new luck value (0..100) of the Passport
  const setPassportLuck = async (tokenId, luck, transactionHashCallback) => {
    return new Promise((resolve, reject) => {
      let option = { from: address, }

      passportSignedCont.methods
        .setPassportLuck(tokenId, luck)
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

  /// @dev Set the appliable stamp count
  /// @param maxApplyCount the appliable stamp maximum count
  const setMaxApplyStamp = async (maxApplyCount, transactionHashCallback) => {
    return new Promise((resolve, reject) => {
      let option = { from: address, }

      passportSignedCont.methods
        .setMaxApplyStamp(maxApplyCount)
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

  const withdrawFromPassport = async (transactionHashCallback) => {
    return new Promise((resolve, reject) => {
        let option = { from: address, value: 0 }
  
        passportSignedCont.methods
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

      const _passport = new _web3.eth.Contract(
        PassportNFT.abi,
        PassportNFT.address
      );

      setPassportSignedCont(_passport);      

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

  const loadingPassportData = async () => {
    await getMintedPassportCount();
    await getMintPrice();
    await getMaxApplyStamp();
  }

  useEffect(() => {
    if (!passportCont) return;
    (async () => {

      await loadingPassportData();
      setIsInitPassportLoading(false)
      
    })();

  }, [passportCont])

  useEffect(()=>{
    if(passportCont && address) {
      (async()=>{
        await passport_balanceOf(address);
        await tokensOfOwner_passport(address);
      })();
    }
  }, [passportCont, address])


  return {
    web3,
    passportCont,
    balancePassport,
    passport_balanceOf,
    mintedPassportCount,
    getMintedPassportCount,
    tokenByIndex_passport,
    tokensOfOwner_passport,
    tokenURI_passport,
    getAppliedStampCount,
    maxApplyStampCount,
    mint_passport,
    reverseMint_passport,
    mintPassportPrice,
    withdrawFromPassport,
    loadingPassportData,
    isInitPassportLoading,
    setStamp,
    setPassportImage,
    setPassportRenwal,
    setPassportLuck,
    setMaxApplyStamp,
    getPassportDecay,
    getPassportImage,
    getPassportLevel,
    getPassportLuck,
    getPassportStamps,
    levelUpPassport

  };
}

const passportContext = createContext({
  web3: undefined,
  passportCont: undefined,
  balancePassport: undefined,
  passport_balanceOf: undefined,
  mintedPassportCount: undefined,
  getMintedPassportCount: undefined,
  tokenByIndex_passport: undefined,
  tokensOfOwner_passport: undefined,
  tokenURI_passport: undefined,
  getAppliedStampCount: undefined,
  maxApplyStampCount: undefined,
  mint_passport: undefined,
  reverseMint_passport: undefined,
  mintPassportPrice: undefined,
  withdrawFromPassport: undefined,
  loadingPassportData: undefined,
  isInitPassportLoading: undefined,
  setStamp: undefined,
  setPassportImage: undefined,
  setPassportRenwal: undefined,
  setPassportLuck: undefined,
  setMaxApplyStamp: undefined,
  getPassportDecay: undefined,
  getPassportImage: undefined,
  getPassportLevel: undefined,
  getPassportLuck: undefined,
  getPassportStamps: undefined,
  levelUpPassport: undefined
  
});

export const PassportContractProvider = ({ children }) => {
  const value = ContractConfig();
  return (
    <passportContext.Provider value={value}>
      {children}
    </passportContext.Provider>
  );
};

export const usePassportContract = () => useContext(passportContext);
