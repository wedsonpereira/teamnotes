"use client";

export default function ActionButtons({ onCreateRoom, onJoinRoom, onReenter }) {
    return (
        <>
            <div className="landing-actions">
                <button className="landing-btn landing-btn-primary" onClick={onCreateRoom}>
                    <i className="fa-solid fa-plus" /> Create Room
                </button>
                <button className="landing-btn landing-btn-outline" onClick={onJoinRoom}>
                    <i className="fa-solid fa-arrow-right-to-bracket" /> Join Room
                </button>
            </div>

            <p className="landing-reenter">
                Already have a code?{" "}
                <a
                    href="#"
                    onClick={(e) => { e.preventDefault(); onReenter(); }}
                >
                    Join Existing Room <i className="fa-solid fa-arrow-right" />
                </a>
            </p>
        </>
    );
}
