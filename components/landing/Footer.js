"use client";

import React from 'react';
import './Footer.css';

export default function Footer({ onOpenModal }) {
    return (
        <footer className="footer-section">
            <div className="footer-container">
                <div className="footer-top-grid">
                    <div className="footer-column">
                        <div className="footer-brand">
                            <i className="fa-solid fa-layer-group footer-icon"></i>
                            <span className="footer-name">TeamNotes</span>
                        </div>
                        <p className="footer-desc">
                            Secure, real-time workspace for teams.
                        </p>
                        <div className="footer-socials">
                            <a href="https://x.com/wedsonpereira14" target="_blank" rel="noopener noreferrer" className="social-icon"><i className="fa-brands fa-x-twitter"></i></a>
                            <a href="https://github.com/wedsonpereira" target="_blank" rel="noopener noreferrer" className="social-icon"><i className="fa-brands fa-github"></i></a>
                            <a href="https://instagram.com/mr.wedson" target="_blank" rel="noopener noreferrer" className="social-icon"><i className="fa-brands fa-instagram"></i></a>
                            <a href="mailto:wedsonp424@gmail.com" className="social-icon"><i className="fa-solid fa-envelope"></i></a>
                        </div>
                    </div>
                    <div className="footer-column">
                        <h4 className="footer-col-title">Product</h4>
                        <button className="footer-link" onClick={() => onOpenModal('create')}>Create Room</button>
                        <button className="footer-link" onClick={() => onOpenModal('join')}>Join Room</button>
                        <a href="/guide" className="footer-link">How to Use Guide</a>
                    </div>
                    <div className="footer-column">
                        <h4 className="footer-col-title">Support</h4>
                        <a href="#" className="footer-link">Report Bugs</a>
                        <a href="mailto:wedsonp424@gmail.com" className="footer-link">Contact Us</a>
                    </div>
                    <div className="footer-column">
                        <h4 className="footer-col-title">Legal</h4>
                        <button className="footer-link" onClick={() => onOpenModal('privacy')}>Privacy Policy</button>
                        <button className="footer-link" onClick={() => onOpenModal('terms')}>Terms & Conditions</button>
                    </div>
                </div>

                <div className="footer-features">
                    <span className="footer-feature-badge"><i className="fa-solid fa-lock" /> End-to-End Encrypted</span>
                    <span className="footer-feature-badge"><i className="fa-solid fa-bolt" /> Real-Time Collaboration</span>
                    <span className="footer-feature-badge"><i className="fa-solid fa-layer-group" /> Multi-Page Workspaces</span>
                    <span className="footer-feature-badge"><i className="fa-solid fa-pen-nib" /> Rich Text Editor</span>
                </div>

                <p className="footer-tagline">
                    Encrypted Real-Time Collaborative Editor for Teams
                </p>

                <div className="footer-giant-text">
                    TEAMNOTES
                </div>

                <div className="footer-bottom">
                    <p className="footer-copyright">&copy; {new Date().getFullYear()} TeamNotes. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
