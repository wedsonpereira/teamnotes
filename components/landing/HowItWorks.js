"use client";

import React, { useEffect, useRef } from 'react';
import './HowItWorks.css';

const steps = [
    {
        num: 1,
        title: "Create a Room",
        desc: "Enter your name and email, choose a Room ID (or let us generate one), and set a Room Key (password). That's it — your encrypted workspace is ready.",
        icon: "fa-solid fa-door-open"
    },
    {
        num: 2,
        title: "Share the Credentials",
        desc: "Share the Room ID and Room Key with your teammates via your preferred secure channel. Or invite them directly by email — they'll receive a one-click join link.",
        icon: "fa-solid fa-share-nodes"
    },
    {
        num: 3,
        title: "Collaborate in Real-Time",
        desc: "Everyone types simultaneously. Changes appear instantly. Author colors show who wrote what. Your content is encrypted before it touches the server.",
        icon: "fa-solid fa-keyboard"
    },
    {
        num: 4,
        title: "Export & Share",
        desc: "When you're done, export your work as PDF, DOCX, or Markdown. Your encrypted content is decrypted locally in your browser and converted to the format you choose.",
        icon: "fa-solid fa-file-export"
    }
];

export default function HowItWorks() {
    const sectionRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, { threshold: 0.1 });

        const cards = sectionRef.current?.querySelectorAll('.how-step');
        cards?.forEach(card => observer.observe(card));

        return () => observer.disconnect();
    }, []);

    return (
        <section className="how-section" ref={sectionRef}>
            <div className="how-header">
                <h2 className="how-title">How It Works</h2>
                <p className="how-subtitle">Get started with secure collaboration in four simple steps</p>
            </div>
            
            <div className="how-grid">
                {steps.map((step, idx) => (
                    <div className="how-step" key={idx} style={{ animationDelay: `${idx * 0.15}s` }}>
                        <div className="how-icon-wrapper">
                            <i className={step.icon}></i>
                            <div className="step-number">{step.num}</div>
                        </div>
                        <h3 className="how-step-title">{step.title}</h3>
                        <p className="how-step-desc">{step.desc}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
