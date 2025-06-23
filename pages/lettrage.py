import streamlit as st
from auth import check_auth

if not check_auth():
    st.stop()

def run():
    st.title("Lettrage bancaire")
    st.write("Contenu de la page lettrage bancaire.")
