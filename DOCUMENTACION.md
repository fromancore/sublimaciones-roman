# Documentación Oficial de la Plataforma Web "Sublimaciones Román"

Plataforma e-commerce, estudio interactivo de personalización 2D y sistema integral de trazabilidad operativa para **Sublimaciones Román**, con sede en **Cárdenas, Tabasco** y próxima apertura en **Mérida, Yucatán**.

---

## 1. Identidad de Marca y Concepto Visual

- **Concepto:** Greco-Romano Elegante y Profesional (inspirado en la fuerza, disciplina, precisión artesanal e institucionalidad corporativa).
- **Textura y Fondo:** Fondo neutro claro inspirado en mármol pulido y piedra cantera clara (`#F8F9FA` a `#F1F3F5`) con textura y vetas casi imperceptibles en SVG/CSS.
- **Detalles Arquitectónicos:** Cenefas con patrones de Meandros Griegos (Grecas), bordes con micro-relieves, frisos decorativos y contenedores diseñados como bloques de mármol pulido.
- **Paleta de Colores:**
  * **Azul Marino Imperial Profundo:** `#0D1B2A` / `#0A192F` (Fuerza, seriedad y formalidad corporativa).
  * **Dorado / Bronce Antiguo:** `#D4AF37` / `#C5A059` (Acentos de calidad, botones en relieve y distintivos de confirmación).
  * **Gris Mármol / Platino:** `#F8F9FA` / `#E2E8F0` (Elegancia limpia y fondos sobrios).
  * **Gris Antracita Oscuro:** `#1E293B` (Tipografía principal para máxima legibilidad).
- **Tipografías:**
  * **Cinzel:** Encabezados monumentales y títulos de prestigio.
  * **Montserrat / Oswald:** Subtítulos estructurados, llamadas a la acción y botones.
  * **Inter:** Cuerpo de texto, tablas, formularios y datos técnicos.
- **Slogan Oficial:** *"Transformamos ideas y momentos especiales en productos personalizados, creativos y accesibles."*

---

## 2. Ubicación, Contacto y Cobertura

- **Sucursal Principal Actual:** Carlos Molina 7B, Col. El Palmar, C.P. 86500, Cárdenas, Tabasco.
- **Atención Directa & WhatsApp:** `937 283 0402` (Enlace directo: `https://wa.me/529372830402`).
- **Horario de Operación:** Lunes a Sábado de 9:00 AM a 7:00 PM.
- **Aviso de Expansión:** *"Atendiendo actualmente en Cárdenas, Tabasco. ¡Próximamente también en Mérida, Yucatán!"* (Visible en la barra superior institucional).
- **Tiempo Estimado de Producción:** 48 - 72 horas dependiendo del producto.

---

## 3. Arquitectura Tecnológica

| Componente | Tecnología | Descripción |
| :--- | :--- | :--- |
| **Framework Frontend** | React 18 + Vite 5 | Single Page Application (SPA) modular, rápida y reactiva |
| **Estilos y Diseño** | Tailwind CSS v3 | Sistema atómico de diseño con tokens corporativos greco-romanos |
| **Capa de Servicios** | JavaScript ES6 Modular | Lógica de negocio desacoplada en `src/services/` |
| **Seguridad / Criptografía** | Web Crypto API (SHA-256) | Cifrado criptográfico de contraseñas de usuarios |
| **Iconografía** | Lucide React | Iconografía vectorial SVG estilizada |
| **Efectos Interactivos** | Canvas 2D + Canvas Confetti | Previsualización en vivo en lienzo HTML5 y celebración visual |
| **Geolocalización** | Google Maps Platform / Leaflet Ready | Mapa interactivo centrado en Cárdenas, Tabasco |

---

## 4. Capa de Servicios y Lógica de Negocio (`src/services/`)

Toda la lógica de cálculo y reglas operativas está desacoplada de los componentes:

### 4.1. `cotizacion.js`
- **Función:** `cotizar(precioBase, cantidad)`
- **Reglas Editables (`reglasDescuento`):**
  - Descuento del **10%** a partir de 5 piezas.
  - Descuento del **15%** a partir de 10 piezas.
  - Las reglas están en un arreglo editable administrado dinámicamente (`actualizarReglasDescuento`).
