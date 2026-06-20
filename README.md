# 🏥 Hospital Management System — Microservices

## Architecture Overview

```
Client
  │
  ▼
┌─────────────────────────────┐
│   API Gateway  :8000        │  ← Single Entry Point
│   /api-docs (Swagger)       │
└──────────────┬──────────────┘
               │ routes to
    ┌──────────┼──────────────────────┐
    │          │          │           │
    ▼          ▼          ▼           ▼
Patient    Doctor    Appointment  Pharmacy  Ward    Billing
 :3001      :3002       :3003      :3004   :3005    :3006
```

## Services

| Service            | Port | Swagger URL                      | Member   |
|--------------------|------|----------------------------------|----------|
| Patient Service    | 3001 | http://localhost:3001/api-docs   | Member 1 |
| Doctor Service     | 3002 | http://localhost:3002/api-docs   | Member 2 |
| Appointment Service| 3003 | http://localhost:3003/api-docs   | Member 3 |
| Pharmacy Service   | 3004 | http://localhost:3004/api-docs   | Member 4 |
| Ward Service       | 3005 | http://localhost:3005/api-docs   | Member 5 |
| Billing Service    | 3006 | http://localhost:3006/api-docs   | Member 6 |
| **API Gateway**    | **8000** | **http://localhost:8000/api-docs** | All  |

---

## ✅ How to Run

### Step 1: Install dependencies for ALL services

Open 7 terminal windows (or use VS Code integrated terminal tabs).

```bash
# Terminal 1 — Patient Service
cd patient-service
npm install
npm start

# Terminal 2 — Doctor Service
cd doctor-service
npm install
npm start

# Terminal 3 — Appointment Service
cd appointment-service
npm install
npm start

# Terminal 4 — Pharmacy Service
cd pharmacy-service
npm install
npm start

# Terminal 5 — Ward Service
cd ward-service
npm install
npm start

# Terminal 6 — Billing Service
cd billing-service
npm install
npm start

# Terminal 7 — API Gateway (start LAST)
cd api-gateway
npm install
npm start
```

### Step 2: Test Direct Access (for screenshots)
- Patient:     http://localhost:3001/patients
- Doctor:      http://localhost:3002/doctors
- Appointment: http://localhost:3003/appointments
- Pharmacy:    http://localhost:3004/medicines
- Ward:        http://localhost:3005/wards
- Billing:     http://localhost:3006/bills

### Step 3: Test via API Gateway (for screenshots)
- Patient:     http://localhost:8000/patients
- Doctor:      http://localhost:8000/doctors
- Appointment: http://localhost:8000/appointments
- Pharmacy:    http://localhost:8000/medicines
- Ward:        http://localhost:8000/wards
- Billing:     http://localhost:8000/bills

### Step 4: Swagger UI screenshots needed
1. http://localhost:3001/api-docs  → Patient native Swagger
2. http://localhost:3002/api-docs  → Doctor native Swagger
3. http://localhost:3003/api-docs  → Appointment native Swagger
4. http://localhost:3004/api-docs  → Pharmacy native Swagger
5. http://localhost:3005/api-docs  → Ward native Swagger
6. http://localhost:3006/api-docs  → Billing native Swagger
7. http://localhost:8000/api-docs  → GATEWAY Swagger (all in one!)

---

## Folder Structure

```
hospital-microservices/
├── api-gateway/
│   ├── index.js
│   └── package.json
├── patient-service/
│   ├── index.js
│   └── package.json
├── doctor-service/
│   ├── index.js
│   └── package.json
├── appointment-service/
│   ├── index.js
│   └── package.json
├── pharmacy-service/
│   ├── index.js
│   └── package.json
├── ward-service/
│   ├── index.js
│   └── package.json
└── billing-service/
    ├── index.js
    └── package.json
```

## Why API Gateway?

Without Gateway: client must know 6 different ports (3001–3006)
With Gateway: client only needs port 8000 for everything

The gateway uses `http-proxy-middleware` to forward requests:
- GET http://localhost:8000/patients → forwards to → http://localhost:3001/patients
- GET http://localhost:8000/doctors  → forwards to → http://localhost:3002/doctors
- etc.
