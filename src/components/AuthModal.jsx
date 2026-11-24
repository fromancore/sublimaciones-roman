import { useState } from 'react'
import { X, Lock, Mail, Phone, User, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react'
import { crearPerfilUsuario } from '../services/autorizacion.js'
import { USUARIOS_INICIALES } from '../services/datos.js'

export default function AuthModal({ isOpen, onClose, onLoginExitoso }) {
  // ⚠️ Todos los hooks ANTES de cualquier return condicional (Rules of Hooks)
  const [modo, setModo] = useState('registro') // 'registro' | 'login'

  // Campos del formulario
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [telefono, setTelefono] = useState('')
  const [password, setPassword] = useState('')

  // Errores de validación junto al campo
  const [errores, setErrores] = useState({})
  const [mensajeExito, setMensajeExito] = useState('')
  const [errorGeneral, setErrorGeneral] = useState('')

  // Early return después de los hooks
  if (!isOpen) return null

  // Cálculo de fortaleza de contraseña
  const calcularFortaleza = pwd => {
    if (!pwd) return { nivel: 0, etiqueta: '', color: 'bg-slate-200' }
    let score = 0
    if (pwd.length >= 8) score += 1
    if (/[A-Z]/.test(pwd)) score += 1
    if (/[0-9]/.test(pwd)) score += 1
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1

    if (score <= 1) return { nivel: 1, etiqueta: 'Débil', color: 'bg-rose-500', width: 'w-1/3' }
    if (score === 2 || score === 3)
      return { nivel: 2, etiqueta: 'Media', color: 'bg-amber-500', width: 'w-2/3' }
    return { nivel: 3, etiqueta: 'Fuerte', color: 'bg-emerald-500', width: 'w-full' }
  }

  const fortaleza = calcularFortaleza(password)

  const validarFormulario = () => {
    const nuevosErrores = {}

    // Correo: formato válido
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email || !regexEmail.test(email.trim())) {
      nuevosErrores.email = 'Ingresa un correo válido'
    }

    if (modo === 'registro') {
      // Nombre
      if (!nombre.trim()) {
        nuevosErrores.nombre = 'El nombre es requerido'
      }

      // Teléfono: exactamente 10 dígitos sin espacios
      const regexTelefono = /^\d{10}$/
      if (!telefono || !regexTelefono.test(telefono.trim())) {
        nuevosErrores.telefono = 'Escribe 10 dígitos, sin espacios'
      }

      // Contraseña: mínimo 8 caracteres
      if (!password || password.length < 8) {
        nuevosErrores.password = 'Usa al menos 8 caracteres'
      }
    } else {
      // Login
      if (!password) {
        nuevosErrores.password = 'Ingresa tu contraseña'
      }
    }

    setErrores(nuevosErrores)
    return Object.keys(nuevosErrores).length === 0
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setErrorGeneral('')
    setMensajeExito('')

    if (!validarFormulario()) return

    const correo = email.trim().toLowerCase()

    const usuarioExistente = USUARIOS_INICIALES.find(
      usuario => usuario.email.toLowerCase() === correo
    )
    const usuario = crearPerfilUsuario({
      ...usuarioExistente,
      email: correo,
      nombre: modo === 'registro' ? nombre.trim() : usuarioExistente?.nombre,
      telefono: modo === 'registro' ? telefono.trim() : usuarioExistente?.telefono,
    })

    setMensajeExito(
      modo === 'registro'
        ? '¡Cuenta de demostración creada exitosamente!'
        : '¡Sesión iniciada con éxito!'
    )
    setTimeout(
      () => {
        onLoginExitoso(usuario)
        onClose()
      },
      modo === 'registro' ? 1200 : 1000
    )
  }

  return (
    <div className="animate-fadeIn fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-roman-navy/80 p-4 backdrop-blur-md">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border-2 border-roman-bronze bg-white shadow-2xl">
        {/* Encabezado */}
        <div className="flex items-center justify-between border-b border-roman-bronze/40 bg-roman-navy px-6 py-5 text-white">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="h-5 w-5 text-roman-gold" />
            <h3 className="font-cinzel text-base font-bold tracking-wider text-white">
              {modo === 'registro' ? 'Crear Cuenta' : 'Iniciar Sesión'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-300 transition-colors hover:bg-slate-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Pestañas de modo */}
        <div className="flex border-b border-slate-200 bg-roman-stone">
          <button
            type="button"
            onClick={() => {
              setModo('registro')
              setErrores({})
              setErrorGeneral('')
              setMensajeExito('')
            }}
            className={`flex-1 py-3 font-headline text-xs font-bold uppercase tracking-wider transition-colors ${
              modo === 'registro'
                ? 'border-b-2 border-roman-gold bg-white text-roman-navy'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Registrarse
          </button>
          <button
            type="button"
            onClick={() => {
              setModo('login')
              setErrores({})
              setErrorGeneral('')
              setMensajeExito('')
            }}
            className={`flex-1 py-3 font-headline text-xs font-bold uppercase tracking-wider transition-colors ${
              modo === 'login'
                ? 'border-b-2 border-roman-gold bg-white text-roman-navy'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Ingresar
          </button>
        </div>

        {/* Mensaje de éxito */}
        {mensajeExito && (
          <div className="m-6 flex items-center gap-2.5 rounded-xl border border-emerald-300 bg-emerald-50 p-4 text-xs font-medium text-emerald-800">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
            <p>{mensajeExito}</p>
          </div>
        )}

        {/* Formulario */}
        {!mensajeExito && (
          <form onSubmit={handleSubmit} className="space-y-4 p-6">
            {errorGeneral && (
              <div className="flex items-center gap-2 rounded-lg border border-rose-300 bg-rose-50 p-3 text-xs text-rose-800">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
                <span>{errorGeneral}</span>
              </div>
            )}

            {/* Nombre (solo registro) */}
            {modo === 'registro' && (
              <div className="space-y-1">
                <label className="flex items-center gap-1.5 font-headline text-xs font-bold uppercase text-roman-navy">
                  <User className="h-3.5 w-3.5 text-roman-bronze" />
                  Nombre Completo:
                </label>
                <input
                  type="text"
                  placeholder="Ej. Carlos Mendiburu"
                  value={nombre}
                  onChange={e => setNombre(e.target.value)}
                  className={`w-full border bg-roman-stone ${
                    errores.nombre ? 'border-rose-400' : 'border-slate-300'
                  } rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:border-roman-bronze focus:outline-none`}
                />
                {errores.nombre && (
                  <p className="text-[11px] font-semibold text-rose-600">{errores.nombre}</p>
                )}
              </div>
            )}

            {/* Correo Electrónico */}
            <div className="space-y-1">
              <label className="flex items-center gap-1.5 font-headline text-xs font-bold uppercase text-roman-navy">
                <Mail className="h-3.5 w-3.5 text-roman-bronze" />
                Correo Electrónico:
              </label>
              <input
                type="email"
                placeholder="ejemplo@correo.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className={`w-full border bg-roman-stone ${
                  errores.email ? 'border-rose-400' : 'border-slate-300'
                } rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:border-roman-bronze focus:outline-none`}
              />
              {errores.email && (
                <p className="text-[11px] font-semibold text-rose-600">{errores.email}</p>
              )}
            </div>

            {/* Teléfono (solo registro) */}
            {modo === 'registro' && (
              <div className="space-y-1">
                <label className="flex items-center gap-1.5 font-headline text-xs font-bold uppercase text-roman-navy">
                  <Phone className="h-3.5 w-3.5 text-roman-bronze" />
                  Teléfono (10 dígitos):
                </label>
                <input
                  type="tel"
                  placeholder="9371234567"
                  maxLength={10}
                  value={telefono}
                  onChange={e => setTelefono(e.target.value.replace(/\D/g, ''))}
                  className={`w-full border bg-roman-stone ${
                    errores.telefono ? 'border-rose-400' : 'border-slate-300'
                  } rounded-xl px-3.5 py-2 font-mono text-xs text-slate-900 focus:border-roman-bronze focus:outline-none`}
                />
                {errores.telefono && (
                  <p className="text-[11px] font-semibold text-rose-600">{errores.telefono}</p>
                )}
              </div>
            )}

            {/* Contraseña */}
            <div className="space-y-1">
              <label className="flex items-center gap-1.5 font-headline text-xs font-bold uppercase text-roman-navy">
                <Lock className="h-3.5 w-3.5 text-roman-bronze" />
                Contraseña:
              </label>
              <input
                type="password"
                placeholder={modo === 'registro' ? 'Mínimo 8 caracteres' : 'Contraseña'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                className={`w-full border bg-roman-stone ${
                  errores.password ? 'border-rose-400' : 'border-slate-300'
                } rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:border-roman-bronze focus:outline-none`}
              />
              {errores.password && (
                <p className="text-[11px] font-semibold text-rose-600">{errores.password}</p>
              )}

              {/* Indicador de fortaleza (solo registro) */}
              {modo === 'registro' && password && (
                <div className="space-y-1 pt-1.5">
                  <div className="flex items-center justify-between text-[10px] font-semibold text-slate-500">
                    <span>Fortaleza de contraseña:</span>
                    <span className="font-bold text-roman-navy">{fortaleza.etiqueta}</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
                    <div
                      className={`h-full ${fortaleza.color} ${fortaleza.width} transition-all duration-300`}
                    />
                  </div>
                </div>
              )}
            </div>

            <p className="pt-1 text-[10px] leading-tight text-slate-400">
              Inicio de sesión simulado para esta práctica. No se guardan ni verifican credenciales.
            </p>

            {/* Botón de envío */}
            <button
              type="submit"
              className="btn-relief-gold mt-4 w-full rounded-xl py-3.5 font-headline text-xs font-bold uppercase tracking-wider"
            >
              {modo === 'registro' ? 'Crear Mi Cuenta' : 'Acceder al Portal'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
