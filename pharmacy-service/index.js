const express = require('express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
app.use(express.json());

const PORT = 3004;

let medicines = [
  { id: 1, name: 'Paracetamol', category: 'Painkiller', stock: 500, price: 25.00, unit: 'tablets' },
  { id: 2, name: 'Amoxicillin', category: 'Antibiotic', stock: 200, price: 85.00, unit: 'capsules' },
  { id: 3, name: 'Metformin', category: 'Diabetes', stock: 350, price: 45.00, unit: 'tablets' },
];
let nextId = 4;

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: { title: 'Pharmacy Service API', version: '1.0.0', description: 'Manages hospital pharmacy and medicine inventory' },
    servers: [{ url: `http://localhost:${PORT}` }],
  },
  apis: ['./index.js'],
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Root endpoint
app.get('/', (req, res) => res.json({ message: 'Pharmacy Service', version: '1.0.0', docs: '/api-docs' }));

/**
 * @swagger
 * /medicines:
 *   get:
 *     summary: Get all medicines
 *     tags: [Pharmacy]
 *     responses:
 *       200:
 *         description: List of all medicines
 */
app.get('/medicines', (req, res) => res.json(medicines));

/**
 * @swagger
 * /medicines/{id}:
 *   get:
 *     summary: Get medicine by ID
 *     tags: [Pharmacy]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Medicine found
 *       404:
 *         description: Medicine not found
 */
app.get('/medicines/:id', (req, res) => {
  const med = medicines.find(m => m.id === parseInt(req.params.id));
  if (!med) return res.status(404).json({ message: 'Medicine not found' });
  res.json(med);
});

/**
 * @swagger
 * /medicines:
 *   post:
 *     summary: Add new medicine
 *     tags: [Pharmacy]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, category, stock, price, unit]
 *             properties:
 *               name:
 *                 type: string
 *               category:
 *                 type: string
 *               stock:
 *                 type: integer
 *               price:
 *                 type: number
 *               unit:
 *                 type: string
 *     responses:
 *       201:
 *         description: Medicine added
 */
app.post('/medicines', (req, res) => {
  const { name, category, stock, price, unit } = req.body;
  const newMed = { id: nextId++, name, category, stock, price, unit };
  medicines.push(newMed);
  res.status(201).json(newMed);
});

/**
 * @swagger
 * /medicines/{id}:
 *   put:
 *     summary: Update medicine by ID
 *     tags: [Pharmacy]
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
 *               category:
 *                 type: string
 *               stock:
 *                 type: integer
 *               price:
 *                 type: number
 *               unit:
 *                 type: string
 *     responses:
 *       200:
 *         description: Medicine updated
 */
app.put('/medicines/:id', (req, res) => {
  const index = medicines.findIndex(m => m.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ message: 'Medicine not found' });
  medicines[index] = { ...medicines[index], ...req.body };
  res.json(medicines[index]);
});

/**
 * @swagger
 * /medicines/{id}:
 *   delete:
 *     summary: Remove medicine by ID
 *     tags: [Pharmacy]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Medicine removed
 */
app.delete('/medicines/:id', (req, res) => {
  const index = medicines.findIndex(m => m.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ message: 'Medicine not found' });
  medicines.splice(index, 1);
  res.json({ message: 'Medicine removed successfully' });
});

app.listen(PORT, () => console.log(`Pharmacy Service running on http://localhost:${PORT}\nSwagger: http://localhost:${PORT}/api-docs`));
