import { ethers } from "ethers";
import { useEffect, useState } from "react";
import axios from "axios";
import NFTMarketplace from "../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json";
import toast from "react-hot-toast";

const marketplaceAddress = "0x7772D1A7aaE5D53679C61Ad8C1353b2CCfA100bA";

const DashboardPage = (props) => {
  const [nfts, setNfts] = useState([]);
  const [loadingState, setLoadingState] = useState("not-loaded");
  useEffect(() => {
    loadNFTs();
  }, []);
  async function loadNFTs() {
    if (props.chainId !== 80001) return;
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      const contract = new ethers.Contract(
        marketplaceAddress,
        NFTMarketplace.abi,
        signer
      );
      const data = await contract.fetchItemsListed();

      const items = await Promise.all(
        data.map(async (i) => {
          const tokenUri = await contract.tokenURI(i.tokenId);
          const meta = await axios.get(tokenUri);
          let price = ethers.utils.formatUnits(i.price.toString(), "ether");
          let item = {
            price,
            tokenId: i.tokenId.toNumber(),
            seller: i.seller,
            owner: i.owner,
            image: meta.data.image,
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

  if (loadingState === "loaded" && !nfts.length)
    return (
      <h1 className="py-10 px-20 text-3xl text-orange-500">No NFTs listed</h1>
    );

  if (props.chainId !== 80001)
    return (
      <h1 className="text-orange-500 text-3xl text-center">
        Please change your network to Mumbai Testnet.
      </h1>
    );

  return (
    <div>
      <div className="p-4 bg-gradient-to-br from-purple-800 to-purple-600 w-full">
        <h2 className="text-2xl py-2 text-orange-500">Items Listed</h2>
        <div className="flex flex-wrap justify-around m-4 gap-x-3">
          {nfts.map((nft, i) => (
            <div
              key={i}
              className="border shadow rounded-xl overflow-hidden w-[300px] h-[300px] mb-4"
            >
              <img
                src={nft.image}
                alt={nft.description}
                className="rounded w-[300px] h-[200px] object-contain bg-white"
              />
              <div className="p-4 bg-purple-900">
                <p className="text-2xl font-bold text-white">
                  Price - {nft.price} MATIC
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
