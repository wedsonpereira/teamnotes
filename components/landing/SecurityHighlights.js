"use client";

import React, { useEffect, useRef } from 'react';
import './SecurityHighlights.css';

const securityFeatures = [
    {
        title: "Encryption",
        desc: "AES-256-GCM — military-grade, client-side encryption",
        icon: "fa-solid fa-lock"
    },
    {
        title: "Key Derivation",
        desc: "PBKDF2 with 100,000 iterations and SHA-256",
        icon: "fa-solid fa-key"
    },
    {
        title: "Password Storage",
        desc: "bcrypt with cost factor 10 — room keys are never stored in plaintext",
        icon: "fa-solid fa-database"
    },
    {
        title: "Session Security",
        desc: "HMAC-SHA256 signed cookies, HttpOnly, Secure, SameSite=Lax",
        icon: "fa-solid fa-shield-halved"
    },
    {
        title: "CSRF Protection",
        desc: "Origin header validation on all state-changing requests",
        icon: "fa-solid fa-shield"
    },
    {
        title: "Rate Limiting",
        desc: "IP-based throttling on all authentication endpoints",
        icon: "fa-solid fa-stopwatch"
    },
    {
        title: "Content Security",
        desc: "CSP headers, X-Frame-Options, HSTS, and Permissions-Policy",
        icon: "fa-solid fa-globe"
    },
    {
        title: "Zero Knowledge",
        desc: "The server never sees your plaintext content or your room key",
        icon: "fa-solid fa-eye-slash"
    }
];

export default function SecurityHighlights() {
    const sectionRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, { threshold: 0.1 });

        const cards = sectionRef.current?.querySelectorAll('.security-card');
        cards?.forEach(card => observer.observe(card));

        return () => observer.disconnect();
    }, []);

    return (
        <section className="security-section" ref={sectionRef}>
            <div className="security-header">
                <h2 className="security-title">Security Highlights</h2>
                <p className="security-subtitle">How We Protect Your Data</p>
            </div>
            
            <div className="security-grid">
                {securityFeatures.map((feature, idx) => (
                    <div className="security-card" key={idx} style={{ animationDelay: `${idx * 0.1}s` }}>
                        <div className="security-icon">
                            <i className={feature.icon}></i>
                        </div>
                        <div className="security-info">
                            <h3 className="security-item-title">{feature.title}</h3>
                            <p className="security-item-desc">{feature.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
