const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes pour les fournisseurs
app.get('/api/fournisseurs', async (req, res) => {
  try {
    const fournisseurs = await prisma.fournisseur.findMany({
      include: { contacts: true }
    });
    res.json(fournisseurs);
  } catch (error) {
    console.error('Erreur lors de la récupération des fournisseurs:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.post('/api/fournisseurs', async (req, res) => {
  try {
    const { fournisseur, contacts } = req.body;
    
    // Créer le fournisseur avec ses contacts
    const nouveauFournisseur = await prisma.fournisseur.create({
      data: {
        ...fournisseur,
        contacts: {
          create: contacts
        }
      },
      include: { contacts: true }
    });
    
    res.status(201).json(nouveauFournisseur);
  } catch (error) {
    console.error('Erreur lors de la création du fournisseur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.put('/api/fournisseurs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { fournisseur, contacts } = req.body;
    
    // Mettre à jour le fournisseur
    const fournisseurModifie = await prisma.fournisseur.update({
      where: { id },
      data: {
        ...fournisseur,
        contacts: {
          deleteMany: {},
          create: contacts
        }
      },
      include: { contacts: true }
    });
    
    res.json(fournisseurModifie);
  } catch (error) {
    console.error('Erreur lors de la modification du fournisseur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.delete('/api/fournisseurs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Supprimer le fournisseur (les contacts seront supprimés automatiquement)
    await prisma.fournisseur.delete({
      where: { id }
    });
    
    res.json({ message: 'Fournisseur supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression du fournisseur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Routes d'authentification
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, nom, prenom, role = 'USER' } = req.body;
    
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });
    
    if (existingUser) {
      return res.status(400).json({ error: 'Cet email est déjà utilisé' });
    }
    
    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Créer l'utilisateur
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        nom,
        prenom,
        role
      }
    });
    
    // Générer le token JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );
    
    res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        nom: user.nom,
        prenom: user.prenom,
        role: user.role
      },
      token
    });
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Trouver l'utilisateur
    const user = await prisma.user.findUnique({
      where: { email }
    });
    
    if (!user || !user.actif) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }
    
    // Vérifier le mot de passe
    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }
    
    // Générer le token JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );
    
    res.json({
      user: {
        id: user.id,
        email: user.email,
        nom: user.nom,
        prenom: user.prenom,
        role: user.role
      },
      token
    });
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.get('/api/auth/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Token manquant' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });
    
    if (!user || !user.actif) {
      return res.status(401).json({ error: 'Utilisateur non trouvé' });
    }
    
    res.json({
      user: {
        id: user.id,
        email: user.email,
        nom: user.nom,
        prenom: user.prenom,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Erreur lors de la vérification:', error);
    res.status(401).json({ error: 'Token invalide' });
  }
});

// Routes pour le plan comptable
app.get('/api/plan-comptable', async (req, res) => {
  try {
    const planComptable = await prisma.planComptable.findMany();
    res.json(planComptable);
  } catch (error) {
    console.error('Erreur lors de la récupération du plan comptable:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.post('/api/plan-comptable', async (req, res) => {
  try {
    const compte = await prisma.planComptable.create({
      data: req.body
    });
    res.status(201).json(compte);
  } catch (error) {
    console.error('Erreur lors de la création du compte:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
  console.log(`📡 API disponible sur http://localhost:${PORT}`);
});

// Gestion de la fermeture propre
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
