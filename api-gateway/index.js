const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const swaggerUi = require('swagger-ui-express');

const app = express();
app.use(express.json());

const PORT = 8000;

// ============================================================
//  Service Registry — all microservices mapped here
// ============================================================
const services = {
  patients:     'http://localhost:3001',
  doctors:      'http://localhost:3002',
  appointments: 'http://localhost:3003',
  medicines:    'http://localhost:3004',
  wards:        'http://localhost:3005',
  bills:        'http://localhost:3006',
};

// ============================================================
//  Proxy Routes — forward traffic to each microservice
// ============================================================
Object.entries(services).forEach(([path, target]) => {
  app.use(
    `/${path}`,
    createProxyMiddleware({
      target,
      changeOrigin: true,
      pathFilter: `/${path}`,
    })
  );
});

// ============================================================
//  Aggregated Swagger UI via Gateway
//  Shows all 6 services in one Swagger page
// ============================================================
const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Hospital Management System — API Gateway',
    version: '1.0.0',
    description: 'Unified API Gateway for all Hospital Microservices. Access all services through port 8000.',
  },
  servers: [{ url: `http://localhost:${PORT}`, description: 'API Gateway (single entry point)' }],
  paths: {
    // ---- PATIENTS ----
    '/patients': {
      get: { tags: ['Patients'], summary: 'Get all patients', responses: { 200: { description: 'OK' } } },
      post: {
        tags: ['Patients'], summary: 'Create a new patient',
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { name: { type: 'string' }, age: { type: 'integer' }, gender: { type: 'string' }, contact: { type: 'string' }, bloodType: { type: 'string' } } } } } },
        responses: { 201: { description: 'Patient created' } }
      },
    },
    '/patients/{id}': {
      get: { tags: ['Patients'], summary: 'Get patient by ID', parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }], responses: { 200: { description: 'OK' }, 404: { description: 'Not found' } } },
      put: { tags: ['Patients'], summary: 'Update patient', parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }], requestBody: { required: true, content: { 'application/json': { schema: { type: 'object' } } } }, responses: { 200: { description: 'Updated' } } },
      delete: { tags: ['Patients'], summary: 'Delete patient', parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }], responses: { 200: { description: 'Deleted' } } },
    },
    // ---- DOCTORS ----
    '/doctors': {
      get: { tags: ['Doctors'], summary: 'Get all doctors', responses: { 200: { description: 'OK' } } },
      post: { tags: ['Doctors'], summary: 'Add a doctor', requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { name: { type: 'string' }, specialization: { type: 'string' }, contact: { type: 'string' }, availability: { type: 'string' } } } } } }, responses: { 201: { description: 'Created' } } },
    },
    '/doctors/{id}': {
      get: { tags: ['Doctors'], summary: 'Get doctor by ID', parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }], responses: { 200: { description: 'OK' } } },
      put: { tags: ['Doctors'], summary: 'Update doctor', parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }], requestBody: { required: true, content: { 'application/json': { schema: { type: 'object' } } } }, responses: { 200: { description: 'Updated' } } },
      delete: { tags: ['Doctors'], summary: 'Delete doctor', parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }], responses: { 200: { description: 'Deleted' } } },
    },
    // ---- APPOINTMENTS ----
    '/appointments': {
      get: { tags: ['Appointments'], summary: 'Get all appointments', responses: { 200: { description: 'OK' } } },
      post: { tags: ['Appointments'], summary: 'Create appointment', requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { patientId: { type: 'integer' }, doctorId: { type: 'integer' }, date: { type: 'string' }, time: { type: 'string' }, reason: { type: 'string' } } } } } }, responses: { 201: { description: 'Created' } } },
    },
    '/appointments/{id}': {
      get: { tags: ['Appointments'], summary: 'Get appointment by ID', parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }], responses: { 200: { description: 'OK' } } },
      put: { tags: ['Appointments'], summary: 'Update appointment', parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }], requestBody: { required: true, content: { 'application/json': { schema: { type: 'object' } } } }, responses: { 200: { description: 'Updated' } } },
      delete: { tags: ['Appointments'], summary: 'Cancel appointment', parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }], responses: { 200: { description: 'Deleted' } } },
    },
    // ---- MEDICINES ----
    '/medicines': {
      get: { tags: ['Pharmacy'], summary: 'Get all medicines', responses: { 200: { description: 'OK' } } },
      post: { tags: ['Pharmacy'], summary: 'Add medicine', requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { name: { type: 'string' }, category: { type: 'string' }, stock: { type: 'integer' }, price: { type: 'number' }, unit: { type: 'string' } } } } } }, responses: { 201: { description: 'Created' } } },
    },
    '/medicines/{id}': {
      get: { tags: ['Pharmacy'], summary: 'Get medicine by ID', parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }], responses: { 200: { description: 'OK' } } },
      put: { tags: ['Pharmacy'], summary: 'Update medicine', parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }], requestBody: { required: true, content: { 'application/json': { schema: { type: 'object' } } } }, responses: { 200: { description: 'Updated' } } },
      delete: { tags: ['Pharmacy'], summary: 'Remove medicine', parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }], responses: { 200: { description: 'Deleted' } } },
    },
    // ---- WARDS ----
    '/wards': {
      get: { tags: ['Wards'], summary: 'Get all wards', responses: { 200: { description: 'OK' } } },
      post: { tags: ['Wards'], summary: 'Add ward', requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { wardName: { type: 'string' }, totalBeds: { type: 'integer' }, availableBeds: { type: 'integer' }, floor: { type: 'integer' }, type: { type: 'string' } } } } } }, responses: { 201: { description: 'Created' } } },
    },
    '/wards/{id}': {
      get: { tags: ['Wards'], summary: 'Get ward by ID', parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }], responses: { 200: { description: 'OK' } } },
      put: { tags: ['Wards'], summary: 'Update ward', parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }], requestBody: { required: true, content: { 'application/json': { schema: { type: 'object' } } } }, responses: { 200: { description: 'Updated' } } },
      delete: { tags: ['Wards'], summary: 'Delete ward', parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }], responses: { 200: { description: 'Deleted' } } },
    },
    // ---- BILLS ----
    '/bills': {
      get: { tags: ['Billing'], summary: 'Get all bills', responses: { 200: { description: 'OK' } } },
      post: { tags: ['Billing'], summary: 'Create bill', requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { patientId: { type: 'integer' }, appointmentId: { type: 'integer' }, amount: { type: 'number' }, description: { type: 'string' } } } } } }, responses: { 201: { description: 'Created' } } },
    },
    '/bills/{id}': {
      get: { tags: ['Billing'], summary: 'Get bill by ID', parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }], responses: { 200: { description: 'OK' } } },
      put: { tags: ['Billing'], summary: 'Update bill', parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }], requestBody: { required: true, content: { 'application/json': { schema: { type: 'object' } } } }, responses: { 200: { description: 'Updated' } } },
      delete: { tags: ['Billing'], summary: 'Delete bill', parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }], responses: { 200: { description: 'Deleted' } } },
    },
  },
  tags: [
    { name: 'Patients', description: 'Patient Management Service (port 3001)' },
    { name: 'Doctors', description: 'Doctor Management Service (port 3002)' },
    { name: 'Appointments', description: 'Appointment Scheduling Service (port 3003)' },
    { name: 'Pharmacy', description: 'Pharmacy & Medicine Service (port 3004)' },
    { name: 'Wards', description: 'Ward & Bed Management Service (port 3005)' },
    { name: 'Billing', description: 'Billing & Payment Service (port 3006)' },
  ],
};

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Gateway health check
app.get('/', (req, res) => {
  res.json({
    message: '🏥 Hospital Management System — API Gateway',
    status: 'Running',
    port: PORT,
    swagger: `http://localhost:${PORT}/api-docs`,
    services: Object.entries(services).map(([name, url]) => ({ name, url, gatewayPath: `http://localhost:${PORT}/${name}` })),
  });
});

app.listen(PORT, () => {
  console.log(`\n🏥 API Gateway running on http://localhost:${PORT}`);
  console.log(`📄 Swagger UI:        http://localhost:${PORT}/api-docs`);
  console.log(`\nRouting table:`);
  Object.entries(services).forEach(([path, target]) => {
    console.log(`  → /${path.padEnd(14)} → ${target}`);
  });
});
