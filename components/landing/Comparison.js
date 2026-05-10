import React, { useEffect, useRef } from 'react';
import './Comparison.css';

const comparisonData = [
    { feature: "End-to-end encryption", us: true, docs: false, notion: false },
    { feature: "No account required", us: true, docs: false, notion: false },
    { feature: "Real-time collaboration", us: true, docs: true, notion: true },
    { feature: "Self-hostable", us: true, docs: false, notion: false },
    { feature: "Zero-knowledge server", us: true, docs: false, notion: false },
    { feature: "Multi-page workspaces", us: true, docs: false, notion: true },
    { feature: "Rich text editing", us: true, docs: true, notion: true },
    { feature: "Free to use", us: true, docs: true, notion: "Freemium" },
];

export default function Comparison() {
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

    const renderIcon = (value) => {
        if (value === true) return <i className="fa-solid fa-check check-icon"></i>;
        if (value === false) return <i className="fa-solid fa-xmark x-icon"></i>;
        return <span className="text-value">{value}</span>;
    };

    return (
        <section className="comparison-section animate-in" ref={sectionRef}>
            <div className="comparison-header" style={{ position: 'relative' }}>
                <h2 className="comparison-title">Why TeamNotes?</h2>
                <p className="comparison-subtitle">See how we stack up against the alternatives</p>
            </div>
            
            <div className="comparison-wrapper">
                <div className="comparison-animated-border"></div>
                <div className="comparison-grid">
                    {/* Header Row */}
                    <div className="comp-cell comp-header comp-feature-header">Feature</div>
                    <div className="comp-cell comp-header comp-us-header">TeamNotes</div>
                    <div className="comp-cell comp-header comp-competitor">Google Docs</div>
                    <div className="comp-cell comp-header comp-competitor">Notion</div>

                    {/* Data Rows */}
                    {comparisonData.map((row, idx) => (
                        <React.Fragment key={idx}>
                            <div className="comp-cell comp-feature">{row.feature}</div>
                            <div className="comp-cell comp-us">{renderIcon(row.us)}</div>
                            <div className="comp-cell comp-them">{renderIcon(row.docs)}</div>
                            <div className="comp-cell comp-them">{renderIcon(row.notion)}</div>
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </section>
    );
}
