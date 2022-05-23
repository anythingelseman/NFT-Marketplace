import { useEffect, useState } from "react";
import { ethers } from "ethers";
import axios from "axios";
import NFTMarketplace from "../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";

const marketplaceAddress = "0x7772D1A7aaE5D53679C61Ad8C1353b2CCfA100bA";

const ResellPage = (props) => {
  const [formInput, updateFormInput] = useState({ price: "", image: "" });
  const navigate = useNavigate();
  let [searchParams, setSearchParams] = useSearchParams();
  const id = searchParams.get("id");
  const tokenURI = searchParams.get("tokenURI");
  const { image, price } = formInput;

  useEffect(() => {
    fetchNFT();
  }, [id]);

  async function fetchNFT() {
    try {
      if (!tokenURI) return;
      const meta = await axios.get(tokenURI);
      updateFormInput((state) => ({ ...state, image: meta.data.image }));
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function listNFTForSale() {
    try {
      if (!price) throw Error("Please give the price");
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      const priceFormatted = ethers.utils.parseUnits(formInput.price, "ether");
      let contract = new ethers.Contract(
        marketplaceAddress,
        NFTMarketplace.abi,
        signer
      );
      let listingPrice = await contract.getListingPrice();

      listingPrice = listingPrice.toString();
      let transaction = await contract.resellToken(id, priceFormatted, {
        value: listingPrice,
      });
      await transaction.wait();
      navigate("/");
    } catch (err) {
      toast.error(err.message);
    }
  }

  if (props.chainId != "80001")
    return (
      <h1 className="text-orange-500 text-3xl text-center">
        Please change your network to Mumbai Testnet.
      </h1>
    );

  return (
    <div className="flex justify-center bg-gradient-to-br from-purple-800 to-purple-600 w-full">
      <div className="w-1/2 flex flex-col pb-12">
        <input
          placeholder="Asset Price in MATIC"
          className="mt-2 border rounded p-4"
          onChange={(e) =>
            updateFormInput({ ...formInput, price: e.target.value })
          }
        />
        {image && (
          <img
            className="rounded mt-4 mx-auto"
            width="350"
            src={image}
            alt="beautiful img"
          />
        )}
        <button
          onClick={listNFTForSale}
          className="bg-orange-500 p-2 mt-8 text-white rounded-lg text-xl hover:bg-orange-600 w-full"
        >
          List NFT
        </button>
      </div>
    </div>
  );
};

export default ResellPage;
