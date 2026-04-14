"use client";

export default function ThemeToggle({ theme, onToggle }) {
    return (
        <button
            className="theme-toggle-landing"
            onClick={onToggle}
            title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
            <i className={theme === "dark" ? "fa-solid fa-sun" : "fa-solid fa-moon"} />
        </button>
    );
}
