"use client";

import React, { useState, useRef, useEffect } from 'react';
import './FAQ.css';

const faqs = [
    { question: "Is TeamNotes free?", answer: "Yes. TeamNotes is completely free to use with no feature limitations." },
    { question: "Do I need to create an account?", answer: "No. Just enter your name and email when you create or join a room. There's no sign-up process or email verification required." },
    { question: "Can the server read my documents?", answer: "No. All content is encrypted in your browser using AES-256-GCM before being sent to the server. The server only stores encrypted data — it cannot decrypt your content." },
    { question: "What happens if I lose my Room Key?", answer: "Room admins can reset the Room Key via the \"Forgot Key\" flow. A reset link is sent to the admin's email. Note that resetting the key changes the encryption key, so previously encrypted content must be re-encrypted." },
    { question: "How many people can collaborate in a room?", answer: "There's no hard limit. TeamNotes is designed for teams of all sizes, though it works best for groups of 2–20 collaborators." },
    { question: "Can I use TeamNotes on mobile?", answer: "Yes. TeamNotes is fully responsive and works on phones and tablets, though the best editing experience is on desktop." },
    { question: "Is my data backed up?", answer: "Your encrypted content is automatically saved to the server. The server stores the encrypted data persistently, but only your team can decrypt it." },
    { question: "Can I self-host TeamNotes?", answer: "Yes. TeamNotes is built with Next.js, PostgreSQL, and Socket.IO. You can deploy it on your own infrastructure for complete control over your data." }
];

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState(0); // first open by default
    const sectionRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, { threshold: 0.1 });

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    const toggleFaq = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="faq-section" ref={sectionRef}>
            <div className="faq-container">
                <div className="faq-left">
                    <h2 className="faq-title">Frequently Asked Questions</h2>
                    <p className="faq-subtitle">Everything you need to know about TeamNotes and how it protects your data.</p>
                </div>
                
                <div className="faq-right">
                    <div className="faq-accordion">
                        {faqs.map((faq, idx) => (
                            <div 
                                key={idx} 
                                className={`faq-item ${openIndex === idx ? 'active' : ''}`}
                            >
                                <button 
                                    className="faq-question" 
                                    onClick={() => toggleFaq(idx)}
                                    aria-expanded={openIndex === idx}
                                >
                                    <span className="faq-question-text">{faq.question}</span>
                                    <span className="faq-icon">
                                        <i className={`fa-solid fa-chevron-down`}></i>
                                    </span>
                                </button>
                                <div className="faq-answer-wrapper">
                                    <div className="faq-answer-inner">
                                        <p className="faq-answer">{faq.answer}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
