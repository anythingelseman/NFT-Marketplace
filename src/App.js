import { Route, Routes } from "react-router-dom";
import { useState } from "react";
import { ethers } from "ethers";
import Wallet from "./pages/Wallet";
import Header from "./components/Header";
import ChainsPage from "./pages/ChainsPage";

function App() {
  const [defaultAccount, setDefaultAccount] = useState(null);
  const [userBalance, setUserBalance] = useState(null);

  const connectWalletHandler = () => {
    if (window.ethereum && window.ethereum.isMetaMask) {
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((result) => {
          accountChangedHandler(result[0]);
          getAccountBalance(result[0]);
        });
    } else {
    }
  };

  const accountChangedHandler = (newAccount) => {
    setDefaultAccount(newAccount);
    getAccountBalance(newAccount.toString());
  };

  const getAccountBalance = (account) => {
    window.ethereum
      .request({ method: "eth_getBalance", params: [account, "latest"] })
      .then((balance) => {
        setUserBalance(ethers.utils.formatEther(balance));
      });
  };

  const chainChangedHandler = () => {
    getAccountBalance(defaultAccount.toString());
  };

  window.ethereum.on("accountsChanged", accountChangedHandler);

  window.ethereum.on("chainChanged", chainChangedHandler);

  return (
    <Routes>
      <Route path="/" element={<Header defaultAccount={defaultAccount} />}>
        <Route
          index
          element={
            <Wallet
              defaultAccount={defaultAccount}
              userBalance={userBalance}
              connectWalletHandler={connectWalletHandler}
            />
          }
        />
        <Route path="networks" element={<ChainsPage />} />
      </Route>
    </Routes>
  );
}

export default App;
