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
  const [tiempoRestante, setTiempoRestante] = useState(15); // Estado para el temporizador
  const [temporizadorActivo, setTemporizadorActivo] = useState(false); // Para manejar si el temporizador está activo
  const [letrasReveladas, setLetrasReveladas] = useState(new Set()); // Estado para las letras reveladas

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

  useEffect(() => {
    if (temporizadorActivo) {
      const timer = setInterval(() => {
        setTiempoRestante(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setTemporizadorActivo(false);
            if (puntos > 0) {
              setPuntos(puntos - 1);
            }
            random(paises);
            return 15; // Reiniciar el tiempo para la próxima bandera
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [temporizadorActivo, paises, puntos]);

  const random = (e) => {
    if (e && e.length > 0) {
      const randomIndex = Math.floor(Math.random() * e.length);
      setPaisRandom(e[randomIndex]);
      setTemporizadorActivo(true); // Inicia el temporizador cuando se cambia la bandera
      setTiempoRestante(15); // Reinicia el temporizador a 15 segundos
      setLetrasReveladas(new Set()); // Reinicia las letras reveladas
    }
  };

  const verRespuesta = () => {
    if (paisRandom && respuesta.toLowerCase() === paisRandom.name.toLowerCase()) {
      setPuntos(puntos + 10);
    } else {
      if (puntos > 0) {
        setPuntos(puntos - 1);
      }
    }
    random(paises);
    setRespuesta('');
  };

  const revelarLetras = () => {
    if (paisRandom && tiempoRestante > 0) {
      let letrasNoReveladas = [];
      for (let i = 0; i < paisRandom.name.length; i++) {
        if (!letrasReveladas.has(paisRandom.name[i].toLowerCase()) && paisRandom.name[i] !== ' ') {
          letrasNoReveladas.push(i);
        }
      }

      if (letrasNoReveladas.length > 0) {
        const indiceAleatorio = letrasNoReveladas[Math.floor(Math.random() * letrasNoReveladas.length)];
        setLetrasReveladas(prev => new Set(prev).add(paisRandom.name[indiceAleatorio].toLowerCase()));
        setTiempoRestante(prev => (prev > 2 ? prev - 2 : 0));
      }
    }
  };

  const renderRespuestaConAyuda = () => {
    if (!paisRandom) return '';

    return paisRandom.name.split('').map((letra, index) => {
      return letra === ' ' || letrasReveladas.has(letra.toLowerCase())
        ? letra
        : '_';
    }).join(' ');
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
          <div className={styles.inputContainer}>
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
            <button
              onClick={revelarLetras}
              className={styles.helpbutton}
            >
              Ayuda
            </button>
          </div>
          <div className={styles.timer}>
            <p>Tiempo restante: {tiempoRestante} s</p>
          </div>
          <div className={styles.help}>
            <p>{renderRespuestaConAyuda()}</p>
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
