// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

contract BookDatabase {
  struct Book {
    string title;
    uint16 year;
  }

  uint32 private nextId = 0;
  mapping(uint32 => Book) public books;

  address private immutable owner;

  uint256 public count;

  modifier onlyOwner() {
    require(owner == msg.sender, "You don't have permission.");
    _;
  }

  constructor() {
    owner = msg.sender;
  }

  function compare(string memory strA, string memory strB) private pure returns (bool) {
    bytes memory arr1 = bytes(strA);
    bytes memory arr2 = bytes(strB);

    return arr1.length == arr2.length && keccak256(arr1) == keccak256(arr2);
  }

  function addBook(Book memory newBook) public {
    nextId++;
    books[nextId] = newBook;
    count++;
  }

  function editBook(uint32 id, Book memory newBook) public {
    Book memory oldBook = books[id];

    if (!compare(oldBook.title, newBook.title) && !compare(newBook.title, ""))
      books[id].title = newBook.title;

    if (oldBook.year != newBook.year && newBook.year > 0) books[id].year = newBook.year;
  }

  function removeBook(uint32 id) public onlyOwner {
    if (books[id].year > 0) {
      delete books[id];
      count--;
    }
  }
}
