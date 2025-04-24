import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("NitroCreditSBT", (m) => {
  const deployer = m.getAccount(0);
  const verifierAddress = "0x53FB0285c68Db09f1Bf0d9efDBb79993aD5AB7F8"; // Replace with actual address

  const nitroCreditSBT = m.contract("NitroCreditSBT", [deployer, verifierAddress]);

  return { nitroCreditSBT };
});
