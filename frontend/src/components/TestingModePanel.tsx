import React, { useState, useEffect } from 'react';
import { FaTools, FaWallet, FaUserShield, FaCheck, FaExclamationTriangle } from 'react-icons/fa';
import { useBlockchain } from '../contexts/BlockchainContext';
import { UserRole, updateUserRole } from '../services/blockchainService';

const TestingModePanel: React.FC = () => {
  const { account, isConnected, userRole } = useBlockchain();
  const [expanded, setExpanded] = useState(false);
  const [newRole, setNewRole] = useState<UserRole>(UserRole.Reader);
  const [message, setMessage] = useState<string | null>(null);

  // Reset message after 5 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleRoleChange = async () => {
    if (!account) return;
    
    try {
      const success = await updateUserRole(account, newRole);
      if (success) {
        setMessage(`Role updated successfully to ${getRoleName(newRole)}`);
      } else {
        setMessage('Failed to update role');
      }
    } catch (error) {
      console.error('Error updating role:', error);
      setMessage('Error updating role');
    }
  };

  const getRoleName = (role: UserRole): string => {
    switch (role) {
      case UserRole.Reader:
        return 'Reader';
      case UserRole.Contributor:
        return 'Contributor';
      case UserRole.Editor:
        return 'Editor';
      default:
        return 'Unassigned';
    }
  };

  if (!expanded) {
    return (
      <div 
        className="fixed bottom-4 right-4 bg-palestine-red text-white p-3 rounded-full shadow-lg cursor-pointer"
        onClick={() => setExpanded(true)}
        title="Testing Mode Tools"
      >
        <FaTools />
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg border border-palestine-red w-80">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold flex items-center">
          <FaTools className="mr-2 text-palestine-red" />
          Testing Mode Tools
        </h3>
        <button 
          className="text-gray-500 hover:text-gray-700"
          onClick={() => setExpanded(false)}
        >
          ×
        </button>
      </div>

      <div className="mb-4 p-2 bg-yellow-50 border border-yellow-200 rounded">
        <div className="flex items-center text-yellow-800">
          <FaExclamationTriangle className="mr-2 text-yellow-600" />
          <span className="text-sm">These tools are only available in testing mode.</span>
        </div>
      </div>

      <div className="mb-4">
        <h4 className="font-medium mb-2 flex items-center">
          <FaWallet className="mr-2 text-gray-600" />
          Wallet Status
        </h4>
        {isConnected ? (
          <div className="bg-green-50 p-2 rounded border border-green-200">
            <p className="text-sm text-green-800 flex items-center">
              <FaCheck className="mr-2 text-green-600" />
              Connected: {account?.substring(0, 6)}...{account?.substring(account.length - 4)}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Current Role: {getRoleName(userRole)}
            </p>
          </div>
        ) : (
          <div className="bg-gray-50 p-2 rounded border border-gray-200">
            <p className="text-sm text-gray-600">Not connected</p>
          </div>
        )}
      </div>

      {isConnected && (
        <div className="mb-4">
          <h4 className="font-medium mb-2 flex items-center">
            <FaUserShield className="mr-2 text-gray-600" />
            Change User Role
          </h4>
          <div className="flex items-center">
            <select 
              className="form-select border border-gray-300 rounded p-2 mr-2 flex-grow"
              value={newRole}
              onChange={(e) => setNewRole(Number(e.target.value) as UserRole)}
            >
              <option value={UserRole.Reader}>Reader</option>
              <option value={UserRole.Contributor}>Contributor</option>
              <option value={UserRole.Editor}>Editor</option>
            </select>
            <button 
              className="btn btn-sm btn-primary"
              onClick={handleRoleChange}
            >
              Update
            </button>
          </div>
        </div>
      )}

      {message && (
        <div className="mt-4 p-2 bg-blue-50 border border-blue-200 rounded">
          <p className="text-sm text-blue-800">{message}</p>
        </div>
      )}

      <div className="mt-6 text-xs text-gray-500">
        <p>Testing Mode allows you to simulate blockchain interactions without actual on-chain transactions.</p>
      </div>
    </div>
  );
};

export default TestingModePanel;
