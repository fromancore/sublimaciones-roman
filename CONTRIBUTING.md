# 🤝 Guía de Contribución — Sublimaciones Roman

¡Gracias por tu interés en contribuir a **Sublimaciones Roman**! Esta guía explica el flujo de trabajo esperado para garantizar la calidad del código y la coherencia del proyecto.

---

## 🚀 Configuración del Entorno de Desarrollo

### Requisitos Previos

| Herramienta | Versión Mínima | Verificar con |
|-------------|---------------|---------------|
| Node.js | 18.x | `node --version` |
| npm | 9.x | `npm --version` |
| Git | 2.39+ | `git --version` |

### Instalación

```bash
# 1. Fork y clonar
git clone https://github.com/TU_USUARIO/sublimaciones-roman.git
cd sublimaciones-roman

# 2. Instalar dependencias (activa los Git hooks automáticamente)
npm install

# 3. Configurar variables de entorno
cp .env.example .env.local
# → Editar .env.local con los valores reales (nunca commitear este archivo)

# 4. Verificar que todo funciona
npm run ci

# 5. Iniciar servidor de desarrollo
npm run dev
```

---

## 🌳 Estrategia de Ramas

| Rama | Propósito | Desde | Merge hacia |
|------|-----------|-------|-------------|
| `main` | Producción estable | — | — |
| `develop` | Integración de features | `main` | `main` (via release) |
| `feature/*` | Nuevas funcionalidades | `develop` | `develop` |
| `hotfix/*` | Correcciones urgentes en producción | `main` | `main` + `develop` |
| `release/*` | Preparación de release | `develop` | `main` + `develop` |

### Nomenclatura de Ramas

```
feature/descripcion-en-kebab-case
fix/nombre-del-bug
hotfix/nombre-del-fix
release/v1.2.0
docs/actualizar-readme
```

---

## 📝 Estándar de Commits

Usamos [Conventional Commits](https://www.conventionalcommits.org/). El hook `commit-msg` valida automáticamente tu commit antes de crearlo.

### Formato

```
<tipo>(<alcance>): <descripción corta en imperativo>

[cuerpo opcional]

[footer opcional]
```

### Tipos Válidos

- `feat` — Nueva funcionalidad
- `fix` — Corrección de error
- `docs` — Solo cambios de documentación
- `style` — Formato sin cambios de lógica
- `refactor` — Refactorización sin feat/fix
- `perf` — Mejora de rendimiento
- `test` — Agregar o corregir pruebas
- `build` — Build system o dependencias
- `ci` — Cambios en CI/CD
- `chore` — Otras tareas de mantenimiento
- `revert` — Revertir un commit anterior

### Ejemplos

```bash
feat(cart): add quantity controls to cart items
fix(auth): resolve token expiry loop on page refresh
docs(contributing): update local setup instructions
test(catalog): add unit tests for product filtering
refactor(header): extract navigation into separate component
```

---

## 🔄 Flujo de Trabajo de una Feature

```bash
# 1. Asegurarse de que develop está actualizado
git checkout develop
git pull origin develop

# 2. Crear rama de feature
git checkout -b feature/nombre-descriptivo

# 3. Desarrollar con commits atómicos
#    (el hook pre-commit corre ESLint + Prettier automáticamente)
git add -p  # Staging interactivo para commits atómicos
git commit -m "feat(catalog): add product rating display"

# 4. Mantener la rama actualizada con develop
git fetch origin
git rebase origin/develop

# 5. Push
git push origin feature/nombre-descriptivo

# 6. Abrir Pull Request hacia 'develop' en GitHub
#    (completar el template de PR)
```

---

## ✅ Checklist Antes de Abrir un PR

```bash
# Verificación completa (igual que el CI)
npm run ci

# Que incluye:
npm run lint          # Cero errores y cero warnings
npm run format:check  # Formato correcto
npm run build         # Build exitoso
npm run test:coverage # Tests pasando con cobertura ≥60%
```

---

## 🧪 Pruebas

```bash
npm run test          # Ejecutar tests una vez
npm run test:watch    # Tests en modo watch (TDD)
npm run test:coverage # Tests con reporte de cobertura
npm run test:ui       # Interfaz visual de Vitest
```

Los archivos de prueba deben:
- Ubicarse en `src/test/` o junto al componente como `ComponentName.test.jsx`
- Seguir la convención de nombres: `[NombreComponente].test.{js,jsx}`
- Cubrir: renderizado sin errores, interacciones principales, casos borde

---

## 🐛 Reportar un Bug

1. Verificar que no existe un [issue similar](https://github.com/fromancore/sublimaciones-roman/issues)
2. Crear un nuevo issue usando el template **🐛 Reporte de Error**
3. Incluir pasos de reproducción, comportamiento esperado vs actual, y capturas

---

## 🚀 Proponer una Funcionalidad

1. Crear un issue usando el template **🚀 Nueva Funcionalidad**
2. Describir el problema que resuelve y la solución propuesta
3. Esperar aprobación del equipo antes de implementar

---

## 📋 Código de Conducta

Este proyecto sigue los principios de comunicación respetuosa y colaborativa. Los comentarios en PRs e issues deben ser constructivos y orientados al código, nunca a la persona.

---

## 📚 Recursos Adicionales

- [Conventional Commits](https://www.conventionalcommits.org/es/)
- [Semantic Versioning](https://semver.org/lang/es/)
- [GitFlow Workflow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Vitest Docs](https://vitest.dev/)
