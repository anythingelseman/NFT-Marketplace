import { useEffect, useState, useRef } from "react";
import ChainItem from "../components/ChainItem";

const ChainsPage = () => {
  const [chains, setChains] = useState([]);
  const [searchedChains, setSearchedChains] = useState([]);
  const inputRef = useRef();

  useEffect(() => {
    const fetchChains = async () => {
      const response = await fetch("https://chainid.network/chains.json");
      const responseData = await response.json();
      setChains(responseData);
      setSearchedChains(responseData);
    };
    fetchChains();
  }, []);

  const searchHandler = () => {
    const a = chains.filter((chain) =>
      chain.name.toLowerCase().includes(inputRef.current.value.toLowerCase())
    );
    setSearchedChains(a);
  };

  const chainLists = searchedChains.map((chain) => (
    <ChainItem
      name={chain.name}
      chainId={chain.chainId}
      nativeCurrency={chain.nativeCurrency}
      rpcUrls={chain.rpc}
    ></ChainItem>
  ));

  return (
    <div>
      <input type="text" ref={inputRef} onChange={searchHandler} />
      <ul>
        <li>{chainLists}</li>
      </ul>
    </div>
  );
};

export default ChainsPage;
