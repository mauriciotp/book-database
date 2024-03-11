import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("BookDatabase", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployFixture() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const BookDatabase = await ethers.getContractFactory("BookDatabase");
    const bookDatabase = await BookDatabase.deploy();

    return { bookDatabase, owner, otherAccount };
  }

  it("Should count = 0", async function () {
    const { bookDatabase, owner, otherAccount } = await loadFixture(
      deployFixture
    );

    const count = await bookDatabase.count();
    expect(count).to.equal(0);
  });
});
