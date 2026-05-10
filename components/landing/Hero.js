import React from 'react';
import "./Hero.css"
import ThemeToggle from "@/components/landing/ThemeToggle";

import editorImgDark from './images/editor-dark.png';
import editorImgLight from './images/editor-light.png';
import Badge from "@/components/landing/Badge";

const Hero = ({ theme, onToggleTheme, onCreateRoom, onJoinRoom, onReenter }) => {
    return (
        <div className="hero-container">
            {/* Background Glows */}
            <div className="hero-glow hero-glow-1"></div>
            <div className="hero-glow hero-glow-2"></div>
            <div className="hero-glow hero-glow-3"></div>
            <div className="hero-glow hero-glow-4"></div>
            <div className="hero-glow hero-glow-5"></div>
            <div className="hero-glow hero-glow-6"></div>

            <Nav theme={theme} onToggleTheme={onToggleTheme} onCreateRoom={onCreateRoom} onJoinRoom={onJoinRoom} onReenter={onReenter} />
            <div className="hero-content">
                <div className="hero-text-content">
                    <h1 className="landing-title">
                        Your team's ideas,<br/>one <span className="highlight-encrypted">encrypted</span> workspace.
                    </h1>
                    
                    <p className="landing-subtitle hero-subtitle-wide">
                        A sophisticated workspace designed for visual thinkers.<br/>
                        Experience real-time collaboration with professional-grade tools.
                    </p>

                    <div className="hero-features">
                        <span className="hero-feature-badge"><i className="fa-solid fa-lock" /> End-to-End Encrypted</span>
                        <span className="hero-feature-badge"><i className="fa-solid fa-bolt" /> Real-Time Collaboration</span>
                        <span className="hero-feature-badge"><i className="fa-solid fa-layer-group" /> Multi-Page Workspaces</span>
                        <span className="hero-feature-badge"><i className="fa-solid fa-pen-nib" /> Rich Text Editor</span>
                        <span className="hero-feature-badge"><i className="fa-solid fa-file-export" /> Export Anywhere</span>
                    </div>
                </div>

                <div className="hero-image-wrapper">
                    <img src={theme === 'dark' ? editorImgDark.src : editorImgLight.src} alt="Editor Preview" className="hero-editor-image" />
                </div>
            </div>
        </div>
    );
};


const Nav = ({ theme, onToggleTheme, onCreateRoom, onJoinRoom, onReenter }) => {
    return (
        <nav className={"landing_nav"}>
            <div className={"nav_brand"}>
                <i className="fa-solid fa-layer-group" style={{ color: 'var(--accent-primary)', marginRight: '8px' }}></i>
                <span className="brand_text">TeamNotes</span>
            </div>
            <div className={"nav_actions"}>
                <ThemeToggle theme={theme} onToggle={onToggleTheme} />
                <button className="nav-btn nav-btn-outline" onClick={onReenter} style={{ border: 'none', background: 'transparent' }}>
                    Rejoin Room
                </button>
                <button className="nav-btn nav-btn-outline" onClick={onJoinRoom}>
                    Join Room
                </button>
                <button className="nav-btn nav-btn-primary" onClick={onCreateRoom}>
                    Create Room
                </button>
            </div>
        </nav>
    )
}

export default Hero;