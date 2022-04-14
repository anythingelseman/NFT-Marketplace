import { Route, Routes } from "react-router-dom";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import WalletPage from "./pages/WalletPage";
import Header from "./components/Header";
import ChainsPage from "./pages/ChainsPage";
import toast, { Toaster } from "react-hot-toast";

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
      (chain) => chain.chainId === parseInt(window.ethereum.chainId, 16)
    );
    setChainName(chain.name);
    setCurrency(chain.nativeCurrency.symbol);
  };

  const connectWalletHandler = () => {
    window.ethereum
      .request({ method: "eth_requestAccounts" })
      .then((result) => {
        accountChangedHandler(result[0]);
        getAccountBalance(result[0]);
        setChainId(parseInt(window.ethereum.chainId, 16));
        getCurrencyAndChainName();
      })
      .catch((err) => toast.error(err.message));
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
        console.log(userBalance);
      });
  };

  const chainChangedHandler = () => {
    getAccountBalance(defaultAccount.toString());
    setChainId(parseInt(window.ethereum.chainId, 16));
    getCurrencyAndChainName();
  };

  if (window.ethereum && window.ethereum.isMetaMask)
    window.ethereum.on("accountsChanged", accountChangedHandler);

  if (window.ethereum && window.ethereum.isMetaMask)
    window.ethereum.on("chainChanged", chainChangedHandler);

  return (
    <div className="h-screen bg-gradient-to-br from-purple-800 to-purple-600 w-full ">
      <Routes>
        <Route path="/" element={<Header defaultAccount={defaultAccount} />}>
          <Route
            index
            element={
              <WalletPage
                defaultAccount={defaultAccount}
                userBalance={userBalance}
                connectWalletHandler={connectWalletHandler}
                chainId={chainId}
                currency={currency}
                chainName={chainName}
                setUserBalance={setUserBalance}
              />
            }
          />
          <Route
            path="networks"
            element={
              defaultAccount ? (
                <ChainsPage chains={chains} />
              ) : (
                <WalletPage
                  defaultAccount={defaultAccount}
                  userBalance={userBalance}
                  connectWalletHandler={connectWalletHandler}
                  chainId={chainId}
                  currency={currency}
                  chainName={chainName}
                />
              )
            }
          />
        </Route>
      </Routes>
      <Toaster position="bottom-left" />
    </div>
  );
}

export default App;
