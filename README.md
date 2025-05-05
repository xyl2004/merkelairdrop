# Merkle Tree 白名单空投项目

这是一个基于 Merkle Tree 的 NFT 白名单铸造和空投系统。该项目包含了智能合约和前端应用，用于实现基于白名单的 NFT 铸造功能。

## 项目结构

- `/contract` - 包含 NFT 智能合约和 Merkle Tree 验证
- `/src` - 前端应用代码
- `/generateMerkleTree.js` - 生成 Merkle Tree 和白名单证明的脚本

## 功能特点

- 使用 Merkle Tree 技术进行白名单验证
- 支持链下生成 Merkle 证明，链上验证
- 自动查询已铸造的 ID，推荐下一个可用 ID
- 实时显示铸造状态和错误信息
- 支持 Sepolia 测试网

## 技术栈

- 前端：React、Vite、TypeScript、TailwindCSS
- 区块链交互：ethers.js、wagmi、RainbowKit
- 智能合约：Solidity、Foundry
- 其他：Merkle Tree 验证

## 开始使用

### 安装依赖

```bash
npm install
```

### 生成 Merkle Tree

```bash
npm start
```

### 运行前端应用

```bash
npm run dev
```

### 部署合约

参考 `contract` 目录下的部署指南。

## 白名单地址

当前白名单包含以下地址：
- 0x65f11439c3a958b1beae65a245bf21c551b886d
- 0x67117b1ff315095f870df6523b3b8341b0063cde

## 许可证

MIT 