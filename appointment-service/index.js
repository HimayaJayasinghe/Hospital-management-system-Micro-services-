const express = require('express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
app.use(express.json());

const PORT = 3003;

let appointments = [
  { id: 1, patientId: 1, doctorId: 1, date: '2026-03-25', time: '09:00', status: 'Scheduled', reason: 'Chest pain' },
  { id: 2, patientId: 2, doctorId: 3, date: '2026-03-26', time: '10:30', status: 'Scheduled', reason: 'Knee pain' },
  { id: 3, patientId: 3, doctorId: 2, date: '2026-03-27', time: '14:00', status: 'Completed', reason: 'Headaches' },
];
let nextId = 4;

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: { title: 'Appointment Service API', version: '1.0.0', description: 'Manages hospital appointments' },
    servers: [{ url: `http://localhost:${PORT}` }],
  },
  apis: ['./index.js'],
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Root endpoint
app.get('/', (req, res) => res.json({ message: 'Appointment Service', version: '1.0.0', docs: '/api-docs' }));

/**
 * @swagger
 * /appointments:
 *   get:
 *     summary: Get all appointments
 *     tags: [Appointments]
 *     responses:
 *       200:
 *         description: List of all appointments
 */
app.get('/appointments', (req, res) => res.json(appointments));

/**
 * @swagger
 * /appointments/{id}:
 *   get:
 *     summary: Get appointment by ID
 *     tags: [Appointments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Appointment found
 *       404:
 *         description: Appointment not found
 */
app.get('/appointments/:id', (req, res) => {
  const appt = appointments.find(a => a.id === parseInt(req.params.id));
  if (!appt) return res.status(404).json({ message: 'Appointment not found' });
  res.json(appt);
});

/**
 * @swagger
 * /appointments:
 *   post:
 *     summary: Create a new appointment
 *     tags: [Appointments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [patientId, doctorId, date, time, reason]
 *             properties:
 *               patientId:
 *                 type: integer
 *               doctorId:
 *                 type: integer
 *               date:
 *                 type: string
 *               time:
 *                 type: string
 *               reason:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       201:
 *         description: Appointment created
 */
app.post('/appointments', (req, res) => {
  const { patientId, doctorId, date, time, reason, status = 'Scheduled' } = req.body;
  const newAppt = { id: nextId++, patientId, doctorId, date, time, status, reason };
  appointments.push(newAppt);
  res.status(201).json(newAppt);
});

/**
 * @swagger
 * /appointments/{id}:
 *   put:
 *     summary: Update appointment by ID
 *     tags: [Appointments]
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
 *               date:
 *                 type: string
 *               time:
 *                 type: string
 *               status:
 *                 type: string
 *               reason:
 *                 type: string
 *     responses:
 *       200:
 *         description: Appointment updated
 */
app.put('/appointments/:id', (req, res) => {
  const index = appointments.findIndex(a => a.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ message: 'Appointment not found' });
  appointments[index] = { ...appointments[index], ...req.body };
  res.json(appointments[index]);
});

/**
 * @swagger
 * /appointments/{id}:
 *   delete:
 *     summary: Cancel/delete appointment by ID
 *     tags: [Appointments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Appointment deleted
 */
app.delete('/appointments/:id', (req, res) => {
  const index = appointments.findIndex(a => a.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ message: 'Appointment not found' });
  appointments.splice(index, 1);
  res.json({ message: 'Appointment cancelled successfully' });
});

app.listen(PORT, () => console.log(`Appointment Service running on http://localhost:${PORT}\nSwagger: http://localhost:${PORT}/api-docs`));
