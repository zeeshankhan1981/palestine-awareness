// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

/**
 * @title PalestineNewsVerifier
 * @dev Contract for storing and verifying article hashes for the Palestine News Hub
 */
contract PalestineNewsVerifier {
    // Struct to store article data
    struct ArticleData {
        string sourceUrl;
        uint256 timestamp;
        address submitter;
        bool exists;
    }
    
    // Mapping from content hash to article data
    mapping(string => ArticleData) private articleHashes;
    
    // Event emitted when an article hash is stored
    event ArticleHashStored(
        string indexed contentHash,
        address indexed submitter,
        string sourceUrl,
        uint256 timestamp
    );
    
    // Contract owner
    address public owner;
    
    /**
     * @dev Constructor sets the contract owner
     */
    constructor() {
        owner = msg.sender;
    }
    
    /**
     * @dev Store an article hash and its metadata
     * @param contentHash SHA-256 hash of the article content
     * @param sourceUrl URL of the article source
     * @param timestamp Publication timestamp of the article
     */
    function storeArticleHash(
        string memory contentHash,
        string memory sourceUrl,
        uint256 timestamp
    ) public {
        // Ensure the hash doesn't already exist
        require(!articleHashes[contentHash].exists, "Article hash already exists");
        
        // Store the article data
        articleHashes[contentHash] = ArticleData({
            sourceUrl: sourceUrl,
            timestamp: timestamp,
            submitter: msg.sender,
            exists: true
        });
        
        // Emit event
        emit ArticleHashStored(contentHash, msg.sender, sourceUrl, timestamp);
    }
    
    /**
     * @dev Check if an article hash exists
     * @param contentHash SHA-256 hash of the article content
     * @return bool indicating if the hash exists
     */
    function isArticleHashStored(string memory contentHash) public view returns (bool) {
        return articleHashes[contentHash].exists;
    }
    
    /**
     * @dev Get article data for a given hash
     * @param contentHash SHA-256 hash of the article content
     * @return sourceUrl URL of the article source
     * @return timestamp Publication timestamp of the article
     * @return submitter Address that submitted the hash
     */
    function getArticleData(string memory contentHash) public view returns (
        string memory sourceUrl,
        uint256 timestamp,
        address submitter
    ) {
        require(articleHashes[contentHash].exists, "Article hash does not exist");
        
        ArticleData memory data = articleHashes[contentHash];
        return (data.sourceUrl, data.timestamp, data.submitter);
    }
}
