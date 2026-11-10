import React, { useState } from 'react';
import RomanLogo from './RomanLogo';
import { ShoppingBag, Search, Compass, ShieldCheck, MapPin, Sparkles, User, Menu, X, PackageCheck, Map } from 'lucide-react';

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
  onLogout
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  const navLinks = [
    { id: 'inicio', label: 'Inicio', icon: Compass },
    { id: 'catalogo', label: 'Catálogo', icon: Search },
    { id: 'personalizar', label: 'Personalizar', icon: Sparkles, badge: 'Estudio 2D' },
    { id: 'rastrear', label: 'Rastrear Pedido', icon: ShieldCheck, alertBadge: activeOrdersCount > 0 },
    { id: 'ubicacion', label: 'Ubicación / Contacto', icon: MapPin },
    { id: 'dashboard', label: 'Panel Operativo', icon: PackageCheck }
  ];

  const roleLabels = {
    cliente: 'Vista Cliente',
    admin: 'Rol Admin',
    disenador: 'Rol Diseñador',
    produccion: 'Rol Producción (RN-01)',
    entregas: 'Rol Entregas Tabasco'
  };

  const handleNavClick = (id) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Top Banner Próxima Apertura */}
      <div className="bg-gradient-to-r from-roman-navy via-roman-dark to-roman-navy border-b border-roman-bronze/40 py-2 px-4 text-center">
        <p className="text-[11px] font-headline font-bold text-roman-gold uppercase tracking-wider flex items-center justify-center gap-2">
          <Map className="w-3.5 h-3.5 text-roman-gold" />
          <span>Atendiendo actualmente en Cárdenas, Tabasco. ¡Próximamente también en Mérida, Yucatán!</span>
        </p>
      </div>

      <header className="sticky top-0 z-40 w-full bg-roman-navy border-b border-roman-bronze/40 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Logo & Brand Name */}
            <div className="cursor-pointer flex items-center gap-3" onClick={() => handleNavClick('inicio')}>
              <RomanLogo className="w-10 h-10" showText={false} />
              <div className="flex flex-col">
                <span className="font-cinzel font-black text-lg sm:text-xl tracking-widest text-white leading-none">
                  SUBLIMACIONES <span className="text-roman-gold">ROMÁN</span>
                </span>
                <span className="text-[9px] font-bold tracking-[0.18em] text-roman-bronze uppercase mt-1">
                  Cárdenas, Tabasco • Próx. Mérida
                </span>
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = activeTab === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => handleNavClick(link.id)}
                    className={`relative flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-headline font-bold uppercase tracking-wider transition-all duration-200 ${
                      isActive 
                        ? 'bg-roman-dark text-roman-gold border border-roman-bronze/50 shadow-inner' 
                        : 'text-slate-300 hover:text-white hover:bg-roman-dark/60'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-roman-gold' : 'text-slate-400'}`} />
                    <span>{link.label}</span>

                    {link.badge && (
                      <span className="px-1.5 py-0.5 text-[9px] font-black rounded bg-roman-gold text-roman-navy uppercase">
                        {link.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              
              {/* Botón Ingresar / Registrarse */}
              {currentUser ? (
                <div className="flex items-center gap-2 bg-roman-dark/90 border border-roman-bronze/40 rounded-lg px-2.5 py-1.5 text-xs">
                  <span className="font-semibold text-roman-gold truncate max-w-[100px] sm:max-w-[140px]">
                    {currentUser.nombre || currentUser.email}
                  </span>
                  <button
                    onClick={onLogout}
                    className="text-[10px] text-slate-400 hover:text-rose-400 font-bold ml-1 transition-colors"
                    title="Cerrar sesión"
                  >
                    Salir
                  </button>
                </div>
              ) : (
                <button
                  onClick={onOpenAuth}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-roman-dark/90 border border-roman-bronze/50 text-xs font-headline font-bold text-slate-200 hover:text-roman-gold hover:border-roman-gold transition-all"
                >
                  <User className="w-3.5 h-3.5 text-roman-gold" />
                  <span className="hidden sm:inline">Ingresar / Registrarse</span>
                  <span className="sm:hidden">Ingresar</span>
                </button>
              )}

              {/* Selector de Rol: HERRAMIENTA DE DEMOSTRACIÓN (Exclusivo Administrador) */}
              {currentUser?.role === 'admin' && (
                <div className="relative">
                  <button
                    onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-roman-dark border border-roman-bronze/30 text-xs font-semibold text-slate-300 hover:border-roman-gold transition-all"
                    title="Herramienta de demostración: Simular Rol"
                  >
                    <span className="text-[10px] uppercase font-bold text-roman-bronze tracking-wider hidden md:inline">Demo:</span>
                    <span className="hidden sm:inline font-mono text-[11px]">{roleLabels[currentRole]}</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400" title="Herramienta de demostración activa"></span>
                  </button>

                  {roleMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-roman-navy border border-roman-bronze/50 rounded-xl shadow-2xl py-2 z-50">
                      <div className="px-3 py-1 text-[10px] font-bold text-roman-gold uppercase tracking-wider border-b border-slate-700/60 mb-1">
                        🛠️ Herramienta de Demostración (Simular Rol)
                      </div>
                      {Object.entries(roleLabels).map(([roleKey, label]) => (
                        <button
                          key={roleKey}
                          onClick={() => {
                            setCurrentRole(roleKey);
                            setRoleMenuOpen(false);
                            if (roleKey !== 'cliente') setActiveTab('dashboard');
                          }}
                          className={`w-full text-left px-3 py-2 text-xs font-medium flex items-center justify-between transition-colors ${
                            currentRole === roleKey 
                              ? 'bg-roman-dark text-roman-gold font-bold border-l-2 border-roman-gold' 
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
                className="relative p-2.5 rounded-xl btn-relief-gold group"
                aria-label="Carrito de compras"
              >
                <ShoppingBag className="w-4 h-4 text-roman-navy" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center min-w-[20px] h-5 px-1 rounded-full bg-roman-navy text-roman-gold font-black text-xs shadow-md border border-roman-gold">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg text-slate-300 hover:text-white"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

            </div>

          </div>
        </div>

        {/* Meander Greca Border Line */}
        <div className="greca-divider-gold w-full opacity-70"></div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-roman-navy border-b border-roman-bronze/40 px-4 pt-2 pb-6 space-y-2">
            {/* Botón Móvil Ingresar / Registrarse */}
            <div className="pb-2 border-b border-slate-700/60">
              {currentUser ? (
                <div className="flex items-center justify-between px-3 py-2 bg-roman-dark rounded-xl text-xs">
                  <span className="text-roman-gold font-semibold truncate">
                    👤 {currentUser.nombre || currentUser.email}
                  </span>
                  <button onClick={onLogout} className="text-rose-400 font-bold ml-2">Salir</button>
                </div>
              ) : (
                <button
                  onClick={() => { setMobileMenuOpen(false); onOpenAuth(); }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl btn-relief-gold text-xs font-headline font-bold uppercase tracking-wider"
                >
                  <User className="w-4 h-4 text-roman-navy" />
                  <span>Ingresar / Registrarse</span>
                </button>
              )}
            </div>

            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider ${
                    isActive 
                      ? 'bg-roman-dark text-roman-gold border border-roman-gold/50' 
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{link.label}</span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </header>
    </>
  );
}
