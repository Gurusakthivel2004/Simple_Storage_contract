const ethers = require("ethers");
const fs = require("fs");
const dotenv = require("dotenv").config();
const main = async () => {
  const providers = new ethers.JsonRpcProvider(process.env.RPC_URL);

  // const encryptedJson = fs.readFileSync("./.encryptedKey.json", "utf-8");

  // let wallet = await ethers.Wallet.fromEncryptedJson(
  //   encryptedJson,
  //   process.env.PRIVATE_KEY_PASSWORD
  // );

  // wallet = wallet.connect(providers);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, providers);
  const abi = fs.readFileSync("SimpleStorage_sol_SimpleStorage.abi", "utf-8");
  const bin = fs.readFileSync("SimpleStorage_sol_SimpleStorage.bin", "utf-8");
  const contract_Factory = new ethers.ContractFactory(abi, bin, wallet);
  console.log("Deploying contract.....");
  const contract = await contract_Factory.deploy();
  await contract.waitForDeployment(1);

  console.log(`Contract address : ${await contract.getAddress()}`);

  // console.log("Deployment with only transaction data...");
  const nonce = await wallet.getNonce();
  const tx = {
    nonce: nonce,
    gasPrice: "20000000000",
    gasLimit: "6721975",
    to: null,
    value: "0",
    data: process.env.TX_DATA,
    chainId: "1337",
  };
  // const txres = await wallet.sendTransaction(tx); // Signed Transaction
  // await txres.wait(1);
  // console.log(txres);

  const favNum = await contract.retrieve();
  console.log(favNum.toString());

  const txRes = await contract.store("10");
  const tx_reciept = await txRes.wait(1);
  const updatedFavNum = await contract.retrieve();

  console.log(`Updated favourite number is ${updatedFavNum}`);
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
