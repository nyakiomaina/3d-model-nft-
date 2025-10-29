// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract VibeRoomNFT is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    // Mint price: 0.00006 ETH
    uint256 public constant MINT_PRICE = 0.00006 ether;

    struct Room {
        string roomName;
        string colorTheme;
        string metadata;
        address creator;
        uint256 timestamp;
    }

    mapping(uint256 => Room) public rooms;
    
    event RoomMinted(
        address indexed owner,
        uint256 indexed tokenId,
        string roomName
    );

    // ============================================
    // DEPLOYMENT INSTRUCTIONS:
    // ============================================
    // 1. Deploy this contract to Scroll Mainnet
    // 2. Copy the deployed contract address
    // 3. Paste it in lib/web3/config.ts at line 27
    //    Replace: export const VIBE_ROOM_NFT_ADDRESS = "YOUR_CONTRACT_ADDRESS_HERE"
    // 4. Save and redeploy your frontend
    // ============================================

    constructor() ERC721("VibeRoom", "VIBE") Ownable(msg.sender) {}

    function mintRoom(
        string memory roomName,
        string memory colorTheme,
        string memory metadata
    ) public payable returns (uint256) {
        require(msg.value >= MINT_PRICE, "Insufficient payment. Send at least 0.00006 ETH");
        
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        
        _safeMint(msg.sender, tokenId);
        
        rooms[tokenId] = Room({
            roomName: roomName,
            colorTheme: colorTheme,
            metadata: metadata,
            creator: msg.sender,
            timestamp: block.timestamp
        });
        
        emit RoomMinted(msg.sender, tokenId, roomName);
        
        return tokenId;
    }

    function getRoomData(uint256 tokenId) public view returns (Room memory) {
        require(ownerOf(tokenId) != address(0), "Room does not exist");
        return rooms[tokenId];
    }

    function totalSupply() public view returns (uint256) {
        return _tokenIdCounter.current();
    }

    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        payable(owner()).transfer(balance);
    }

    // Get current mint price
    function getMintPrice() public pure returns (uint256) {
        return MINT_PRICE;
    }

    // Override required functions
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
