// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";

contract UserVerification is Ownable {
    // Mapping from address to verification status
    mapping(address => bool) private _verifiedUsers;
    
    // Mapping from address to user role (0: unassigned, 1: reader, 2: contributor, 3: editor)
    mapping(address => uint8) private _userRoles;
    
    // Events
    event UserVerified(address indexed user);
    event UserRoleAssigned(address indexed user, uint8 role);
    
    constructor() Ownable(msg.sender) {}
    
    // Verify a user
    function verifyUser(address user) external onlyOwner {
        _verifiedUsers[user] = true;
        emit UserVerified(user);
    }
    
    // Assign a role to a user
    function assignRole(address user, uint8 role) external onlyOwner {
        require(role > 0 && role <= 3, "Invalid role");
        _userRoles[user] = role;
        emit UserRoleAssigned(user, role);
    }
    
    // Check if a user is verified
    function isVerified(address user) external view returns (bool) {
        return _verifiedUsers[user];
    }
    
    // Get a user's role
    function getUserRole(address user) external view returns (uint8) {
        return _userRoles[user];
    }
    
    // Generate a verification message for a user to sign
    function getVerificationMessage(address user) external pure returns (bytes32) {
        return keccak256(abi.encodePacked("Verify Palestine News Hub Account: ", user));
    }
}
