import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ethers } from 'ethers';
import { isUserVerified, getUserRole, UserRole } from '../services/blockchainService';

interface BlockchainContextType {
  account: string | null;
  isConnected: boolean;
  isVerified: boolean;
  userRole: UserRole;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  verifyUser: () => Promise<void>;
}

const BlockchainContext = createContext<BlockchainContextType>({
  account: null,
  isConnected: false,
  isVerified: false,
  userRole: UserRole.Unassigned,
  connectWallet: async () => {},
  disconnectWallet: () => {},
  verifyUser: async () => {},
});

export const useBlockchain = () => useContext(BlockchainContext);

interface BlockchainProviderProps {
  children: ReactNode;
}

export const BlockchainProvider: React.FC<BlockchainProviderProps> = ({ children }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>(UserRole.Unassigned);

  useEffect(() => {
    // Check if wallet was previously connected
    const checkConnection = async () => {
      if (window.ethereum) {
        try {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const accounts = await provider.listAccounts();
          
          if (accounts.length > 0) {
            setAccount(accounts[0]);
            
            // Check verification status and role
            const verified = await isUserVerified(accounts[0]);
            setIsVerified(verified);
            
            const role = await getUserRole(accounts[0]);
            setUserRole(role);
          }
        } catch (err) {
          console.error('Error checking connection:', err);
        }
      }
    };
    
    checkConnection();
    
    // Listen for account changes
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          setAccount(null);
          setIsVerified(false);
          setUserRole(UserRole.Unassigned);
        }
      });
    }
    
    return () => {
      // Clean up listeners
      if (window.ethereum) {
        window.ethereum.removeAllListeners('accountsChanged');
      }
    };
  }, []);
  
  const connectWallet = async () => {
    if (!window.ethereum) {
      throw new Error('MetaMask is not installed');
    }
    
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        
        // Check verification status and role
        const verified = await isUserVerified(accounts[0]);
        setIsVerified(verified);
        
        const role = await getUserRole(accounts[0]);
        setUserRole(role);
      }
    } catch (err) {
      console.error('Error connecting to wallet:', err);
      throw err;
    }
  };
  
  const disconnectWallet = () => {
    setAccount(null);
    setIsVerified(false);
    setUserRole(UserRole.Unassigned);
  };
  
  const verifyUser = async () => {
    if (!account) {
      throw new Error('No wallet connected');
    }
    
    try {
      // In a real implementation, this would call the contract
      // For now, we'll just mock it
      setIsVerified(true);
      setUserRole(UserRole.Reader);
    } catch (err) {
      console.error('Error verifying user:', err);
      throw err;
    }
  };
  
  return (
    <BlockchainContext.Provider
      value={{
        account,
        isConnected: !!account,
        isVerified,
        userRole,
        connectWallet,
        disconnectWallet,
        verifyUser,
      }}
    >
      {children}
    </BlockchainContext.Provider>
  );
};

// Add TypeScript declarations for window.ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}
