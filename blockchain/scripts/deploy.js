const hre = require("hardhat");

async function main() {
  console.log("Deploying UserVerification contract...");

  const UserVerification = await hre.ethers.getContractFactory("UserVerification");
  const userVerification = await UserVerification.deploy();

  // Wait for the contract to be mined
  await userVerification.waitForDeployment();

  const address = await userVerification.getAddress();
  console.log(`UserVerification deployed to: ${address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
