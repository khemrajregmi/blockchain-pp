'use client';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { EthereumProvider } from '@walletconnect/ethereum-provider';

// Extend the Window interface to include phantom
declare global {
    interface Window {
        phantom?: {
            solana?: {
                connect: () => Promise<any>;
                disconnect: () => Promise<void>;
                publicKey?: { toString: () => string };
            };
        };
        ethereum?: any;
    }
}

interface WalletModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const WalletModal = ({ isOpen, onClose }: WalletModalProps) => {
    const [loading, setLoading] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [connectedWallets, setConnectedWallets] = useState<Record<string, string>>({});

    // Cleanup on unmount
    useEffect(() => {
        let timeoutId: NodeJS.Timeout | null = null;

        // Cleanup function
        return () => {
            // Clear any pending timeouts
            if (timeoutId) {
                clearTimeout(timeoutId);
            }

            // Disconnect Phantom if connected
            if (window?.phantom?.solana) {
                window.phantom.solana.disconnect().catch(() => {});
            }

            // Cleanup MetaMask events
            if (window.ethereum?.removeListener) {
                const handleAccountsChanged = (accounts: string[]) => {
                    if (accounts.length === 0) {
                        console.log('Please connect to MetaMask.');
                    }
                };
                window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
            }
        };
    }, []);

    const walletOptions = [
        {
            name: 'MetaMask',
            id: 'metamask',
            image: '/wallets/metamask.svg',
            connect: async () => {
                if (!window.ethereum) {
                    throw new Error('Please install MetaMask');
                }
                try {
                    const accounts = await window.ethereum.request({
                        method: 'eth_requestAccounts'
                    });
                    if (!accounts || !accounts[0]) {
                        throw new Error('No accounts found');
                    }
                    type AccountsChangedHandler = (accounts: string[]) => void;
                    const handleAccountsChanged: AccountsChangedHandler = (accounts: string[]) => {
                        if (accounts.length === 0) {
                            console.log('Please connect to MetaMask.');
                        } else {
                            console.log('Account changed:', accounts[0]);
                        }
                    };
                    if (typeof window.ethereum.removeListener === 'function') {
                        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
                    }
                    if (typeof window.ethereum.on === 'function') {
                        window.ethereum.on('accountsChanged', handleAccountsChanged);
                    }
                    return accounts[0];
                } catch (error: any) {
                    if (error.code === 4001) {
                        throw new Error('Please connect your wallet');
                    }
                    if (error.code === -32002) {
                        throw new Error('MetaMask is already processing a request');
                    }
                    throw new Error(error.message || 'Failed to connect to MetaMask');
                }
            }
        },
        {
            name: 'Phantom',
            id: 'phantom',
            image: '/wallets/phantom.jpg',
            connect: async () => {
                try {
                    // Check if window is defined (for SSR)
                    if (typeof window === 'undefined') {
                        throw new Error('Window is not defined');
                    }

                    // Check if Phantom is installed
                    const provider = window?.phantom?.solana;

                    if (!provider) {
                        // window.open('https://phantom.app/', '_blank');
                        throw new Error('Please install Phantom wallet');
                    }

                    try {
                        // Try to connect with timeout
                        const connectWithTimeout = async () => {
                            const connectionPromise = provider.connect();
                            const timeoutPromise = new Promise((_, reject) =>
                                setTimeout(() => reject(new Error('Connection timeout')), 30000)
                            );

                            const response = await Promise.race([
                                connectionPromise,
                                timeoutPromise
                            ]);

                            return response;
                        };

                        const response = await connectWithTimeout();
                        const address = (response as any).publicKey.toString();
                        console.log("Phantom Connected:", address);
                        return address;

                    } catch (err: any) {
                        // Handle specific Phantom errors
                        if (err.code === 4001) {
                            throw new Error('Connection rejected by user');
                        }
                        if (err.message.includes('timeout')) {
                            throw new Error('Connection timed out. Please try again');
                        }
                        throw err;
                    }

                } catch (error: any) {
                    console.error("Phantom connection error:", error);
                    throw new Error(`Phantom: ${error.message || 'Connection failed'}`);
                }
            }
        },
        {
            name: 'Trust Wallet',
            id: 'trust',
            image: '/wallets/Trustwallets.png',
            connect: async () => {
                try {
                    if (!window.ethereum?.isTrust) {
                        window.open('https://trustwallet.com/download', '_blank');
                        throw new Error('Please install Trust Wallet');
                    }

                    const provider = new ethers.BrowserProvider(window.ethereum);
                    const accounts = await provider.send("eth_requestAccounts", []);
                    console.log("Trust Wallet Connected:", accounts[0]);
                    return accounts[0];
                } catch (error) {
                    throw new Error(`Trust Wallet: ${error instanceof Error ? error.message : 'Connection failed'}`);
                }
            }
        },
        {
            name: 'WalletConnect',
            id: 'walletconnect',
            image: '/wallets/walletconnect.png',
            connect: async () => {
                try {
                    if (!process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID) {
                        throw new Error('WalletConnect project ID is not configured');
                    }

                    const provider = await EthereumProvider.init({
                        projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
                        chains: [1],
                        showQrModal: true,
                        metadata: {
                            name: 'checkerchain',
                            description: 'checkerchain',
                            url: window.location.origin,
                            icons: [`${window.location.origin}/icon.png`]
                        }
                    });

                    await provider.enable();
                    const accounts = await provider.request({ method: 'eth_accounts' }) as string[];
                    return accounts[0];
                } catch (error) {
                    throw new Error(`WalletConnect: ${error instanceof Error ? error.message : 'Connection failed'}`);
                }
            }
        },
        {
            name: 'Coinbase',
            id: 'coinbase',
            image: '/wallets/coinbase.svg',
            connect: async () => {
                try {
                    if (!window.ethereum?.isCoinbaseWallet) {
                        window.open('https://www.coinbase.com/wallet/downloads', '_blank');
                        throw new Error('Please install Coinbase Wallet');
                    }

                    const provider = new ethers.BrowserProvider(window.ethereum);
                    const accounts = await provider.send("eth_requestAccounts", []);
                    console.log("Coinbase Wallet Connected:", accounts[0]);
                    return accounts[0];
                } catch (error) {
                    throw new Error(`Coinbase: ${error instanceof Error ? error.message : 'Connection failed'}`);
                }
            }
        }
    ];

