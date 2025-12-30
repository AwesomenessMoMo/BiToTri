import { useEffect, useState } from "react";
import "../styles/admin.css";
import { toast } from "react-toastify";

import API from "../config/api";

fetch(`${API}/api/coaches`)
fetch(`${API}/api/supplements`)
fetch(`${API}/api/clothes`)
fetch(`${API}/api/bookings`)

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

  const [newCoach, setNewCoach] = useState({ name:"", specialty:"", bio:"", image:null, preview:null });
  const [newSupplement, setNewSupplement] = useState({ name:"", category:SUPPLEMENT_CATEGORIES[0], description:"", price:"", image:null, preview:null });
  const [newClothes, setNewClothes] = useState({ name:"", category:CLOTHES_CATEGORIES[0], price:"", color:"", image:null, preview:null });

  const loadData = () => {
    fetch(`${API}/api/coaches`).then(r=>r.json()).then(setCoaches);
    fetch(`${API}/api/supplements`).then(r=>r.json()).then(setSupplements);
    fetch(`${API}/api/clothes`).then(r=>r.json()).then(setClothes);
    fetch(`${API}/api/admin/bookings`).then(r=>r.json()).then(setBookings);
  };

  useEffect(loadData, []);

  const addItem = async (url, data, reset) => {
    const fd = new FormData();
    Object.entries(data).forEach(([k,v]) => v && k!=="preview" && fd.append(k,v));

    const res = await fetch(url,{method:"POST",body:fd});
    if(!res.ok) return toast.error("Add failed");

    toast.success("Added");
    reset();
    loadData();
  };

  const updateImage = async (url,file) => {
    const fd = new FormData();
    fd.append("image",file);
    await fetch(url,{method:"PUT",body:fd});
    toast.success("Image updated");
    loadData();
  };

  const del = async url => {
    await fetch(url,{method:"DELETE"});
    toast.success("Deleted");
    loadData();
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
            <textarea placeholder="Bio" onChange={e=>setNewCoach({...newCoach,bio:e.target.value})}/>

            <button className="change-image-btn" onClick={()=>document.getElementById("coachImg").click()}>
              Upload image
            </button>
            <input id="coachImg" type="file" className="edit-image-input"
              onChange={e=>previewFile(e.target.files[0],setNewCoach)} />

            <button className="primary"
              onClick={()=>addItem(`${API}/api/admin/coaches`,newCoach,
                ()=>setNewCoach({name:"",specialty:"",bio:"",image:null,preview:null}))}>
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
                <span>{s.name} — {s.category} (${s.price})</span>
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
            <tbody>
              {bookings.map(b=>(
                <tr key={b.id}>
                  <td>{b.user_name}</td>
                  <td>{b.coach_name}</td>
                  <td>{b.booking_date}</td>
                  <td>{b.booking_time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </div>
  );
};

export default AdminPage;
