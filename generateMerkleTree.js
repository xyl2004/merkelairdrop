const { ethers } = require("ethers");
const { MerkleTree } = require("merkletreejs");

// 白名单地址
const tokens = [
  "0x65F11439C3a958b1beEAE65a245bf21C551B886d",
  "0x67117b1ff315095f870df6523b3b8341b0063cde"
];

// 1. 生成merkle tree
console.log("\n1. 生成merkle tree");

// 生成叶子节点
const leaf = tokens.map(x => ethers.keccak256(x));

// 创建Merkle Tree
const merkletree = new MerkleTree(leaf, ethers.keccak256, { sortPairs: true });

// 获取根哈希
const root = merkletree.getHexRoot();

console.log("Leaf:");
console.log(leaf);
console.log("\nMerkleTree:");
console.log(merkletree.toString());
console.log("\nRoot:");
console.log(root);

// 为每个地址生成proof
console.log("\n2. 为白名单地址生成Proof");
tokens.forEach((addr, index) => {
  const proof = merkletree.getHexProof(leaf[index]);
  console.log(`地址 ${addr} 的Proof:`);
  console.log(proof);
});

// 3. 验证白名单地址
console.log("\n3. 验证白名单地址");
tokens.forEach((addr, index) => {
  const proof = merkletree.getHexProof(leaf[index]);
  const verified = merkletree.verify(proof, leaf[index], root);
  console.log(`地址 ${addr} 验证结果: ${verified}`);
});

// 4. 验证非白名单地址
const fakeAddress = "0x0000000000000000000000000000000000000000";
const fakeLeaf = ethers.keccak256(fakeAddress);
const fakeProof = merkletree.getHexProof(fakeLeaf);
const verified = merkletree.verify(fakeProof, fakeLeaf, root);
console.log(`\n非白名单地址 ${fakeAddress} 验证结果: ${verified}`);

// 5. 生成智能合约需要的数据
console.log("\n5. 输出智能合约需要的数据");
console.log(`Merkle根: ${root}`);
console.log("在合约中使用此根哈希值进行验证。");
console.log("用户铸造NFT时，后端应提供对应地址的Proof。"); 