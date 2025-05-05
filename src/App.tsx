import { WagmiConfig, createConfig, configureChains } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { RainbowKitProvider, connectorsForWallets } from '@rainbow-me/rainbowkit';
import { metaMaskWallet, injectedWallet, walletConnectWallet } from '@rainbow-me/rainbowkit/wallets';
import '@rainbow-me/rainbowkit/styles.css';
import Footer from './components/Footer';
import MintNFT from './components/MintNFT';
import ConnectButton from './components/ConnectButton';

// 自定义Sepolia配置，使用用户的Alchemy RPC
const customSepolia = {
  ...sepolia,
  rpcUrls: {
    ...sepolia.rpcUrls,
    default: {
      http: ['https://eth-sepolia.g.alchemy.com/v2/cKsGKndbjjbgerDIj7dlAjh9LtEWCMvD'],
    },
    public: {
      http: ['https://eth-sepolia.g.alchemy.com/v2/cKsGKndbjjbgerDIj7dlAjh9LtEWCMvD'],
    },
  },
};

// 配置chains和providers，使用多个provider
const { chains, publicClient } = configureChains(
  [mainnet, customSepolia],
  [
    jsonRpcProvider({
      rpc: (chain) => {
        if (chain.id === customSepolia.id) {
          return { http: customSepolia.rpcUrls.default.http[0] };
        }
        return null;
      },
    }),
    publicProvider(),
  ]
);

// 配置connectors
const projectId = 'YOUR_PROJECT_ID'; // 从WalletConnect获取
const connectors = connectorsForWallets([
  {
    groupName: '推荐',
    wallets: [
      metaMaskWallet({ projectId, chains }),
      injectedWallet({ chains }),
      walletConnectWallet({ projectId, chains }),
    ],
  },
]);

// 配置wagmi客户端
const config = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

function App() {
  return (
    <WagmiConfig config={config}>
      <RainbowKitProvider chains={chains}>
        <div className="min-h-screen flex flex-col bg-gray-50">
          <header className="p-4 bg-white shadow-sm">
            <div className="container mx-auto flex justify-between items-center">
              <h1 className="text-xl font-bold text-gray-800">NFT白名单铸造</h1>
              <ConnectButton />
            </div>
          </header>

          <main className="flex-1 container mx-auto p-4">
            <MintNFT />
          </main>

          <Footer />
        </div>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default App;