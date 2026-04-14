"use client";

export default function HeroTitle() {
    return (
        <>
            <div className="landing-logo">
                <img src="/logo.svg" alt="TeamNotes logo" width={120} height={132} />
            </div>
            <h1 className="landing-title">TeamNotes</h1>
            <p className="landing-subtitle">
                A sophisticated workspace designed for visual thinkers.
                <br />
                Experience real-time collaboration with professional-grade tools.
            </p>
        </>
    );
}
