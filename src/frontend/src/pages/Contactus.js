import React, { useState } from "react";
import "../styles/contactus.css";
import { toast } from "react-toastify";
import API from "../config/api";

function Contactus() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: ""
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch(`${API}/api/contact`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            if (!res.ok) throw new Error();

            toast.success("Message sent! Admin will contact you soon.");

            setFormData({
                name: "",
                email: "",
                message: ""
            });
        } catch {
            toast.error("Failed to send message. Try again.");
        }
    };

    return (
        <div className="contact-container">
            <h1>Contact Us</h1>
            <p>Have a question or feedback? Our team will reach out shortly.</p>

            <form className="contact-form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />

                <input
                    type="email"
                    name="email"
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />

                <textarea
                    name="message"
                    placeholder="Your Message..."
                    value={formData.message}
                    onChange={handleChange}
                    required
                />

                <button type="submit">Send Message</button>
            </form>
        </div>
    );
}

export default Contactus;
