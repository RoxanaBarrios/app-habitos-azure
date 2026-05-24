import express, { Express, Request, Response } from 'express';
import cors from 'cors';
require('dotenv').config();

const app: Express = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Health check - prueba que API está funcionando
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ 
    status: 'API funcionando en Azure ✅',
    timestamp: new Date().toISOString()
  });
});

// GET hábitos
app.get('/api/habits', (req: Request, res: Response) => {
  res.json({ 
    message: 'GET /api/habits',
    habits: [],
    note: 'Próximamente conectado a SQL Azure'
  });
});

// POST crear hábito
app.post('/api/habits', (req: Request, res: Response) => {
  const { name, category, color } = req.body;
  
  if (!name) {
    return res.status(400).json({ error: 'El nombre del hábito es requerido' });
  }

  res.status(201).json({ 
    message: 'Hábito creado',
    habit: {
      id: Date.now().toString(),
      name,
      category: category || 'Salud',
      color: color || 'Azul',
      streak: 0,
      created_at: new Date().toISOString()
    }
  });
});

// GET hábito por ID
app.get('/api/habits/:id', (req: Request, res: Response) => {
  res.json({ 
    message: `GET /api/habits/${req.params.id}`,
    id: req.params.id
  });
});

// PUT actualizar hábito
app.put('/api/habits/:id', (req: Request, res: Response) => {
  res.json({ 
    message: `PUT /api/habits/${req.params.id}`,
    updated: true
  });
});

// DELETE hábito
app.delete('/api/habits/:id', (req: Request, res: Response) => {
  res.json({ 
    message: `DELETE /api/habits/${req.params.id}`,
    deleted: true
  });
});

// POST completar hábito
app.post('/api/habits/:id/complete', (req: Request, res: Response) => {
  res.json({ 
    message: `Hábito ${req.params.id} marcado como completado`,
    completed: true,
    streak: Math.floor(Math.random() * 21) + 1
  });
});

// Error 404
app.use((req: Request, res: Response) => {
  res.status(404).json({ 
    error: 'Ruta no encontrada',
    path: req.path
  });
});

app.listen(PORT, () => {
  console.log(`🚀 API corriendo en puerto ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
});
