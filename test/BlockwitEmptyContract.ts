import {loadFixture,} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import {expect} from "chai";
import hre from "hardhat";

describe("BlockwitEmptyContract", function () {

    async function deploy() {
        const [owner, otherAccount] = await hre.ethers.getSigners();

        const BlockwitEmptyContract = await hre.ethers.getContractFactory("BlockwitEmptyContract");
        const blockwitEmptyContract = await BlockwitEmptyContract.deploy();

        return {blockwitEmptyContract, owner, otherAccount};
    }

    describe("Deployment", function () {
        it("Should get the right field a value", async function () {
            const {blockwitEmptyContract, owner, otherAccount} = await loadFixture(deploy);

            expect(await blockwitEmptyContract.a()).to.equal(777);
        });
    });

});
