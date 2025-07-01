import streamlit as st
import importlib
from auth import check_auth

# ✅ Configuration initiale
st.set_page_config(layout="wide", initial_sidebar_state="collapsed")

# 🔐 Authentification
if not check_auth():
    st.stop()

# Vérifie si logout est demandé
if st.query_params.get("logout") == "true":
    st.session_state.clear()
    st.query_params.clear()
    st.rerun()

# 🔄 Navigation par paramètres d'URL
if "page" not in st.session_state:
    st.session_state.page = "accueil"

query_page = st.query_params.get("page")
if query_page:
    st.session_state.page = query_page

page = st.session_state.page
st.query_params["page"] = page


# 📋 Liste des modules/pages
modules = [
    "accueil", "dashboard", "factures", "lettrage", "import_banque",
    "cessions", "chantiers", "synthese_client", "alertes", "export"
]
classes = {m: "active" if m == page else "" for m in modules}

# 🎨 CSS
st.markdown(f"<style>{open('style.css').read()}</style>", unsafe_allow_html=True)

# 📂 Menu personnalisé
if st.session_state.get("authenticated"):
    st.markdown(
        f"""
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
        """,
        unsafe_allow_html=True
    )

# ▶️ Exécution dynamique du module
try:
    module = importlib.import_module(f"modules.{page}")
    module.run()
except Exception as e:
    st.error(f"Erreur lors du chargement du module : {page}")
    st.exception(e)