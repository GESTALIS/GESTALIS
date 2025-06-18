# 📌 app.py - Application principale GESTALIS

import streamlit as st
import importlib

# 📋 Configuration générale
st.set_page_config(page_title="GESTALIS – Accueil", layout="wide")
st.markdown("<h1 style='text-align: center; color: #0558A6;'>💼 GESTALIS – Gestion Intégrée</h1>", unsafe_allow_html=True)
st.divider()

# 📚 Modules disponibles
modules = {
    "🏠 Accueil": None,
    "📊 Tableau de bord": "dashboard",
    "🧾 Factures": "factures",
    "💳 Lettrage bancaire": "lettrage",
    "🏦 Import banque": "import_banque",
    "🔁 Cessions + Avenants": "cessions_avenants",
    "🏗️ Chantiers": "chantiers",
    "🧑‍💼 Synthèse client": "synthese_client",
    "🚨 Alertes à suivre": "alertes",
    "📤 Export / Archivage": "export",
}

# 📍 Choix du module
choix = st.sidebar.radio("📁 Menu principal", list(modules.keys()))

# 🔄 Chargement dynamique du module choisi
if modules[choix]:
    module = importlib.import_module(f"web.{modules[choix]}")
    if hasattr(module, "main"):
        module.main()
    else:
        st.error("⚠️ Le module ne contient pas de fonction `main()`.")
else:
    st.markdown("### 🎯 Bienvenue dans GESTALIS")
    st.markdown("Utilisez le menu à gauche pour naviguer entre les fonctionnalités.")
