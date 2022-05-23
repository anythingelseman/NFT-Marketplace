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
      key={chain.chainId}
      name={chain.name}
      chainId={chain.chainId}
      nativeCurrency={chain.nativeCurrency}
      rpcUrls={chain.rpc}
      infoURL={chain.infoURL}
    ></ChainItem>
  ));

  return (
    <div className=" bg-gradient-to-br from-purple-800 to-purple-600 w-full text-white">
      <div className="flex mx-auto w-[400px] rounded-md bg-white">
        <div className="text-black bg-white rounded-md p-2 font-bold text-md">
          Search Networks
        </div>
        <input
          placeholder="ETH, Fantom, ..."
          type="text"
          ref={inputRef}
          onChange={searchHandler}
          className="p-2 text-black outline-none grow rounded-md"
        />
      </div>
      <div className="flex flex-wrap justify-around m-4 gap-x-3">
        {chainLists}
      </div>
    </div>
  );
};

export default ChainsPage;
