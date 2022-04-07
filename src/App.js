import { Route, Routes } from "react-router-dom";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import Wallet from "./pages/Wallet";
import Header from "./components/Header";
import ChainsPage from "./pages/ChainsPage";

function App() {
  const [defaultAccount, setDefaultAccount] = useState(null);
  const [userBalance, setUserBalance] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [chains, setChains] = useState([]);
  const [chainName, setChainName] = useState(null);
  const [currency, setCurrency] = useState(null);

  useEffect(() => {
    const fetchChains = async () => {
      const response = await fetch("https://chainid.network/chains.json");
      const responseData = await response.json();
      setChains(responseData);
    };
    fetchChains();
  }, []);

  const getCurrencyAndChainName = () => {
    const chain = chains.find(
      (chain) => chain.chainId == parseInt(window.ethereum.chainId, 16)
    );
    setChainName(chain.name);
    setCurrency(chain.nativeCurrency.symbol);
  };

  const connectWalletHandler = () => {
    if (window.ethereum && window.ethereum.isMetaMask) {
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((result) => {
          accountChangedHandler(result[0]);
          getAccountBalance(result[0]);
          setChainId(parseInt(window.ethereum.chainId, 16));
          getCurrencyAndChainName();
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
    setChainId(parseInt(window.ethereum.chainId, 16));
    getCurrencyAndChainName();
  };

  window.ethereum.on("accountsChanged", accountChangedHandler);

  window.ethereum.on("chainChanged", chainChangedHandler);

  return (
    <div className="h-screen bg-gradient-to-br from-purple-800 to-purple-600 w-full ">
      <Routes>
        <Route path="/" element={<Header defaultAccount={defaultAccount} />}>
          <Route
            index
            element={
              <Wallet
                defaultAccount={defaultAccount}
                userBalance={userBalance}
                connectWalletHandler={connectWalletHandler}
                chainId={chainId}
                currency={currency}
                chainName={chainName}
              />
            }
          />
          <Route path="networks" element={<ChainsPage chains={chains} />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
