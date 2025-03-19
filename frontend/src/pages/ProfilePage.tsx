import React, { useState } from 'react';
import { FaWallet, FaUserCheck, FaUserTimes, FaKey } from 'react-icons/fa';
import { useBlockchain } from '../contexts/BlockchainContext';
import { UserRole, signVerificationMessage } from '../services/blockchainService';

const ProfilePage: React.FC = () => {
  const { account, isConnected, isVerified, userRole, verifyUser } = useBlockchain();
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [verificationSuccess, setVerificationSuccess] = useState(false);

  const handleVerify = async () => {
    if (!account) return;
    
    setIsVerifying(true);
    setVerificationError(null);
    setVerificationSuccess(false);
    
    try {
      // Sign a message to verify identity
      await signVerificationMessage(account);
      
      // Call the verifyUser function from the context
      await verifyUser();
      
      setVerificationSuccess(true);
    } catch (error: any) {
      console.error('Verification error:', error);
      setVerificationError(error.message || 'Failed to verify. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const getRoleName = (role: UserRole) => {
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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
      
      {!isConnected ? (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex flex-col items-center justify-center py-8">
            <FaWallet className="text-5xl text-gray-400 mb-4" />
            <h2 className="text-xl font-medium mb-2">Wallet Not Connected</h2>
            <p className="text-gray-600 mb-4 text-center">
              Connect your wallet to access your profile and verification status.
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-4">Wallet Information</h2>
            <div className="flex items-center mb-2">
              <FaWallet className="text-lg mr-2 text-gray-600" />
              <span className="font-medium">Address:</span>
              <span className="ml-2 text-sm font-mono bg-gray-100 p-1 rounded">
                {account}
              </span>
            </div>
          </div>
          
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-4">Verification Status</h2>
            <div className="flex items-center mb-4">
              {isVerified ? (
                <>
                  <FaUserCheck className="text-lg mr-2 text-green-600" />
                  <span className="font-medium text-green-600">Verified</span>
                </>
              ) : (
                <>
                  <FaUserTimes className="text-lg mr-2 text-red-600" />
                  <span className="font-medium text-red-600">Not Verified</span>
                </>
              )}
            </div>
            
            {isVerified && (
              <div className="flex items-center mb-2">
                <FaKey className="text-lg mr-2 text-gray-600" />
                <span className="font-medium">Role:</span>
                <span className="ml-2 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                  {getRoleName(userRole)}
                </span>
              </div>
            )}
            
            {!isVerified && (
              <div className="mt-4">
                <button
                  onClick={handleVerify}
                  disabled={isVerifying}
                  className="btn btn-primary"
                >
                  {isVerifying ? 'Verifying...' : 'Verify Your Account'}
                </button>
                
                {verificationError && (
                  <div className="mt-2 text-red-600 text-sm">{verificationError}</div>
                )}
                
                {verificationSuccess && (
                  <div className="mt-2 text-green-600 text-sm">
                    Verification successful! You are now verified.
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div className="mt-6 border-t pt-6">
            <h2 className="text-xl font-bold mb-4">What You Can Do</h2>
            <ul className="list-disc pl-5 space-y-2">
              {userRole >= UserRole.Reader && (
                <li>Read and access all verified articles</li>
              )}
              {userRole >= UserRole.Contributor && (
                <li>Submit new articles for verification</li>
              )}
              {userRole >= UserRole.Editor && (
                <li>Review and approve submitted articles</li>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
