import React from 'react';
import './Landing.css';

const Landing = ({ onGetStarted }) => {
    return (
        <div className="landing-container">
            <div className="blob blob-1"></div>
            <div className="blob blob-2"></div>

            <section className="hero-section">
                <div className="hero-badge">Next Gen AI NFT Creation</div>
                <h1>Turn Your Dreams Into Digital Assets</h1>
                <p className="motto">
                    The intersection of artificial intelligence and blockchain.
                    Generate unique, professional-grade artwork instantly and mint it as a forever asset
                    on the decentralized web.
                </p>
                <div className="cta-group">
                    <button className="btn-primary" onClick={onGetStarted}>
                        Get Started for Free
                    </button>
                    <button className="btn-secondary">
                        View Gallery
                    </button>
                </div>
            </section>

            <div className="features-grid">
                <div className="feature-card">
                    <div className="feature-icon">✨</div>
                    <h3>AI Image Generation</h3>
                    <p>Powered by Flux.1-schnell for the fastest and most detailed artistic outputs.</p>
                </div>
                <div className="feature-card">
                    <div className="feature-icon">⛓️</div>
                    <h3>One-Click Minting</h3>
                    <p>Deploy your art directly to the Hardhat/Polygon network with smart contract security.</p>
                </div>
                <div className="feature-card">
                    <div className="feature-icon">☁️</div>
                    <h3>IPFS Backed</h3>
                    <p>Decentralized storage via Pinata ensures your NFT metadata is permanent and accessible.</p>
                </div>
            </div>
        </div>
    );
};

export default Landing;
