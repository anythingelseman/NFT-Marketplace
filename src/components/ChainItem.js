import toast from "react-hot-toast";

const ChainItem = (props) => {
  const { chainId, name, nativeCurrency, rpcUrls, infoURL } = props;
  const changeNetwork = async () => {
    try {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: `0x${chainId.toString(16)}`,
            chainName: name,
            nativeCurrency,
            rpcUrls,
          },
        ],
      });
    } catch (err) {
      toast.error(err.message);
    }
  };
  return (
    <div className="h-60 w-60 bg-purple-900 rounded-xl m-2 p-2 flex flex-col justify-center">
      <a
        target="_blank"
        rel="noopener noreferrer"
        href={infoURL}
        className="text-center text-2xl font-bold text-orange-500 mb-5 hover:text-orange-700"
      >
        {name}
      </a>

      <div className="flex justify-between">
        <div>
          <p className="font-bold">ChainID</p>
          <p>{chainId}</p>
        </div>
        <div>
          <p className="font-bold">Currency</p>
          <p>{nativeCurrency.symbol}</p>
        </div>
      </div>

      <div className="flex justify-center">
        <button
          onClick={changeNetwork}
          className="bg-orange-500 p-2 mt-3 text-white rounded-lg text-xl hover:bg-orange-600"
        >
          Add chain
        </button>
      </div>
    </div>
  );
};

export default ChainItem;
