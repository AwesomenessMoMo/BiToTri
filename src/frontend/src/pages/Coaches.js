import React, { useState, useEffect } from "react";
import "../styles/coaches.css";
import CoachesSchedule from "./CoachesSchedule";
import API from "../config/api";

const Coaches = () => {
  const [coaches, setCoaches] = useState([]);
  const [selectedCoach, setSelectedCoach] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/api/coaches`)
      .then(res => res.json())
      .then(data => {
        setCoaches(data || []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch coaches:", err);
        setLoading(false);
      });
  }, []);

  const handleCoachClick = (coach) => {
    if (selectedCoach?.id === coach.id) {
      setSelectedCoach(null);
    } else {
      setSelectedCoach(coach);
    }
  };

  return (
    <>
      <div className="coaches-hero">
        <h1>OUR COACHES</h1>
        <p>Our team of certified professionals is ready to guide your fitness journey.</p>
      </div>

      <div className="coaches-section">
        {loading ? (
          <p className="loading">Loading coaches...</p>
        ) : coaches.length === 0 ? (
          <p className="loading">No coaches available</p>
        ) : (
          coaches.map(coach => (
            <div
              key={coach.id}
              className={`coach-card ${selectedCoach?.id === coach.id ? "active" : ""}`}
              onClick={() => handleCoachClick(coach)}
            >
              <img
                src={
                  coach.image
                    ? `${API}/uploads/${coach.image}`
                    : "/images/placeholder.png"
                }
                alt={coach.name}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/images/placeholder.png";
                }}
              />

              <h3>{coach.name}</h3>
              <p>{coach.specialty}</p>
            </div>
          ))
        )}
      </div>

      {selectedCoach && (
        <CoachesSchedule
          coach={selectedCoach.name}
          coachId={selectedCoach.id}
          image={
            selectedCoach.image
              ? `${API}/uploads/${selectedCoach.image}`
              : "/images/placeholder.png"
          }
          specialty={selectedCoach.specialty}
          bio={selectedCoach.bio}
        />
      )}
    </>
  );
};

export default Coaches;
