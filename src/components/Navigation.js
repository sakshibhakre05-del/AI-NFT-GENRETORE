import { ethers } from 'ethers';
import { useAuth } from './AuthContext';

const Navigation = ({ account, setAccount }) => {
    const { user, logout } = useAuth();

    const connectHandler = async () => {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const account = ethers.utils.getAddress(accounts[0])
        setAccount(account);
    }

    return (
        <nav>
            <div className='nav__brand'>
                <h1>AI NFT Generator</h1>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', paddingRight: '20px' }}>
                {user && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <span style={{ color: '#666' }}>Welcome, <strong>{user.name}</strong></span>
                        <button className="logout-btn" onClick={logout}>Logout</button>
                    </div>
                )}

                {account ? (
                    <button
                        type="button"
                        className='nav__connect'
                    >
                        {account.slice(0, 6) + '...' + account.slice(38, 42)}
                    </button>
                ) : (
                    <button
                        type="button"
                        className='nav__connect'
                        onClick={connectHandler}
                    >
                        Connect
                    </button>
                )}
            </div>
        </nav>
    );
}

export default Navigation;