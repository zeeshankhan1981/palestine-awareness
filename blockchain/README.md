# Palestine News Hub - Blockchain Component

This directory contains the blockchain components for the Palestine News Hub project, which enables user verification through wallet connections.

## Features

- User verification through wallet signatures
- Role-based access control (reader, contributor, editor)
- Smart contract for managing user verification and roles

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Create a `.env` file based on `.env.example` with your private keys and API keys.

3. Compile the contracts:
   ```
   npm run compile
   ```

4. Start a local blockchain node:
   ```
   npm run node
   ```

5. Deploy the contracts to the local blockchain:
   ```
   npm run deploy:local
   ```

## Contract Details

### UserVerification.sol

This contract handles user verification and role assignment:

- `verifyUser(address user)`: Verifies a user (admin only)
- `assignRole(address user, uint8 role)`: Assigns a role to a user (admin only)
- `isVerified(address user)`: Checks if a user is verified
- `getUserRole(address user)`: Gets a user's role
- `getVerificationMessage(address user)`: Generates a verification message for signing

## Roles

- 0: Unassigned (default)
- 1: Reader
- 2: Contributor
- 3: Editor

## Integration with Frontend

The frontend will connect to this contract to verify users and manage roles, providing a secure and decentralized authentication system.
