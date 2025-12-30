import React, { useEffect, useState } from "react";
import "../styles/home.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import SignupModal from "../components/SignupModal";
import LoginModal from "../components/LoginModal";

const slides = [
    "https://images.unsplash.com/photo-1571902943202-507ec2618e8f",
    "https://images.unsplash.com/photo-1558611848-73f7eb4001a1",
    "https://images.unsplash.com/photo-1599058917212-d750089bc07e",
    "https://images.unsplash.com/photo-1517836357463-d25dfeac3438"
];

const Home = () => {
    const navigate = useNavigate();
    const { isLoggedIn } = useAuth();

    const [showSignup, setShowSignup] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent(c => (c + 1) % slides.length);
        }, 4500);
        return () => clearInterval(timer);
    }, []);

    const handleSubscribe = () => {
        if (!isLoggedIn) {
            setShowSignup(true);
            return;
        }
        navigate("/Subplans");
    };

    return (
        <>
            <div className="home-slider">
                {slides.map((img, i) => (
                    <div
                        key={i}
                        className={`slide ${i === current ? "active" : ""}`}
                        style={{ backgroundImage: `url(${img})` }}
                    />
                ))}

                <div className="home-overlay fade-in">
                    <h1>Welcome to Bi To Tri Gym</h1>
                    <p>
                        Where strength, endurance, and discipline are built through
                        professional coaching and a powerful training environment.
                    </p>
                    <button onClick={handleSubscribe}>Subscribe Now</button>
                </div>
            </div>

            <div className="about-section slide-up">
                <h2>About Bi To Tri Gym</h2>
                <p>
                    Bi To Tri Gym is designed for serious training. Our facility is equipped
                    with professional-grade machines, heavy free weights, functional zones,
                    and modern cardio equipment.
                </p>
                <p>
                    Every space is optimized for performance, safety, and progress —
                    whether you're lifting heavy, improving endurance, or transforming
                    your physique.
                </p>
                <p>
                    We provide the tools, environment, and coaching needed to push limits
                    and achieve real results.
                </p>
            </div>

            <div className="why-section">
                <h2>Why Choose Bi To Tri Gym?</h2>
                <div className="why-grid">
                    <div className="why-card" onClick={() => navigate("/coaches")}>
                        <h3>🏋️‍♂️ Expert Coaches</h3>
                        <p>Certified trainers with real-world experience.</p>
                    </div>
                    <div className="why-card" onClick={() => navigate("/training-programs")}>
                        <h3>💪 Training Programs</h3>
                        <p>Structured programs for strength, fat loss, and endurance.</p>
                    </div>
                    <div className="why-card" onClick={() => navigate("/store")}>
                        <h3>🛒 In-Gym Store</h3>
                        <p>Supplements and apparel selected for performance.</p>
                    </div>
                </div>
            </div>

            <div className="testimonial-section">
                <h2>Member Transformations</h2>
                <div className="testimonial-slider">
                    <div className="testimonial">
                        <div className="stars">★★★★★</div>
                        <p>"I lost 12kg in 8 weeks. Best gym ever!"</p>
                        <h4>- Karim</h4>
                    </div>
                    <div className="testimonial">
                        <div className="stars">★★★★★</div>
                        <p>"Amazing coaches and top-level equipment."</p>
                        <h4>- Rami</h4>
                    </div>
                    <div className="testimonial">
                        <div className="stars">★★★★★</div>
                        <p>"Bi To Tri completely changed how I train."</p>
                        <h4>- Maya</h4>
                    </div>
                    <div className="testimonial">
                        <div className="stars">★★★★★</div>
                        <p>"Gained strength and confidence in just a few months."</p>
                        <h4>- Ahmad</h4>
                    </div>
                    <div className="testimonial">
                        <div className="stars">★★★★★</div>
                        <p>"Clean gym, serious atmosphere, real results."</p>
                        <h4>- Jad</h4>
                    </div>
                    <div className="testimonial">
                        <div className="stars">★★★★★</div>
                        <p>"Best decision I made for my health and fitness."</p>
                        <h4>- Nour</h4>
                    </div>
                </div>
            </div>

            <div className="cta-section">
                <h2>Ready to Start Your Transformation?</h2>
                <p>Train with purpose. Train at Bi To Tri Gym.</p>
                <button onClick={handleSubscribe}>View Subscription Plans</button>
            </div>

            {showSignup && (
                <SignupModal
                    close={() => setShowSignup(false)}
                    openLogin={() => {
                        setShowSignup(false);
                        setShowLogin(true);
                    }}
                />
            )}

            {showLogin && (
                <LoginModal
                    close={() => setShowLogin(false)}
                    openSignup={() => {
                        setShowLogin(false);
                        setShowSignup(true);
                    }}
                />
            )}
        </>
    );
};

export default Home;
