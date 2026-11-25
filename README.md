# 🎯 Sublimaciones Román Web Platform

> A responsive e-commerce and product personalization platform built with React, Vite, and interactive browser-based
> tools.

> 🌐 **Live Demo:** [https://sublimaciones-roman-eight.vercel.app/](https://sublimaciones-roman-eight.vercel.app/)

---

## 📘 Project Information

| Field       | Details                          |
| ----------- | -------------------------------- |
| **Project** | Sublimaciones Román Web Platform |
| **Type**    | Web application                  |
| **Status**  | Active web application           |

---

## 💻 Project Description

This project is a web platform for a sublimation business. It combines a product catalog, visual 2D customization tools,
shopping cart management, order tracking, and multi-role operational dashboards.

The application also demonstrates quotation rules, payment validation, order state transitions, design approval, and
production workflows entirely in the browser.

---

## ✨ Features

| Feature                  | Description                                                                            |
| ------------------------ | -------------------------------------------------------------------------------------- |
| 🛍️ **Product Catalog**   | Search, category filtering, and price sorting                                          |
| 🎨 **2D Customization**  | Real-time product preview with text, colors, and image uploads                         |
| 👕 **Shirt Variants**    | Choose shirt color, collar style, size, and design area                                |
| 📞 **Contact Details**   | Required phone number with format validation when customizing a product                |
| 🧾 **Quotation System**  | Automatic totals and volume discount calculations                                      |
| 🛒 **Shopping Cart**     | Multi-product cart and checkout flow                                                   |
| 📦 **Order Tracking**    | Validated folio lookup and visual order timeline                                       |
| 💳 **Payment Workflow**  | Payment registration and administrative validation                                     |
| 👥 **Role-Based Access** | Restricted operational dashboards for administration, design, production, and delivery |
| 🗺️ **Location Map**      | Interactive map and direct messaging integration                                       |
| 🧪 **Automated Tests**   | Unit and component tests with Vitest                                                   |

---

## 🎨 About the Customization Tools

The personalization experience uses HTML5 Canvas to render product previews in real time. Users can add text, choose
colors, upload design files, adjust quantities, and calculate prices before adding an item to the cart.

The canvas-based preview allows an immediate visual response without requiring additional software or plugins.

---

## 🎯 Main Customization Components

| Component             | Role                                                                                                   |
| --------------------- | ------------------------------------------------------------------------------------------------------ |
| **Catalog**           | Displays products and supports filtering and sorting                                                   |
| **Customizer**        | Generates the live product preview, supports shirt variants, and validates contact details and uploads |
| **Quotation Service** | Calculates totals and volume discounts                                                                 |
| **Cart**              | Groups products and creates order records                                                              |
| **Order Tracker**     | Shows status history and design approval                                                               |
| **Dashboards**        | Manage payments, production, and deliveries                                                            |

---

## 🛠️ Technologies Used

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Leaflet](https://img.shields.io/badge/Leaflet-199900?style=for-the-badge&logo=leaflet&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-6E9F18?style=for-the-badge&logo=vitest&logoColor=white)
![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white)
![VSCode](https://img.shields.io/badge/VS_Code-007ACC?style=for-the-badge&logo=visual-studio-code&logoColor=white)

---

## 📂 Project Structure

```text
sublimaciones-roman/
├── public/                 # Public static resources
├── src/
│   ├── assets/             # Product images and graphical resources
│   ├── components/         # Interface and application components
│   ├── services/           # Business rules and in-memory data
│   ├── test/               # Unit and component tests
│   ├── App.jsx             # Main application component
│   ├── index.css           # Global styles
│   └── main.jsx            # Application entry point
├── .env.example            # Example environment variables
├── package.json            # Scripts and dependencies
├── vite.config.js          # Vite and Vitest configuration
└── README.md               # Project documentation
```

### File Descriptions

- **`App.jsx`** — Defines the application structure and main component composition.
- **`components/`** — Contains the catalog, customizer, cart, authentication, tracking, map, and dashboard interfaces.
- **`services/`** — Implements quotation, payment, authorization, shirt variants, order flow, data, and rendering logic.
- **`test/`** — Contains automated tests and the shared test setup.
- **`vite.config.js`** — Configures the Vite server, build, path splitting, and Vitest environment.

---

## 🎯 Main Features

- ✅ Responsive React interface
- ✅ Product search and filtering
- ✅ Interactive canvas-based personalization, including shirt color, collar, size, and design-area options
- ✅ Required and validated contact phone in product customization
- ✅ Automatic quotation and volume discounts
- ✅ Cart and order generation
- ✅ Order status timeline
- ✅ Design approval workflow
- ✅ Payment registration and validation
- ✅ Role-based access to operational dashboards
- ✅ Automated unit and component tests

---

## 🚀 Installation and Usage

### Requirements

- Node.js 22.14 or later, or Node.js 24.10 or later
- npm 9 or later

### Install dependencies

```bash
npm ci
```

### Configure environment variables

```bash
cp .env.example .env.local
```

PowerShell:

```powershell
Copy-Item .env.example .env.local
```

### Start development server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

---

## 🧪 Available Commands

| Command                 | Description                             |
| ----------------------- | --------------------------------------- |
| `npm run dev`           | Starts the development server           |
| `npm run build`         | Creates the production build            |
| `npm run preview`       | Previews the production build           |
| `npm run lint`          | Runs ESLint                             |
| `npm run format:check`  | Checks source formatting                |
| `npm run test`          | Runs the test suite                     |
| `npm run test:coverage` | Runs tests with coverage                |
| `npm run ci`            | Runs lint, formatting, build, and tests |

---

## 📚 Additional Documentation

- [DOCUMENTACION.md](DOCUMENTACION.md) — Architecture and business rules
- [CONTRIBUTING.md](CONTRIBUTING.md) — Contribution workflow and local checks
