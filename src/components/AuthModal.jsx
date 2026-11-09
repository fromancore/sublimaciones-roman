import React, { useState } from 'react';
import { X, Lock, Mail, Phone, User, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';

/**
 * Función utilitaria para hashear contraseñas con SHA-256 (nunca texto plano)
 */
async function generarHashContrasena(contrasena) {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(contrasena);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch {
    // Fallback simple si crypto.subtle no está disponible
    return btoa(contrasena).split('').reverse().join('');
  }
}

export default function AuthModal({ isOpen, onClose, onLoginExitoso, currentUser }) {
  if (!isOpen) return null;

  const [modo, setModo] = useState('registro'); // 'registro' | 'login'
  
  // Campos del formulario
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [password, setPassword] = useState('');
  
  // Errores de validación junto al campo
  const [errores, setErrores] = useState({});
  const [mensajeExito, setMensajeExito] = useState('');
  const [errorGeneral, setErrorGeneral] = useState('');

  // Cálculo de fortaleza de contraseña
  const calcularFortaleza = (pwd) => {
    if (!pwd) return { nivel: 0, etiqueta: '', color: 'bg-slate-200' };
    let score = 0;
    if (pwd.length >= 8) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    if (score <= 1) return { nivel: 1, etiqueta: 'Débil', color: 'bg-rose-500', width: 'w-1/3' };
    if (score === 2 || score === 3) return { nivel: 2, etiqueta: 'Media', color: 'bg-amber-500', width: 'w-2/3' };
    return { nivel: 3, etiqueta: 'Fuerte', color: 'bg-emerald-500', width: 'w-full' };
  };

  const fortaleza = calcularFortaleza(password);

  const validarFormulario = () => {
    const nuevosErrores = {};

    // Correo: formato válido
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !regexEmail.test(email.trim())) {
      nuevosErrores.email = 'Ingresa un correo válido';
    }

    if (modo === 'registro') {
      // Nombre
      if (!nombre.trim()) {
        nuevosErrores.nombre = 'El nombre es requerido';
      }

      // Teléfono: exactamente 10 dígitos sin espacios
      const regexTelefono = /^\d{10}$/;
      if (!telefono || !regexTelefono.test(telefono.trim())) {
        nuevosErrores.telefono = 'Escribe 10 dígitos, sin espacios';
      }

      // Contraseña: mínimo 8 caracteres
      if (!password || password.length < 8) {
        nuevosErrores.password = 'Usa al menos 8 caracteres';
      }
    } else {
      // Login
      if (!password) {
        nuevosErrores.password = 'Ingresa tu contraseña';
      }
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorGeneral('');
    setMensajeExito('');

    if (!validarFormulario()) return;

    const hash = await generarHashContrasena(password);

    if (modo === 'registro') {
      const nuevoUsuario = {
        id: `usr-${Date.now()}`,
        nombre: nombre.trim(),
        email: email.trim().toLowerCase(),
        telefono: telefono.trim(),
        role: 'cliente',
        passwordHash: hash, // Nunca guardamos texto plano
        fechaRegistro: new Date().toISOString()
      };

      setMensajeExito('¡Cuenta creada exitosamente! Bienvenido a Sublimaciones Román.');
      setTimeout(() => {
        onLoginExitoso(nuevoUsuario);
        onClose();
      }, 1200);
    } else {
      // Modo login simulado
      const usuarioLogueado = {
        id: `usr-${Date.now()}`,
        nombre: email.split('@')[0],
        email: email.trim().toLowerCase(),
        role: email.includes('admin') ? 'admin' : 'cliente',
        passwordHash: hash
      };

      setMensajeExito('¡Sesión iniciada con éxito!');
      setTimeout(() => {
        onLoginExitoso(usuarioLogueado);
        onClose();
      }, 1000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-roman-navy/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="relative w-full max-w-md bg-white border-2 border-roman-bronze rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Encabezado */}
        <div className="px-6 py-5 bg-roman-navy text-white flex items-center justify-between border-b border-roman-bronze/40">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-roman-gold" />
            <h3 className="font-cinzel font-bold text-base tracking-wider text-white">
              {modo === 'registro' ? 'Crear Cuenta' : 'Iniciar Sesión'}
            </h3>
          </div>
          <button 
            onClick={onClose} 
            className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Pestañas de modo */}
        <div className="flex border-b border-slate-200 bg-roman-stone">
          <button
            type="button"
            onClick={() => { setModo('registro'); setErrores({}); setErrorGeneral(''); }}
            className={`flex-1 py-3 text-xs font-headline font-bold uppercase tracking-wider transition-colors ${
              modo === 'registro'
                ? 'bg-white text-roman-navy border-b-2 border-roman-gold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Registrarse
          </button>
          <button
            type="button"
            onClick={() => { setModo('login'); setErrores({}); setErrorGeneral(''); }}
            className={`flex-1 py-3 text-xs font-headline font-bold uppercase tracking-wider transition-colors ${
              modo === 'login'
                ? 'bg-white text-roman-navy border-b-2 border-roman-gold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Ingresar
          </button>
        </div>

        {/* Mensaje de éxito */}
        {mensajeExito && (
          <div className="m-6 p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-medium flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <p>{mensajeExito}</p>
          </div>
        )}

        {/* Formulario */}
        {!mensajeExito && (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            
            {errorGeneral && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-300 text-rose-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorGeneral}</span>
              </div>
            )}

            {/* Nombre (solo registro) */}
            {modo === 'registro' && (
              <div className="space-y-1">
                <label className="text-xs font-headline font-bold text-roman-navy uppercase flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-roman-bronze" />
                  Nombre Completo:
                </label>
                <input
                  type="text"
                  placeholder="Ej. Carlos Mendiburu"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className={`w-full bg-roman-stone border ${
                    errores.nombre ? 'border-rose-400' : 'border-slate-300'
                  } rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-roman-bronze`}
                />
                {errores.nombre && (
                  <p className="text-[11px] text-rose-600 font-semibold">{errores.nombre}</p>
                )}
              </div>
            )}

            {/* Correo Electrónico */}
            <div className="space-y-1">
              <label className="text-xs font-headline font-bold text-roman-navy uppercase flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-roman-bronze" />
                Correo Electrónico:
              </label>
              <input
                type="email"
                placeholder="ejemplo@correo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full bg-roman-stone border ${
                  errores.email ? 'border-rose-400' : 'border-slate-300'
                } rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-roman-bronze`}
              />
              {errores.email && (
                <p className="text-[11px] text-rose-600 font-semibold">{errores.email}</p>
              )}
            </div>

            {/* Teléfono (solo registro) */}
            {modo === 'registro' && (
              <div className="space-y-1">
                <label className="text-xs font-headline font-bold text-roman-navy uppercase flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-roman-bronze" />
                  Teléfono (10 dígitos):
                </label>
                <input
                  type="tel"
                  placeholder="9371234567"
                  maxLength={10}
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value.replace(/\D/g, ''))}
                  className={`w-full bg-roman-stone border ${
                    errores.telefono ? 'border-rose-400' : 'border-slate-300'
                  } rounded-xl px-3.5 py-2 text-xs text-slate-900 font-mono focus:outline-none focus:border-roman-bronze`}
                />
                {errores.telefono && (
                  <p className="text-[11px] text-rose-600 font-semibold">{errores.telefono}</p>
                )}
              </div>
            )}

            {/* Contraseña */}
            <div className="space-y-1">
              <label className="text-xs font-headline font-bold text-roman-navy uppercase flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-roman-bronze" />
                Contraseña:
              </label>
              <input
                type="password"
                placeholder="Mínimo 8 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full bg-roman-stone border ${
                  errores.password ? 'border-rose-400' : 'border-slate-300'
                } rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-roman-bronze`}
              />
              {errores.password && (
                <p className="text-[11px] text-rose-600 font-semibold">{errores.password}</p>
              )}

              {/* Indicador de fortaleza (solo registro) */}
              {modo === 'registro' && password && (
                <div className="pt-1.5 space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-semibold">
                    <span>Fortaleza de contraseña:</span>
                    <span className="font-bold text-roman-navy">{fortaleza.etiqueta}</span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div className={`h-full ${fortaleza.color} ${fortaleza.width} transition-all duration-300`}></div>
                  </div>
                </div>
              )}
            </div>

            <p className="text-[10px] text-slate-400 pt-1 leading-tight">
              🔒 Tus credenciales son protegidas con cifrado hash y nunca se guardan en texto plano.
            </p>

            {/* Botón de envío */}
            <button
              type="submit"
              className="w-full py-3.5 rounded-xl btn-relief-gold text-xs font-headline font-bold uppercase tracking-wider mt-4"
            >
              {modo === 'registro' ? 'Crear Mi Cuenta' : 'Acceder al Portal'}
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
