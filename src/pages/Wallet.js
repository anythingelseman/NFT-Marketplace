import TransitionForm from "../components/TransitionForm";

const Wallet = (props) => {
  if (!props.defaultAccount) {
    return (
      <div>
        <h1> Connect now</h1>
        <button onClick={props.connectWalletHandler}>
          Connect your wallet now
        </button>
      </div>
    );
  }

  return (
    <>
      <div>
        <div>
          <h3>Address: {props.defaultAccount}</h3>
        </div>
        <div>
          <h3>Balance: {props.userBalance}</h3>
        </div>
        <h1>Chain ID: {parseInt(window.ethereum.chainId, 16)}</h1>
      </div>
      <TransitionForm />
    </>
  );
};

export default Wallet;
