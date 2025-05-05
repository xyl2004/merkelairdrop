import { useState, useEffect, Fragment } from 'react';
import { useAccount, useContractRead, useContractWrite, useWaitForTransaction } from 'wagmi';
import { MerkleTree } from 'merkletreejs';
import { ethers } from 'ethers';

// 白名单地址和证明映射 
const whitelist: { [key: string]: string[] } = {
  "0x65F11439C3a958b1beEAE65a245bf21C551B886d": ["0x3e48480d16c6d7303961ebac643a079a12e732a4726f58477d2c600d768057fd"],
  "0x67117b1ff315095f870df6523b3b8341b0063cde": ["0xc88663f9a8d8ac815b9ea825fdd57dc3b23ae5f2f440ae111a0224be7106446d"]
};

// NFT合约ABI和地址
const contractAddress = "0x97175171729B1b53c11440838CEdB0665b6eDDe2";
const contractABI = [{"inputs":[{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"symbol","type":"string"},{"internalType":"bytes32","name":"merkleroot","type":"bytes32"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"address","name":"owner","type":"address"}],"name":"ERC721IncorrectOwner","type":"error"},{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ERC721InsufficientApproval","type":"error"},{"inputs":[{"internalType":"address","name":"approver","type":"address"}],"name":"ERC721InvalidApprover","type":"error"},{"inputs":[{"internalType":"address","name":"operator","type":"address"}],"name":"ERC721InvalidOperator","type":"error"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"ERC721InvalidOwner","type":"error"},{"inputs":[{"internalType":"address","name":"receiver","type":"address"}],"name":"ERC721InvalidReceiver","type":"error"},{"inputs":[{"internalType":"address","name":"sender","type":"address"}],"name":"ERC721InvalidSender","type":"error"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ERC721NonexistentToken","type":"error"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"OwnableInvalidOwner","type":"error"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"OwnableUnauthorizedAccount","type":"error"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"approved","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"approve","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getApproved","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"bytes32[]","name":"proof","type":"bytes32[]"}],"name":"mint","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"root","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"tokenURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"transferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"}];

// 检查ID是否已铸造的最大范围
const MAX_TOKEN_ID_CHECK = 100;

