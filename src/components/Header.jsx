import React, { useState } from 'react'
import RomanLogo from './RomanLogo'
import { puedeAccederPanel } from '../services/autorizacion.js'
import {
  ShoppingBag,
  Search,
  Compass,
  ShieldCheck,
  MapPin,
  Sparkles,
  User,
  Menu,
  X,
  PackageCheck,
  Map,
} from 'lucide-react'

export default function Header({
  cartCount,
  onOpenCart,
  activeTab,
  setActiveTab,
  currentRole,
  setCurrentRole,
  activeOrdersCount = 1,
  onOpenAuth,
  currentUser,
  onLogout,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [roleMenuOpen, setRoleMenuOpen] = useState(false)

  const navLinks = [
    { id: 'inicio', label: 'Inicio', icon: Compass },
    { id: 'catalogo', label: 'Catálogo', icon: Search },
    { id: 'personalizar', label: 'Personalizar', icon: Sparkles, badge: 'Estudio 2D' },
    {
      id: 'rastrear',
      label: 'Rastrear Pedido',
      icon: ShieldCheck,
      alertBadge: activeOrdersCount > 0,
    },
    { id: 'ubicacion', label: 'Ubicación / Contacto', icon: MapPin },
    ...(puedeAccederPanel(currentUser)
      ? [{ id: 'dashboard', label: 'Panel Operativo', icon: PackageCheck }]
      : []),
  ]

  const roleLabels = {
    cliente: 'Vista Cliente',
    admin: 'Rol Admin',
    disenador: 'Rol Diseñador',
    produccion: 'Rol Producción (RN-01)',
    entregas: 'Rol Entregas Tabasco',
  }

  const handleNavClick = id => {
    setActiveTab(id)
    setMobileMenuOpen(false)
  }

  return (
    <>
      {/* Top Banner Próxima Apertura */}
      <div className="border-b border-roman-bronze/40 bg-gradient-to-r from-roman-navy via-roman-dark to-roman-navy px-4 py-2 text-center">
        <p className="flex items-center justify-center gap-2 font-headline text-[11px] font-bold uppercase tracking-wider text-roman-gold">
          <Map className="h-3.5 w-3.5 text-roman-gold" />
          <span>
            Atendiendo actualmente en Cárdenas, Tabasco. ¡Próximamente también en Mérida, Yucatán!
          </span>
        </p>
      </div>

      <header className="sticky top-0 z-40 w-full border-b border-roman-bronze/40 bg-roman-navy shadow-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            {/* Logo & Brand Name */}
            <div
              className="flex cursor-pointer items-center gap-3"
              onClick={() => handleNavClick('inicio')}
            >
              <RomanLogo className="h-10 w-10" showText={false} />
              <div className="flex flex-col">
                <span className="font-cinzel text-lg font-black leading-none tracking-widest text-white sm:text-xl">
                  SUBLIMACIONES <span className="text-roman-gold">ROMÁN</span>
                </span>
                <span className="mt-1 text-[9px] font-bold uppercase tracking-[0.18em] text-roman-bronze">
                  Cárdenas, Tabasco • Próx. Mérida
                </span>
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="hidden items-center gap-1 lg:flex xl:gap-2">
              {navLinks.map(link => {
                const Icon = link.icon
                const isActive = activeTab === link.id
                return (
                  <button
                    key={link.id}
                    onClick={() => handleNavClick(link.id)}
                    className={`relative flex items-center gap-2 rounded-lg px-3.5 py-2 font-headline text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                      isActive
                        ? 'border border-roman-bronze/50 bg-roman-dark text-roman-gold shadow-inner'
                        : 'text-slate-300 hover:bg-roman-dark/60 hover:text-white'
                    }`}
                  >
                    <Icon
                      className={`h-3.5 w-3.5 ${isActive ? 'text-roman-gold' : 'text-slate-400'}`}
                    />
                    <span>{link.label}</span>

                    {link.badge && (
                      <span className="rounded bg-roman-gold px-1.5 py-0.5 text-[9px] font-black uppercase text-roman-navy">
                        {link.badge}
                      </span>
                    )}
                  </button>
                )
              })}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              {/* Botón Ingresar / Registrarse */}
              {currentUser ? (
                <div className="flex items-center gap-2 rounded-lg border border-roman-bronze/40 bg-roman-dark/90 px-2.5 py-1.5 text-xs">
                  <span className="max-w-[100px] truncate font-semibold text-roman-gold sm:max-w-[140px]">
                    {currentUser.nombre || currentUser.email}
                  </span>
                  <button
                    onClick={onLogout}
                    className="ml-1 text-[10px] font-bold text-slate-400 transition-colors hover:text-rose-400"
                    title="Cerrar sesión"
                  >
                    Salir
                  </button>
                </div>
              ) : (
                <button
                  onClick={onOpenAuth}
                  className="flex items-center gap-1.5 rounded-lg border border-roman-bronze/50 bg-roman-dark/90 px-3 py-1.5 font-headline text-xs font-bold text-slate-200 transition-all hover:border-roman-gold hover:text-roman-gold"
                >
                  <User className="h-3.5 w-3.5 text-roman-gold" />
                  <span className="hidden sm:inline">Ingresar / Registrarse</span>
                  <span className="sm:hidden">Ingresar</span>
                </button>
              )}

              {/* Selector de Rol: HERRAMIENTA DE DEMOSTRACIÓN (Exclusivo Administrador) */}
              {currentUser?.role === 'admin' && (
                <div className="relative">
                  <button
                    onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                    className="flex items-center gap-1.5 rounded-lg border border-roman-bronze/30 bg-roman-dark px-2.5 py-1.5 text-xs font-semibold text-slate-300 transition-all hover:border-roman-gold"
                    title="Herramienta de demostración: Simular Rol"
                  >
                    <span className="hidden text-[10px] font-bold uppercase tracking-wider text-roman-bronze md:inline">
                      Demo:
                    </span>
                    <span className="hidden font-mono text-[11px] sm:inline">
                      {roleLabels[currentRole]}
                    </span>
                    <span
                      className="h-2 w-2 rounded-full bg-emerald-400"
                      title="Herramienta de demostración activa"
                    />
                  </button>

                  {roleMenuOpen && (
                    <div className="absolute right-0 z-50 mt-2 w-56 rounded-xl border border-roman-bronze/50 bg-roman-navy py-2 shadow-2xl">
                      <div className="mb-1 border-b border-slate-700/60 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-roman-gold">
                        🛠️ Herramienta de Demostración (Simular Rol)
                      </div>
                      {Object.entries(roleLabels).map(([roleKey, label]) => (
                        <button
                          key={roleKey}
                          onClick={() => {
                            setCurrentRole(roleKey)
                            setRoleMenuOpen(false)
                            setActiveTab(roleKey === 'cliente' ? 'inicio' : 'dashboard')
                          }}
                          className={`flex w-full items-center justify-between px-3 py-2 text-left text-xs font-medium transition-colors ${
                            currentRole === roleKey
                              ? 'border-l-2 border-roman-gold bg-roman-dark font-bold text-roman-gold'
                              : 'text-slate-300 hover:bg-slate-800'
                          }`}
                        >
                          {label}
                          {currentRole === roleKey && <span>✓</span>}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Shopping Cart Button */}
              <button
                onClick={onOpenCart}
                className="btn-relief-gold group relative rounded-xl p-2.5"
                aria-label="Carrito de compras"
              >
                <ShoppingBag className="h-4 w-4 text-roman-navy" />
                {cartCount > 0 && (
                  <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-[20px] items-center justify-center rounded-full border border-roman-gold bg-roman-navy px-1 text-xs font-black text-roman-gold shadow-md">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="rounded-lg p-2 text-slate-300 hover:text-white lg:hidden"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Meander Greca Border Line */}
        <div className="greca-divider-gold w-full opacity-70" />

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="space-y-2 border-b border-roman-bronze/40 bg-roman-navy px-4 pb-6 pt-2 lg:hidden">
            {/* Botón Móvil Ingresar / Registrarse */}
            <div className="border-b border-slate-700/60 pb-2">
              {currentUser ? (
                <div className="flex items-center justify-between rounded-xl bg-roman-dark px-3 py-2 text-xs">
                  <span className="truncate font-semibold text-roman-gold">
                    👤 {currentUser.nombre || currentUser.email}
                  </span>
                  <button onClick={onLogout} className="ml-2 font-bold text-rose-400">
                    Salir
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false)
                    onOpenAuth()
                  }}
                  className="btn-relief-gold flex w-full items-center justify-center gap-2 rounded-xl py-2.5 font-headline text-xs font-bold uppercase tracking-wider"
                >
                  <User className="h-4 w-4 text-roman-navy" />
                  <span>Ingresar / Registrarse</span>
                </button>
              )}
            </div>

            {navLinks.map(link => {
              const Icon = link.icon
              const isActive = activeTab === link.id
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-xs font-bold uppercase tracking-wider ${
                    isActive
                      ? 'border border-roman-gold/50 bg-roman-dark text-roman-gold'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-4 w-4" />
                    <span>{link.label}</span>
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </header>
    </>
  )
}
