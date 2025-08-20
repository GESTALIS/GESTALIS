#!/usr/bin/env node
/**
 * Script de validation automatique du frontend GESTALIS
 * Vérifie tous les composants critiques du frontend
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class FrontendValidator {
    constructor() {
        this.baseDir = path.resolve(__dirname);
        this.results = {
            timestamp: new Date().toISOString(),
            status: 'pending',
            checks: {},
            errors: [],
            warnings: []
        };
    }

    runAllChecks() {
        console.log('🔍 VALIDATION COMPLÈTE DU FRONTEND GESTALIS');
        console.log('=' .repeat(60));

        try {
            this.checkFileStructure();
            this.checkPackageJson();
            this.checkConfigurationFiles();
            this.checkComponents();
            this.checkTests();
            this.checkQualityTools();
            this.checkBuildProcess();

            this.generateReport();
        } catch (error) {
            this.addError(`Erreur critique lors de la validation: ${error.message}`);
            this.generateReport();
        }
    }

    checkFileStructure() {
        console.log('\n�� VÉRIFICATION DE LA STRUCTURE DES FICHIERS');

        const requiredFiles = [
            'package.json',
            'vite.config.js',
            'tailwind.config.js',
            'src/App.jsx',
            'src/components/ui/',
            'src/pages/',
            'src/stores/',
            'src/utils/',
            'src/styles/',
            'src/test/setup.js',
            '.eslintrc.js',
            '.prettierrc',
            '.pre-commit-config.yaml'
        ];

        requiredFiles.forEach(filePath => {
            const fullPath = path.join(this.baseDir, filePath);
            if (fs.existsSync(fullPath)) {
                console.log(`  ✅ ${filePath}`);
                this.addCheck(`file_${filePath.replace(/[\/\.]/g, '_')}`, true, `Fichier ${filePath} présent`);
            } else {
                console.log(`  ❌ ${filePath} - MANQUANT`);
                this.addCheck(`file_${filePath.replace(/[\/\.]/g, '_')}`, false, `Fichier ${filePath} manquant`);
            }
        });
    }

    checkPackageJson() {
        console.log('\n📦 VÉRIFICATION DU PACKAGE.JSON');

        try {
            const packagePath = path.join(this.baseDir, 'package.json');
            const packageData = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

            // Vérifier les scripts
            const requiredScripts = ['dev', 'build', 'test', 'test:ci', 'lint', 'format'];
            requiredScripts.forEach(script => {
                if (packageData.scripts && packageData.scripts[script]) {
                    console.log(`  ✅ Script ${script} présent`);
                    this.addCheck(`script_${script}`, true, `Script ${script} présent`);
                } else {
                    console.log(`  ❌ Script ${script} - MANQUANT`);
                    this.addCheck(`script_${script}`, false, `Script ${script} manquant`);
                }
            });

            // Vérifier les dépendances
            const requiredDeps = ['react', 'vite', 'tailwindcss', 'zustand'];
            requiredDeps.forEach(dep => {
                if (packageData.dependencies && packageData.dependencies[dep]) {
                    console.log(`  ✅ Dépendance ${dep} présente`);
                    this.addCheck(`dep_${dep}`, true, `Dépendance ${dep} présente`);
                } else {
                    console.log(`  ❌ Dépendance ${dep} - MANQUANTE`);
                    this.addCheck(`dep_${dep}`, false, `Dépendance ${dep} manquante`);
                }
            });

            // Vérifier les dépendances de développement
            const requiredDevDeps = ['vitest', '@testing-library/react', 'eslint', 'prettier'];
            requiredDevDeps.forEach(dep => {
                if (packageData.devDependencies && packageData.devDependencies[dep]) {
                    console.log(`  ✅ Dev dépendance ${dep} présente`);
                    this.addCheck(`devdep_${dep}`, true, `Dev dépendance ${dep} présente`);
                } else {
                    console.log(`  ❌ Dev dépendance ${dep} - MANQUANTE`);
                    this.addCheck(`devdep_${dep}`, false, `Dev dépendance ${dep} manquante`);
                }
            });

        } catch (error) {
            this.addError(`Erreur lors de la vérification du package.json: ${error.message}`);
        }
    }

    checkConfigurationFiles() {
        console.log('\n⚙️ VÉRIFICATION DES FICHIERS DE CONFIGURATION');

        // Vérifier Vite
        const vitePath = path.join(this.baseDir, 'vite.config.js');
        if (fs.existsSync(vitePath)) {
            console.log('  ✅ Configuration Vite présente');
            this.addCheck('vite_config', true, 'Configuration Vite présente');
        } else {
            console.log('  ❌ Configuration Vite manquante');
            this.addCheck('vite_config', false, 'Configuration Vite manquante');
        }

        // Vérifier Tailwind
        const tailwindPath = path.join(this.baseDir, 'tailwind.config.js');
        if (fs.existsSync(tailwindPath)) {
            console.log('  ✅ Configuration Tailwind présente');
            this.addCheck('tailwind_config', true, 'Configuration Tailwind présente');
        } else {
            console.log('  ❌ Configuration Tailwind manquante');
            this.addCheck('tailwind_config', false, 'Configuration Tailwind manquante');
        }

        // Vérifier ESLint
        const eslintPath = path.join(this.baseDir, '.eslintrc.js');
        if (fs.existsSync(eslintPath)) {
            console.log('  ✅ Configuration ESLint présente');
            this.addCheck('eslint_config', true, 'Configuration ESLint présente');
        } else {
            console.log('  ❌ Configuration ESLint manquante');
            this.addCheck('eslint_config', false, 'Configuration ESLint manquante');
        }

        // Vérifier Prettier
        const prettierPath = path.join(this.baseDir, '.prettierrc');
        if (fs.existsSync(prettierPath)) {
            console.log('  ✅ Configuration Prettier présente');
            this.addCheck('prettier_config', true, 'Configuration Prettier présente');
        } else {
            console.log('  ❌ Configuration Prettier manquante');
            this.addCheck('prettier_config', false, 'Configuration Prettier manquante');
        }
    }

    checkComponents() {
        console.log('\n🧩 VÉRIFICATION DES COMPOSANTS');

        const requiredComponents = [
            'src/components/ui/gestalis-button.jsx',
            'src/components/ui/gestalis-card.jsx',
            'src/components/ui/input.jsx',
            'src/components/ui/label.jsx',
            'src/components/ui/textarea.jsx',
            'src/components/layout/Sidebar.jsx',
            'src/pages/Login.jsx',
            'src/pages/Dashboard.jsx'
        ];

        requiredComponents.forEach(componentPath => {
            const fullPath = path.join(this.baseDir, componentPath);
            if (fs.existsSync(fullPath)) {
                console.log(`  ✅ ${componentPath}`);
                this.addCheck(`component_${componentPath.replace(/[\/\.]/g, '_')}`, true, `Composant ${componentPath} présent`);
            } else {
                console.log(`  ❌ ${componentPath} - MANQUANT`);
                this.addCheck(`component_${componentPath.replace(/[\/\.]/g, '_')}`, false, `Composant ${componentPath} manquant`);
            }
        });
    }

    checkTests() {
        console.log('\n🧪 VÉRIFICATION DES TESTS');

        // Vérifier la configuration Vitest
        const vitestPath = path.join(this.baseDir, 'vitest.config.js');
        if (fs.existsSync(vitestPath)) {
            console.log('  ✅ Configuration Vitest présente');
            this.addCheck('vitest_config', true, 'Configuration Vitest présente');
        } else {
            console.log('  ❌ Configuration Vitest manquante');
            this.addCheck('vitest_config', false, 'Configuration Vitest manquante');
        }

        // Vérifier le setup des tests
        const testSetupPath = path.join(this.baseDir, 'src/test/setup.js');
        if (fs.existsSync(testSetupPath)) {
            console.log('  ✅ Setup des tests présent');
            this.addCheck('test_setup', true, 'Setup des tests présent');
        } else {
            console.log('  ❌ Setup des tests manquant');
            this.addCheck('test_setup', false, 'Setup des tests manquant');
        }
    }

    checkQualityTools() {
        console.log('\n✨ VÉRIFICATION DES OUTILS DE QUALITÉ');

        // Vérifier pre-commit
        const precommitPath = path.join(this.baseDir, '.pre-commit-config.yaml');
        if (fs.existsSync(precommitPath)) {
            console.log('  ✅ Configuration pre-commit présente');
            this.addCheck('precommit_config', true, 'Configuration pre-commit présente');
        } else {
            console.log('  ❌ Configuration pre-commit manquante');
            this.addCheck('precommit_config', false, 'Configuration pre-commit manquante');
        }
    }

    checkBuildProcess() {
        console.log('\n🏗️ VÉRIFICATION DU PROCESSUS DE BUILD');

        try {
            // Vérifier que npm install peut être exécuté
            console.log('  🔄 Test de npm install...');
            execSync('npm install --dry-run', { cwd: this.baseDir, stdio: 'pipe' });
            console.log('  ✅ npm install possible');
            this.addCheck('npm_install', true, 'npm install possible');
        } catch (error) {
            console.log('  ❌ npm install échoué');
            this.addCheck('npm_install', false, 'npm install échoué');
        }

        try {
            // Vérifier que le build peut être lancé
            console.log('  🔄 Test de npm run build...');
            execSync('npm run build', { cwd: this.baseDir, stdio: 'pipe' });
            console.log('  ✅ Build réussi');
            this.addCheck('build_success', true, 'Build réussi');
        } catch (error) {
            console.log('  ❌ Build échoué');
            this.addCheck('build_success', false, 'Build échoué');
        }
    }

    addCheck(name, success, description) {
        this.results.checks[name] = {
            success,
            description,
            timestamp: new Date().toISOString()
        };
    }

    addError(message) {
        this.results.errors.push({
            message,
            timestamp: new Date().toISOString()
        });
    }

    addWarning(message) {
        this.results.warnings.push({
            message,
            timestamp: new Date().toISOString()
        });
    }

    generateReport() {
        console.log('\n' + '=' .repeat(60));
        console.log('📊 RAPPORT DE VALIDATION FRONTEND GESTALIS');
        console.log('=' .repeat(60));

        // Calculer les statistiques
        const totalChecks = Object.keys(this.results.checks).length;
        const successfulChecks = Object.values(this.results.checks).filter(check => check.success).length;
        const failedChecks = totalChecks - successfulChecks;

        // Déterminer le statut global
        if (failedChecks === 0 && this.results.errors.length === 0) {
            this.results.status = 'success';
            console.log('\n✅ STATUT GLOBAL: SUCCÈS');
        } else if (failedChecks <= 2) {
            this.results.status = 'warning';
            console.log('\n⚠️ STATUT GLOBAL: AVERTISSEMENT');
        } else {
            this.results.status = 'error';
            console.log('\n❌ STATUT GLOBAL: ERREUR');
        }

        console.log(`📈 RÉSULTATS: ${successfulChecks}/${totalChecks} vérifications réussies`);

        if (failedChecks > 0) {
            console.log(`\n❌ VÉRIFICATIONS ÉCHOUÉES (${failedChecks}):`);
            Object.entries(this.results.checks).forEach(([name, check]) => {
                if (!check.success) {
                    console.log(`  • ${name}: ${check.description}`);
                }
            });
        }

        if (this.results.errors.length > 0) {
            console.log(`\n🚨 ERREURS CRITIQUES (${this.results.errors.length}):`);
            this.results.errors.forEach(error => {
                console.log(`  • ${error.message}`);
            });
        }

        if (this.results.warnings.length > 0) {
            console.log(`\n⚠️ AVERTISSEMENTS (${this.results.warnings.length}):`);
            this.results.warnings.forEach(warning => {
                console.log(`  • ${warning.message}`);
            });
        }

        // Sauvegarder le rapport
        const reportPath = path.join(this.baseDir, 'frontend_validation_report.json');
        fs.writeFileSync(reportPath, JSON.stringify(this.results, null, 2), 'utf8');
        console.log(`\n�� Rapport sauvegardé: ${reportPath}`);

        // Recommandations
        if (this.results.status === 'success') {
            console.log('\n�� FÉLICITATIONS ! Le frontend GESTALIS est 100% validé.');
            console.log('   Vous pouvez commencer le développement des composants métier.');
        } else if (this.results.status === 'warning') {
            console.log('\n⚠️ Le frontend GESTALIS est presque prêt.');
            console.log('   Corrigez les quelques problèmes identifiés avant de continuer.');
        } else {
            console.log('\n❌ Le frontend GESTALIS nécessite des corrections importantes.');
            console.log('   Résolvez tous les problèmes avant de continuer.');
        }
    }
}

// Exécuter la validation
const validator = new FrontendValidator();
validator.runAllChecks();
