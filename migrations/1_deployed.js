const idoFactory = artifacts.require("IDOFactory");
const tokenLockerFactory = artifacts.require("TokenLockerFactory");

module.exports = function (deployer) {
  deployer.then(async () => {
    let EBTCAddress = "0x57b450A6a2B11cd2D9E667e6cc5f77837Db82d54";
    await deployer.deploy(idoFactory, EBTCAddress, "0", "0");
    await deployer.deploy(tokenLockerFactory);
  });
};
