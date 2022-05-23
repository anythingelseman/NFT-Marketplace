import { ethers } from "ethers";
import { useEffect, useState } from "react";
import axios from "axios";
import NFTMarketplace from "../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json";
import toast from "react-hot-toast";

const marketplaceAddress = "0x7772D1A7aaE5D53679C61Ad8C1353b2CCfA100bA";

const MarketplacePage = (props) => {
  const [nfts, setNfts] = useState([]);
  const [loadingState, setLoadingState] = useState("not-loaded");
  useEffect(() => {
    loadNFTs();
  }, []);
  async function loadNFTs() {
    try {
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
      setLoadingState("loaded");
    } catch (err) {
      toast.error(err.message);
    }
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

      /* user will be prompted to pay the asking proces to complete the transaction */
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

  if (props.chainId != "80001")
    return (
      <h1 className="text-orange-500 text-3xl text-center">
        Please change your network to Mumbai Testnet.
      </h1>
    );

  if (loadingState === "loaded" && !nfts.length)
    return (
      <h1 className="px-20 py-10 text-3xl text-orange-500">
        No items in marketplace
      </h1>
    );
  return (
    <div className="bg-gradient-to-br from-purple-800 to-purple-600 w-full">
      <div className="flex flex-wrap justify-around m-4 gap-x-3">
        {nfts.map((nft, i) => (
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
              <p className="text-2xl font-semibold text-orange-500">
                {nft.name}
              </p>
              <div>
                <p className="text-white overflow-hidden">{nft.description}</p>
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
