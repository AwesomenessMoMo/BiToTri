import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/trainingdetail.css";
import jsPDF from "jspdf";
import { useAuth } from "../context/AuthContext";
import LoginModal from "../components/LoginModal";
import SignupModal from "../components/SignupModal";

const TrainingDetail = () => {
    const { name } = useParams();
    const navigate = useNavigate();
    const { isLoggedIn } = useAuth();
    const [showLogin, setShowLogin] = useState(false);
    const [showSignup, setShowSignup] = useState(false);

    const getWorkoutPlan = (programTitle) => {
        const plans = {
            "Beginner Full-Body Program": {
                weeks: [
                    {
                        week: 1,
                        days: [
                            { day: "Monday", workout: "Full Body A\n- Squats: 3x10\n- Push-ups: 3x8\n- Rows: 3x10\n- Plank: 3x30s\n- Leg Raises: 3x10" },
                            { day: "Tuesday", workout: "Rest / Light Walk" },
                            { day: "Wednesday", workout: "Full Body B\n- Deadlifts: 3x8\n- Overhead Press: 3x8\n- Pull-ups/Lat Pulldown: 3x8\n- Lunges: 3x10 each\n- Russian Twists: 3x15" },
                            { day: "Thursday", workout: "Rest / Light Walk" },
                            { day: "Friday", workout: "Full Body A (Repeat)" },
                            { day: "Saturday", workout: "Rest / Mobility Work" },
                            { day: "Sunday", workout: "Rest" }
                        ]
                    },
                    {
                        week: 2,
                        days: [
                            { day: "Monday", workout: "Full Body B (Repeat)\n- Increase weight by 5-10%" },
                            { day: "Tuesday", workout: "Rest / Light Walk" },
                            { day: "Wednesday", workout: "Full Body A\n- Increase reps to 12" },
                            { day: "Thursday", workout: "Rest / Light Walk" },
                            { day: "Friday", workout: "Full Body B\n- Increase weight by 5-10%" },
                            { day: "Saturday", workout: "Rest / Mobility Work" },
                            { day: "Sunday", workout: "Rest" }
                        ]
                    },
                    {
                        week: 3,
                        days: [
                            { day: "Monday", workout: "Full Body A\n- Add 1 set to each exercise\n- Focus on form" },
                            { day: "Tuesday", workout: "Rest / Light Walk" },
                            { day: "Wednesday", workout: "Full Body B\n- Add 1 set to each exercise" },
                            { day: "Thursday", workout: "Rest / Light Walk" },
                            { day: "Friday", workout: "Full Body A\n- Increase weight by 5%" },
                            { day: "Saturday", workout: "Rest / Mobility Work" },
                            { day: "Sunday", workout: "Rest" }
                        ]
                    },
                    {
                        week: 4,
                        days: [
                            { day: "Monday", workout: "Full Body B\n- Max effort: 3x10-12\n- Increase weight" },
                            { day: "Tuesday", workout: "Rest / Light Walk" },
                            { day: "Wednesday", workout: "Full Body A\n- Max effort: 3x10-12" },
                            { day: "Thursday", workout: "Rest / Light Walk" },
                            { day: "Friday", workout: "Full Body B\n- Test your max weights" },
                            { day: "Saturday", workout: "Rest / Mobility Work" },
                            { day: "Sunday", workout: "Rest & Recovery" }
                        ]
                    }
                ]
            },
            "Weight Loss / Fat Burn Program": {
                weeks: [
                    {
                        week: 1,
                        days: [
                            { day: "Monday", workout: "HIIT Cardio\n- 5 min warm-up\n- 20 min HIIT (30s on/30s off)\n- 5 min cool-down" },
                            { day: "Tuesday", workout: "Circuit Training\n- Burpees: 3x10\n- Mountain Climbers: 3x20\n- Jump Squats: 3x15\n- Plank: 3x45s\n- Rest 60s between rounds" },
                            { day: "Wednesday", workout: "Steady Cardio\n- 30-40 min moderate pace\n- Treadmill/Bike/Row" },
                            { day: "Thursday", workout: "HIIT Cardio\n- 5 min warm-up\n- 25 min HIIT (40s on/20s off)\n- 5 min cool-down" },
                            { day: "Friday", workout: "Circuit Training\n- Repeat Tuesday + 1 round" },
                            { day: "Saturday", workout: "Active Recovery\n- 20 min light walk\n- Stretching" },
                            { day: "Sunday", workout: "Rest" }
                        ]
                    },
                    {
                        week: 2,
                        days: [
                            { day: "Monday", workout: "HIIT Cardio\n- Increase intensity\n- 25 min HIIT" },
                            { day: "Tuesday", workout: "Circuit Training\n- Add 1 exercise per round\n- Reduce rest to 45s" },
                            { day: "Wednesday", workout: "Steady Cardio\n- 40-45 min moderate pace" },
                            { day: "Thursday", workout: "HIIT Cardio\n- 30 min HIIT (45s on/15s off)" },
                            { day: "Friday", workout: "Circuit Training\n- Full body circuit\n- 4 rounds" },
                            { day: "Saturday", workout: "Active Recovery\n- 30 min light activity" },
                            { day: "Sunday", workout: "Rest" }
                        ]
                    },
                    {
                        week: 3,
                        days: [
                            { day: "Monday", workout: "HIIT Cardio\n- 30 min HIIT\n- Increase resistance/speed" },
                            { day: "Tuesday", workout: "Circuit Training\n- 5 rounds\n- 45s rest between" },
                            { day: "Wednesday", workout: "Steady Cardio\n- 45-50 min moderate pace" },
                            { day: "Thursday", workout: "HIIT Cardio\n- 35 min HIIT\n- Max intensity intervals" },
                            { day: "Friday", workout: "Circuit Training\n- Full body blast\n- 5 rounds" },
                            { day: "Saturday", workout: "Active Recovery\n- Light yoga/stretching" },
                            { day: "Sunday", workout: "Rest" }
                        ]
                    },
                    {
                        week: 4,
                        days: [
                            { day: "Monday", workout: "HIIT Cardio\n- 35 min HIIT\n- Peak performance test" },
                            { day: "Tuesday", workout: "Circuit Training\n- 6 rounds\n- Minimal rest" },
                            { day: "Wednesday", workout: "Steady Cardio\n- 50 min moderate pace" },
                            { day: "Thursday", workout: "HIIT Cardio\n- 40 min HIIT\n- Maximum effort" },
                            { day: "Friday", workout: "Circuit Training\n- Final challenge\n- 6 rounds" },
                            { day: "Saturday", workout: "Active Recovery\n- Full body stretch" },
                            { day: "Sunday", workout: "Rest & Recovery" }
                        ]
                    }
                ]
            },
            "Muscle Gain (Hypertrophy)": {
                weeks: [
                    {
                        week: 1,
                        days: [
                            { day: "Monday", workout: "Chest & Triceps\n- Bench Press: 4x8-10\n- Incline DB Press: 4x10\n- Cable Flyes: 3x12\n- Tricep Dips: 3x10\n- Overhead Extension: 3x12" },
                            { day: "Tuesday", workout: "Back & Biceps\n- Deadlifts: 4x8\n- Pull-ups: 4x8\n- Rows: 4x10\n- Bicep Curls: 3x12\n- Hammer Curls: 3x12" },
                            { day: "Wednesday", workout: "Legs & Shoulders\n- Squats: 4x10\n- Leg Press: 4x12\n- Leg Curls: 3x12\n- Shoulder Press: 4x10\n- Lateral Raises: 3x15" },
                            { day: "Thursday", workout: "Rest" },
                            { day: "Friday", workout: "Chest & Triceps (Repeat)" },
                            { day: "Saturday", workout: "Back & Biceps (Repeat)" },
                            { day: "Sunday", workout: "Rest" }
                        ]
                    },
                    {
                        week: 2,
                        days: [
                            { day: "Monday", workout: "Legs & Shoulders\n- Increase weight by 5%\n- Add 1 set" },
                            { day: "Tuesday", workout: "Chest & Triceps\n- Increase weight by 5%" },
                            { day: "Wednesday", workout: "Back & Biceps\n- Increase weight by 5%" },
                            { day: "Thursday", workout: "Rest" },
                            { day: "Friday", workout: "Legs & Shoulders\n- Progressive overload" },
                            { day: "Saturday", workout: "Chest & Triceps\n- Progressive overload" },
                            { day: "Sunday", workout: "Rest" }
                        ]
                    },
                    {
                        week: 3,
                        days: [
                            { day: "Monday", workout: "Back & Biceps\n- Increase volume\n- 5 sets main lifts" },
                            { day: "Tuesday", workout: "Legs & Shoulders\n- Increase volume\n- 5 sets main lifts" },
                            { day: "Wednesday", workout: "Chest & Triceps\n- Increase volume\n- 5 sets main lifts" },
                            { day: "Thursday", workout: "Rest" },
                            { day: "Friday", workout: "Back & Biceps\n- Add drop sets" },
                            { day: "Saturday", workout: "Legs & Shoulders\n- Add drop sets" },
                            { day: "Sunday", workout: "Rest" }
                        ]
                    },
                    {
                        week: 4,
                        days: [
                            { day: "Monday", workout: "Chest & Triceps\n- Peak week\n- Test max weights" },
                            { day: "Tuesday", workout: "Back & Biceps\n- Peak week\n- Test max weights" },
                            { day: "Wednesday", workout: "Legs & Shoulders\n- Peak week\n- Test max weights" },
                            { day: "Thursday", workout: "Rest" },
                            { day: "Friday", workout: "Full Body Pump\n- Light weights\n- High reps" },
                            { day: "Saturday", workout: "Active Recovery\n- Light stretching" },
                            { day: "Sunday", workout: "Rest & Recovery" }
                        ]
                    }
                ]
            },
            "Strength Training (Power)": {
                weeks: [
                    {
                        week: 1,
                        days: [
                            { day: "Monday", workout: "Squat Day\n- Warm-up sets\n- Squat: 5x5 @ 75% 1RM\n- Leg Press: 3x8\n- Calf Raises: 3x12" },
                            { day: "Tuesday", workout: "Bench Press Day\n- Warm-up sets\n- Bench Press: 5x5 @ 75% 1RM\n- Incline Press: 3x5\n- Tricep Work: 3x8" },
                            { day: "Wednesday", workout: "Rest" },
                            { day: "Thursday", workout: "Deadlift Day\n- Warm-up sets\n- Deadlift: 5x5 @ 75% 1RM\n- Rows: 3x5\n- Shrugs: 3x8" },
                            { day: "Friday", workout: "Overhead Press Day\n- Warm-up sets\n- OHP: 5x5 @ 75% 1RM\n- Lateral Raises: 3x8" },
                            { day: "Saturday", workout: "Rest" },
                            { day: "Sunday", workout: "Rest" }
                        ]
                    },
                    {
                        week: 2,
                        days: [
                            { day: "Monday", workout: "Squat Day\n- Squat: 5x5 @ 80% 1RM\n- Increase weight" },
                            { day: "Tuesday", workout: "Bench Press Day\n- Bench: 5x5 @ 80% 1RM\n- Increase weight" },
                            { day: "Wednesday", workout: "Rest" },
                            { day: "Thursday", workout: "Deadlift Day\n- Deadlift: 5x5 @ 80% 1RM\n- Increase weight" },
                            { day: "Friday", workout: "Overhead Press Day\n- OHP: 5x5 @ 80% 1RM\n- Increase weight" },
                            { day: "Saturday", workout: "Rest" },
                            { day: "Sunday", workout: "Rest" }
                        ]
                    },
                    {
                        week: 3,
                        days: [
                            { day: "Monday", workout: "Squat Day\n- Squat: 5x5 @ 85% 1RM\n- Heavy singles: 3x1" },
                            { day: "Tuesday", workout: "Bench Press Day\n- Bench: 5x5 @ 85% 1RM\n- Heavy singles: 3x1" },
                            { day: "Wednesday", workout: "Rest" },
                            { day: "Thursday", workout: "Deadlift Day\n- Deadlift: 5x5 @ 85% 1RM\n- Heavy singles: 3x1" },
                            { day: "Friday", workout: "Overhead Press Day\n- OHP: 5x5 @ 85% 1RM\n- Heavy singles: 3x1" },
                            { day: "Saturday", workout: "Rest" },
                            { day: "Sunday", workout: "Rest" }
                        ]
                    },
                    {
                        week: 4,
                        days: [
                            { day: "Monday", workout: "Squat Day\n- Test 1RM or 3RM\n- Deload if needed" },
                            { day: "Tuesday", workout: "Bench Press Day\n- Test 1RM or 3RM\n- Deload if needed" },
                            { day: "Wednesday", workout: "Rest" },
                            { day: "Thursday", workout: "Deadlift Day\n- Test 1RM or 3RM\n- Deload if needed" },
                            { day: "Friday", workout: "Overhead Press Day\n- Test 1RM or 3RM\n- Deload if needed" },
                            { day: "Saturday", workout: "Rest" },
                            { day: "Sunday", workout: "Rest & Recovery" }
                        ]
                    }
                ]
            },
            "Athlete Conditioning Program": {
                weeks: [
                    {
                        week: 1,
                        days: [
                            { day: "Monday", workout: "Speed & Agility\n- 10x40m sprints\n- Ladder drills: 3x\n- Cone drills: 3x\n- Plyometric jumps: 3x10" },
                            { day: "Tuesday", workout: "Power Training\n- Box Jumps: 5x5\n- Medicine Ball Throws: 4x8\n- Kettlebell Swings: 4x15\n- Burpees: 3x10" },
                            { day: "Wednesday", workout: "Conditioning\n- 400m intervals: 6x\n- Rest 90s between\n- Core circuit: 3 rounds" },
                            { day: "Thursday", workout: "Speed & Agility\n- Repeat Monday\n- Increase intensity" },
                            { day: "Friday", workout: "Power Training\n- Repeat Tuesday\n- Add weight" },
                            { day: "Saturday", workout: "Active Recovery\n- Light jog\n- Mobility work" },
                            { day: "Sunday", workout: "Rest" }
                        ]
                    },
                    {
                        week: 2,
                        days: [
                            { day: "Monday", workout: "Speed & Agility\n- 12x40m sprints\n- Advanced ladder drills\n- Increased plyometrics" },
                            { day: "Tuesday", workout: "Power Training\n- Increase box height\n- Heavier medicine ball\n- More explosive movements" },
                            { day: "Wednesday", workout: "Conditioning\n- 400m intervals: 8x\n- Reduced rest to 75s" },
                            { day: "Thursday", workout: "Speed & Agility\n- 15x40m sprints\n- Complex drills" },
                            { day: "Friday", workout: "Power Training\n- Max power output\n- Heavy implements" },
                            { day: "Saturday", workout: "Active Recovery\n- Light activity" },
                            { day: "Sunday", workout: "Rest" }
                        ]
                    },
                    {
                        week: 3,
                        days: [
                            { day: "Monday", workout: "Speed & Agility\n- 15x40m sprints\n- Advanced drills\n- Competition pace" },
                            { day: "Tuesday", workout: "Power Training\n- Peak power\n- Maximum effort sets" },
                            { day: "Wednesday", workout: "Conditioning\n- 400m intervals: 10x\n- Rest 60s" },
                            { day: "Thursday", workout: "Speed & Agility\n- 18x40m sprints\n- Race simulation" },
                            { day: "Friday", workout: "Power Training\n- Peak performance\n- Test max power" },
                            { day: "Saturday", workout: "Active Recovery\n- Light work" },
                            { day: "Sunday", workout: "Rest" }
                        ]
                    },
                    {
                        week: 4,
                        days: [
                            { day: "Monday", workout: "Speed & Agility\n- 20x40m sprints\n- Peak performance\n- Time trials" },
                            { day: "Tuesday", workout: "Power Training\n- Maximum output\n- Competition simulation" },
                            { day: "Wednesday", workout: "Conditioning\n- 400m intervals: 12x\n- Minimal rest" },
                            { day: "Thursday", workout: "Speed & Agility\n- Final test\n- Peak speed work" },
                            { day: "Friday", workout: "Power Training\n- Final test\n- Max power output" },
                            { day: "Saturday", workout: "Active Recovery\n- Full recovery protocol" },
                            { day: "Sunday", workout: "Rest & Recovery" }
                        ]
                    }
                ]
            },
            "5-Day Bodybuilding Split": {
                weeks: [
                    {
                        week: 1,
                        days: [
                            { day: "Monday", workout: "Chest\n- Bench Press: 4x8-10\n- Incline DB Press: 4x10\n- Cable Flyes: 3x12\n- Dips: 3x12\n- Push-ups: 3x15" },
                            { day: "Tuesday", workout: "Back\n- Deadlifts: 4x8\n- Pull-ups: 4x10\n- Rows: 4x10\n- Lat Pulldown: 3x12\n- Shrugs: 3x15" },
                            { day: "Wednesday", workout: "Shoulders\n- OHP: 4x8-10\n- Lateral Raises: 4x12\n- Rear Delt Flyes: 3x12\n- Front Raises: 3x12\n- Upright Rows: 3x10" },
                            { day: "Thursday", workout: "Arms\n- Bicep Curls: 4x10\n- Hammer Curls: 3x12\n- Tricep Dips: 4x10\n- Overhead Extension: 3x12\n- Cable Curls: 3x12" },
                            { day: "Friday", workout: "Legs\n- Squats: 4x10\n- Leg Press: 4x15\n- Leg Curls: 3x12\n- Calf Raises: 4x15\n- Lunges: 3x12 each" },
                            { day: "Saturday", workout: "Rest" },
                            { day: "Sunday", workout: "Rest" }
                        ]
                    },
                    {
                        week: 2,
                        days: [
                            { day: "Monday", workout: "Chest\n- Increase weight by 5%\n- Add 1 set" },
                            { day: "Tuesday", workout: "Back\n- Increase weight by 5%\n- Add 1 set" },
                            { day: "Wednesday", workout: "Shoulders\n- Increase weight by 5%\n- Add 1 set" },
                            { day: "Thursday", workout: "Arms\n- Increase weight by 5%\n- Add 1 set" },
                            { day: "Friday", workout: "Legs\n- Increase weight by 5%\n- Add 1 set" },
                            { day: "Saturday", workout: "Rest" },
                            { day: "Sunday", workout: "Rest" }
                        ]
                    },
                    {
                        week: 3,
                        days: [
                            { day: "Monday", workout: "Chest\n- 5 sets main lifts\n- Add drop sets\n- Increase volume" },
                            { day: "Tuesday", workout: "Back\n- 5 sets main lifts\n- Add drop sets\n- Increase volume" },
                            { day: "Wednesday", workout: "Shoulders\n- 5 sets main lifts\n- Add drop sets\n- Increase volume" },
                            { day: "Thursday", workout: "Arms\n- 5 sets main lifts\n- Add drop sets\n- Increase volume" },
                            { day: "Friday", workout: "Legs\n- 5 sets main lifts\n- Add drop sets\n- Increase volume" },
                            { day: "Saturday", workout: "Rest" },
                            { day: "Sunday", workout: "Rest" }
                        ]
                    },
                    {
                        week: 4,
                        days: [
                            { day: "Monday", workout: "Chest\n- Peak week\n- Test max weights\n- High volume pump" },
                            { day: "Tuesday", workout: "Back\n- Peak week\n- Test max weights\n- High volume pump" },
                            { day: "Wednesday", workout: "Shoulders\n- Peak week\n- Test max weights\n- High volume pump" },
                            { day: "Thursday", workout: "Arms\n- Peak week\n- Test max weights\n- High volume pump" },
                            { day: "Friday", workout: "Legs\n- Peak week\n- Test max weights\n- High volume pump" },
                            { day: "Saturday", workout: "Rest" },
                            { day: "Sunday", workout: "Rest & Recovery" }
                        ]
                    }
                ]
            }
        };
        return plans[programTitle] || null;
    };

    const programs = [
        { title: "Beginner Full-Body Program", short: "Perfect for newcomers learning the basics.", details: "Light weights, form training, mobility sessions, and gradual strength progression." },
        { title: "Weight Loss / Fat Burn Program", short: "High-intensity calorie-burning routine.", details: "HIIT, circuits, fat-burn cardio, and metabolic conditioning sessions." },
        { title: "Muscle Gain (Hypertrophy)", short: "Maximize muscle growth and strength.", details: "High-volume workouts, progressive overload, and targeted muscle isolation." },
        { title: "Strength Training (Power)", short: "Focused on heavy compound lifting.", details: "5×5 strength training, low reps, heavy weight, and progressive overload." },
        { title: "Athlete Conditioning Program", short: "Speed, agility, explosiveness.", details: "Plyometrics, sprints, explosive movements, and high-performance conditioning." },
        { title: "5-Day Bodybuilding Split", short: "Classic physique-building training.", details: "Body-part splits, high volume, and maximum muscle isolation." },
    ];

    let decodedName;
    try {
        decodedName = decodeURIComponent(name).trim();
    } catch (e) {
        decodedName = name.trim();
    }
    
    const normalizeString = (str) => str.trim().toLowerCase().replace(/\s+/g, ' ');
    
    const program = programs.find(p => {
        const normalizedTitle = normalizeString(p.title);
        const normalizedDecoded = normalizeString(decodedName);
        return normalizedTitle === normalizedDecoded;
    });

    if (!program) {
        return (
            <div className="training-detail-page">
                <div className="training-detail-container">
                    <h1>Program Not Found</h1>
                    <p>The training program you're looking for doesn't exist.</p>
                    <button onClick={() => navigate("/training-programs")}>
                        Back to Programs
                    </button>
                </div>
            </div>
        );
    }

    const handleGetCoach = () => {
        if (!isLoggedIn) {
            setShowLogin(true);
            return;
        }
        navigate("/coaches");
    };

    const handleDownloadPDF = () => {
        const doc = new jsPDF("p", "mm", "a4");
        const logo = new Image();
        logo.src = require("../assets/logo.png");

        logo.onload = () => {
            doc.addImage(logo, "PNG", 80, 10, 50, 50);
            generatePDFContent(doc);
        };

        logo.onerror = () => {
            generatePDFContent(doc);
        };
    };

    const getCleanTitle = (title) => {
        return title.trim();
    };

    const generatePDFContent = (doc) => {
        const cleanTitle = getCleanTitle(program.title);
        let y = 70;
        const pageWidth = 210;
        const margin = 20;
        const contentWidth = pageWidth - (margin * 2);

        doc.setTextColor(0, 0, 0);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(20);
        doc.text(cleanTitle, pageWidth / 2, y, { align: "center" });
        y += 10;

        doc.setFont("helvetica", "normal");
        doc.setFontSize(12);
        doc.setTextColor(100, 100, 100);
        doc.text("4-Week Comprehensive Training Plan", pageWidth / 2, y, { align: "center" });
        y += 20;

        doc.setDrawColor(200, 0, 0);
        doc.setLineWidth(0.5);
        doc.line(margin, y, pageWidth - margin, y);
        y += 10;

        doc.setTextColor(0, 0, 0);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.text("Program Overview", margin, y);
        y += 8;

        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        const overviewLines = doc.splitTextToSize(program.short, contentWidth);
        doc.text(overviewLines, margin, y);
        y += overviewLines.length * 5 + 3;

        const detailsLines = doc.splitTextToSize(program.details, contentWidth);
        doc.text(detailsLines, margin, y);
        y += detailsLines.length * 5 + 15;

        const workoutPlan = getWorkoutPlan(program.title);

        if (workoutPlan && workoutPlan.weeks) {
            workoutPlan.weeks.forEach((weekData, weekIndex) => {
                if (y > 260) {
                    doc.addPage();
                    y = 20;
                }

                doc.setFillColor(240, 240, 240);
                doc.rect(margin, y - 5, contentWidth, 12, "F");
                
                doc.setTextColor(200, 0, 0);
                doc.setFont("helvetica", "bold");
                doc.setFontSize(14);
                doc.text(`WEEK ${weekData.week}`, margin + 5, y + 3);
                y += 12;

                doc.setTextColor(0, 0, 0);
                doc.setFont("helvetica", "bold");
                doc.setFontSize(9);
                doc.text("DAY", margin + 5, y);
                doc.text("WORKOUT DETAILS", margin + 50, y);
                y += 5;

                doc.setDrawColor(200, 0, 0);
                doc.setLineWidth(0.3);
                doc.line(margin, y, pageWidth - margin, y);
                y += 5;

                weekData.days.forEach((dayData, dayIndex) => {
                    if (y > 270) {
                        doc.addPage();
                        y = 20;
                    }

                    doc.setFont("helvetica", "bold");
                    doc.setFontSize(9);
                    doc.setTextColor(50, 50, 50);
                    doc.text(dayData.day.toUpperCase(), margin + 5, y);

                    doc.setFont("helvetica", "normal");
                    doc.setFontSize(8);
                    doc.setTextColor(0, 0, 0);
                    
                    const workoutParts = dayData.workout.split('\n');
                    let workoutY = y;
                    workoutParts.forEach((part, partIndex) => {
                        if (workoutY > 270) {
                            doc.addPage();
                            workoutY = 20;
                        }
                        if (partIndex === 0) {
                            doc.setFont("helvetica", "bold");
                            doc.setFontSize(9);
                            doc.text(part, margin + 50, workoutY);
                            workoutY += 5;
                        } else {
                            doc.setFont("helvetica", "normal");
                            doc.setFontSize(8);
                            doc.text(part.trim(), margin + 55, workoutY);
                            workoutY += 4.5;
                        }
                    });
                    y = workoutY;

                    if (dayIndex < weekData.days.length - 1 && y < 270) {
                        doc.setDrawColor(220, 220, 220);
                        doc.setLineWidth(0.1);
                        doc.line(margin + 5, y, pageWidth - margin - 5, y);
                        y += 3;
                    }
                });

                y += 8;

                if (weekIndex < workoutPlan.weeks.length - 1) {
                    doc.setDrawColor(200, 0, 0);
                    doc.setLineWidth(0.3);
                    doc.setLineDash([2, 2], 0);
                    doc.line(margin, y, pageWidth - margin, y);
                    doc.setLineDash([], 0);
                    y += 8;
                }
            });
        }

        const totalPages = doc.internal.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
            doc.setPage(i);
            doc.setFont("helvetica", "normal");
            doc.setFontSize(8);
            doc.setTextColor(150, 150, 150);
            doc.text(`Page ${i} of ${totalPages}`, pageWidth / 2, 287, { align: "center" });
            doc.text("Bi To Tri Gym — Train Hard, Transform Harder", pageWidth / 2, 292, { align: "center" });
        }

        const safeTitle = cleanTitle.replace(/[^a-z0-9]/gi, "_");
        doc.save(`${safeTitle}_4-Week_Training_Plan.pdf`);
    };

    return (
        <>
            <div className="training-detail-page">
                <div className="training-detail-container">
                    <button className="back-button" onClick={() => navigate("/training-programs")}>
                        ← Back to Programs
                    </button>

                    <div className="program-header">
                        <h1>{program.title}</h1>
                        <p className="program-short">{program.short}</p>
                    </div>

                    <div className="program-content">
                        <div className="program-section">
                            <h2>Program Overview</h2>
                            <p className="program-details">{program.details}</p>
                        </div>

                        <div className="program-section">
                            <h2>What's Included</h2>
                            <ul className="program-features">
                                <li>4-week structured training plan</li>
                                <li>Detailed workout instructions</li>
                                <li>Progressive overload guidelines</li>
                                <li>Recovery and rest day recommendations</li>
                                <li>Nutrition tips for optimal results</li>
                            </ul>
                        </div>

                        <div className="program-actions">
                            <button className="coach-button" onClick={handleGetCoach}>
                                Get a Coach
                            </button>
                            <button className="pdf-button" onClick={handleDownloadPDF}>
                                Download PDF
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {showLogin && (
                <LoginModal
                    close={() => setShowLogin(false)}
                    openSignup={() => {
                        setShowLogin(false);
                        setShowSignup(true);
                    }}
                />
            )}

            {showSignup && (
                <SignupModal
                    close={() => setShowSignup(false)}
                    openLogin={() => {
                        setShowSignup(false);
                        setShowLogin(true);
                    }}
                />
            )}
        </>
    );
};

export default TrainingDetail;

