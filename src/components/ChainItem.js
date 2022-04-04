const ChainItem = (props) => {
  const { chainId, name, nativeCurrency, rpcUrls } = props;
  const changeNetwork = async () => {
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
  };
  return (
    <div>
      <li>{name}</li>
      <button onClick={changeNetwork}>Add chain</button>
    </div>
  );
};

export default ChainItem;
