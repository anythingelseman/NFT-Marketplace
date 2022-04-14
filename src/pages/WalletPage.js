import TransitionForm from "../components/TransitionForm";

const WalletPage = (props) => {
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
          Add a wallet
        </button>
      </div>
    );
  }

  return (
    <div className=" bg-gradient-to-br from-purple-800 to-purple-600 w-full ">
      <div className="flex flex-col items-center text-white lg:flex-row lg:justify-around">
        <div className="w-fit h-48 bg-purple-900 p-6 rounded-xl">
          <h1 className="text-center text-2xl font-bold text-orange-500">
            Wallet overview
          </h1>
          <div className="flex flex-col justify-evenly h-full">
            <div className="flex justify-between">
              <p className="mr-5">Address: </p>
              <p>{props.defaultAccount}</p>
            </div>
            <div className="flex justify-between">
              <p>Balance: </p>
              <p>
                {props.userBalance} {props.currency}
              </p>
            </div>
          </div>
        </div>

        <div className="w-fit h-48 bg-purple-900 p-6 rounded-xl mt-5 lg:mt-0">
          <h1 className="text-center text-2xl font-bold text-orange-500">
            Current chain
          </h1>
          <div className="flex flex-col justify-evenly h-full">
            <div className="flex justify-between">
              <p className="mr-5">Chain name: </p>
              <p>{props.chainName}</p>
            </div>
            <div className="flex justify-between">
              <p>Chain Id: </p>
              <p>{props.chainId}</p>
            </div>
            <div className="flex justify-between">
              <p>Currency: </p>
              <p>{props.currency}</p>
            </div>
          </div>
        </div>
      </div>

      <TransitionForm />
    </div>
  );
};

export default WalletPage;
