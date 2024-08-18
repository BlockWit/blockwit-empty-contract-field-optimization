import {loadFixture,} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import {expect} from "chai";
import hre from "hardhat";

describe("BlockwitEmptyContractBytecodeWayOptimized", function () {

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
            "5b50606c80601f5f395ff3fe" +

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
            //
            "5B5F5460405180919052602090F3" +

            // metadata
            "a2646970667358221220" +
            "52b689f2eb123eb4fe4ead878d0b4a6224c0554c640c36015c4e5acc61d7c9d3" +
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
