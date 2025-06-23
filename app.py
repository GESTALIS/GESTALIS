import streamlit as st

# Configuration de la page Streamlit
st.set_page_config(
    page_title="GESTALIS",
    layout="wide"
)

# Injection du fichier CSS
with open("style.css") as f:
    st.markdown(f"<style>{f.read()}</style>", unsafe_allow_html=True)

# Structure de la page HTML
st.markdown(
    """
    <div class="sidebar">
        <a class="active" href="#">🏠 Accueil</a>
        <a href="#">📊 Tableau de bord</a>
        <a href="#">🧾 Factures</a>
        <a href="#">💳 Lettrage bancaire</a>
        <a href="#">🏦 Import banque</a>
        <a href="#">🔁 Cessions + Avenants</a>
        <a href="#">🏗️ Chantiers</a>
        <a href="#">🧑‍💼 Synthèse client</a>
        <a href="#">🚨 Alertes à suivre</a>
        <a href="#">📤 Export / Archivage</a>
    </div>
    <div class="main">
        <h1>Bienvenue sur GESTALIS</h1>
        <p>Sélectionnez une section dans le menu à gauche.</p>
    </div>
    """,
    unsafe_allow_html=True
)
