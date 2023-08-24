const { ethers, run, network } = require("hardhat");

const main = async () => {
  const SimpleStorageFactory = await ethers.getContractFactory("SimpleStorage");
  console.log("Deploying contract...");
  const simpleStorage = await SimpleStorageFactory.deploy();
  simpleStorage.deploymentTransaction();
  const address = await simpleStorage.getAddress();
  console.log(`Deployed contract to : ${address}`);

  if (network.config.chainId == 11155111 && process.env.API_KEY) {
    let tx = simpleStorage.deploymentTransaction();
    await tx.wait(6);
    await verify(address, []);
  }

  //Retrieve the current value
  const currentValue = await simpleStorage.retrieve();
  console.log(`CurrentValue is ${currentValue}`);

  //Update the current value
  const transactionResponse = await simpleStorage.store(10);
  const transactionReciept = await transactionResponse.wait(1);
  const updatedValue = await simpleStorage.retrieve();
  console.log(`Updated value is ${updatedValue}`);
};

const verify = async (contractAddress, args) => {
  console.log("Verifying contract....");
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
    });
  } catch (error) {
    console.log(error);
  }
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
