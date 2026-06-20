const express = require('express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
app.use(express.json());

const PORT = 3002;

let doctors = [
  { id: 1, name: 'Dr. Suresh Jayawardena', specialization: 'Cardiology', contact: '0771112222', availability: 'Mon-Fri' },
  { id: 2, name: 'Dr. Priya Wijesinghe', specialization: 'Neurology', contact: '0773334444', availability: 'Tue-Sat' },
  { id: 3, name: 'Dr. Rohan Bandara', specialization: 'Orthopedics', contact: '0775556666', availability: 'Mon-Wed' },
];
let nextId = 4;

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: { title: 'Doctor Service API', version: '1.0.0', description: 'Manages hospital doctor records' },
    servers: [{ url: `http://localhost:${PORT}` }],
  },
  apis: ['./index.js'],
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Root endpoint
app.get('/', (req, res) => res.json({ message: 'Doctor Service', version: '1.0.0', docs: '/api-docs' }));

/**
 * @swagger
 * /doctors:
 *   get:
 *     summary: Get all doctors
 *     tags: [Doctors]
 *     responses:
 *       200:
 *         description: List of all doctors
 */
app.get('/doctors', (req, res) => res.json(doctors));

/**
 * @swagger
 * /doctors/{id}:
 *   get:
 *     summary: Get doctor by ID
 *     tags: [Doctors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Doctor found
 *       404:
 *         description: Doctor not found
 */
app.get('/doctors/:id', (req, res) => {
  const doctor = doctors.find(d => d.id === parseInt(req.params.id));
  if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
  res.json(doctor);
});

/**
 * @swagger
 * /doctors:
 *   post:
 *     summary: Add a new doctor
 *     tags: [Doctors]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, specialization, contact, availability]
 *             properties:
 *               name:
 *                 type: string
 *               specialization:
 *                 type: string
 *               contact:
 *                 type: string
 *               availability:
 *                 type: string
 *     responses:
 *       201:
 *         description: Doctor created
 */
app.post('/doctors', (req, res) => {
  const { name, specialization, contact, availability } = req.body;
  const newDoctor = { id: nextId++, name, specialization, contact, availability };
  doctors.push(newDoctor);
  res.status(201).json(newDoctor);
});

/**
 * @swagger
 * /doctors/{id}:
 *   put:
 *     summary: Update doctor by ID
 *     tags: [Doctors]
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
 *               specialization:
 *                 type: string
 *               contact:
 *                 type: string
 *               availability:
 *                 type: string
 *     responses:
 *       200:
 *         description: Doctor updated
 */
app.put('/doctors/:id', (req, res) => {
  const index = doctors.findIndex(d => d.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ message: 'Doctor not found' });
  doctors[index] = { ...doctors[index], ...req.body };
  res.json(doctors[index]);
});

/**
 * @swagger
 * /doctors/{id}:
 *   delete:
 *     summary: Delete doctor by ID
 *     tags: [Doctors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Doctor deleted
 */
app.delete('/doctors/:id', (req, res) => {
  const index = doctors.findIndex(d => d.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ message: 'Doctor not found' });
  doctors.splice(index, 1);
  res.json({ message: 'Doctor deleted successfully' });
});

app.listen(PORT, () => console.log(`Doctor Service running on http://localhost:${PORT}\nSwagger: http://localhost:${PORT}/api-docs`));
