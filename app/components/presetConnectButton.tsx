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

    const { lisk_chainId, lisk_uZarContractAddress } = liskNetworkConfig;


    return (
        <ConnectButton
            supportedTokens={{
                [lisk_chainId]: [
                    {
                        address: lisk_uZarContractAddress,
                        name: "UZAR",
                        symbol: "UZAR",
                    },
                    {
                        address: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
                        name: "USDC",
                        symbol: "USDC",
                    },
                ],
                
                [42161]: [ // Arbitrum
                    {
                        address: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
                        name: "USDC",
                        symbol: "USDC",
                    },
                    {
                        address: '0x9A9D0574739B5c9b856Bd0bB3fb16d7B0186f9bB',
                        name: "UZAR",
                        symbol: "UZAR",
                    }
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