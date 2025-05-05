import { useBalance, useNetwork, useAccount } from 'wagmi'
import { useEffect, useState } from 'react'

interface WalletInfoProps {
  address: `0x${string}`
}

const WalletInfo = ({ address }: WalletInfoProps) => {
  const { chain } = useNetwork()
  const { data: balance } = useBalance({ address })
  const { connector } = useAccount()
  const [copied, setCopied] = useState(false)
  
  const copyAddress = () => {
    navigator.clipboard.writeText(address)
    setCopied(true)
  }
  
  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [copied])

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }
  
  return (
    <div className="space-y-5 text-left">
      <div className="border-b border-gray-200 pb-4">
        <h2 className="text-lg font-medium text-gray-800 mb-1">Wallet Details</h2>
        <div className="flex items-center gap-2">
          <p className="text-sm text-gray-500">Connected with {connector?.name || 'Unknown'}</p>
        </div>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
          <div className="flex items-center gap-2">
            <code className="bg-gray-100 px-2 py-1 rounded text-sm flex-1 overflow-hidden text-ellipsis">
              {formatAddress(address)}
            </code>
            <button 
              onClick={copyAddress}
              className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 py-1 px-2 rounded transition-colors"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>
        
        {balance && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Balance</label>
            <div className="bg-gray-100 px-3 py-2 rounded">
              <p className="font-mono text-sm">
                {parseFloat(balance.formatted).toFixed(4)} {balance.symbol}
              </p>
            </div>
          </div>
        )}
        
        {chain && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Network</label>
            <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded">
              <p className="text-sm">{chain.name}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default WalletInfo