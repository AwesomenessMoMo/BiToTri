import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import "../styles/coaches.css";
import CoachesSchedule from "./CoachesSchedule";
import API from "../config/api";

const Coaches = () => {
  const [searchParams] = useSearchParams();
  const [coaches, setCoaches] = useState([]);
  const [selectedCoach, setSelectedCoach] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/api/coaches`)
      .then(res => res.json())
      .then(data => {
        setCoaches(data || []);
        setLoading(false);

        // Auto-select coach if coachId is in query params
        const coachIdParam = searchParams.get("coachId");
        if (coachIdParam) {
          const coachId = parseInt(coachIdParam);
          const coach = data.find(c => c.id === coachId);
          if (coach) {
            setSelectedCoach(coach);
          }
        }
      })
      .catch(err => {
        console.error("Failed to fetch coaches:", err);
        setLoading(false);
      });
  }, [searchParams]);

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
            <div key={coach.id} className="coach-card-wrapper">
              <div
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

              {selectedCoach?.id === coach.id && (
                <div className="mobile-booking-section">
                  <CoachesSchedule
                    coach={selectedCoach.name}
                    coachId={selectedCoach.id}
                    image={
                      selectedCoach.image
                        ? `${API}/uploads/${selectedCoach.image}`
                        : "/images/placeholder.png"
                    }
                    specialty={selectedCoach.specialty}
                  />
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {selectedCoach && (
        <div className="desktop-booking-section">
          <CoachesSchedule
            coach={selectedCoach.name}
            coachId={selectedCoach.id}
            image={
              selectedCoach.image
                ? `${API}/uploads/${selectedCoach.image}`
                : "/images/placeholder.png"
            }
            specialty={selectedCoach.specialty}
          />
        </div>
      )}
    </>
  );
};

export default Coaches;
