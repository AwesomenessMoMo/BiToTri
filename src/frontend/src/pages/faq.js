import React from "react";
import "../styles/faq.css";

const FAQ = () => {
    return (
        <div className="faq-container">
            <h1>Frequently Asked Questions</h1>
            <p className="faq-intro">Find quick answers to the most common questions about Bi To Tri Gym.</p>

            <div className="faq-list">

                <div className="faq-item">
                    <h3>🏋️ What membership plans do you offer?</h3>
                    <p>
                        We offer monthly and annual plans including Basic, Premium, and Elite tiers.
                        Each package includes access to different levels of coaching, equipment, and programs.
                    </p>
                </div>

                <div className="faq-item">
                    <h3>🤝 Can I book sessions with a coach?</h3>
                    <p>
                        Yes! You can browse our certified coaches and book training sessions directly through the website.
                        Each coach specializes in different fitness fields.
                    </p>
                </div>

                <div className="faq-item">
                    <h3>📅 How do training programs work?</h3>
                    <p>
                        Our training programs are structured guides that match your fitness goals:
                        weight loss, strength building, muscle gain, and more.
                        You can preview the programs and select a coach if you need guidance.
                    </p>
                </div>

                <div className="faq-item">
                    <h3>💳 How can I subscribe?</h3>
                    <p>
                        Simply go to the Subscription Plans page and choose the plan that fits your goals.
                        A secure digital payment process is used through the website.
                    </p>
                </div>

                <div className="faq-item">
                    <h3>🛒 Do you sell supplements and gym apparel?</h3>
                    <p>
                        Yes! Our store includes high-quality supplements and gym apparel.
                        You can explore categories in the Store page.
                    </p>
                </div>

                <div className="faq-item">
                    <h3>🏠 Where are you located?</h3>
                    <p>
                        Bi To Tri Gym – Hazmieh, Baabda District, Mount Lebanon <br />
                        Near City Centre Beirut, Hazmieh Main Road <br />
                        <a
                            href="https://www.google.com/maps/place/Hazmieh,+Lebanon"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: "#ff0000", fontWeight: "bold" }}
                        >
                            View on Google Maps
                        </a>
                    </p>
                </div>

                <div className="faq-item">
                    <h3>⏱ What are your working hours?</h3>
                    <p>
                        We're open 24/7, including weekends and holidays.
                    </p>
                </div>

                <div className="faq-item">
                    <h3>🎟 Do you offer free trial sessions?</h3>
                    <p>
                        Yes, first-time visitors receive one free trial session to experience our environment and coaches.
                    </p>
                </div>

                <div className="faq-item">
                    <h3>❓ Is the gym beginner-friendly?</h3>
                    <p>
                        Absolutely. Our coaches and programs are designed to work with all levels —
                        especially beginners who need guidance and confidence.
                    </p>
                </div>

                <div className="faq-item">
                    <h3>📱 How can I contact support?</h3>
                    <p>
                        You can use the contact form on our Contact Us page or email us directly.
                        Our team replies within 24 hours.
                    </p>
                </div>

            </div>
        </div>
    );
};

export default FAQ;
