import React, { useEffect, useState } from "react";
import "./StampsBox.css";

import stampDota from '../assets/pictures/stamps/STAMP - DOTA.png';
import stampEarth from '../assets/pictures/stamps/STAMP - EARTH.png';
import stampLorum from '../assets/pictures/stamps/STAMP - LORUM IPSUM.png';
import stampMedsoe from '../assets/pictures/stamps/STAMP - MEDSOE.png';
import stampScience from '../assets/pictures/stamps/STAMP - SCIENCE.png';

const allCategories = [
  { name: "DOTA", image: stampDota },
  { name: "EARTH", image: stampEarth },
  { name: "LORUM IPSUM", image: stampLorum },
  { name: "MEDSOE", image: stampMedsoe },
  { name: "SCIENCE", image: stampScience },
];

const StampsBox = () => {
  const [clearedCategories, setClearedCategories] = useState([]);

  useEffect(() => {
    setClearedCategories(["DOTA", "SCIENCE"]);
  }, []);

  return (
    <div className="noir-box stamps-box">
      <h2>Category Stamps</h2>
      <div className="stamps-grid">
        {allCategories.map((cat) => (
          <div key={cat.name} className="stamp-wrapper">
            <img
              src={cat.image}
              alt={cat.name}
              className={`stamp-image ${clearedCategories.includes(cat.name) ? "active" : "inactive"}`}
            />
            <div className="stamp-label">{cat.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StampsBox;
