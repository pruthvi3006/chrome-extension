import React from "react";
import { Web3ContextProvider } from "./Web3ContextProvider";
import ExtensionPanel from "./extension-panel";

export default function App() {
  return (
    <Web3ContextProvider>
      <ExtensionPanel />
    </Web3ContextProvider>
  );
}