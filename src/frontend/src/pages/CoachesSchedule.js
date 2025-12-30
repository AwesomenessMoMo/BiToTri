import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../styles/coachesschedule.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../config/api";

const CoachesSchedule = ({ coach, image, specialty, bio, coachId }) => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState("");
    const [showPopup, setShowPopup] = useState(false);
    const [error, setError] = useState("");

    const timeSlots = [
        "08:00", "09:00", "10:00", "11:00",
        "12:00", "13:00", "14:00",
        "15:00", "16:00", "17:00",
        "18:00", "20:00"
    ];

    const confirmBooking = async () => {
        if (!user) {
            setError("Please login to book a session");
            return;
        }

        if (!selectedDate || !selectedTime) {
            setError("Please select date and time");
            return;
        }

        setError("");

        try {
            const res = await fetch(`${API}/api/bookings`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user_id: user.id,
                    coach_id: coachId,
                    booking_date: selectedDate.toISOString().split("T")[0],
                    booking_time: selectedTime
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || "Booking failed");
                return;
            }

            setShowPopup(true);
        } catch (err) {
            console.error(err);
            setError("Server not reachable");
        }
    };

    return (
        <div className="inline-schedule-wrapper">
            <div className="inline-schedule-box">

                {/* COACH PROFILE */}
                <div className="coach-profile">
                    <img src={image} alt={coach} className="coach-img" />

                    <div className="coach-info">
                        <h1>{coach}</h1>
                        <h3>{specialty}</h3>
                        <p>{bio}</p>
                    </div>
                </div>

                {/* CALENDAR */}
                <div className="calendar-box">
                    <h2>Select a Date</h2>
                    <Calendar
                        onChange={setSelectedDate}
                        value={selectedDate}
                        minDate={new Date()}
                    />
                </div>

                {/* TIME SLOTS */}
                {selectedDate && (
                    <div className="time-section">
                        <h2>Select a Time</h2>
                        <div className="time-grid">
                            {timeSlots.map((time, i) => (
                                <button
                                    key={i}
                                    className={`time-btn ${selectedTime === time ? "selected" : ""}`}
                                    onClick={() => setSelectedTime(time)}
                                >
                                    {time}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* CONFIRMATION */}
                {selectedDate && selectedTime && (
                    <div className="confirmation">
                        <h3>Booking Summary</h3>

                        <p>
                            <strong>{coach}</strong><br />
                            {specialty}<br /><br />
                            <strong>Date:</strong> {selectedDate.toDateString()}<br />
                            <strong>Time:</strong> {selectedTime}
                        </p>

                        {error && <p className="error-text">{error}</p>}

                        <button className="confirm-btn" onClick={confirmBooking}>
                            Confirm Booking
                        </button>
                    </div>
                )}

                {/* SUCCESS POPUP */}
                {showPopup && (
                    <div className="popup-overlay">
                        <div className="popup-box">
                            <h2>Success!</h2>
                            <p>Your session has been booked.</p>

                            <button onClick={() => navigate("/home")}>
                                Awesome!
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default CoachesSchedule;
