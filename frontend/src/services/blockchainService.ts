import { ethers } from 'ethers';

// This will be replaced with the actual contract address after deployment
const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS || '';
console.log('Using contract address:', CONTRACT_ADDRESS);

// ABI for the UserVerification contract
const USER_VERIFICATION_ABI = [
  "function verifyUser(address user) external",
  "function assignRole(address user, uint8 role) external",
  "function isVerified(address user) external view returns (bool)",
  "function getUserRole(address user) external view returns (uint8)",
  "function getVerificationMessage(address user) external pure returns (bytes32)"
];

// Role definitions
export enum UserRole {
  Unassigned = 0,
  Reader = 1,
  Contributor = 2,
  Editor = 3
}

// Get provider and signer
export const getProviderAndSigner = async () => {
  if (!window.ethereum) {
    throw new Error('MetaMask is not installed');
  }

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send('eth_requestAccounts', []);
  const signer = provider.getSigner();
  return { provider, signer };
};

// Get contract instance
export const getUserVerificationContract = async (signer?: ethers.Signer) => {
  if (!CONTRACT_ADDRESS) {
    throw new Error('Contract address not configured');
  }

  if (!signer) {
    const { signer: newSigner } = await getProviderAndSigner();
    signer = newSigner;
  }

  return new ethers.Contract(CONTRACT_ADDRESS, USER_VERIFICATION_ABI, signer);
};

// Check if a user is verified
export const isUserVerified = async (address: string): Promise<boolean> => {
  try {
    const { provider } = await getProviderAndSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, USER_VERIFICATION_ABI, provider);
    return await contract.isVerified(address);
  } catch (error) {
    console.error('Error checking user verification:', error);
    return false;
  }
};

// Get user role
export const getUserRole = async (address: string): Promise<UserRole> => {
  try {
    const { provider } = await getProviderAndSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, USER_VERIFICATION_ABI, provider);
    const role = await contract.getUserRole(address);
    return role as UserRole;
  } catch (error) {
    console.error('Error getting user role:', error);
    return UserRole.Unassigned;
  }
};

// Sign a message to verify user identity
export const signVerificationMessage = async (address: string): Promise<string> => {
  try {
    const { signer } = await getProviderAndSigner();
    const userAddress = await signer.getAddress();
    
    // Create a simple message for the user to sign
    const message = `Verify Palestine News Hub Account: ${userAddress}`;
    
    // Sign the message
    return await signer.signMessage(message);
  } catch (error) {
    console.error('Error signing verification message:', error);
    throw error;
  }
};

// For development/testing: Mock verification
export const mockVerifyUser = async (address: string): Promise<boolean> => {
  console.log(`Mock verifying user: ${address}`);
  // In a real implementation, this would call the contract
  return true;
};
