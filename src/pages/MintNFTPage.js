import { useState } from "react";
import { ethers } from "ethers";
import { create as ipfsHttpClient } from "ipfs-http-client";
import NFTMarketplace from "../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
const client = ipfsHttpClient("https://ipfs.infura.io:5001/api/v0");

const marketplaceAddress = "0x358d95F5EAb6Ea0D89bfadF62889c7eF542d6c41";

const MintNFTPage = (props) => {
  const navigate = useNavigate();
  const [fileUrl, setFileUrl] = useState(null);
  const [formInput, updateFormInput] = useState({
    price: "",
    name: "",
    description: "",
  });

  async function onChange(e) {
    const file = e.target.files[0];
    try {
      const added = await client.add(file, {
        progress: (prog) => console.log(`received: ${prog}`),
      });
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      setFileUrl(url);
    } catch (err) {
      toast.error(err.message);
    }
  }
  async function uploadToIPFS() {
    try {
      const { name, description, price } = formInput;
      if (!name || !description || !price || !fileUrl)
        throw Error("Please fill out the form completely");

      const data = JSON.stringify({
        name,
        description,
        image: fileUrl,
      });

      const added = await client.add(data);
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;

      return url;
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function listNFTForSale() {
    try {
      const url = await uploadToIPFS();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      /* next, create the item */
      const price = ethers.utils.parseUnits(formInput.price, "ether");
      let contract = new ethers.Contract(
        marketplaceAddress,
        NFTMarketplace.abi,
        signer
      );
      let listingPrice = await contract.getListingPrice();
      listingPrice = listingPrice.toString();
      let transaction = await contract.createToken(url, price, {
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
    <div className="flex justify-center bg-gradient-to-br from-purple-800 to-purple-600">
      <div className="w-1/2 flex flex-col pb-12 bg-purple-900 px-4 rounded-lg mb-5">
        <input
          placeholder="Asset Name"
          className="mt-8 border rounded p-4"
          onChange={(e) =>
            updateFormInput({ ...formInput, name: e.target.value })
          }
        />
        <textarea
          placeholder="Asset Description"
          className="mt-2 border rounded p-4"
          onChange={(e) =>
            updateFormInput({ ...formInput, description: e.target.value })
          }
        />
        <input
          placeholder="Asset Price in MATIC"
          className="mt-2 border rounded p-4"
          onChange={(e) =>
            updateFormInput({ ...formInput, price: e.target.value })
          }
        />
        <input type="file" name="Asset" className="my-4" onChange={onChange} />
        {fileUrl && (
          <img
            className="rounded mt-4"
            width="350"
            src={fileUrl}
            alt="Insert pic"
          />
        )}
        <button
          onClick={listNFTForSale}
          className="bg-orange-500 p-2 mt-3 text-white rounded-lg text-xl hover:bg-orange-600 w-full"
        >
          Create NFT
        </button>
      </div>
    </div>
  );
};

export default MintNFTPage;
