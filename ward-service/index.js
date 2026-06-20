const express = require('express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
app.use(express.json());

const PORT = 3005;

let wards = [
  { id: 1, wardName: 'Cardiology Ward', totalBeds: 20, availableBeds: 8, floor: 2, type: 'General' },
  { id: 2, wardName: 'ICU', totalBeds: 10, availableBeds: 3, floor: 3, type: 'Intensive Care' },
  { id: 3, wardName: 'Maternity Ward', totalBeds: 15, availableBeds: 10, floor: 1, type: 'Maternity' },
];
let nextId = 4;

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: { title: 'Ward Service API', version: '1.0.0', description: 'Manages hospital wards and bed availability' },
    servers: [{ url: `http://localhost:${PORT}` }],
  },
  apis: ['./index.js'],
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Root endpoint
app.get('/', (req, res) => res.json({ message: 'Ward Service', version: '1.0.0', docs: '/api-docs' }));

/**
 * @swagger
 * /wards:
 *   get:
 *     summary: Get all wards
 *     tags: [Wards]
 *     responses:
 *       200:
 *         description: List of all wards
 */
app.get('/wards', (req, res) => res.json(wards));

/**
 * @swagger
 * /wards/{id}:
 *   get:
 *     summary: Get ward by ID
 *     tags: [Wards]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Ward found
 *       404:
 *         description: Ward not found
 */
app.get('/wards/:id', (req, res) => {
  const ward = wards.find(w => w.id === parseInt(req.params.id));
  if (!ward) return res.status(404).json({ message: 'Ward not found' });
  res.json(ward);
});

/**
 * @swagger
 * /wards:
 *   post:
 *     summary: Add a new ward
 *     tags: [Wards]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [wardName, totalBeds, availableBeds, floor, type]
 *             properties:
 *               wardName:
 *                 type: string
 *               totalBeds:
 *                 type: integer
 *               availableBeds:
 *                 type: integer
 *               floor:
 *                 type: integer
 *               type:
 *                 type: string
 *     responses:
 *       201:
 *         description: Ward created
 */
app.post('/wards', (req, res) => {
  const { wardName, totalBeds, availableBeds, floor, type } = req.body;
  const newWard = { id: nextId++, wardName, totalBeds, availableBeds, floor, type };
  wards.push(newWard);
  res.status(201).json(newWard);
});

/**
 * @swagger
 * /wards/{id}:
 *   put:
 *     summary: Update ward by ID
 *     tags: [Wards]
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
 *               wardName:
 *                 type: string
 *               totalBeds:
 *                 type: integer
 *               availableBeds:
 *                 type: integer
 *               floor:
 *                 type: integer
 *               type:
 *                 type: string
 *     responses:
 *       200:
 *         description: Ward updated
 */
app.put('/wards/:id', (req, res) => {
  const index = wards.findIndex(w => w.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ message: 'Ward not found' });
  wards[index] = { ...wards[index], ...req.body };
  res.json(wards[index]);
});

/**
 * @swagger
 * /wards/{id}:
 *   delete:
 *     summary: Delete ward by ID
 *     tags: [Wards]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Ward deleted
 */
app.delete('/wards/:id', (req, res) => {
  const index = wards.findIndex(w => w.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ message: 'Ward not found' });
  wards.splice(index, 1);
  res.json({ message: 'Ward deleted successfully' });
});

app.listen(PORT, () => console.log(`Ward Service running on http://localhost:${PORT}\nSwagger: http://localhost:${PORT}/api-docs`));
