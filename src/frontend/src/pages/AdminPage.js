import { useEffect, useState } from "react";
import "../styles/admin.css";
import { toast } from "react-toastify";

import API from "../config/api";

const IMG = img => img ? `${API}/uploads/${img}` : "/images/placeholder.png";

const SUPPLEMENT_CATEGORIES = [
  "Protein","Creatine","Amino Acids","Vitamins",
  "Pre-Workout","Post-Workout","Fat Burner","Mass Gainer"
];

const CLOTHES_CATEGORIES = ["T-Shirts","Hoodies","Shorts","Pants"];

const AdminPage = () => {
  const [tab, setTab] = useState("coaches");
  const [coaches, setCoaches] = useState([]);
  const [supplements, setSupplements] = useState([]);
  const [clothes, setClothes] = useState([]);
  const [bookings, setBookings] = useState([]);

  const [newCoach, setNewCoach] = useState({ name:"", specialty:"", image:null, preview:null });
  const [newSupplement, setNewSupplement] = useState({ name:"", category:SUPPLEMENT_CATEGORIES[0], description:"", price:"", image:null, preview:null });
  const [newClothes, setNewClothes] = useState({ name:"", category:CLOTHES_CATEGORIES[0], price:"", color:"", image:null, preview:null });

  const loadData = () => {
    fetch(`${API}/api/coaches`)
      .then(r => r.json())
      .then(setCoaches)
      .catch(err => {
        console.error("Failed to load coaches:", err);
        toast.error("Failed to load coaches");
      });
    
    fetch(`${API}/api/supplements`)
      .then(r => r.json())
      .then(setSupplements)
      .catch(err => {
        console.error("Failed to load supplements:", err);
        toast.error("Failed to load supplements");
      });
    
    fetch(`${API}/api/clothes`)
      .then(r => r.json())
      .then(setClothes)
      .catch(err => {
        console.error("Failed to load clothes:", err);
        toast.error("Failed to load clothes");
      });
    
    fetch(`${API}/api/admin/bookings`)
      .then(r => r.json())
      .then(setBookings)
      .catch(err => {
        console.error("Failed to load bookings:", err);
        toast.error("Failed to load bookings");
      });
  };

  useEffect(loadData, []);

  const addItem = async (url, data, reset) => {
    try {
      const fd = new FormData();
      Object.entries(data).forEach(([k,v]) => v && k!=="preview" && fd.append(k,v));

      const res = await fetch(url,{method:"POST",body:fd});
      const result = await res.json();
      
      if(!res.ok) {
        const errorMsg = result.message || "Add failed";
        toast.error(errorMsg);
        return;
      }

      toast.success("Added");
      reset();
      loadData();
    } catch (err) {
      console.error("Add item error:", err);
      toast.error("Failed to add item");
    }
  };

  const updateImage = async (url,file) => {
    try {
      const fd = new FormData();
      fd.append("image",file);
      const res = await fetch(url,{method:"PUT",body:fd});
      const result = await res.json();
      
      if(!res.ok) {
        const errorMsg = result.message || "Image update failed";
        toast.error(errorMsg);
        return;
      }
      
      toast.success("Image updated");
      loadData();
    } catch (err) {
      console.error("Update image error:", err);
      toast.error("Failed to update image");
    }
  };

  const del = async url => {
    try {
      const res = await fetch(url,{method:"DELETE"});
      const result = await res.json();
      
      if(!res.ok) {
        const errorMsg = result.message || "Delete failed";
        toast.error(errorMsg);
        return;
      }
      
      toast.success("Deleted");
      loadData();
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Failed to delete item");
    }
  };

  const previewFile = (file,setter) =>
    setter(p=>({...p,image:file,preview:URL.createObjectURL(file)}));

  return (
    <div className="admin-page">
      <h1 className="admin-title">Admin Dashboard</h1>

      <div className="admin-tabs">
        {["coaches","supplements","clothes","bookings"].map(t=>(
          <button key={t} className={tab===t?"active":""} onClick={()=>setTab(t)}>
            {t.toUpperCase()}
          </button>
        ))}
      </div>

      {tab==="coaches" && (
        <section className="admin-card">
          <div className="form-grid">
            <input placeholder="Name" onChange={e=>setNewCoach({...newCoach,name:e.target.value})}/>
            <input placeholder="Specialty" onChange={e=>setNewCoach({...newCoach,specialty:e.target.value})}/>

            <button className="change-image-btn" onClick={()=>document.getElementById("coachImg").click()}>
              Upload image
            </button>
            <input id="coachImg" type="file" className="edit-image-input"
              onChange={e=>previewFile(e.target.files[0],setNewCoach)} />

            <button className="primary"
              onClick={()=>addItem(`${API}/api/admin/coaches`,newCoach,
                ()=>setNewCoach({name:"",specialty:"",image:null,preview:null}))}>
              Add Coach
            </button>
          </div>

          {newCoach.preview && (
            <img src={newCoach.preview} className="preview" alt="Coach preview" />
          )}

          <ul className="admin-list">
            {coaches.map(c=>(
              <li key={c.id}>
                <img src={IMG(c.image)} className="admin-thumb large" alt={c.name} />
                <span>{c.name} — {c.specialty}</span>
                <button className="change-image-btn" onClick={()=>document.getElementById(`c${c.id}`).click()}>Change Image</button>
                <input id={`c${c.id}`} type="file" className="edit-image-input"
                  onChange={e=>updateImage(`${API}/api/admin/coaches/${c.id}/image`,e.target.files[0])}/>
                <button className="change-image-btn" onClick={()=>del(`${API}/api/admin/coaches/${c.id}`)}>Delete</button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {tab==="supplements" && (
        <section className="admin-card">
          <div className="form-grid">
            <input placeholder="Name" onChange={e=>setNewSupplement({...newSupplement,name:e.target.value})}/>
            <select onChange={e=>setNewSupplement({...newSupplement,category:e.target.value})}>
              {SUPPLEMENT_CATEGORIES.map(c=><option key={c}>{c}</option>)}
            </select>
            <textarea placeholder="Description" onChange={e=>setNewSupplement({...newSupplement,description:e.target.value})}/>
            <input type="number" placeholder="Price" onChange={e=>setNewSupplement({...newSupplement,price:e.target.value})}/>

            <button className="change-image-btn" onClick={()=>document.getElementById("suppImg").click()}>
              Upload image
            </button>
            <input id="suppImg" type="file" className="edit-image-input"
              onChange={e=>previewFile(e.target.files[0],setNewSupplement)}/>

            <button className="primary"
              onClick={()=>addItem(`${API}/api/admin/supplements`,newSupplement,
                ()=>setNewSupplement({name:"",category:SUPPLEMENT_CATEGORIES[0],description:"",price:"",image:null,preview:null}))}>
              Add Supplement
            </button>
          </div>

          {newSupplement.preview && (
            <img src={newSupplement.preview} className="preview" alt="Supplement preview" />
          )}

          <ul className="admin-list">
            {supplements.map(s=>(
              <li key={s.id}>
                <img src={IMG(s.image)} className="admin-thumb large" alt={s.name} />
                <div className="admin-item-info">
                  <span className="admin-item-name">{s.name} — {s.category} (${s.price})</span>
                  {s.description && <p className="admin-item-description">{s.description}</p>}
                </div>
                <button className="change-image-btn" onClick={()=>document.getElementById(`s${s.id}`).click()}>Change Image</button>
                <input id={`s${s.id}`} type="file" className="edit-image-input"
                  onChange={e=>updateImage(`${API}/api/admin/supplements/${s.id}/image`,e.target.files[0])}/>
                <button className="change-image-btn" onClick={()=>del(`${API}/api/admin/supplements/${s.id}`)}>Delete</button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {tab==="clothes" && (
        <section className="admin-card">
          <div className="form-grid">
            <input placeholder="Name" onChange={e=>setNewClothes({...newClothes,name:e.target.value})}/>
            <select onChange={e=>setNewClothes({...newClothes,category:e.target.value})}>
              {CLOTHES_CATEGORIES.map(c=><option key={c}>{c}</option>)}
            </select>
            <input type="number" placeholder="Price" onChange={e=>setNewClothes({...newClothes,price:e.target.value})}/>
            <input placeholder="Color" onChange={e=>setNewClothes({...newClothes,color:e.target.value})}/>

            <button className="change-image-btn" onClick={()=>document.getElementById("clothImg").click()}>
              Upload image
            </button>
            <input id="clothImg" type="file" className="edit-image-input"
              onChange={e=>previewFile(e.target.files[0],setNewClothes)}/>

            <button className="primary"
              onClick={()=>addItem(`${API}/api/admin/clothes`,newClothes,
                ()=>setNewClothes({name:"",category:CLOTHES_CATEGORIES[0],price:"",color:"",image:null,preview:null}))}>
              Add Clothes
            </button>
          </div>

          {newClothes.preview && (
            <img src={newClothes.preview} className="preview" alt="Clothes preview" />
          )}

          <ul className="admin-list">
            {clothes.map(c=>(
              <li key={c.id}>
                <img src={IMG(c.image)} className="admin-thumb large" alt={c.name} />
                <span>{c.name} — {c.color} (${c.price})</span>
                <button className="change-image-btn" onClick={()=>document.getElementById(`cl${c.id}`).click()}>Change Image</button>
                <input id={`cl${c.id}`} type="file" className="edit-image-input"
                  onChange={e=>updateImage(`${API}/api/admin/clothes/${c.id}/image`,e.target.files[0])}/>
                <button className="change-image-btn" onClick={()=>del(`${API}/api/admin/clothes/${c.id}`)}>Delete</button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {tab==="bookings" && (
        <section className="admin-card">
          <table className="admin-table">
            <thead>
              <tr>
                <th>User Name</th>
                <th>Coach Name</th>
                <th>Date</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(b=>{
                const formatDate = (dateStr) => {
                  if (!dateStr) return "N/A";
                  const date = new Date(dateStr);
                  if (isNaN(date.getTime())) return dateStr;
                  const day = String(date.getDate()).padStart(2, '0');
                  const month = String(date.getMonth() + 1).padStart(2, '0');
                  const year = date.getFullYear();
                  return `${day}/${month}/${year}`;
                };

                const formatTime = (timeStr) => {
                  if (!timeStr) return "N/A";
                  if (timeStr.includes(':')) {
                    const parts = timeStr.split(':');
                    const hours = String(parseInt(parts[0])).padStart(2, '0');
                    const minutes = String(parseInt(parts[1])).padStart(2, '0');
                    return `${hours}:${minutes}`;
                  }
                  return timeStr;
                };

                return (
                  <tr key={b.id}>
                    <td>{b.user_name || "N/A"}</td>
                    <td>{b.coach_name || "N/A"}</td>
                    <td>{formatDate(b.booking_date)}</td>
                    <td>{formatTime(b.booking_time)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>
      )}
    </div>
  );
};

export default AdminPage;
