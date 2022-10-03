
import React, {useState, useEffect} from 'react';
import './App.css';
import {
  Grid,
  Paper,
} from '@material-ui/core'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl'
import LinearProgress from '@material-ui/core/LinearProgress'
import AlertDialog from './components/AlertDialog'
import { useStampContract } from './context/StampContext';
import { usePassportContract } from './context/PassportContext';
import { useTokenContract } from './context/LocalContext';
import { useCustomWallet } from './context/CustomWalletContext';
import { utils, BigNumber } from 'ethers'


const App = () => {
  
  const [stampBalance, setStampBalance] = useState(0);
  const [passportBalance, setPassportBalance] = useState(0);
  const [localBalance, setLocalBalance] = useState(0);

  const [stampPrice, setStampPrice] = useState(0);
  const [passportPrice, setPassportPrice] = useState(0);
  const [localPrice, setLocalPrice] = useState(0);

  const [stampTotal, setStampTotal] = useState(0);
  const [passportTotal, setPassportTotal] = useState(0);
  const [localTotal, setLocalTotal] = useState(0);

  const [isProgressingStamp, setIsProgressingStamp] = useState(false);
  const [isProgressingPassport, setIsProgressingPassport] = useState(false);
  const [isProgressingToken, setIsProgressingToken] = useState(false);

  const [tokenMintAmount, setTokenMintAmount] = useState(0);

  const alertRef = React.createRef();

  const {
    connectMetamask,
    address,
    shortAddr
  } = useCustomWallet();

  const {
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
  } = useStampContract();

  const {
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
  } = usePassportContract();

  const {
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
  } = useTokenContract();

  const btnStyle = {
    width: 120,
    float: 'right',
    marginLeft: 5,
    marginRight: 5,
    marginBottom: 20,
    minWidth: 180,
  }

  const onConect = () => {
    connectMetamask();
  }

  const mintStamp = async () => {
    console.log('Stamp mint');
    if (!address) {
      if (alertRef){
        alertRef.current.showDialog('Warning!', 'Please connect metamask first', () => {})
      }      
      connectMetamask();
      return;
    }

    let ethValue = BigNumber.from(mintStampPrice + '')
    try {
      setIsProgressingStamp(true)
      const res = await mint_stamp(ethValue ? ethValue.toString() : undefined, (hash) => {

      });
      await loadingStampData();
      setIsProgressingStamp(false)
    } catch (ex) {
        console.log(ex);
        if (alertRef){
          alertRef.current.showDialog('Error!', ex.error ? ex.error.message : ex.message, () => {})
        }
        setIsProgressingStamp(false)
    }
  }

  const mintPassport = async () => {
    console.log('Passport mint');
    if (!address) {
      if (alertRef){
        alertRef.current.showDialog('Warning!', 'Please connect metamask first', () => {})
      }
      connectMetamask();
      return;
    }

    let ethValue = BigNumber.from(mintPassportPrice + '')
    try {
      setIsProgressingPassport(true)
      const res = await mint_passport(ethValue ? ethValue.toString() : undefined, (hash) => {

      });
      await loadingPassportData();
      setIsProgressingPassport(false)
    } catch (ex) {
        console.log(ex);
        if (alertRef){
          alertRef.current.showDialog('Error!', ex.error ? ex.error.message : ex.message, () => {})
        }
        setIsProgressingPassport(false)
    }
  }

  const mintLocalToken = async () => {
    console.log('Token mint');
    if (!address) {
      if (alertRef){
        alertRef.current.showDialog('Warning!', 'Please connect metamask first', () => {})
      }
      connectMetamask();
      return;
    }

    if(!tokenMintAmount){
      if (alertRef){
        alertRef.current.showDialog('Warning!', 'Please input the amount to mint', () => {})
      }
      return
    }
    if (0 > tokenMintAmount){
      if (alertRef){
        alertRef.current.showDialog('Warning!', 'Please input the amount correctly. The amount must be bigger than 0', () => {})
      }
      return
    }

    let maxAmount = BigNumber.from(maxTxAmount + '')
    let amount = BigNumber.from(tokenMintAmount + '').mul(10**9)

    console.log("maxTxAmount : ", maxAmount.toString())
    console.log("mintAmount : ", amount.toString())

    if (amount.toNumber() > maxAmount.toNumber){
      let markNum = maxAmount.div(10**9);
      if (alertRef){
        alertRef.current.showDialog('Warning!', 'Please input the amount correctly. The amount must be smaller than Max(' + markNum.toString() + ')', () => {})
      }
      return
    }

    let ethValue = BigNumber.from(mintTokenPrice + '').mul(tokenMintAmount)
    try {
      setIsProgressingToken(true)
      const res = await mintToken(amount.toString(), ethValue ? ethValue.toString() : undefined, (hash) => {

      });
      await loadingTokenData();
      setIsProgressingToken(false)
    } catch (ex) {
        console.log(ex);
        if (alertRef){
          alertRef.current.showDialog('Error!', ex.error ? ex.error.message : ex.message, () => {})
        }        
        setIsProgressingToken(false)
    }
  }

  const loadingData = async () => {
    await loadingStampData();
    await loadingPassportData();
    await loadingTokenData();
  }

  const loadingAddressData = async () => {
    await stamp_balanceOf();
    await passport_balanceOf();
    await token_balanceOf();
  }

  // useEffect(() => {
  //   console.log("loading data: ");
  //   loadingData();    
  // }, [])

  useEffect(() => {
    console.log("Price data: ");
    if (mintStampPrice){
      let price = BigNumber.from(mintStampPrice + '')
      let nftPrice = utils.formatEther (price)
      setStampPrice(nftPrice)
    }
    
    if (mintPassportPrice){
      let price = BigNumber.from(mintPassportPrice + '')
      let nftPrice = utils.formatEther (price)
      setPassportPrice(nftPrice)
    }

    if(mintTokenPrice){
      let price = BigNumber.from(mintTokenPrice + '')
      let nftPrice = utils.formatEther (price)
      setLocalPrice(nftPrice)
    }
    
  }, [mintStampPrice, mintPassportPrice, mintTokenPrice])

  useEffect(() => {
    console.log("Total Count data: ");
    setStampTotal(mintedStampCount)
    setPassportTotal(mintedPassportCount)
    if(totalSupply){
      let total = BigNumber.from(totalSupply + '')
      let tokenTotal = utils.formatUnits (total, 9)
      setLocalTotal(tokenTotal)
    }
    if (address){
      loadingAddressData();
    }
  }, [mintedStampCount, mintedPassportCount, totalSupply])

  useEffect(() => {
    console.log("Balance data: ");
    if(balanceStamp){
      setStampBalance(balanceStamp)
    }
    if(balancePassport){
      setPassportBalance(balancePassport)
    }
    if(balanceToken){
      setLocalBalance(balanceToken)
    }
  }, [balanceStamp, balancePassport, balanceToken])

  useEffect(() => {
    if (address){
      loadingAddressData();
    }
    
  }, [address])


  return (
    <div className="App">
      <header className="App-header">
        <Button
              fontFamily={'broken-console'}
              bg={'#0000'}
              bordercolor={'black'}
              borderwidth={6}
              wordbreak={'break-word'}
              color="primary"
              onClick={onConect}>
              Connect metamask
        </Button> 
        <div style={{ paddingLeft: 15 }}>
          <Typography variant="subtitle1">Address : {shortAddr}</Typography>
        </div>    
        <div className="App-body">
          <Grid 
                item sm={4} 
                xs={12} >
            <Paper
                elevation={0}
                style={{
                  padding: 10,
                  backgroundColor: '#F4F4F4',
                  borderRadius: 5,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div style={{ paddingLeft: 15 }}>
                    <Typography variant="subtitle1">StampNFT</Typography>
                  </div>
                  <div style={{ padding: 10, width:'100%' }}>
                    { isProgressingStamp? <LinearProgress /> : null}
                  </div>
                  
                  <Button
                          variant="contained"
                          size="medium"
                          color="primary"
                          style={btnStyle}
                          onClick={mintStamp}
                        > Mint </Button>
                  <div>
                    <Typography variant="body1">Mint Price: {stampPrice} ETH</Typography>
                  </div>
                  <div>
                    <Typography variant="body1">Minted Count: {stampTotal}</Typography>
                  </div>
                  <div>
                    <Typography variant="body1">Your Stamp Count: {stampBalance}</Typography>
                  </div>
                </div>
            </Paper>
          </Grid>

          <Grid 
                item sm={4} 
                xs={12} >
            <Paper
                elevation={0}
                style={{
                  padding: 10,
                  backgroundColor: '#F4F4F4',
                  borderRadius: 5,
                  marginLeft: 10,
                  marginRight: 10,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div style={{ paddingLeft: 15 }}>
                    <Typography variant="subtitle1">PassportNFT</Typography>
                  </div>
                  <div style={{ padding: 10, width:'100%' }}>
                    { isProgressingPassport? <LinearProgress /> : null}
                  </div>
                  
                  <Button
                          variant="contained"
                          size="medium"
                          color="primary"
                          onClick={mintPassport}
                          style={btnStyle}> Mint </Button>
                  <div>
                    <Typography variant="body1">Mint Price: {passportPrice} ETH</Typography>
                  </div>
                  <div>
                    <Typography variant="body1">Minted Count: {passportTotal}</Typography>
                  </div>
                  <div>
                    <Typography variant="body1">Your Passport Count: {passportBalance}</Typography>
                  </div>
                </div>
            </Paper>
          </Grid>

          <Grid 
                item sm={4} 
                xs={12} >
            <Paper
                elevation={0}
                style={{
                  padding: 10,
                  backgroundColor: '#F4F4F4',
                  borderRadius: 5,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div style={{ paddingLeft: 15 }}>
                    <Typography variant="subtitle1">Local Token</Typography>
                  </div>
                  <div style={{ padding: 10, width:'100%' }}>
                   { isProgressingToken? <LinearProgress variant="indeterminate"/> : null}
                  </div>                 
                  
                  <Button
                          variant="contained"
                          size="medium"
                          color="primary"
                          style={btnStyle}
                          onClick={mintLocalToken}
                        > Mint </Button>
                  <FormControl style={{ width: '70%' }}>
                    <InputLabel htmlFor="filled-basic">Mint Amount</InputLabel>
                    <Input
                      id="filled-basic"
                      type={'number'}
                      value={tokenMintAmount}
                      variant="filled"
                      onChange={e => {
                        const { value } = e.target;
                        if (value){
                          const parsedInt = parseInt(value);
                          if (parsedInt) {
                            setTokenMintAmount(parsedInt);
                          }
                        } else {
                          setTokenMintAmount(0);
                        }
                      }}
                    />
                  </FormControl>
                  <div style={{ marginTop: 10 }}>
                    <Typography variant="body1">Mint Price: {localPrice} ETH</Typography>
                  </div>
                  <div>
                    <Typography variant="body1">Total Supply: {localTotal}</Typography>
                  </div>
                  <div>
                    <Typography variant="body1">Balance: {localBalance}</Typography>
                  </div>
              </div>
            </Paper>
          </Grid>    
        </div>
            
      </header>
      <AlertDialog ref={alertRef} okTitle={'done'} />
    </div>
  );
}

export default App;
