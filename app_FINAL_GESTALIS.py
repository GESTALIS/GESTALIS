import streamlit as st
import importlib
from auth import check_auth

st.write("🔍 DEBUG SESSION:", st.session_state)

# ✅ Configuration initiale
st.set_page_config(layout="wide", initial_sidebar_state="collapsed")

# 🔐 Authentification sécurisée
if "authenticated" not in st.session_state:
    st.session_state.authenticated = False

if not st.session_state.authenticated:
    if not check_auth():
        st.stop()

# 🔁 Gestion du logout
if st.query_params.get("logout") == "true":
    st.session_state.clear()
    st.query_params.clear()
    st.rerun()

# 🔄 Navigation persistante via session
if "page" not in st.session_state:
    st.session_state.page = "accueil"

query_page = st.query_params.get("page")
if query_page and query_page != st.session_state.page:
    st.session_state.page = query_page

# Mise à jour de l'URL (sans perte de session)
st.query_params["page"] = st.session_state.page
page = st.session_state.page

# 📋 Liste des modules/pages
modules = [
    "accueil", "dashboard", "factures", "lettrage", "import_banque",
    "cessions", "chantiers", "synthese_client", "alertes", "export"
]
classes = {m: "active" if m == page else "" for m in modules}

# 🎨 CSS externe
with open("style.css") as f:
    st.markdown(f"<style>{f.read()}</style>", unsafe_allow_html=True)

# 📂 Menu latéral personnalisé
if st.session_state.authenticated:
    menu_html = f"""
    <div class="sidebar">
        <a class="{classes['accueil']}" href="/?page=accueil">🏠 Accueil</a>
        <a class="{classes['dashboard']}" href="/?page=dashboard">📊 Tableau de bord</a>
        <a class="{classes['factures']}" href="/?page=factures">🧾 Factures</a>
        <a class="{classes['lettrage']}" href="/?page=lettrage">💳 Lettrage bancaire</a>
        <a class="{classes['import_banque']}" href="/?page=import_banque">🏦 Import banque</a>
        <a class="{classes['cessions']}" href="/?page=cessions">🔁 Cessions + Avenants</a>
        <a class="{classes['chantiers']}" href="/?page=chantiers">🏗️ Chantiers</a>
        <a class="{classes['synthese_client']}" href="/?page=synthese_client">🧑‍💼 Synthèse client</a>
        <a class="{classes['alertes']}" href="/?page=alertes">🚨 Alertes à suivre</a>
        <a class="{classes['export']}" href="/?page=export">📤 Export / Archivage</a>
        <a class="logout" href="/?logout=true">🔓 Se déconnecter</a>
    </div>
    """
    st.markdown(menu_html, unsafe_allow_html=True)

# ▶️ Chargement du module sélectionné
try:
    module = importlib.import_module(f"modules.{page}")
    module.run()
except Exception as e:
    st.error(f"Erreur lors du chargement du module : {page}")
    st.exception(e)
