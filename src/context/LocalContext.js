/* eslint-disable react-hooks/exhaustive-deps */
import { BigNumber } from "bignumber.js";
import React, { createContext, useContext, useEffect } from "react";

import Local from "../abis/Local";
import getWeb3 from "./getWeb3";
import { useCustomWallet } from "./CustomWalletContext";
const Web3 = require('web3');

function ContractConfig() {

  const {
    address
  } = useCustomWallet();

  const [isInitTokenLoading, setIsInitTokenLoading] = React.useState(true);
  const [localCont, setLocalCont] = React.useState();

  const [localSignedCont, setLocalSignedCont] = React.useState();

  const [totalSupply, setTotalSupply] = React.useState();
  const [mintTokenPrice, setMintTokenPrice] = React.useState();
  const [balanceToken, setBalanceToken] = React.useState();
  const [maxTxAmount, setMaxTxAmount] = React.useState();
  const [royaltyFee, setRoyaltyFee] = React.useState();
  const [taxFee, setTaxFee] = React.useState();
  const [totalFee, setTotalFee] = React.useState();
  const [tradingEnabled, setTradingEnabled] = React.useState();

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
    const _local = new web3Default.eth.Contract(Local.abi, Local.address);
    
    setLocalCont(_local);
  }

  /**
   * Local APIs
   */ 

  /** Read functions */
  
  const getTotalSupply = async () => {
    try {
      const res = await localCont.methods.totalSupply().call();
      console.log('TotalSupply :', res)
      setTotalSupply(res + '');
      return res;
    } catch (ex) {
      console.log(ex);
      return null;
    }
  }

  
  const token_balanceOf = async () => {
    try {
      const res = await localCont.methods.balanceOf(address).call();
      console.log('balanceOf :', res)
      setBalanceToken(new BigNumber(res).dividedBy(10**9).toString());
      return res;
    } catch (ex) {
      console.log(ex);
      return null;
    }
  }

  const getMaxTxAmount = async () => {

    try {
      const res = await localCont.methods.getMaxTxAmount().call();
      console.log('MaxTxAmount :', res)
      setMaxTxAmount(res);
      return res;
    } catch (ex) {
      console.log(ex);
      return null;
    }
  }

  
  const getRoyaltyFee = async () => {
    try {
        const res = await localCont.methods.getRoyaltyFeePercent().call();
        console.log('RoyaltyFee:', res);
        setRoyaltyFee(res);
        return res;
      } catch (ex) {
        console.error(ex);
      }
  }
 
  const getTaxFee = async()=>{

    try {
      const res = await localCont.methods.getTaxFeePercent().call();
      console.log('TaxFee :', res)
      setTaxFee(res)
      return res;
    } catch (ex) {
      console.log(ex);
      return null;
    }
  }

  
  const getTotalFee = async()=>{
    try {
      const res = await localCont.methods.totalFees().call();
      console.log('getPlaceIdByToken :', res)
      setTotalFee(res);
      return res;
    } catch (ex) {
      console.log(ex);
      return null;
    }
  }

  const getTradingEnabled = async()=> {
    try {
      const res = await localCont.methods.tradingEnabled().call();
      console.log('tradingEnabled :', res)
      setTradingEnabled(res)
      return res;
    } catch (ex) {
      console.log(ex);
      return null;
    }
  }

  const getMintPrice = async () => {
    try {
        const res = await localCont.methods.PRICE().call();
        console.log('getMintPrice:', res.toString());
        setMintTokenPrice(res.toString());
      } catch (ex) {
        console.error(ex);
      }
  }

  /** Write functions */
  const approve = async (spender, amount, transactionHashCallback) => {
    return new Promise((resolve, reject) => {
      let option = { from: address, }

      localSignedCont.methods
        .approve(spender, amount)
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

  const mintToken = async (amount, msgValue, transactionHashCallback) => {
    return new Promise((resolve, reject) => {
      let option = { from: address, }

      if (msgValue) {
        option.value = msgValue;
      }
      localSignedCont.methods
        .mint(amount)
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

  const decreaseAllowance = async (spender, subValue, transactionHashCallback) => {
    return new Promise((resolve, reject) => {
      let option = { from: address, }

      localSignedCont.methods
        .decreaseAllowance(spender, subValue)
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

  const increaseAllowance = async (spender, addValue, transactionHashCallback) => {
    return new Promise((resolve, reject) => {
      let option = { from: address, }

      localSignedCont.methods
        .increaseAllowance(spender, addValue)
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

  const transfer = async (recipient, amount, transactionHashCallback) => {
    return new Promise((resolve, reject) => {
      let option = { from: address, }

      localSignedCont.methods
        .transfer(recipient, amount)
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

  const transferFrom = async (sender, recipient, amount, transactionHashCallback) => {
    return new Promise((resolve, reject) => {
      let option = { from: address, }

      localSignedCont.methods
        .transferFrom(sender, recipient, amount)
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
  const enableTrading = async (transactionHashCallback) => {
    return new Promise((resolve, reject) => {
      let option = { from: address, }

      localSignedCont.methods
        .enableTrading()
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

  const rewardMint = async (recipient, amount, transactionHashCallback) => {
    return new Promise((resolve, reject) => {
      let option = { from: address, }

      localSignedCont.methods
        .rewardMint(recipient, amount)
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

  const excludeFromFee = async (recipient, transactionHashCallback) => {
    return new Promise((resolve, reject) => {
        let option = { from: address }
  
        localSignedCont.methods
          .excludeFromFee(recipient)
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

  const includeInFee = async (recipient, transactionHashCallback) => {
    return new Promise((resolve, reject) => {
        let option = { from: address }
  
        localSignedCont.methods
          .includeInFee(recipient)
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

  const excludeFromReward = async (recipient, transactionHashCallback) => {
    return new Promise((resolve, reject) => {
        let option = { from: address }
  
        localSignedCont.methods
          .excludeFromReward(recipient)
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

  const includeInReward = async (recipient, transactionHashCallback) => {
    return new Promise((resolve, reject) => {
        let option = { from: address }
  
        localSignedCont.methods
          .includeInReward(recipient)
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

  const setMaxTransactionAmount = async (txAmount, transactionHashCallback) => {
    return new Promise((resolve, reject) => {
        let option = { from: address }
  
        localSignedCont.methods
          .setMaxTxAmount(txAmount)
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

  const setTaxFeePercent = async (taxFee, transactionHashCallback) => {
    return new Promise((resolve, reject) => {
        let option = { from: address }
  
        localSignedCont.methods
          .setTaxFeePercent(taxFee)
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

  const setRoyaltyFeePercent = async (royaltyFee, transactionHashCallback) => {
    return new Promise((resolve, reject) => {
        let option = { from: address }
  
        localSignedCont.methods
          .setRoyaltyFeePercent(royaltyFee)
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

  const withdrawFromToken = async (transactionHashCallback) => {
    return new Promise((resolve, reject) => {
        let option = { from: address, value: 0 }
  
        localSignedCont.methods
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

  const withdrawToken = async (transactionHashCallback) => {
    return new Promise((resolve, reject) => {
        let option = { from: address }
  
        localSignedCont.methods
          .withdrawToken()
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
      
      const _local = new _web3.eth.Contract(
        Local.abi,
        Local.address
      );
      setLocalSignedCont(_local);

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

  const loadingTokenData = async () => {
    await getTotalSupply();
    await getMaxTxAmount();
    await getRoyaltyFee();
    await getTaxFee();
    await getTotalFee();
    await getMintPrice();
    await getTradingEnabled();
  }

  useEffect(() => {
    if (!localCont) return;
    (async () => {

      await loadingTokenData();
      setIsInitTokenLoading(false)
      
    })();

  }, [localCont])

  useEffect(()=>{
    if(localCont && address) {
      (async()=>{
        await token_balanceOf(address);
      })();
    }
  }, [localCont, address])
  

  return {
    web3,
    localCont,
    balanceToken,
    token_balanceOf,
    totalSupply,
    maxTxAmount,
    royaltyFee,
    taxFee,
    mintTokenPrice,
    totalFee,
    tradingEnabled,
    getTotalSupply,
    getMaxTxAmount,
    getRoyaltyFee,
    getTaxFee,
    getTotalFee,
    getMintPrice,
    getTradingEnabled,
    approve,    
    mintToken,
    decreaseAllowance,
    increaseAllowance,
    transfer,
    transferFrom,
    enableTrading,
    rewardMint,
    excludeFromFee,
    includeInFee,
    excludeFromReward,
    includeInReward,
    setMaxTransactionAmount,
    setTaxFeePercent,
    setRoyaltyFeePercent,
    withdrawFromToken,
    withdrawToken,
    loadingTokenData,
    isInitTokenLoading
 };
}

const localContext = createContext({
  web3: undefined,
  localCont: undefined,
  balanceToken: undefined,
  token_balanceOf: undefined,
  totalSupply: undefined,
  maxTxAmount: undefined,
  royaltyFee: undefined,
  taxFee: undefined,
  mintTokenPrice: undefined,
  totalFee: undefined,
  tradingEnabled: undefined,
  getTotalSupply: undefined,
  getMaxTxAmount: undefined,
  getRoyaltyFee: undefined,
  getTaxFee: undefined,
  getTotalFee: undefined,
  getMintPrice: undefined,
  getTradingEnabled: undefined,
  approve: undefined,    
  mintToken: undefined,
  decreaseAllowance: undefined,
  increaseAllowance: undefined,
  transfer: undefined,
  transferFrom: undefined,
  enableTrading: undefined,
  rewardMint: undefined,
  excludeFromFee: undefined,
  includeInFee: undefined,
  excludeFromReward: undefined,
  includeInReward: undefined,
  setMaxTransactionAmount: undefined,
  setTaxFeePercent: undefined,
  setRoyaltyFeePercent: undefined,
  withdrawFromToken: undefined,
  withdrawToken: undefined,
  loadingTokenData: undefined,
  isInitTokenLoading: undefined
});

export const TokenContractProvider = ({ children }) => {
  const value = ContractConfig();
  return (
    <localContext.Provider value={value}>
      {children}
    </localContext.Provider>
  );
};

export const useTokenContract = () => useContext(localContext);