const MintNFT = () => {
  const { address, isConnected } = useAccount();
  const [isWhitelisted, setIsWhitelisted] = useState<boolean>(false);
  const [tokenId, setTokenId] = useState<number>(1);
  const [nextAvailableId, setNextAvailableId] = useState<number>(1);
  const [mintedIds, setMintedIds] = useState<number[]>([]);
  const [isCheckingIds, setIsCheckingIds] = useState<boolean>(false);
  const [proof, setProof] = useState<`0x${string}`[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  // 读取合约中的root
  const { data: contractRoot } = useContractRead({
    address: contractAddress as `0x${string}`,
    abi: contractABI as any,
    functionName: 'root',
  });

  // 检查用户当前拥有的NFT数量
  const { data: balance } = useContractRead({
    address: contractAddress as `0x${string}`,
    abi: contractABI as any,
    functionName: 'balanceOf',
    args: [address],
    enabled: !!address,
  });

  // 铸造NFT合约调用
  const { 
    writeAsync: mintNFT, 
    data: mintData,
    isLoading: isMintLoading,
    isError: isMintError,
    error: mintError 
  } = useContractWrite({
    address: contractAddress as `0x${string}`,
    abi: contractABI as any,
    functionName: 'mint' as any,
  } as any);

  // 等待交易确认
  const { isLoading: isTransactionLoading, isSuccess: isTransactionSuccess } = 
    useWaitForTransaction({
      hash: mintData?.hash,
    });

  // 查询NFT所有者，用于检查ID是否已被铸造
  const checkTokenOwner = async (id: number) => {
    try {
      const provider = new ethers.JsonRpcProvider("https://eth-sepolia.g.alchemy.com/v2/cKsGKndbjjbgerDIj7dlAjh9LtEWCMvD");
      const contract = new ethers.Contract(contractAddress, contractABI, provider);
      const owner = await contract.ownerOf(id);
      return { id, minted: true, owner };
    } catch (error) {
      // 如果发生错误，通常表示该ID尚未铸造
      return { id, minted: false, owner: null };
    }
  };

  // 查找下一个可用的ID
  const findNextAvailableId = async () => {
    if (!isConnected) return;
    
    setIsCheckingIds(true);
    setError("");
    
    try {
      const minted: number[] = [];
      let nextId = 1;
      
      // 批量检查Token ID
      const promises = [];
      for (let i = 1; i <= MAX_TOKEN_ID_CHECK; i++) {
        promises.push(checkTokenOwner(i));
      }
      
      const results = await Promise.all(promises);
      
      results.forEach(result => {
        if (result.minted) {
          minted.push(result.id);
        }
      });
      
      // 按从小到大排序
      minted.sort((a, b) => a - b);
      setMintedIds(minted);
      
      // 找到第一个未铸造的ID
      for (let i = 1; i <= MAX_TOKEN_ID_CHECK; i++) {
        if (!minted.includes(i)) {
          nextId = i;
          break;
        }
      }
      
      setNextAvailableId(nextId);
      setTokenId(nextId);
   //   console.log("已铸造的ID:", minted);
      console.log("下一个可用ID:", nextId);
      
    } catch (err: any) {
      setError("查询已铸造ID失败: " + (err.message || "未知错误"));
    } finally {
      setIsCheckingIds(false);
    }
  };

  // 验证地址是否在白名单中
  const checkWhitelist = () => {
    if (!address) {
      setError("请先连接钱包");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      // 添加调试信息
      console.log("当前连接的钱包地址:", address);
      console.log("白名单中的地址:", Object.keys(whitelist));
      console.log("地址是否直接匹配:", whitelist[address] !== undefined);

      // 检查地址是否在预设的白名单中 - 尝试不区分大小写比较
      const addressLower = address.toLowerCase();
      const whitelistKeys = Object.keys(whitelist).map(addr => addr.toLowerCase());
      const isInWhitelist = whitelistKeys.includes(addressLower);
      
      console.log("地址小写后:", addressLower);
      console.log("白名单地址小写后:", whitelistKeys);
      console.log("小写比较是否匹配:", isInWhitelist);
      
      if (whitelist[address]) {
        const proofArray = whitelist[address];
        const hexProof = proofArray.map(p => p as `0x${string}`);
        setProof(hexProof);
        setIsWhitelisted(true);
        setSuccess("恭喜！您的地址在白名单中，可以铸造NFT。");
        
        // 验证成功后自动查询已铸造ID
        findNextAvailableId();
      } else if (isInWhitelist) {
        // 如果小写比较匹配，找到原始大小写格式的地址
        const originalCaseAddr = Object.keys(whitelist).find(
          addr => addr.toLowerCase() === addressLower
        );
        
        if (originalCaseAddr) {
          console.log("找到原始大小写地址:", originalCaseAddr);
          const proofArray = whitelist[originalCaseAddr];
          const hexProof = proofArray.map(p => p as `0x${string}`);
          setProof(hexProof);
          setIsWhitelisted(true);
          setSuccess("恭喜！您的地址在白名单中，可以铸造NFT。(大小写不同但已匹配)");
          
          // 验证成功后自动查询已铸造ID
          findNextAvailableId();
        } else {
          setIsWhitelisted(false);
          setError("出现异常：小写匹配但找不到原始地址");
        }
      } else {
        setIsWhitelisted(false);
        setError("抱歉，您的地址不在白名单中。");
      }
    } catch (err: any) {
      setError("验证白名单失败: " + (err.message || "未知错误"));
      setIsWhitelisted(false);
    } finally {
      setIsLoading(false);
    }
  };

  // 铸造NFT
  const handleMint = async () => {
    if (!address || !isWhitelisted) return;
    
    try {
      // 尝试找到白名单中匹配的地址（考虑大小写）
      const addressLower = address.toLowerCase();
      const originalCaseAddr = Object.keys(whitelist).find(
        addr => addr.toLowerCase() === addressLower
      ) || address;
      
      // 使用找到的原始大小写地址或当前地址
      const userAddress = address as `0x${string}`;
      
      // 构造数组格式的proof - 使用原始大小写地址获取proof
      const proofArray = [whitelist[originalCaseAddr][0]];
      
      console.log("铸造参数:", {
        address: userAddress,
        originalAddress: originalCaseAddr,
        tokenId,
        proof: proofArray
      });
      
      // 调用合约mint函数
      if (typeof mintNFT === 'function') {
        // @ts-ignore - 忽略类型错误
        await mintNFT({
          args: [userAddress, BigInt(tokenId), proofArray],
        });
      }

      // 铸造成功后自动查找下一个可用ID
      setTimeout(() => {
        findNextAvailableId();
      }, 2000);
    } catch (err: any) {
      setError("铸造NFT失败: " + (err.message || "未知错误"));
    }
  };
  
  // 手动刷新已铸造ID列表
  const refreshMintedIds = () => {
    findNextAvailableId();
  };

  // 交易成功后显示成功信息
  useEffect(() => {
    if (isTransactionSuccess) {
      setSuccess(`NFT铸造成功！TokenID: ${tokenId}`);
    }
  }, [isTransactionSuccess, tokenId]);

  // 处理铸造错误
  useEffect(() => {
    if (isMintError && mintError) {
      setError(`铸造失败: ${mintError.message || "未知错误"}`);
    }
  }, [isMintError, mintError]);

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">NFT白名单铸造</h2>
      
      {!isConnected ? (
        <div className="text-center text-gray-600 mb-6">
          请先连接您的钱包
        </div>
      ) : (
        <Fragment>
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">您的钱包地址</h3>
            <div className="bg-gray-100 p-3 rounded-md">
              <code className="text-sm break-all">{address}</code>
            </div>
            {isWhitelisted && (
              <div className="mt-1 text-xs text-green-600">
                该地址已验证在白名单中
              </div>
            )}
          </div>

          {balance && Number(balance) > 0 && (
            <div className="mb-6 bg-gray-100 p-3 rounded-md">
              <p>您已拥有 {Number(balance)} 个NFT</p>
            </div>
          )}

          <div className="mb-6">
            <button
              onClick={checkWhitelist}
              disabled={isLoading}
              className={`w-full py-2 px-4 rounded-md text-white font-medium transition-colors ${
                isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isLoading ? '验证中...' : '验证白名单'}
            </button>
          </div>

          {isWhitelisted && (
            <div className="mb-6">
              <div className="mb-4">
                <h3 className="text-md font-medium mb-2">已铸造的ID:</h3>
                <div className="flex flex-wrap gap-1 bg-gray-50 p-2 rounded-md min-h-10">
                  {isCheckingIds ? (
                    <span className="text-gray-500">正在查询...</span>
                  ) : mintedIds.length > 0 ? (
                    mintedIds.map(id => (
                      <span key={id} className="px-2 py-1 bg-gray-200 rounded-md text-xs">
                        {id},
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500">尚未有铸造记录</span>
                  )}
                </div>
                <div className="mt-2 text-right">
                  <button 
                    onClick={refreshMintedIds}
                    disabled={isCheckingIds}
                    className="text-xs text-blue-600 hover:text-blue-800"
                  >
                    {isCheckingIds ? '刷新中...' : '刷新'}
                  </button>
                </div>
              </div>
              
              <div className="flex mb-3">
                <label className="block text-sm font-medium text-gray-700 mr-2 mt-2">
                  TokenID:
                </label>
                <input
                  type="number"
                  min="1"
                  value={tokenId}
                  onChange={(e) => setTokenId(parseInt(e.target.value))}
                  className="flex-1 border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={() => setTokenId(nextAvailableId)}
                  className="ml-2 px-2 bg-gray-200 rounded-md text-xs flex items-center"
                  title="使用下一个可用ID"
                >
                  使用 {nextAvailableId}
                </button>
              </div>
              <button
                onClick={handleMint}
                disabled={!isWhitelisted || isMintLoading || isTransactionLoading || isCheckingIds}
                className={`w-full py-2 px-4 rounded-md text-white font-medium transition-colors ${
                  !isWhitelisted || isMintLoading || isTransactionLoading || isCheckingIds
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {isMintLoading || isTransactionLoading ? '处理中...' : isCheckingIds ? '查询中...' : '铸造NFT'}
              </button>
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-100 text-red-700 rounded-md mb-4">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 bg-green-100 text-green-700 rounded-md mb-4">
              {success}
            </div>
          )}
        </Fragment>
      )}
    </div>
  );
};

export default MintNFT; 