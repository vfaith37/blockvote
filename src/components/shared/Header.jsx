import React, { useEffect, useState } from "react";
import { HiOutlineSearch } from "react-icons/hi";
import PROFILE_IMAGE from "../../assets/profile.jpg";
// import { ethers, providers } from "ethers";
// import Web3 from "web3";
// import client from "../../api/client";

export default function Header() {
  // const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);
  // const [isConnected, setIsConnected] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  // const [ethBalance, setEthBalance] = useState("");
  const [userInfo, setUserInfo] = useState("");
  // useEffect to fetch data from local storage when the component mounts
  useEffect(() => {
    // Retrieve data from local storage

    const storedUserData = localStorage.getItem("userInfo");

    if (storedUserData) {
      // If data exists, parse it and update the state
      setUserInfo(JSON.parse(storedUserData));
    }
  }, []); // Empty dependency array ensures this effect runs only once on component mount

  async function connectToMetamask() {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const account = accounts[0];
        setIsConnected(true);
        setAccount(account);
        // console.log("Connected account:", account);
        // if (account !== null) {
        //   const res = await client.post("walletAddress", {})
        //   if (res.status === 200) {
        //     console.log(res.data);
        //     setIsConnected(true);
        //     setAccount(account)
        //   }
        // }
      } catch (error) {
        console.error("Failed to connect to MetaMask:", error);
        setIsConnected(false);
      }
    } else {
      alert("Please install MetaMask!");
    }
    // if (window.ethereum) {
    //   try {
    //     const provider = window.ethereum
    //       ? new ethers.providers.Web3Provider(window.ethereum)
    //       : ethers.getDefaultProvider();

    //     setProvider(provider);

    //     // Ensure the provider is properly initialized
    //     await provider.ready;
    //     console.log(provider);

    //     const signer = provider.getSigner();
    //     console.log(signer);
    //     const address = await signer.getAddress();

    //     setAccount(address);
    //     console.log("Metamask Connected:", address);
    //     setIsConnected(true);
    //     // await checkCanVote();
    //   } catch (err) {
    //     console.error("Error connecting to MetaMask:", err);
    //   }
    // } else {
    //   console.error("MetaMask is not detected in the browser");
    // }
  }

  // const detectCurrentProvider = () => {
  //   let provider;
  //   if (window.ethereum) {
  //     provider = window.ethereum;
  //   } else if (window.web3) {
  //     provider = window.web3.currentProvider;
  //   } else {
  //     alert("Non-ethereum browser detected. You should install Metamask");
  //   }
  //   return provider;
  // };

  // const onConnect = async () => {
  //   try {
  //     const currentProvider = detectCurrentProvider();
  //     console.log(currentProvider);
  //     if (currentProvider) {
  //       await currentProvider.request({ method: "eth_requestAccounts" });
  //       const web3 = new Web3(currentProvider);
  //       const userAccount = await web3.eth.getAccounts();
  //       const account = userAccount[0];
  //       let ethBalance = await web3.eth.getBalance(account);
  //       setEthBalance(ethBalance);
  //       setIsConnected(true);
  //       console.log(userAccount);
  //       console.log(web3.eth);
  //     }
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };
  const onDisconnect = () => {
    setIsConnected(false);
  };

  return (
    <div className="bg-[#060606] border-b border-neutral-800 h-16 px-5 flex justify-between gap-4 text-white items-center">
      <div className="relative border border-neutral-700 rounded-lg focus-within:border-teal-600 transition-colors">
        <HiOutlineSearch
          fontSize={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500"
        />
        <input
          type="text"
          placeholder="Search here"
          className="h-10 focus:outline-none w-[16rem] lg:w-[24rem] bg-transparent text-white text-sm pl-10 pr-4 placeholder:text-neutral-500"
        />
      </div>

      {isConnected ? (
        <div className="flex items-center gap-3 min-w-0">
          <p
            className="hash text-teal-400 truncate max-w-[180px]"
            title={account || ""}
          >
            {account}
          </p>
          <button
            className="flex h-10 px-4 justify-center border border-neutral-700 hover:border-teal-600 text-neutral-300 rounded-lg items-center font-medium text-sm"
            onClick={onDisconnect}
          >
            Disconnect
          </button>
        </div>
      ) : (
        <button
          onClick={() => connectToMetamask()}
          className="gap-2 flex h-10 px-4 justify-center bg-teal-600 hover:bg-teal-500 rounded-lg items-center font-medium text-sm"
        >
          Connect wallet
        </button>
      )}
      <div className="flex gap-3 items-center cursor-pointer">
        <div className="flex flex-col items-end">
          <p className="text-white text-sm font-semibold">{userInfo.name}</p>
          <p className="stamp text-teal-500">admin</p>
        </div>
        <img
          src={PROFILE_IMAGE}
          alt="profile"
          className="w-9 h-9 rounded-full object-cover ring-1 ring-neutral-700"
        />
      </div>
    </div>
  );
}
