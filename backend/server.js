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

// Routes pour la société
app.get('/api/societe', async (req, res) => {
  try {
    const societe = await prisma.societe.findFirst();
    if (!societe) {
      return res.status(404).json({ error: 'Aucune société configurée' });
    }
    res.json(societe);
  } catch (error) {
    console.error('Erreur lors de la récupération de la société:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.put('/api/societe/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const societe = await prisma.societe.update({
      where: { id },
      data: req.body
    });
    res.json(societe);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la société:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.post('/api/societe/upload-logo', async (req, res) => {
  try {
    const { logoBase64, logoUrl } = req.body;
    const societe = await prisma.societe.findFirst();
    
    if (!societe) {
      return res.status(404).json({ error: 'Aucune société configurée' });
    }
    
    const societeModifiee = await prisma.societe.update({
      where: { id: societe.id },
      data: { logoBase64, logoUrl }
    });
    
    res.json(societeModifiee);
  } catch (error) {
    console.error('Erreur lors de l\'upload du logo:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Routes pour les chantiers
app.get('/api/chantiers', async (req, res) => {
  try {
    const chantiers = await prisma.chantier.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(chantiers);
  } catch (error) {
    console.error('Erreur lors de la récupération des chantiers:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Routes pour les bons de commande
app.get('/api/bons-commande', async (req, res) => {
  try {
    const bonsCommande = await prisma.bonCommande.findMany({
      include: {
        fournisseur: true,
        chantier: true,
        demandeur: true,
        createur: true,
        articles: true
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(bonsCommande);
  } catch (error) {
    console.error('Erreur lors de la récupération des bons de commande:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.post('/api/bons-commande', async (req, res) => {
  try {
    const { articles, ...bonCommandeData } = req.body;
    
    // Créer le bon de commande avec les articles
    const bonCommande = await prisma.bonCommande.create({
      data: {
        ...bonCommandeData,
        articles: {
          create: articles
        }
      },
      include: {
        fournisseur: true,
        chantier: true,
        demandeur: true,
        createur: true,
        articles: true
      }
    });
    
    res.status(201).json(bonCommande);
  } catch (error) {
    console.error('Erreur lors de la création du bon de commande:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.get('/api/bons-commande/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const bonCommande = await prisma.bonCommande.findUnique({
      where: { id },
      include: {
        fournisseur: true,
        chantier: true,
        demandeur: true,
        createur: true,
        articles: true
      }
    });
    
    if (!bonCommande) {
      return res.status(404).json({ error: 'Bon de commande non trouvé' });
    }
    
    res.json(bonCommande);
  } catch (error) {
    console.error('Erreur lors de la récupération du bon de commande:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Route pour récupérer les utilisateurs (pour les bons de commande)
app.get('/api/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      where: { actif: true },
      select: {
        id: true,
        nom: true,
        prenom: true,
        email: true,
        role: true
      },
      orderBy: { nom: 'asc' }
    });
    res.json(users);
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ========================================
// ROUTES MULTI-ENTREPRISES
// ========================================

// ===== ROUTES ENTREPRISES =====

// GET /api/companies - Liste des entreprises
app.get('/api/companies', async (req, res) => {
  try {
    const { page = 1, limit = 20, search, active } = req.query;
    const skip = (page - 1) * limit;
    
    const where = {};
    if (search) {
      where.OR = [
        { code: { contains: search, mode: 'insensitive' } },
        { name: { contains: search, mode: 'insensitive' } },
        { legalName: { contains: search, mode: 'insensitive' } }
      ];
    }
    
    if (active !== undefined) {
      where.isActive = active === 'true';
    }
    
    const [companies, total] = await Promise.all([
      prisma.company.findMany({
        where,
        skip: parseInt(skip),
        take: parseInt(limit),
        orderBy: { name: 'asc' },
        include: {
          branding: true,
          _count: {
            select: {
              templates: true,
              numberingRules: true
            }
          }
        }
      }),
      prisma.company.count({ where })
    ]);
    
    res.json({
      companies,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des entreprises:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST /api/companies - Créer une entreprise
app.post('/api/companies', async (req, res) => {
  try {
    const companyData = req.body;
    
    // Validation basique
    if (!companyData.code || !companyData.name) {
      return res.status(400).json({ error: 'Code et nom requis' });
    }
    
    // Vérifier que le code est unique
    const existingCompany = await prisma.company.findUnique({
      where: { code: companyData.code }
    });
    
    if (existingCompany) {
      return res.status(400).json({ error: 'Code entreprise déjà utilisé' });
    }
    
    // Créer l'entreprise avec branding par défaut
    const company = await prisma.company.create({
      data: {
        ...companyData,
        branding: {
          create: {
            primaryColor: '#1E40AF',
            secondaryColor: '#059669',
            accentColor: '#DC2626',
            textColor: '#1F2937',
            backgroundColor: '#F9FAFB'
          }
        }
      },
      include: {
        branding: true
      }
    });
    
    res.status(201).json(company);
  } catch (error) {
    console.error('Erreur lors de la création de l\'entreprise:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// PUT /api/companies/:id - Modifier une entreprise
app.put('/api/companies/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const companyData = req.body;
    
    // Validation basique
    if (!companyData.code || !companyData.name) {
      return res.status(400).json({ error: 'Code et nom requis' });
    }
    
    // Vérifier que le code est unique (sauf pour cette entreprise)
    const existingCompany = await prisma.company.findFirst({
      where: {
        code: companyData.code,
        id: { not: id }
      }
    });
    
    if (existingCompany) {
      return res.status(400).json({ error: 'Code entreprise déjà utilisé' });
    }
    
    const company = await prisma.company.update({
      where: { id },
      data: companyData,
      include: {
        branding: true
      }
    });
    
    res.json(company);
  } catch (error) {
    console.error('Erreur lors de la modification de l\'entreprise:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// PUT /api/companies/:id/branding - Modifier le branding
app.put('/api/companies/:id/branding', async (req, res) => {
  try {
    const { id } = req.params;
    const brandingData = req.body;
    
    // Validation des couleurs
    const colorRegex = /^#[0-9A-Fa-f]{6}$/;
    if (!colorRegex.test(brandingData.primaryColor) || 
        !colorRegex.test(brandingData.secondaryColor) || 
        !colorRegex.test(brandingData.accentColor)) {
      return res.status(400).json({ error: 'Format de couleur invalide (format hex requis)' });
    }
    
    const branding = await prisma.branding.upsert({
      where: { companyId: id },
      update: brandingData,
      create: {
        companyId: id,
        ...brandingData
      }
    });
    
    res.json(branding);
  } catch (error) {
    console.error('Erreur lors de la modification du branding:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ===== ROUTES TEMPLATES =====

// GET /api/templates - Liste des templates
app.get('/api/templates', async (req, res) => {
  try {
    const { companyId, type, active, system } = req.query;
    
    const where = {};
    if (companyId) where.companyId = companyId;
    if (type) where.type = type;
    if (active !== undefined) where.isActive = active === 'true';
    if (system !== undefined) where.isSystem = system === 'true';
    
    const templates = await prisma.template.findMany({
      where,
      orderBy: [
        { companyId: 'asc' },
        { type: 'asc' },
        { version: 'desc' }
      ],
      include: {
        company: {
          select: {
            id: true,
            code: true,
            name: true
          }
        },
        fallbackTemplate: {
          select: {
            id: true,
            name: true,
            version: true
          }
        }
      }
    });
    
    res.json(templates);
  } catch (error) {
    console.error('Erreur lors de la récupération des templates:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST /api/templates - Créer un template
app.post('/api/templates', async (req, res) => {
  try {
    const templateData = req.body;
    
    // Validation basique
    if (!templateData.name || !templateData.type || !templateData.html) {
      return res.status(400).json({ error: 'Nom, type et HTML requis' });
    }
    
    // Vérifier que l'entreprise existe
    if (templateData.companyId) {
      const company = await prisma.company.findUnique({
        where: { id: templateData.companyId }
      });
      
      if (!company) {
        return res.status(400).json({ error: 'Entreprise non trouvée' });
      }
    }
    
    // Créer le template
    const template = await prisma.template.create({
      data: templateData,
      include: {
        company: {
          select: {
            id: true,
            code: true,
            name: true
          }
        }
      }
    });
    
    // Créer la première version
    await prisma.templateVersion.create({
      data: {
        templateId: template.id,
        version: template.version,
        html: template.html,
        css: template.css,
        js: template.js,
        modifiedBy: 'system'
      }
    });
    
    res.status(201).json(template);
  } catch (error) {
    console.error('Erreur lors de la création du template:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ===== ROUTES DE RENDU =====

// POST /api/render/pdf - Générer un PDF
app.post('/api/render/pdf', async (req, res) => {
  try {
    const { templateId, data, options = {} } = req.body;
    
    // Récupérer le template
    const template = await prisma.template.findUnique({
      where: { id: templateId },
      include: {
        company: {
          include: {
            branding: true
          }
        }
      }
    });
    
    if (!template) {
      return res.status(404).json({ error: 'Template non trouvé' });
    }
    
    // Pour l'instant, retourner une erreur car Puppeteer n'est pas encore configuré
    res.status(501).json({ 
      error: 'Fonctionnalité en cours de développement',
      message: 'Le rendu PDF sera disponible après configuration de Puppeteer',
      template: {
        id: template.id,
        name: template.name,
        type: template.type
      }
    });
    
  } catch (error) {
    console.error('Erreur lors de la génération du PDF:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ===== ROUTES UTILITAIRES =====

// GET /api/companies/:id/config - Configuration complète de l'entreprise
app.get('/api/companies/:id/config', async (req, res) => {
  try {
    const { id } = req.params;
    
    const config = await prisma.company.findUnique({
      where: { id },
      select: {
        id: true,
        code: true,
        name: true,
        legalName: true,
        siret: true,
        tvaNumber: true,
        address: true,
        postalCode: true,
        city: true,
        country: true,
        phone: true,
        email: true,
        website: true,
        timezone: true,
        locale: true,
        currency: true,
        branding: {
          select: {
            primaryColor: true,
            secondaryColor: true,
            accentColor: true,
            textColor: true,
            backgroundColor: true,
            logoUrl: true,
            primaryFont: true,
            secondaryFont: true
          }
        }
      }
    });
    
    if (!config) {
      return res.status(404).json({ error: 'Entreprise non trouvée' });
    }
    
    res.json(config);
  } catch (error) {
    console.error('Erreur lors de la récupération de la config:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
  console.log(`📡 API disponible sur http://localhost:${PORT}`);
  console.log(`🏢 Système multi-entreprises configuré`);
});

// Gestion de la fermeture propre
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
