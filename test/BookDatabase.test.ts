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

  it("Should add book", async function () {
    const { bookDatabase, owner, otherAccount } = await loadFixture(
      deployFixture
    );

    await bookDatabase.addBook({ title: "New Book", year: 2023 });
    const count = await bookDatabase.count();
    expect(count).to.equal(1);
  });

  it("Should edit book", async function () {
    const { bookDatabase, owner, otherAccount } = await loadFixture(
      deployFixture
    );

    await bookDatabase.addBook({ title: "New Book", year: 2023 });
    await bookDatabase.editBook(1, { title: "New Book 2.0", year: 2023 });

    const book = await bookDatabase.books(1);
    expect(book.title).to.equal("New Book 2.0");
  });

  it("Should remove book", async function () {
    const { bookDatabase, owner, otherAccount } = await loadFixture(
      deployFixture
    );

    await bookDatabase.addBook({ title: "New Book", year: 2023 });
    await bookDatabase.removeBook(1);

    const count = await bookDatabase.count();
    expect(count).to.equal(0);
  });

  it("Should NOT remove book", async function () {
    const { bookDatabase, owner, otherAccount } = await loadFixture(
      deployFixture
    );

    const instance = bookDatabase.connect(otherAccount);
    await expect(instance.removeBook(1)).to.be.revertedWith(
      "You don't have permission."
    );
  });
});
