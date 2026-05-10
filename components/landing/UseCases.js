"use client";

import React, { useEffect, useRef } from 'react';
import './UseCases.css';

const useCases = [
    {
        title: "Meeting Notes",
        emoji: "📝",
        desc: "Capture meeting notes together in real-time. Everyone contributes, nobody misses a detail. Export to PDF when you're done and share with stakeholders."
    },
    {
        title: "Brainstorming",
        emoji: "💡",
        desc: "Create a shared space for ideas. Multiple pages let you organize brainstorms by topic. Color-coded author attribution shows who contributed what."
    },
    {
        title: "Project Documentation",
        emoji: "📋",
        desc: "Build project specs, technical docs, and requirements together. Rich formatting gives you professional-looking documents without leaving the editor."
    },
    {
        title: "Study Groups",
        emoji: "🎓",
        desc: "Students can collaborate on study notes, share resources, and prepare for exams together in a private, encrypted workspace."
    },
    {
        title: "Task Management",
        emoji: "✅",
        desc: "Use checkbox lists to track tasks and action items. Everyone on the team can see and update progress in real-time."
    },
    {
        title: "Confidential Documents",
        emoji: "🔒",
        desc: "When privacy matters, TeamNotes delivers. Legal teams, HR departments, and executives can collaborate on sensitive documents with confidence that only room members can read the content."
    }
];

export default function UseCases() {
    const sectionRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, { threshold: 0.1 });

        const cards = sectionRef.current?.querySelectorAll('.usecase-card');
        cards?.forEach(card => observer.observe(card));

        return () => observer.disconnect();
    }, []);

    return (
        <section className="usecases-section" ref={sectionRef}>
            <div className="usecases-header">
                <h2 className="usecases-title">Use Cases</h2>
                <p className="usecases-subtitle">Designed for every team, built for every workflow</p>
            </div>
            
            <div className="usecases-grid">
                {useCases.map((useCase, idx) => (
                    <div className="usecase-card" key={idx} style={{ animationDelay: `${idx * 0.1}s` }}>
                        <div className="usecase-icon">{useCase.emoji}</div>
                        <h3 className="usecase-item-title">{useCase.title}</h3>
                        <p className="usecase-item-desc">{useCase.desc}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
