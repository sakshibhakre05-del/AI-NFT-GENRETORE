const hre = require("hardhat");

async function main() {
  const NAME = "AI Generated NFT"
  const SYMBOL = "AINFT"
  const COST = ethers.utils.parseUnits("1", "ether") // 1 ETH

  const NFT = await hre.ethers.getContractFactory("NFT")
  const nft = await NFT.deploy(NAME, SYMBOL, COST)
  await nft.deployed()

  console.log(`Deployed NFT Contract at: ${nft.address}`)

  // Save the address to config.json for the frontend
  const fs = require("fs");
  const path = require("path");
  const configPath = path.join(__dirname, "..", "src", "config.json");
  const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));

  const network = await hre.ethers.provider.getNetwork();
  config[network.chainId] = {
    nft: {
      address: nft.address
    }
  };

  fs.writeFileSync(configPath, JSON.stringify(config, null, 4));
  console.log(`Updated config.json with address ${nft.address} for network ${network.chainId}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
