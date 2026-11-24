import { COLORES_PLAYERA, CUELLOS_PLAYERA, obtenerNombreColorPlayera } from '../services/datos.js'

export default function PlayeraMockup({
  color = COLORES_PLAYERA[0].hex,
  cuello = CUELLOS_PLAYERA[0],
  texto = '',
  colorTexto = '#D4AF37',
  fuente = 'sans-serif',
  imagen = null,
  className = '',
}) {
  const aperturaCuello =
    {
      'Cuello en V': '112 20 L130 49 L148 20',
      'Tipo Polo': '112 20 C116 42 144 42 148 20',
    }[cuello] || '112 20 C115 44 145 44 148 20'

  return (
    <svg
      viewBox="0 0 260 240"
      role="img"
      aria-label={`Playera ${obtenerNombreColorPlayera(color)}, ${cuello}`}
      className={className}
    >
      <path
        d={`M74 40 L${aperturaCuello} L186 40 L224 77 L198 101 L178 84 V220 H82 V84 L62 101 L36 77 Z`}
        fill={color}
        stroke="#64748B"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      {cuello === 'Tipo Polo' ? (
        <>
          <path d="M112 22 L126 43 L130 36 L118 20 Z" fill="#CBD5E1" stroke="#64748B" />
          <path d="M148 22 L134 43 L130 36 L142 20 Z" fill="#CBD5E1" stroke="#64748B" />
          <path d="M130 39 V68" stroke="#64748B" strokeWidth="2" />
          <circle cx="130" cy="50" r="1.5" fill="#64748B" />
          <circle cx="130" cy="59" r="1.5" fill="#64748B" />
        </>
      ) : (
        <path d={`M${aperturaCuello}`} fill="none" stroke="#64748B" strokeWidth="4" />
      )}
      {imagen && (
        <image
          href={imagen}
          x="101"
          y="91"
          width="58"
          height="58"
          preserveAspectRatio="xMidYMid meet"
        />
      )}
      {texto && (
        <text
          x="130"
          y={imagen ? '174' : '144'}
          textAnchor="middle"
          fill={colorTexto}
          fontFamily={fuente}
          fontSize="12"
          fontWeight="bold"
        >
          {texto.slice(0, 24)}
        </text>
      )}
    </svg>
  )
}
