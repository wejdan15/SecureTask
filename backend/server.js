const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors({
  origin: 'http://localhost:4200'
}));
app.use(express.json());

// Connexion MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'securetask_db'
});

db.connect((err) => {
  if (err) {
    console.error('❌ Erreur connexion MySQL :', err);
    return;
  }

  console.log('✅ Connexion MySQL réussie !');
});

// Test API
app.get('/', (req, res) => {
  res.send('SecureTask API fonctionne 🚀');
});

// Récupérer les tâches depuis MySQL
app.get('/api/tasks', (req, res) => {

  const sql = 'SELECT * FROM tasks';

  db.query(sql, (err, results) => {

    if (err) {
      console.error('❌ Erreur récupération tâches :', err);
      return res.status(500).json({
        error: 'Erreur serveur'
      });
    }

    res.json(results);
  });
});
// Ajouter une nouvelle tâche
app.post('/api/tasks', (req, res) => {

  const { title, description } = req.body;

  const sql = `
    INSERT INTO tasks (title, description, completed)
    VALUES (?, ?, 0)
  `;

  db.query(sql, [title, description], (err, result) => {

    if (err) {
      console.error('Erreur ajout tâche :', err);
      return res.status(500).json({
        error: 'Erreur serveur'
      });
    }

    res.status(201).json({
      id: result.insertId,
      title: title,
      description: description,
      completed: 0
    });

  });

});

// Marquer une tâche comme terminée
app.put('/api/tasks/:id/complete', (req, res) => {

  const id = req.params.id;

  const sql = 'UPDATE tasks SET completed = 1 WHERE id = ?';

  db.query(sql, [id], (err, result) => {

    if (err) {
      console.error('Erreur modification tâche :', err);
      return res.status(500).json({
        error: 'Erreur serveur'
      });
    }

    res.json({
      message: 'Tâche terminée'
    });

  });

});
app.listen(PORT, () => {
  console.log(`🚀 Backend démarré sur http://localhost:${PORT}`);
});