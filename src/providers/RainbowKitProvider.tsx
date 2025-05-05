import { RainbowKitProvider as RainbowKitProviderOriginal, getDefaultWallets } from '@rainbow-me/rainbowkit';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { mainnet, polygon, optimism, arbitrum, base, zora } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { ReactNode } from 'react';

const { chains, publicClient } = configureChains(
  [mainnet, polygon, optimism, arbitrum, base, zora],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: 'Web3 Airdrop',
  projectId: 'b750019578349eaaf88cb5943ce0ce24',
  chains
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient
});

export const RainbowKitProvider = ({ children }: { children: ReactNode }) => {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProviderOriginal chains={chains}>
        {children}
      </RainbowKitProviderOriginal>
    </WagmiConfig>
  );
};