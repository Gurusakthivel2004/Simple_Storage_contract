const ethers = require("ethers");
const fs = require("fs");

const main = async () => {
  const providers = new ethers.JsonRpcProvider("http://127.0.0.1:7545");
  const wallet = new ethers.Wallet(
    "0x8c0712a06a1663ffea524a42f1468728628a37bffee2b0a0bafc8d3757dd0b54",
    providers
  );
  const abi = fs.readFileSync("SimpleStorage_sol_SimpleStorage.abi", "utf-8");
  const bin = fs.readFileSync("SimpleStorage_sol_SimpleStorage.bin", "utf-8");
  const contract_Factory = new ethers.ContractFactory(abi, bin, wallet);
  console.log("Deploying contract.....");
  const contract = await contract_Factory.deploy();
  console.log(contract);
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
