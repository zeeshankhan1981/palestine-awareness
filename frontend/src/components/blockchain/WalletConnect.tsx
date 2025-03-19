import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { FaWallet, FaSignOutAlt, FaUserCheck } from 'react-icons/fa';

interface WalletConnectProps {
  onConnect?: (address: string) => void;
  onDisconnect?: () => void;
}

const WalletConnect: React.FC<WalletConnectProps> = ({ onConnect, onDisconnect }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if wallet was previously connected
    const checkConnection = async () => {
      if (window.ethereum) {
        try {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const accounts = await provider.listAccounts();
          
          if (accounts.length > 0) {
            setAccount(accounts[0]);
            onConnect?.(accounts[0]);
          }
        } catch (err) {
          console.error('Error checking connection:', err);
        }
      }
    };
    
    checkConnection();
  }, [onConnect]);

  const connectWallet = async () => {
    if (!window.ethereum) {
      setError('MetaMask is not installed. Please install MetaMask to connect.');
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        onConnect?.(accounts[0]);
      }
    } catch (err: any) {
      console.error('Error connecting to wallet:', err);
      setError(err.message || 'Failed to connect wallet. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    onDisconnect?.();
  };

  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <div className="wallet-connect">
      {account ? (
        <div className="flex items-center">
          <span className="flex items-center mr-2 text-sm">
            <FaUserCheck className="text-green-500 mr-2" />
            {formatAddress(account)}
          </span>
          <button
            onClick={disconnectWallet}
            className="btn btn-sm btn-secondary"
            title="Disconnect wallet"
          >
            <FaSignOutAlt />
          </button>
        </div>
      ) : (
        <button
          onClick={connectWallet}
          disabled={isConnecting}
          className="btn btn-sm btn-primary"
        >
          {isConnecting ? (
            <>Connecting...</>
          ) : (
            <>
              <FaWallet className="mr-2" />
              Connect Wallet
            </>
          )}
        </button>
      )}
      
      {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
    </div>
  );
};

export default WalletConnect;
