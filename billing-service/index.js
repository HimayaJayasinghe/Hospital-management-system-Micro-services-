const express = require('express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
app.use(express.json());

const PORT = 3006;

let bills = [
  { id: 1, patientId: 1, appointmentId: 1, amount: 3500.00, status: 'Pending', date: '2026-03-25', description: 'Consultation + ECG' },
  { id: 2, patientId: 2, appointmentId: 2, amount: 5200.00, status: 'Paid', date: '2026-03-26', description: 'Consultation + X-Ray' },
  { id: 3, patientId: 3, appointmentId: 3, amount: 2800.00, status: 'Paid', date: '2026-03-27', description: 'Consultation + MRI scan' },
];
let nextId = 4;

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: { title: 'Billing Service API', version: '1.0.0', description: 'Manages hospital billing and payments' },
    servers: [{ url: `http://localhost:${PORT}` }],
  },
  apis: ['./index.js'],
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Root endpoint
app.get('/', (req, res) => res.json({ message: 'Billing Service', version: '1.0.0', docs: '/api-docs' }));

/**
 * @swagger
 * /bills:
 *   get:
 *     summary: Get all bills
 *     tags: [Billing]
 *     responses:
 *       200:
 *         description: List of all bills
 */
app.get('/bills', (req, res) => res.json(bills));

/**
 * @swagger
 * /bills/{id}:
 *   get:
 *     summary: Get bill by ID
 *     tags: [Billing]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Bill found
 *       404:
 *         description: Bill not found
 */
app.get('/bills/:id', (req, res) => {
  const bill = bills.find(b => b.id === parseInt(req.params.id));
  if (!bill) return res.status(404).json({ message: 'Bill not found' });
  res.json(bill);
});

/**
 * @swagger
 * /bills:
 *   post:
 *     summary: Create a new bill
 *     tags: [Billing]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [patientId, appointmentId, amount, description]
 *             properties:
 *               patientId:
 *                 type: integer
 *               appointmentId:
 *                 type: integer
 *               amount:
 *                 type: number
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       201:
 *         description: Bill created
 */
app.post('/bills', (req, res) => {
  const { patientId, appointmentId, amount, description, status = 'Pending' } = req.body;
  const date = new Date().toISOString().split('T')[0];
  const newBill = { id: nextId++, patientId, appointmentId, amount, status, date, description };
  bills.push(newBill);
  res.status(201).json(newBill);
});

/**
 * @swagger
 * /bills/{id}:
 *   put:
 *     summary: Update bill by ID
 *     tags: [Billing]
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
 *               amount:
 *                 type: number
 *               status:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Bill updated
 */
app.put('/bills/:id', (req, res) => {
  const index = bills.findIndex(b => b.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ message: 'Bill not found' });
  bills[index] = { ...bills[index], ...req.body };
  res.json(bills[index]);
});

/**
 * @swagger
 * /bills/{id}:
 *   delete:
 *     summary: Delete bill by ID
 *     tags: [Billing]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Bill deleted
 */
app.delete('/bills/:id', (req, res) => {
  const index = bills.findIndex(b => b.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ message: 'Bill not found' });
  bills.splice(index, 1);
  res.json({ message: 'Bill deleted successfully' });
});

app.listen(PORT, () => console.log(`Billing Service running on http://localhost:${PORT}\nSwagger: http://localhost:${PORT}/api-docs`));
