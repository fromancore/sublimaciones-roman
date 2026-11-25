import playeraBlanca from '../assets/Productos_Base/Playera_Dry-Fit_Sublimada_Total.png'
import playeraNormalAzulMarino from '../assets/Playera_Dry-Fit_Colores_Modelos/Playera_Dry-Fit_Sublimada_Total_Normal/Azul_Marino.png'
import playeraNormalAzulRey from '../assets/Playera_Dry-Fit_Colores_Modelos/Playera_Dry-Fit_Sublimada_Total_Normal/Azul_Rey.png'
import playeraNormalGrisJaspe from '../assets/Playera_Dry-Fit_Colores_Modelos/Playera_Dry-Fit_Sublimada_Total_Normal/Gris_Jaspe.png'
import playeraNormalNegra from '../assets/Playera_Dry-Fit_Colores_Modelos/Playera_Dry-Fit_Sublimada_Total_Normal/Negro.png'
import playeraNormalRoja from '../assets/Playera_Dry-Fit_Colores_Modelos/Playera_Dry-Fit_Sublimada_Total_Normal/Rojo.png'
import playeraPoloAzulMarino from '../assets/Playera_Dry-Fit_Colores_Modelos/Playera_Dry-Fit_Sublimada_Total_Polo/P_Azul_Marino.png'
import playeraPoloAzulRey from '../assets/Playera_Dry-Fit_Colores_Modelos/Playera_Dry-Fit_Sublimada_Total_Polo/P_Azul_Rey.png'
import playeraPoloBlanca from '../assets/Playera_Dry-Fit_Colores_Modelos/Playera_Dry-Fit_Sublimada_Total_Polo/P_Blanco.png'
import playeraPoloGrisJaspe from '../assets/Playera_Dry-Fit_Colores_Modelos/Playera_Dry-Fit_Sublimada_Total_Polo/P_Gris_Jaspe.png'
import playeraPoloNegra from '../assets/Playera_Dry-Fit_Colores_Modelos/Playera_Dry-Fit_Sublimada_Total_Polo/P_Negro.png'
import playeraPoloRoja from '../assets/Playera_Dry-Fit_Colores_Modelos/Playera_Dry-Fit_Sublimada_Total_Polo/P_Rojo.png'
import playeraVAzulMarino from '../assets/Playera_Dry-Fit_Colores_Modelos/Playera_Dry-Fit_Sublimada_Total_V/V_Azul_Marino.png'
import playeraVAzulRey from '../assets/Playera_Dry-Fit_Colores_Modelos/Playera_Dry-Fit_Sublimada_Total_V/V_Azul_Rey.png'
import playeraVBlanca from '../assets/Playera_Dry-Fit_Colores_Modelos/Playera_Dry-Fit_Sublimada_Total_V/V_Blanco.png'
import playeraVGrisJaspe from '../assets/Playera_Dry-Fit_Colores_Modelos/Playera_Dry-Fit_Sublimada_Total_V/V_Gris_Jaspe.png'
import playeraVNegra from '../assets/Playera_Dry-Fit_Colores_Modelos/Playera_Dry-Fit_Sublimada_Total_V/V_Negro.png'
import playeraVRoja from '../assets/Playera_Dry-Fit_Colores_Modelos/Playera_Dry-Fit_Sublimada_Total_V/V_Rojo.png'

export const VARIANTES_PLAYERA = [
  {
    color: '#FFFFFF',
    nombre: 'Blanco',
    image: playeraBlanca,
    imagenes: {
      'Cuello Redondo': playeraBlanca,
      'Cuello en V': playeraVBlanca,
      'Tipo Polo': playeraPoloBlanca,
    },
  },
  {
    color: '#111827',
    nombre: 'Negro',
    image: playeraNormalNegra,
    imagenes: {
      'Cuello Redondo': playeraNormalNegra,
      'Cuello en V': playeraVNegra,
      'Tipo Polo': playeraPoloNegra,
    },
  },
  {
    color: '#1B2A4A',
    nombre: 'Azul Marino',
    image: playeraNormalAzulMarino,
    imagenes: {
      'Cuello Redondo': playeraNormalAzulMarino,
      'Cuello en V': playeraVAzulMarino,
      'Tipo Polo': playeraPoloAzulMarino,
    },
  },
  {
    color: '#9CA3AF',
    nombre: 'Gris Jaspe',
    image: playeraNormalGrisJaspe,
    imagenes: {
      'Cuello Redondo': playeraNormalGrisJaspe,
      'Cuello en V': playeraVGrisJaspe,
      'Tipo Polo': playeraPoloGrisJaspe,
    },
  },
  {
    color: '#DC2626',
    nombre: 'Rojo',
    image: playeraNormalRoja,
    imagenes: {
      'Cuello Redondo': playeraNormalRoja,
      'Cuello en V': playeraVRoja,
      'Tipo Polo': playeraPoloRoja,
    },
  },
  {
    color: '#2563EB',
    nombre: 'Azul Rey',
    image: playeraNormalAzulRey,
    imagenes: {
      'Cuello Redondo': playeraNormalAzulRey,
      'Cuello en V': playeraVAzulRey,
      'Tipo Polo': playeraPoloAzulRey,
    },
  },
]
