// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Groth16Verifier.sol";

/**
 * @title Nitro Credit Soulbound Token (SBT)
 * @notice ERC721-based non-transferable token that represents user identity and credit reputation.
 */
contract NitroCreditSBT is ERC721URIStorage, Ownable {
    uint256 private _nextTokenId;
    Groth16Verifier public ageVerifier;

    struct CreditProfile {
        uint256 creditScore;
        uint256 reputationScore;
        uint256 lastActivity;
        uint256 totalTransactions;
        bool isActive;
    }

    mapping(uint256 => CreditProfile) public creditProfiles;
    mapping(address => uint256) public userTokens;

    constructor(address initialOwner, address verifierAddress) ERC721("Nitro Credit SBT", "NCSBT") Ownable(initialOwner) {
        _nextTokenId = 1;
        ageVerifier = Groth16Verifier(verifierAddress);
    }

    // Override _update to make the token soulbound
    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal virtual override returns (address) {
        address from = _ownerOf(tokenId);

        // Disallow transfers unless it's minting (from == address(0)) or burning (to == address(0))
        if (from != address(0) && to != address(0)) {
            revert("Soulbound tokens cannot be transferred");
        }

        return super._update(to, tokenId, auth);
    }

    function _exists(uint256 tokenId) internal view returns (bool) {
        return tokenId > 0 && tokenId < _nextTokenId;
    }

    modifier onlyTokenOwner(uint256 tokenId) {
        require(ownerOf(tokenId) == msg.sender, "Not token owner");
        _;
    }

    modifier noExistingToken(address user) {
        require(userTokens[user] == 0, "User already has a token");
        _;
    }

    function mint(
        address to,
        string memory uri,
        uint[2] memory a,
        uint[2][2] memory b,
        uint[2] memory c,
        uint[3] memory input
    ) public onlyOwner noExistingToken(to) {
        require(ageVerifier.verifyProof(a, b, c, input), "Invalid ZK proof");


        uint256 newTokenId = _nextTokenId++;
        creditProfiles[newTokenId] = CreditProfile(500, 0, block.timestamp, 0, true);
        _safeMint(to, newTokenId);
        _setTokenURI(newTokenId, uri);
        userTokens[to] = newTokenId;

        emit TokenMinted(to, newTokenId);
    }

    function updateCreditScore(uint256 tokenId, uint256 newScore) public onlyOwner {
        require(_exists(tokenId), "Token does not exist");
        require(newScore <= 1000, "Score must be between 0 and 1000");
        creditProfiles[tokenId].creditScore = newScore;
        emit CreditScoreUpdated(tokenId, newScore);
    }

    function updateReputation(uint256 tokenId, int256 points) public onlyOwner {
        require(_exists(tokenId), "Token does not exist");
        CreditProfile storage profile = creditProfiles[tokenId];
        uint256 newScore;

        if (points > 0) {
            newScore = profile.reputationScore + uint256(points);
        } else {
            newScore = profile.reputationScore > uint256(-points) ? profile.reputationScore - uint256(-points) : 0;
        }

        profile.reputationScore = newScore;
        profile.lastActivity = block.timestamp;
        profile.totalTransactions += 1;

        emit ReputationUpdated(tokenId, newScore);
        emit ActivityRecorded(tokenId, block.timestamp);
    }

    function getCreditProfile(uint256 tokenId) public view returns (CreditProfile memory) {
        require(_exists(tokenId), "Token does not exist");
        return creditProfiles[tokenId];
    }

    function hasToken(address user) public view returns (bool) {
        return userTokens[user] != 0;
    }

    function getTokenId(address user) public view returns (uint256) {
        return userTokens[user];
    }

    function tokenURI(uint256 tokenId) public view override(ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    // Events
    event TokenMinted(address indexed to, uint256 indexed tokenId);
    event CreditScoreUpdated(uint256 indexed tokenId, uint256 newScore);
    event ReputationUpdated(uint256 indexed tokenId, uint256 newScore);
    event ActivityRecorded(uint256 indexed tokenId, uint256 timestamp);
}