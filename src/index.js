import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from "react-router-dom";
import { UseWalletProvider } from 'use-wallet';
import './index.css';

import reportWebVitals from './reportWebVitals';

import { CustomWalletProvider } from './context/CustomWalletContext';
import { StampContractProvider } from './context/StampContext';
import { PassportContractProvider } from './context/PassportContext';
import { TokenContractProvider } from './context/LocalContext';

import App from './App';

// const root = ReactDOM.createRoot(document.getElementById('root'));
ReactDOM.render(
  <React.StrictMode>
    <UseWalletProvider chainId={4} connectors={{}}>
      <CustomWalletProvider>
        <TokenContractProvider>
          <PassportContractProvider>
            <StampContractProvider>
              <BrowserRouter>
                <App />
              </BrowserRouter>
            </StampContractProvider>            
          </PassportContractProvider>
        </TokenContractProvider>
      </CustomWalletProvider>
    </UseWalletProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
