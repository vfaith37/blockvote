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
    <div className="bg-[#060606] h-16 px-4 flex justify-between text-white items-center">
      <div className="relative border border-gray-400  rounded-lg ">
        <HiOutlineSearch
          fontSize={20}
          className="absolute left-3 top-1/2 -translate-y-1/2"
        />
        <input
          type="text"
          placeholder="Search here"
          className="h-10 active:outline-none focus:outline-none gap-2.5 w-[24rem] bg-transparent  text-white text-sm pl-11 pr-4"
        />
      </div>

      {isConnected ? (
        <>
          <button
            className="flex w-28 h-10 justify-center bg-teal-600 rounded items-center font-medium text-base"
            onClick={onDisconnect}
          >
            Disconnect
          </button>
          {account !== null && <p className="text-white left-[650px] top-14">Wallet Address: {account}</p>}
        </>
      ) : (
        <>
          <button
            onClick={() => connectToMetamask()}
            className="gap-2 flex w-28 h-10 justify-center bg-teal-600 rounded items-center font-medium text-base"
          >
            connect
          </button>
        </>
      )}
      <div className="flex gap-4 items-center cursor-pointer">
        <div className="flex flex-col">
          <p className="text-white text-lg font-normal">{userInfo.name}</p>
          <p className="text-teal-600 text-base font-semibold self-end">
            Admin
          </p>
        </div>
        <img
          src={PROFILE_IMAGE}
          alt="profile"
          className="w-10 h-10 rounded-full object-cover"
        />
      </div>
    </div>
  );
}
