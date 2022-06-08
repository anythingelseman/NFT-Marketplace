import { Route, Routes } from "react-router-dom";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import WalletPage from "./pages/WalletPage";
import Header from "./components/Header";
import ChainsPage from "./pages/ChainsPage";
import MintNFTPage from "./pages/MintNFTPage";
import MarketplacePage from "./pages/MarketplacePage";
import toast, { Toaster } from "react-hot-toast";
import DashboardPage from "./pages/DashboardPage";
import MyNFTPage from "./pages/MyNFTPage";
import ResellPage from "./pages/ResellPage";

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

  const marketplacePage = (
    <MarketplacePage
      defaultAccount={defaultAccount}
      connectWalletHandler={connectWalletHandler}
      chainId={chainId}
      userBalance={userBalance}
    />
  );

  return (
    <div className=" h-screen bg-gradient-to-br from-purple-800 to-purple-600 w-full ">
      <Routes>
        <Route path="/" element={<Header defaultAccount={defaultAccount} />}>
          <Route index element={marketplacePage} />
          <Route
            path="dashboard"
            element={
              defaultAccount ? (
                <DashboardPage chainId={chainId} />
              ) : (
                marketplacePage
              )
            }
          />
          <Route
            path="my-nft"
            element={
              defaultAccount ? <MyNFTPage chainId={chainId} /> : marketplacePage
            }
          />
          <Route
            path="mint-nft"
            element={
              defaultAccount ? (
                <MintNFTPage chainId={chainId} />
              ) : (
                marketplacePage
              )
            }
          />
          <Route
            path="resell-nft"
            element={
              defaultAccount ? (
                <ResellPage chainId={chainId} />
              ) : (
                marketplacePage
              )
            }
          />
          <Route
            path="wallet"
            element={
              defaultAccount ? (
                <WalletPage
                  defaultAccount={defaultAccount}
                  userBalance={userBalance}
                  chainId={chainId}
                  currency={currency}
                  chainName={chainName}
                  getAccountBalance={getAccountBalance}
                />
              ) : (
                marketplacePage
              )
            }
          />
          <Route
            path="networks"
            element={
              defaultAccount ? <ChainsPage chains={chains} /> : marketplacePage
            }
          />
        </Route>
      </Routes>
      <Toaster position="bottom-left" />
    </div>
  );
}

export default App;
