const idoFactory = artifacts.require("IDOFactory");
const tokenLockerFactory = artifacts.require("TokenLockerFactory");

module.exports = function (deployer) {
  deployer.then(async () => {
    let EBTCAddress = "0xCC2298953ed9D9234B6118DE686b2Dc83F2b4D36";
    await deployer.deploy(idoFactory, EBTCAddress, "0", "0");
    await deployer.deploy(tokenLockerFactory, "1000000000000000000", "0x37eCc7E1c378C0fD3DE5353C34F8E5e0BACAF30b");
  });
};
