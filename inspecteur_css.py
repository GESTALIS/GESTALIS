import streamlit as st

st.set_page_config(page_title="Inspecteur CSS", layout="wide")

st.title("🧪 Inspecteur CSS – Visualisation des classes internes Streamlit")

st.markdown("Ce module affiche des éléments HTML avec des balises identifiables pour t'aider à inspecter le rendu.")

# Création de blocs avec ID spécifiques pour inspecter leur classe
st.markdown('<div id="bloc-test-1" style="background-color: #ffffff; padding: 20px; border-radius: 8px; margin: 20px 0;">Bloc test 1 – Carte blanche</div>', unsafe_allow_html=True)
st.markdown('<div id="bloc-test-2" style="background-color: #f8d7da; padding: 20px; border-radius: 8px; margin: 20px 0;">Bloc test 2 – Carte rose</div>', unsafe_allow_html=True)
st.markdown('<div id="bloc-test-3" style="background-color: #d1ecf1; padding: 20px; border-radius: 8px; margin: 20px 0;">Bloc test 3 – Carte bleue claire</div>', unsafe_allow_html=True)

st.markdown("👉 Clique droit sur un bloc > Inspecter l’élément pour voir sa classe.")
