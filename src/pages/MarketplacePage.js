import { ethers } from "ethers";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import NFTMarketplace from "../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json";
import toast from "react-hot-toast";

const marketplaceAddress = "0xf6b66dc94404C127386fA3B4D9cb3430263Ea3F7";

const MarketplacePage = (props) => {
  const [nfts, setNfts] = useState([]);
  const [loadingState, setLoadingState] = useState(true);
  const [searchedNFT, setSearchedNFT] = useState(null);
  const inputRef = useRef();

  const searchHandler = () => {
    const a = nfts.filter((nft) =>
      nft.name.toLowerCase().includes(inputRef.current.value.toLowerCase())
    );
    setSearchedNFT(a);
  };

  useEffect(() => {
    loadNFTs();
  }, []);
  async function loadNFTs() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const marketplaceContract = new ethers.Contract(
      marketplaceAddress,
      NFTMarketplace.abi,
      signer
    );

    const data = await marketplaceContract.fetchMarketItems();

    const items = await Promise.all(
      data.map(async (i) => {
        const tokenUri = await marketplaceContract.tokenURI(i.tokenId);
        const meta = await axios.get(tokenUri);
        let price = ethers.utils.formatUnits(i.price.toString(), "ether");
        let item = {
          price,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          image: meta.data.image,
          name: meta.data.name,
          description: meta.data.description,
        };
        return item;
      })
    );
    setNfts(items);
    setSearchedNFT(items);
    setLoadingState(false);
  }
  async function buyNft(nft) {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        marketplaceAddress,
        NFTMarketplace.abi,
        signer
      );
      if (props.userBalance < nft.price)
        throw Error("You don't have enough balance in your wallet");
      const price = ethers.utils.parseUnits(nft.price.toString(), "ether");

      const transaction = await contract.createMarketSale(nft.tokenId, {
        value: price,
      });
      await transaction.wait();
      loadNFTs();
    } catch (err) {
      toast.error(err.message);
    }
  }

  if (!(window.ethereum && window.ethereum.isMetaMask))
    return (
      <div className="h-screen flex justify-center items-center">
        <h1 className="text-orange-500 text-3xl">
          Please install metamask first to use this website.
        </h1>
      </div>
    );

  if (!props.defaultAccount) {
    return (
      <div className="h-screen flex justify-center items-center flex-col">
        <h1 className="text-white text-3xl">
          Looks like you haven't connected your wallet yet.
        </h1>

        <button
          onClick={props.connectWalletHandler}
          className="bg-orange-500 p-2 mt-3 text-white rounded-lg text-xl hover:bg-orange-600"
        >
          Connect wallet
        </button>
      </div>
    );
  }

  if (props.chainId !== 80001)
    return (
      <h1 className="text-orange-500 text-3xl text-center">
        Please change your network to Mumbai Testnet.
      </h1>
    );

  if (loadingState)
    return (
      <div className="h-screen flex justify-center items-center">
        <h1 className="text-orange-500 text-3xl">Fetching...</h1>
      </div>
    );

  if (loadingState === false && !nfts.length)
    return (
      <h1 className="px-20 py-10 text-3xl text-orange-500">
        No items in marketplace
      </h1>
    );
  return (
    <div className="bg-gradient-to-br from-purple-800 to-purple-600 w-full">
      <div className="flex mx-auto w-[400px] rounded-md bg-white">
        <div className="text-black bg-white rounded-md p-2 font-bold text-md">
          Search NFTs
        </div>
        <input
          type="text"
          ref={inputRef}
          onChange={searchHandler}
          className="p-2 text-black outline-none grow rounded-md"
        />
      </div>
      <div className="flex flex-wrap justify-around m-4 gap-x-3">
        {searchedNFT.map((nft, i) => (
          <div
            key={i}
            className="border shadow rounded-xl overflow-hidden bg-purple-900 w-[300px] h-[450px] mb-4"
          >
            <img
              className="w-full h-[200px] object-contain bg-white"
              src={nft.image}
              alt={nft.name}
            />
            <div className="p-4 h-[130px]">
              <p className="text-2xl font-semibold text-orange-500 h-[30px]">
                {nft.name}
              </p>
              <div className="h-[100px] text-white overflow-y-auto scrollbar-hide">
                {nft.description}
              </div>
            </div>
            <div className="p-4 ">
              <p className="text-2xl font-bold text-orange-500">
                {nft.price} MATIC
              </p>
              <button
                className="bg-orange-500 p-2 mt-3 text-white rounded-lg text-xl hover:bg-orange-600 w-full"
                onClick={() => buyNft(nft)}
              >
                Buy
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarketplacePage;
