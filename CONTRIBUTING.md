# Guía de contribución

## Requisitos

- Git 2.39 o posterior
- Node.js 22.14 o posterior (o 24.10 o posterior) y npm 9 o posterior

```bash
git clone https://github.com/fromancore/sublimaciones-roman.git
cd sublimaciones-roman
npm ci
# Bash
cp .env.example .env.local
# PowerShell equivalent: Copy-Item .env.example .env.local
npm run ci
npm run dev
```

`.env.local` es local y no se debe versionar. Las variables `VITE_*` se incorporan al bundle del navegador; no guardes
secretos ni credenciales privadas en ellas.

## Estrategia de ramas: Trunk-Based Development

`main` es la única rama permanente y contiene código integrado y verificable. No se mantienen `develop` ni ramas de
release. El trabajo se realiza en ramas cortas y se integra a `main` exclusivamente mediante Pull Request:

| Rama                    | Uso                | Destino |
| ----------------------- | ------------------ | ------- |
| `feature/<descripcion>` | Funcionalidad      | `main`  |
| `fix/<descripcion>`     | Corrección         | `main`  |
| `hotfix/<descripcion>`  | Corrección urgente | `main`  |
| `docs/<descripcion>`    | Documentación      | `main`  |

```bash
git switch main
git pull --ff-only origin main
git switch -c feature/descripcion-breve
# implementar y ejecutar npm run ci
git add -p
git commit -m "feat(catalog): add product filters"
git push -u origin feature/descripcion-breve
# Abrir un Pull Request hacia main, revisar el check CI y solicitar aprobación.
```

Mantén las ramas breves, actualízalas desde `main` antes del PR y evita commits de merge innecesarios. Los hotfixes
siguen el mismo flujo de PR y verificaciones.

### Protección requerida en GitHub

La protección es una configuración del repositorio remoto y no puede imponerse desde un clone local. En **Settings →
Rules → Rulesets** (o **Branches → Add branch protection rule**), crea una regla activa para `main` con:

- exigir Pull Request antes de integrar (al menos una aprobación);
- exigir que la aprobación más reciente sea posterior a los cambios solicitados;
- exigir que la rama esté al día con la base antes de integrar;
- exigir el check de estado **`CI / CI`** (workflow/job);
- permitir squash merge y desactivar merge commits para conservar títulos de PR validados en el historial;
- bloquear force-push y eliminación de `main`;
- no permitir bypass, salvo una excepción administrativa deliberada.

Las ramas `feature/*`, `fix/*`, `hotfix/*` y `docs/*` son efímeras; se protegen por la regla obligatoria de PR y CI al
apuntar a `main`, no con políticas permanentes por patrón.

## Commits

Se valida [Conventional Commits](https://www.conventionalcommits.org/) mediante Commitlint en el hook `commit-msg` y en
CI. El formato es:

```text
<tipo>(<alcance opcional>): <descripción en imperativo>
```

Tipos habituales: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore` y `revert`. Usa `!`
o un footer `BREAKING CHANGE:` para indicar cambios incompatibles.

```text
feat(cart): add quantity controls
fix(auth): handle expired sessions
docs(contributing): explain pull request flow
test(catalog): cover product filtering
refactor(header): extract navigation component
```

Cada commit debe representar un cambio coherente, ser revisable y dejar el árbol en un estado funcional. Usa
`git add -p` para separar cambios no relacionados. El hook `pre-commit` ejecuta ESLint y Prettier sobre los archivos
preparados.

## Verificaciones locales

```bash
npm run lint
npm run format:check
npm run build
npm run test
npm run test:coverage
npm run ci
```

CI ejecuta validación de commits, lint, formato, build y pruebas con reporte de cobertura. Los avisos de ESLint se
muestran para seguimiento; errores de lint, formato, build o pruebas bloquean el check. El reporte de cobertura es
informativo y no existe un umbral porcentual configurado.

## Pull Requests

Abre el PR hacia `main`, usa el template, resume propósito, impacto y pruebas y usa un título Conventional Commit. El
check **CI / CI** debe terminar correctamente antes del merge. Los fallos aparecen en el estado del PR y en **Actions**;
corrige la causa y vuelve a subir los cambios antes de solicitar integración.

## Releases

Al completarse correctamente CI en `main`, el workflow de release analiza los commits convencionales y publica una
etiqueta semántica y un GitHub Release. Los releases no escriben commits automatizados en `main`, por lo que respetan la
protección de rama.
