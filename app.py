import streamlit as st
import importlib
from auth import check_auth

# Configuration de la page
st.set_page_config(layout="wide", initial_sidebar_state="collapsed")

# 🔐 Vérification de l'authentification
if not check_auth():
    st.stop()

# 🎨 Injection du CSS customisé
st.markdown(f"<style>{open('style.css').read()}</style>", unsafe_allow_html=True)

# ✅ Liste des pages disponibles
pages = {
    "🏠 Accueil": "accueil",
    "📊 Tableau de bord": "dashboard",
    "🧾 Factures": "factures",
    "💳 Lettrage bancaire": "lettrage",
    "🏦 Import banque": "import_banque",
    "🔁 Cessions + Avenants": "cessions",
    "🏗️ Chantiers": "chantiers",
    "🧑‍💼 Synthèse client": "synthese_client",
    "🚨 Alertes à suivre": "alertes",
    "📤 Export / Archivage": "export"
}

# 📋 Affichage du menu latéral avec radio boutons
st.sidebar.markdown("<h3 style='color:#003366;'>Navigation</h3>", unsafe_allow_html=True)
selection = st.sidebar.radio("Aller à :", list(pages.keys()), label_visibility="collapsed")

# 🔓 Bouton de déconnexion
if st.sidebar.button("🔓 Se déconnecter", key="logout_btn"):
    st.session_state.authenticated = False
    st.rerun()

# 📦 Import dynamique de la page sélectionnée
page_key = pages[selection]
try:
    module = importlib.import_module(f"pages.{page_key}")
    module.run()
except Exception as e:
    st.error(f"Erreur lors du chargement de la page : {page_key}")
    st.exception(e)
