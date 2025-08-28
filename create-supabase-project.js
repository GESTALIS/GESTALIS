// =====================================================
// SCRIPT DE CRÉATION AUTOMATIQUE PROJET SUPABASE
// Création automatique du projet et de la base de données
// =====================================================

const https = require('https');
const fs = require('fs');

// Configuration
const SUPABASE_ACCESS_TOKEN = process.env.SUPABASE_ACCESS_TOKEN;
const PROJECT_NAME = 'gestalis-prod';
const DATABASE_PASSWORD = 'MotDePasseSecurise123!';
const REGION = 'us-east-1'; // Région valide Supabase

// Vérification du token
if (!SUPABASE_ACCESS_TOKEN) {
    console.log('❌ Token d\'accès Supabase manquant !');
    console.log('💡 Pour créer un token :');
    console.log('1. Aller sur https://supabase.com');
    console.log('2. Se connecter avec GitHub');
    console.log('3. Aller dans Account → Access Tokens');
    console.log('4. Créer un nouveau token');
    console.log('5. Exporter : export SUPABASE_ACCESS_TOKEN="votre_token"');
    process.exit(1);
}

// Fonction pour faire une requête HTTPS
function makeRequest(options, postData = null) {
    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    const jsonData = JSON.parse(data);
                    resolve({ statusCode: res.statusCode, data: jsonData });
                } catch (error) {
                    resolve({ statusCode: res.statusCode, data: data });
                }
            });
        });

        req.on('error', reject);

        if (postData) {
            req.write(postData);
        }

        req.end();
    });
}

// Récupérer l'organisation par défaut
async function getDefaultOrganization() {
    console.log('🏢 Récupération de l\'organisation par défaut...');
    
    const options = {
        hostname: 'api.supabase.com',
        port: 443,
        path: '/v1/organizations',
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${SUPABASE_ACCESS_TOKEN}`,
            'User-Agent': 'Gestalis-Deployment/1.0'
        }
    };

    try {
        const response = await makeRequest(options);
        
        if (response.statusCode === 200 && response.data.length > 0) {
            const org = response.data[0];
            console.log(`✅ Organisation trouvée : ${org.name} (ID: ${org.id})`);
            return org.id;
        } else {
            console.error('❌ Aucune organisation trouvée');
            return null;
        }
    } catch (error) {
        console.error('❌ Erreur lors de la récupération de l\'organisation :', error.message);
        return null;
    }
}

// Créer le projet Supabase
async function createSupabaseProject(organizationId) {
    console.log('🚀 Création du projet Supabase...');
    
    const options = {
        hostname: 'api.supabase.com',
        port: 443,
        path: '/v1/projects',
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${SUPABASE_ACCESS_TOKEN}`,
            'Content-Type': 'application/json',
            'User-Agent': 'Gestalis-Deployment/1.0'
        }
    };

    const postData = JSON.stringify({
        name: PROJECT_NAME,
        organization_id: organizationId,
        db_pass: DATABASE_PASSWORD,
        region: REGION
    });

    try {
        const response = await makeRequest(options, postData);
        
        if (response.statusCode === 201) {
            console.log('✅ Projet Supabase créé avec succès !');
            console.log('📊 Détails du projet :');
            console.log(`   - Nom : ${response.data.name}`);
            console.log(`   - ID : ${response.data.id}`);
            console.log(`   - Région : ${response.data.region}`);
            console.log(`   - URL : ${response.data.api_url}`);
            
            // Sauvegarder les informations
            const projectInfo = {
                id: response.data.id,
                name: response.data.name,
                api_url: response.data.api_url,
                region: response.data.region,
                created_at: new Date().toISOString()
            };
            
            fs.writeFileSync('supabase-project-info.json', JSON.stringify(projectInfo, null, 2));
            console.log('💾 Informations du projet sauvegardées dans supabase-project-info.json');
            
            return response.data;
        } else {
            console.error('❌ Erreur lors de la création du projet :');
            console.error(`   - Status : ${response.statusCode}`);
            console.error(`   - Réponse : ${JSON.stringify(response.data, null, 2)}`);
            return null;
        }
    } catch (error) {
        console.error('❌ Erreur de connexion :', error.message);
        return null;
    }
}

