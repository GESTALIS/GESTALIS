import streamlit as st
from auth import check_auth

if not check_auth():
    st.stop()

def run():
    st.title("Factures")
    st.write("Contenu de la page factures.")
