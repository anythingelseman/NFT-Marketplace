import { ethers } from "ethers";
import { useRef } from "react";
import toast from "react-hot-toast";

const TransitionForm = (props) => {
  const amountInputRef = useRef();
  const addrInputRef = useRef();

  const startPayment = async ({ ether, addr }) => {
    try {
      if (ether > props.userBalance)
        throw Error("You don't have enough balance in your wallet");
      await window.ethereum.send("eth_requestAccounts");
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      ethers.utils.getAddress(addr);
      await signer
        .sendTransaction({
          to: addr,
          value: ethers.utils.parseEther(ether),
        })
        .then((tx) => {
          console.log(props.userBalance);
          console.log(ethers.utils.formatEther(tx.value._hex));
          console.log(
            ethers.utils.formatEther(tx.gasLimit._hex) * Math.pow(10, 10)
          );

          props.setUserBalance(
            props.userBalance -
              ethers.utils.formatEther(tx.value._hex) -
              ethers.utils.formatEther(tx.gasLimit._hex) * Math.pow(10, 10)
          );
        });
      amountInputRef.current.value = "";
      addrInputRef.current.value = "";
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);

    await startPayment({
      ether: data.get("ether"),
      addr: data.get("addr"),
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mt-14 mx-auto bg-purple-900 w-fit p-5 rounded-md">
        <h1 className="text-center text-2xl font-bold text-orange-500 mb-5">
          Transaction Form
        </h1>
        <div>
          <input
            type="text"
            name="addr"
            placeholder="Recipient Address"
            className="w-96 mb-5 rounded-lg p-4"
            ref={addrInputRef}
          />

          <br />

          <input
            name="ether"
            type="text"
            placeholder="Amount"
            className="w-96 rounded-lg p-4 mb-5"
            ref={amountInputRef}
          />
        </div>
        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-orange-500 p-2 mt-3 text-white rounded-lg text-xl hover:bg-orange-600 "
          >
            Pay now
          </button>
        </div>
      </div>
    </form>
  );
};

export default TransitionForm;