// Attendre que le projet soit prêt
async function waitForProjectReady(projectId) {
    console.log('⏳ Attente que le projet soit prêt...');
    
    const maxAttempts = 30; // 5 minutes max
    let attempts = 0;
    
    while (attempts < maxAttempts) {
        attempts++;
        
        const options = {
            hostname: 'api.supabase.com',
            port: 443,
            path: `/v1/projects/${projectId}`,
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${SUPABASE_ACCESS_TOKEN}`,
                'User-Agent': 'Gestalis-Deployment/1.0'
            }
        };

        try {
            const response = await makeRequest(options);
            
            if (response.statusCode === 200) {
                const project = response.data;
                
                if (project.status === 'active') {
                    console.log('✅ Projet Supabase prêt !');
                    return project;
                } else if (project.status === 'processing') {
                    console.log(`⏳ Projet en cours de création... (${attempts}/${maxAttempts})`);
                    await new Promise(resolve => setTimeout(resolve, 10000)); // Attendre 10 secondes
                } else {
                    console.log(`⚠️  Statut du projet : ${project.status}`);
                    await new Promise(resolve => setTimeout(resolve, 10000));
                }
            } else {
                console.log(`⚠️  Tentative ${attempts}/${maxAttempts} : ${response.statusCode}`);
                await new Promise(resolve => setTimeout(resolve, 10000));
            }
        } catch (error) {
            console.log(`⚠️  Tentative ${attempts}/${maxAttempts} : Erreur de connexion`);
            await new Promise(resolve => setTimeout(resolve, 10000));
        }
    }
    
    console.error('❌ Le projet n\'est pas prêt après 5 minutes');
    return null;
}

// Récupérer les clés API
async function getProjectKeys(projectId) {
    console.log('🔑 Récupération des clés API...');
    
    const options = {
        hostname: 'api.supabase.com',
        port: 443,
        path: `/v1/projects/${projectId}/api-keys`,
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${SUPABASE_ACCESS_TOKEN}`,
            'User-Agent': 'Gestalis-Deployment/1.0'
        }
    };

    try {
        const response = await makeRequest(options);
        
        if (response.statusCode === 200) {
            const keys = response.data;
            const anonKey = keys.find(key => key.name === 'anon')?.key;
            const serviceKey = keys.find(key => key.name === 'service_role')?.key;
            
            if (anonKey) {
                console.log('✅ Clé anonyme récupérée !');
                console.log(`   - Clé anonyme : ${anonKey.substring(0, 20)}...`);
                
                // Sauvegarder les clés
                const keysInfo = {
                    project_id: projectId,
                    anon_key: anonKey,
                    service_key: serviceKey,
                    retrieved_at: new Date().toISOString()
                };
                
                fs.writeFileSync('supabase-keys.json', JSON.stringify(keysInfo, null, 2));
                console.log('💾 Clés API sauvegardées dans supabase-keys.json');
                
                return { anonKey, serviceKey };
            } else {
                console.error('❌ Clé anonyme non trouvée');
                return null;
            }
        } else {
            console.error('❌ Erreur lors de la récupération des clés :', response.statusCode);
            return null;
        }
    } catch (error) {
        console.error('❌ Erreur de connexion :', error.message);
        return null;
    }
}

// Fonction principale
async function main() {
    console.log('🚀 DÉPLOIEMENT AUTOMATIQUE SUPABASE GESTALIS');
    console.log('=============================================');
    
    try {
        // 1. Récupérer l'organisation par défaut
        const organizationId = await getDefaultOrganization();
        if (!organizationId) {
            console.error('❌ Impossible de récupérer l\'organisation');
            process.exit(1);
        }
        
        // 2. Créer le projet
        const project = await createSupabaseProject(organizationId);
        if (!project) {
            console.error('❌ Impossible de créer le projet');
            process.exit(1);
        }
        
        // 3. Attendre que le projet soit prêt
        const readyProject = await waitForProjectReady(project.id);
        if (!readyProject) {
            console.error('❌ Le projet n\'est pas prêt');
            process.exit(1);
        }
        
        // 4. Récupérer les clés API
        const keys = await getProjectKeys(project.id);
        if (!keys) {
            console.error('❌ Impossible de récupérer les clés API');
            process.exit(1);
        }
        
        console.log('');
        console.log('🎉 PROJET SUPABASE CRÉÉ AVEC SUCCÈS !');
        console.log('=====================================');
        console.log(`🌐 URL du projet : ${readyProject.api_url}`);
        console.log(`🔑 Clé anonyme : ${keys.anonKey.substring(0, 20)}...`);
        console.log('');
        console.log('📋 PROCHAINES ÉTAPES :');
        console.log('1. Exécuter le schéma SQL dans Supabase');
        console.log('2. Configurer les variables d\'environnement');
        console.log('3. Déployer sur Vercel');
        console.log('');
        console.log('💾 Toutes les informations sont sauvegardées dans :');
        console.log('   - supabase-project-info.json');
        console.log('   - supabase-keys.json');
        
    } catch (error) {
        console.error('❌ Erreur critique :', error.message);
        process.exit(1);
    }
}

// Exécuter si appelé directement
if (require.main === module) {
    main();
}

module.exports = { createSupabaseProject, waitForProjectReady, getProjectKeys };