- **Retorno:** `{ subtotal, descuento, total, porcentaje }`.

### 4.2. `flujoPedido.js`
- **Único punto de transición de estados:** `cambiarEstado(pedido, nuevoEstado, usuario, observacion, pagosDelPedido)`.
- **Transiciones Válidas:**
  `Recibido` ➔ `En Revisión` ➔ `Diseño Pendiente` ➔ `Diseño Confirmado` ➔ `En Producción` ➔ `Listo para Entrega` ➔ `Entregado`.
- **Reglas Estrictas del Flujo:**
  - **Cancelado:** Permitido únicamente desde estados anteriores a `En Producción`.
  - **RN-01 (Aprobación Obligatoria):** Se bloquea el pase a `En Producción` si el diseño no está aprobado por el cliente.
  - **Anticipo Mínimo (50%):** Se bloquea `En Producción` si el monto pagado validado por Administración es inferior al 50% del total.
  - **RN-07 (Protección de Entregados):** Un pedido con estado `Entregado` no puede ser modificado por ningún rol salvo el Administrador.
  - **Auditoría:** Cada transición genera un registro en el historial (`pedidoId`, `estadoAnterior`, `estadoNuevo`, `usuario`, `fecha`, `observacion`).

### 4.3. `pagos.js`
- **`registrarPago({ pedidoId, monto, metodo, comprobanteNombre, usuario })`:** Registra un nuevo pago con estado inicial `Pendiente de validación`.
- **`validarPago(pago, accion, usuario, motivo)`:** Permite exclusivamente al rol `admin` cambiar el estado a `Validado` o `Rechazado`.
- **`calcularResumenPagos(totalPedido, pagosDelPedido)`:** Devuelve `{ total, pagadoValidado, pagadoPendiente, saldoPendiente, anticipoMinimoRequerido, cumpleAnticipo50 }`.

### 4.4. `datos.js`
Estructura de datos relacional normalizada en 8 tablas lista para migrar a backend REST / MySQL:
1. `usuarios`: Cuentas de usuarios con roles y `passwordHash` (SHA-256).
2. `productos`: Catálogo base de 8 productos con especificaciones y precios.
3. `pedidos`: Órdenes con folios formato `ROM-AAAA-NNNN`.
4. `detalles_pedido`: Desglose multilínea de productos, tallas, colores y notas.
5. `archivos_diseno`: Versiones de muestras gráficas generadas por el diseñador.
6. `pagos`: Registros de pagos con estatus `Pendiente de validación`, `Validado` o `Rechazado`.
7. `historial_estados`: Bitácora inmutable de cambios de estado.
8. `incidencias`: Registro de anomalías de calidad en taller (tipo, severidad y descripción).

---

## 5. Módulos y Funcionalidades de la Interfaz

### 5.1. Header y Autenticación (`Header.jsx` & `AuthModal.jsx`)
- **Acceso:** Botón *"Ingresar / Registrarse"* en la barra de navegación.
- **Registro Seguro:** Valida nombre obligatorio, correo electrónico válido, teléfono a 10 dígitos exactos, y contraseña mínima de 8 caracteres con barra medidora de seguridad (Débil, Media, Fuerte).
- **Criptografía:** Hasheo inmediato con **SHA-256** antes de almacenar (nunca viaja ni se guarda en texto plano).
- **Herramienta de Demostración:** Selector claramente etiquetado como *"🛠️ Herramienta de Demostración (Simular Rol)"* para alternar entre Cliente, Administrador, Diseñador, Producción y Entregas.

### 5.2. Página de Inicio (`HeroSection.jsx`)
- Portada monumental con tipografía Cinzel y vitrina de productos.
- 4 Pilares de propuesta de valor (Diseños Creativos, Calidad en Sublimación, Cotización Transparente y Atención Cercana).
- Tiempos de producción oficiales actualizados: *"48 - 72 hrs dependiendo el producto"*.

### 5.3. Catálogo de Artículos (`ProductCatalog.jsx`)
- 8 productos base: Tazas Mágicas, Termos de Acero, Playeras Dry-Fit, Gorras Camioneras, Cojines Decorativos, Mousepads Gamer XL, Llaveros de Polímero y Tazas Clásicas.
- Filtrado por categorías, búsqueda instantánea y ordenamiento por precios.

