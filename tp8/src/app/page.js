"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import styles from '../app/page.module.css';
export default function Home() {
const [paises, setPaises] = useState([]);
const [paisRandom, setPaisRandom] = useState(null);
const [respuesta, setRespuesta] = useState('');
const [puntos, setPuntos] = useState(0);
const [cargando, setCargando] = useState(true);

useEffect(() => {
axios.get("https://countriesnow.space/api/v0.1/countries/flag/images")
.then(response => {
setPaises(response.data.data);
setCargando(false);
})
.catch(error => {
console.error('Error fetching data:', error);
setCargando(false);
});
}, []);

useEffect(() => {
if (paises.length > 0) {
random(paises);
}
}, [paises]);

const random = (e) => {
if (e && e.length > 0) {
const randomIndex = Math.floor(Math.random() * e.length);
setPaisRandom(e[randomIndex]);
}
};
const verRespuesta = () => {
  if (paisRandom && respuesta.toLowerCase() === paisRandom.name.toLowerCase()) {
  setPuntos(puntos + 10);
  } else {
    if (puntos>0){
      setPuntos(puntos - 1);
    }
  }
  random(paises);
  setRespuesta('');
  };
  
  if (cargando) {
  return <p>Cargando datos...</p>;
  }
  
  return (
    <div className={styles.container}>
    <h1 className={styles.header}>Adiviná el país</h1>
    {paisRandom ? (
      <>
        <img
          src={paisRandom.flag}
          alt={`Flag of ${paisRandom.name}`}
          className={styles.flagimg}
        />
        <div style={{ marginTop: '20px' }}>
          <input
            type="text"
            value={respuesta}
            onChange={(e) => setRespuesta(e.target.value)}
            placeholder="Ingrese el nombre del país"
            className={styles.inputfield}
          />
          <button
            onClick={verRespuesta}
            className={styles.submitbutton}
          >
            Enviar
          </button>
        </div>
      </>
    ) : (
      <p>No hay datos para mostrar</p>
    )}
    <div className={styles.score}>
      <p>Puntos: {puntos}</p>
    </div>
  </div>
 );
  }