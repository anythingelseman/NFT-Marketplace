import TransitionForm from "../components/TransitionForm";

const WalletPage = (props) => {
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

      <TransitionForm
        userBalance={props.userBalance}
        defaultAccount={props.defaultAccount}
        setUserBalance={props.setUserBalance}
      />
    </div>
  );
};

export default WalletPage;
