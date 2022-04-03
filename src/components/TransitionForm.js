import { ethers } from "ethers";

const TransitionForm = (props) => {
  const startPayment = async ({ ether, addr }) => {
    await window.ethereum.send("eth_requestAccounts");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    ethers.utils.getAddress(addr);
    const tx = await signer.sendTransaction({
      to: addr,
      value: ethers.utils.parseEther(ether),
    });
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
      <div>
        <div>
          <div>
            <input type="text" name="addr" placeholder="Recipient Address" />
          </div>
          <div>
            <input name="ether" type="text" placeholder="Amount in ETH" />
          </div>
        </div>

        <button type="submit">Pay now</button>
      </div>
    </form>
  );
};

export default TransitionForm;
