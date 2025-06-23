
import streamlit as st
import importlib

st.set_page_config(layout="wide")

# Menu latéral
st.markdown(
    """
    <link rel="stylesheet" href="style.css">
    <div class="sidebar">
        <a class="{accueil}" href="?page=accueil">🏠 Accueil</a>
        <a class="{dashboard}" href="?page=dashboard">📊 Tableau de bord</a>
        <a class="{factures}" href="?page=factures">🧾 Factures</a>
        <a class="{lettrage}" href="?page=lettrage">💳 Lettrage bancaire</a>
        <a class="{import_banque}" href="?page=import_banque">🏦 Import banque</a>
        <a class="{cessions}" href="?page=cessions">🔁 Cessions + Avenants</a>
        <a class="{chantiers}" href="?page=chantiers">🏗️ Chantiers</a>
        <a class="{synthese_client}" href="?page=synthese_client">🧑‍💼 Synthèse client</a>
        <a class="{alertes}" href="?page=alertes">🚨 Alertes à suivre</a>
        <a class="{export}" href="?page=export">📤 Export / Archivage</a>
    </div>
    """,
    unsafe_allow_html=True
)

# Récupération du paramètre de page
query_params = st.experimental_get_query_params()
page = query_params.get("page", ["accueil"])[0]

# Marquer la page active
for key in ["accueil", "dashboard", "factures", "lettrage", "import_banque", "cessions", "chantiers", "synthese_client", "alertes", "export"]:
    st.session_state[key] = "active" if page == key else ""

# Injection CSS
st.markdown(f"<style>{open('style.css').read()}</style>", unsafe_allow_html=True)

# Import dynamique de la page
try:
    module = importlib.import_module(f"pages.{page}")
    module.run()
except Exception as e:
    st.error(f"Erreur lors du chargement de la page : {page}")
    st.exception(e)