### 5.4. Estudio de Personalización 2D (`CustomizerModal.jsx`)
- **Lienzo HTML5 Canvas:** Previsualización en tiempo real del producto, color base, texto y color de fuente.
- **Validaciones Inline:**
  - Cantidad mínima de 1 pieza (bloquea la adición al carrito si es inválida).
  - Formatos admitidos: `.jpg`, `.jpeg`, `.png`, `.pdf`, `.ai`, `.psd` (muestra *"Formato no admitido"* en caso contrario).
  - Límite de tamaño: máximo 50 MB (muestra *"El archivo supera 50 MB"*).
- **Cotizador Integrado:** Enlace directo con `cotizar()` calculando descuentos automáticos por volumen.

### 5.5. Carrito de Compras (`CartDrawer.jsx`)
- Carrito multilínea que detalla por cada producto: cantidad, precio unitario, descuento aplicado y subtotal.
- **Checkout:** Al procesar la compra genera una orden con folio oficial `ROM-AAAA-NNNN` e inicializa su estado en **`Recibido`**.

### 5.6. Portal de Trazabilidad & Aprobación RN-01 (`OrderTracker.jsx`)
- **Búsqueda Validada:** Comprueba el formato de folio `ROM-AAAA-NNNN`; si no coincide o no existe, muestra: *"No encontramos ese folio, revisa el formato"*.
- **Timeline de 7 Pasos:** Visualización del progreso (`Recibido` ➔ `Entregado`).
- **Estado Cancelado:** Si un pedido está cancelado, muestra una insignia destacada sin romper el diseño de las 7 etapas del timeline.
- **Aprobación de Diseño (RN-01):**
  - Botón habilitado solo si el diseñador cargó una muestra gráfica digital.
  - Al hacer clic, solicita confirmación: *"¿Aprobar este diseño? Esta acción no se puede deshacer"*.
  - Avanza el pedido a **`Diseño Confirmado`** (NO directo a Producción).
  - Dispara animación de confeti.
- **Solicitud de Cambios:** Exige observación obligatoria, registra una nueva versión pendiente del diseño y devuelve el pedido a `Diseño Pendiente`.

### 5.7. Registro de Anticipos y Pagos (`PaymentModal.jsx`)
- Opciones de pago del 50% de anticipo inicial o liquidación del 100%.
- Validación de montos: no permite montos menores o iguales a 0 ni montos que superen el saldo pendiente (*"El monto excede el saldo pendiente"*).
- Todo pago registrado queda en estado **`Pendiente de validación`** hasta su revisión administrativa.

### 5.8. Dashboard Multi-Rol (`AdminDashboard.jsx`)
- **Vista Admin:**
  - Validación o rechazo de pagos pendientes con ajuste automático del saldo.
  - Editor interactivo de reglas de descuento por volumen (mínimo de piezas y porcentaje).
  - Resumen métrico de ventas totales acumuladas y desglose de pedidos por estado.
- **Vista Diseñador:**
  - Control de versiones y carga de muestras gráficas digitales hacia los clientes.
- **Vista Producción:**
  - **Filtro Estricto:** Muestra exclusivamente pedidos con diseño confirmado Y anticipo validado de al menos el 50%.
  - Módulo para registrar incidencias de calidad (tipo, severidad y descripción del problema).
- **Vista Entregas:**
  - Solo permite marcar como *"Entregado"* aquellos pedidos que estén en *"Listo para Entrega"*, con modal de confirmación obligatoria.
- **Cancelaciones Seguras:** Modal de confirmación antes de cancelar cualquier pedido elegible.

### 5.9. Ubicación y Contacto (`LocationMap.jsx` & `Footer.jsx`)
- Mapa interactivo centrado en Cárdenas, Tabasco con enlace directo a WhatsApp (`937 283 0402`).
- Pie de página institucional con políticas de propiedad intelectual sobre los artes de clientes.

---

## 6. Comandos de Operación

```cmd
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo en http://localhost:3000
npm run dev

# Compilar para producción (validación de tipos y build)
npm run build
```
