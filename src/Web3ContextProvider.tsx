import React, { createContext, useContext, useEffect, useState } from "react";
import { Web3Auth } from "@web3auth/modal";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import { chainConfig, clientId } from "./web3AuthConfig";

const Web3Context = createContext<any>(null);

export const Web3ContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [web3auth, setWeb3auth] = useState<Web3Auth | null>(null);
  const [provider, setProvider] = useState<any>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {        const web3authInstance = new Web3Auth({
          clientId,
          web3AuthNetwork: "testnet",
          uiConfig: {
            defaultLanguage: "en"
          }
        });

        await web3authInstance.init();

        setWeb3auth(web3authInstance);

        if (web3authInstance.provider) {
          setProvider(web3authInstance.provider);
          const userInfo = await web3authInstance.getUserInfo();
          setAddress(userInfo.email || userInfo.name || "Unknown User");
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.error("Web3Auth init failed", err);
      }
    };
    init();
  }, []);

  const login = async () => {
    if (!web3auth) return;
    const connectedProvider = await web3auth.connect();
    setProvider(connectedProvider);
    const userInfo = await web3auth.getUserInfo();
    setAddress(userInfo.email || userInfo.name || "Unknown User");
    setIsAuthenticated(true);
  };

  const logout = async () => {
    if (!web3auth) return;
    await web3auth.logout();
    setProvider(null);
    setIsAuthenticated(false);
    setAddress(null);
  };

  return (
    <Web3Context.Provider value={{ login, logout, isAuthenticated, address }}>
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => useContext(Web3Context);
