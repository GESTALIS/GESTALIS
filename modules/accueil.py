import streamlit as st

def run():
    st.markdown('<div class="main-content">', unsafe_allow_html=True)
    st.title("Accueil")
    st.write("Contenu de la page accueil.")
    st.markdown('</div>', unsafe_allow_html=True)