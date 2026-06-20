const express = require('express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
app.use(express.json());

const PORT = 3001;

// In-memory data store
let patients = [
  { id: 1, name: 'John Silva', age: 35, gender: 'Male', contact: '0771234567', bloodType: 'A+' },
  { id: 2, name: 'Nimal Perera', age: 52, gender: 'Male', contact: '0779876543', bloodType: 'O-' },
  { id: 3, name: 'Kamala Fernando', age: 28, gender: 'Female', contact: '0712345678', bloodType: 'B+' },
];
let nextId = 4;

// Swagger setup
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: { title: 'Patient Service API', version: '1.0.0', description: 'Manages hospital patient records' },
    servers: [{ url: `http://localhost:${PORT}` }],
  },
  apis: ['./index.js'],
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Root endpoint
app.get('/', (req, res) => res.json({ message: 'Patient Service', version: '1.0.0', docs: '/api-docs' }));

/**
 * @swagger
 * /patients:
 *   get:
 *     summary: Get all patients
 *     tags: [Patients]
 *     responses:
 *       200:
 *         description: List of all patients
 */
app.get('/patients', (req, res) => res.json(patients));

/**
 * @swagger
 * /patients/{id}:
 *   get:
 *     summary: Get patient by ID
 *     tags: [Patients]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Patient found
 *       404:
 *         description: Patient not found
 */
app.get('/patients/:id', (req, res) => {
  const patient = patients.find(p => p.id === parseInt(req.params.id));
  if (!patient) return res.status(404).json({ message: 'Patient not found' });
  res.json(patient);
});

/**
 * @swagger
 * /patients:
 *   post:
 *     summary: Add a new patient
 *     tags: [Patients]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, age, gender, contact, bloodType]
 *             properties:
 *               name:
 *                 type: string
 *               age:
 *                 type: integer
 *               gender:
 *                 type: string
 *               contact:
 *                 type: string
 *               bloodType:
 *                 type: string
 *     responses:
 *       201:
 *         description: Patient created
 */
app.post('/patients', (req, res) => {
  const { name, age, gender, contact, bloodType } = req.body;
  const newPatient = { id: nextId++, name, age, gender, contact, bloodType };
  patients.push(newPatient);
  res.status(201).json(newPatient);
});

/**
 * @swagger
 * /patients/{id}:
 *   put:
 *     summary: Update patient by ID
 *     tags: [Patients]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               age:
 *                 type: integer
 *               gender:
 *                 type: string
 *               contact:
 *                 type: string
 *               bloodType:
 *                 type: string
 *     responses:
 *       200:
 *         description: Patient updated
 *       404:
 *         description: Patient not found
 */
app.put('/patients/:id', (req, res) => {
  const index = patients.findIndex(p => p.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ message: 'Patient not found' });
  patients[index] = { ...patients[index], ...req.body };
  res.json(patients[index]);
});

/**
 * @swagger
 * /patients/{id}:
 *   delete:
 *     summary: Delete patient by ID
 *     tags: [Patients]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Patient deleted
 *       404:
 *         description: Patient not found
 */
app.delete('/patients/:id', (req, res) => {
  const index = patients.findIndex(p => p.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ message: 'Patient not found' });
  patients.splice(index, 1);
  res.json({ message: 'Patient deleted successfully' });
});

app.listen(PORT, () => console.log(`Patient Service running on http://localhost:${PORT}\nSwagger: http://localhost:${PORT}/api-docs`));
