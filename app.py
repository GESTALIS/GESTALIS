import streamlit as st
import importlib
from auth import check_auth

# 🔐 Gestion de la déconnexion
if "logout" in st.experimental_get_query_params():
    st.session_state.pop("authenticated", None)
    st.experimental_set_query_params()  # Nettoie l'URL

# 🔐 Vérification de l'authentification
if not check_auth():
    st.stop()

# 🧠 Récupération du paramètre de page dans l’URL
query_params = st.experimental_get_query_params()
page = query_params.get("page", ["accueil"])[0]

# ✅ Liste des pages disponibles
pages = [
    "accueil", "dashboard", "factures", "lettrage", "import_banque",
    "cessions", "chantiers", "synthese_client", "alertes", "export"
]

# 🟧 Marquage dynamique du menu actif
classes = {p: "active" if p == page else "" for p in pages}

# 🎨 Injection CSS
st.markdown(f"<style>{open('style.css').read()}</style>", unsafe_allow_html=True)

# 📋 Menu latéral HTML stylisé
st.markdown(
    f"""
    <div class="sidebar">
        <a class="{classes['accueil']}" href="?page=accueil">🏠 Accueil</a>
        <a class="{classes['dashboard']}" href="?page=dashboard">📊 Tableau de bord</a>
        <a class="{classes['factures']}" href="?page=factures">🧾 Factures</a>
        <a class="{classes['lettrage']}" href="?page=lettrage">💳 Lettrage bancaire</a>
        <a class="{classes['import_banque']}" href="?page=import_banque">🏦 Import banque</a>
        <a class="{classes['cessions']}" href="?page=cessions">🔁 Cessions + Avenants</a>
        <a class="{classes['chantiers']}" href="?page=chantiers">🏗️ Chantiers</a>
        <a class="{classes['synthese_client']}" href="?page=synthese_client">🧑‍💼 Synthèse client</a>
        <a class="{classes['alertes']}" href="?page=alertes">🚨 Alertes à suivre</a>
        <a class="{classes['export']}" href="?page=export">📤 Export / Archivage</a>

        <a class="logout" href="?logout=true">🔓 Se déconnecter</a>
    </div>
    """,
    unsafe_allow_html=True
)

# 📦 Chargement dynamique de la page sélectionnée
try:
    module = importlib.import_module(f"pages.{page}")
    module.run()
except Exception as e:
    st.error(f"Erreur lors du chargement de la page : {page}")
    st.exception(e)
