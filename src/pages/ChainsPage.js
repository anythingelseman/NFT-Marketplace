import { useState, useRef } from "react";
import ChainItem from "../components/ChainItem";

const ChainsPage = (props) => {
  const [searchedChains, setSearchedChains] = useState(props.chains);
  const inputRef = useRef();

  const searchHandler = () => {
    const a = props.chains.filter((chain) =>
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
    <div className=" bg-gradient-to-br from-purple-800 to-purple-600 w-full ">
      <input type="text" ref={inputRef} onChange={searchHandler} />
      <ul>
        <li>{chainLists}</li>
      </ul>
    </div>
  );
};

export default ChainsPage;
