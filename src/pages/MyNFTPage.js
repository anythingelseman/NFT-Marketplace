import { ethers } from "ethers";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import NFTMarketplace from "../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json";
import toast from "react-hot-toast";
const marketplaceAddress = "0x7772D1A7aaE5D53679C61Ad8C1353b2CCfA100bA";

const MyNFTPage = (props) => {
  const navigate = useNavigate();
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

      const marketplaceContract = new ethers.Contract(
        marketplaceAddress,
        NFTMarketplace.abi,
        signer
      );
      const data = await marketplaceContract.fetchMyNFTs();

      const items = await Promise.all(
        data.map(async (i) => {
          const tokenURI = await marketplaceContract.tokenURI(i.tokenId);
          const meta = await axios.get(tokenURI);
          let price = ethers.utils.formatUnits(i.price.toString(), "ether");
          let item = {
            price,
            tokenId: i.tokenId.toNumber(),
            seller: i.seller,
            owner: i.owner,
            image: meta.data.image,
            tokenURI,
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
  function listNFT(nft) {
    console.log("nft:", nft);
    navigate(`/resell-nft?id=${nft.tokenId}&tokenURI=${nft.tokenURI}`);
  }

  if (props.chainId !== 80001)
    return (
      <h1 className="text-orange-500 text-3xl text-center">
        Please change your network to Mumbai Testnet.
      </h1>
    );

  if (loadingState === "loaded" && !nfts.length)
    return (
      <h1 className="py-10 px-20 text-3xl text-orange-500">No NFTs owned</h1>
    );
  return (
    <div className="bg-gradient-to-br from-purple-800 to-purple-600 w-full">
      <div className="p-4">
        <div className="flex flex-wrap justify-around m-4 gap-x-3">
          {nfts.map((nft, i) => (
            <div
              key={i}
              className="border shadow rounded-xl overflow-hidden w-[300px] h-[350px]"
            >
              <img
                src={nft.image}
                className="w-full rounded h-[200px] object-contain bg-white"
                alt={nft.name}
              />
              <div className="p-2 bg-purple-900 h-[150px]">
                <p className="text-2xl font-bold text-white">
                  Price - {nft.price} MATIC
                </p>
                <button
                  className="bg-orange-500 p-2 mt-8 text-white rounded-lg text-xl hover:bg-orange-600 w-full"
                  onClick={() => listNFT(nft)}
                >
                  List
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyNFTPage;
