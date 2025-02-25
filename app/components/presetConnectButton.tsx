import React from 'react'
import { ConnectButton } from 'thirdweb/react'
import { defineChain } from 'thirdweb'
import { thirdwebClient } from '../config/client'
import { liskNetworkConfig } from '../config/networkConfig'
import {
    inAppWallet,
    createWallet,
  } from "thirdweb/wallets";

  const wallets = [
    inAppWallet({
      auth: {
        options: [
          "google",
          "discord",
          "telegram",
          "email",
          "passkey",
          "phone"
        ],
      },
    }),
    createWallet("io.metamask"),
    createWallet("com.coinbase.wallet"),
    createWallet("com.valoraapp"),
    createWallet("com.okex.wallet")
  ];

const PresetConnectButton = () => {
    const {lisk_chainId, lisk_uZarContractAddress} = liskNetworkConfig;
    return (
        <ConnectButton
            supportedTokens={{
                [lisk_chainId]: [
                    {
                        address: lisk_uZarContractAddress,
                        name: "Universel Zar",
                        symbol: "uZAR",
                        icon: "...",
                    },
                ],
            }}
            wallets={wallets}
            client={thirdwebClient}
            accountAbstraction={{
                chain: defineChain(1135),
                sponsorGas: true,
            }}
            connectModal={{
                size: "compact",
                showThirdwebBranding: false,
            }}
            detailsButton={{
                displayBalanceToken: {
                    [lisk_chainId]: lisk_uZarContractAddress
                },
            }}
        />
    )
}

export default PresetConnectButton