    // Function to disconnect current wallet
    const disconnectWallet = async (walletId: string) => {
        try {
            switch (walletId) {
                case 'metamask':
                    if (window.ethereum) {
                        // MetaMask doesn't have a direct disconnect method
                        delete connectedWallets.metamask;
                    }
                    break;
                case 'phantom':
                    if (window.phantom?.solana) {
                        await window.phantom.solana.disconnect();
                        delete connectedWallets.phantom;
                    }
                    break;
                // Add other wallet disconnect cases
            }
            setConnectedWallets({ ...connectedWallets });
        } catch (error) {
            console.error('Error disconnecting wallet:', error);
        }
    };

    const handleWalletConnect = async (wallet: typeof walletOptions[0]) => {
        if (loading) return;

        setLoading(wallet.id);
        setError(null);

        try {
            // If this wallet is already connected, disconnect it first
            if (connectedWallets[wallet.id]) {
                await disconnectWallet(wallet.id);
                setLoading(null);
                return;
            }

            const address = await wallet.connect();

            if (!address) {
                throw new Error('No address returned');
            }

            // Update connected wallets
            setConnectedWallets(prev => ({
                ...prev,
                [wallet.id]: address
            }));

            // Show success message
            console.log(`${wallet.name} Connected: ${address.slice(0, 6)}...${address.slice(-4)}`);

        } catch (error) {
            console.error('Connection error:', error);
            setError(error instanceof Error ? error.message : 'Connection failed');
        } finally {
            setLoading(null);
        }
    };

    return (
        <div className={`fixed inset-0 ${isOpen ? 'flex' : 'hidden'} items-center justify-center z-50`}>
            <div className="fixed inset-0 bg-black/50" onClick={onClose} />

            <div className="bg-white rounded-2xl w-full max-w-2xl mx-4 z-10">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b">
                    <h2 className="text-xl font-semibold">Connect Wallet</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        ✕
                    </button>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="p-4 mx-6 mt-4 bg-red-50 text-red-500 text-sm rounded-lg">
                        {error}
                    </div>
                )}

                {/* Wallet Grid */}
                <div className="p-6">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {walletOptions.map((wallet) => {
                            const isConnected = !!connectedWallets[wallet.id];
                            return (
                                <button
                                    key={wallet.id}
                                    onClick={() => handleWalletConnect(wallet)}
                                    disabled={!!loading && loading !== wallet.id}
                                    className={`
                                        flex flex-col items-center justify-center p-4 border rounded-xl
                                        transition-all hover:shadow-md space-y-2
                                        ${loading === wallet.id ? 'bg-gray-50 cursor-wait' : ''}
                                        ${isConnected ? 'border-green-500 bg-green-50' : 'hover:border-gray-400'}
                                        ${loading && loading !== wallet.id ? 'opacity-50 cursor-not-allowed' : ''}
                                    `}
                                >
                                    <div className="w-12 h-12 relative flex items-center justify-center">
                                        <img
                                            src={wallet.image}
                                            alt={wallet.name}
                                            className="object-contain w-12 h-12"
                                        />
                                    </div>
                                    <span className="text-sm font-medium text-center">
                                        {loading === wallet.id
                                            ? 'Connecting...'
                                            : isConnected
                                                ? 'Connected'
                                                : wallet.name}
                                    </span>
                                    {isConnected && (
                                        <span className="text-xs text-green-600">
                                            {connectedWallets[wallet.id].slice(0, 6)}...
                                            {connectedWallets[wallet.id].slice(-4)}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Connected Wallets Summary */}
                {Object.keys(connectedWallets).length > 0 && (
                    <div className="border-t p-4">
                        <h3 className="text-sm font-medium mb-2">Connected Wallets:</h3>
                        <div className="space-y-2">
                            {Object.entries(connectedWallets).map(([id, address]) => (
                                <div key={id} className="flex items-center justify-between text-sm">
                                    <span>{walletOptions.find(w => w.id === id)?.name}</span>
                                    <span className="text-gray-500">
                                        {address.slice(0, 6)}...{address.slice(-4)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Footer */}
                <div className="border-t p-4">
                    <p className="text-sm text-gray-500 text-center">
                        New to Web3?{' '}
                        <a href="#" className="text-blue-500 hover:text-blue-600">
                            Learn more about wallets
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default WalletModal;
