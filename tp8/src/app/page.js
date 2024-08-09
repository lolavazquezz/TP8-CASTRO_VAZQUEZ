"use client";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Home() {
  const [paises,  setPaises] = useState([]);
  const [paisRandom,  setPaisRandom] = useState({});
  const [respuesta,  setRespuesta] = useState('');
  const [puntos,  setPuntos] = useState(0);
  const [cargando, setCargando] = useState(true);
  useEffect(() => {
    axios.get(" https://countriesnow.space/api/v0.1/countries/flag/images")
      .then(response => {
        //const paisesList = response.data.data;
        setPaises(response.data);
        /*if (paisesList.length > 0) {
          random(paises);
        }*/
        setCargando(false);
      })
      .catch(error => console.error('Error fetching data:', error));
      setCargando(false);
    }, []);
 console.log(paises)
  

 const random = (e) => {
    if (e==null || e==''){
      return null;
    } 
    else{
    const randomIndex = Math.floor(Math.random() * e.length);
    setPaisRandom(e[randomIndex]);
    }
  };
  random(paises);
  const verRespuesta = () => {
    if (respuesta.toLowerCase() === paisRandom.name.toLowerCase()) {
      setPuntos(puntos + 10);
      random(paises);
    } else {
      setPuntos(puntos - 1);
    }
    setRespuesta('');
  };
  if (cargando) {
    return <p>Cargando datos...</p>;
  }
  return (

      <>
       <div>
      <h1>Adiviná el país</h1>
      {paisRandom ? (
        <>
          <img
            src={paisRandom.flag}
            alt={`Flag of ${paisRandom.name}`}
            style={{ width: '300px', height: 'auto' }}
          />
          <div>
            <input
              type="text"
              value={respuesta}
              onChange={(e) => setRespuesta(e.target.value)}
              placeholder="Ingrese el nombre del país"
            />
            <button onClick={verRespuesta}>Enviar</button>
          </div>
        </>
      ) : (
        <p>No hay datos para mostrar</p>
      )}
      <div>
        <p>Puntos: {puntos}</p>
      </div>
    </div>
      </>
    );
}
