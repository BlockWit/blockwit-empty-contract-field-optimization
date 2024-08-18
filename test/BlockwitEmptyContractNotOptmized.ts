import {loadFixture,} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import {expect} from "chai";
import hre from "hardhat";

describe("BlockwitEmptyContractBytecodeWayNotOptimized", function () {

    async function deploy() {
        const [owner, otherAccount] = await hre.ethers.getSigners();

        const bytecode = "0x" +
            // constructor
            // - pointer to empty memory initialization
            "6080604052" +
            // - write filed "a" value to storage
            "6103095f55" +
            // - checks whether sent ether
            "3480156013575f80fd" +
            // - copy code to memory and return
            "5b5060ac80601f5f395ff3fe" +

            // smart-contract
            // - pointer to empty memory initialization
            "6080604052" +
            // - checks whether sent ether
            "348015600e575f80fd" +
            // - checks whether it 4-bytes function identifier call or not
            "5b5060043610602657" +
            // - methods selector
            "5f3560e01c80630dbe671f14602a57" +
            // - revert in case of eth sent or 4-bytes function selector not found
            "5b5f80fd" +
            // - functions code
            "5b60306044565b604051603b9190605f565b60405180910390f35b5f5481565b5f819050919050565b6059816049565b82525050565b5f60208201905060705f8301846052565b9291505056fe" +

            // metadata
            "a2646970667358221220" +
            "11b00437b0b3511bbfcf815f04a652a2ca60951acd4e28803b30bdf9cf80918f" +
            "64736f6c6343" +
            // - major version
            "0008" +
            // - minor version
            "19" +
            "0033";

        console.log(bytecode);
        console.log("Bytecode size: " + bytecode.length/2);

        const txReceipt = await owner.sendTransaction({data: bytecode})
        const txResult = await txReceipt.wait();

        if (txResult?.contractAddress == null)
            throw "Returned empty address";

        console.log("Gas used: " + txResult.gasUsed);

        const contractAddress = txResult.contractAddress;

        const BlockwitEmptyContract = await hre.ethers.getContractFactory("BlockwitEmptyContract");
        const blockwitEmptyContract = await BlockwitEmptyContract.attach(contractAddress);

        return {blockwitEmptyContract, owner, otherAccount};
    }

    describe("Deployment", function () {
        it("Should get the right field a value", async function () {
            const {blockwitEmptyContract, owner, otherAccount} = await loadFixture(deploy);

            expect(await blockwitEmptyContract.a()).to.equal(777);
        });
    });

});
