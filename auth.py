import streamlit as st
import json

# 🔓 Chargement des utilisateurs
def load_users():
    with open("users.json", "r") as f:
        return json.load(f)

# ✅ Fonction principale de contrôle d'accès
def check_auth():
    if "authenticated" not in st.session_state:
        st.session_state.authenticated = False

    # 🔁 Déconnexion via l’URL
    if "logout" in st.query_params:
        st.session_state.authenticated = False
        st.rerun()

    # ✅ Si déjà connecté
    if st.session_state.authenticated:
        return True

    # 🔐 Formulaire de connexion
    st.title("🔐 Connexion à GESTALIS")
    st.info("Veuillez entrer vos identifiants pour accéder à la plateforme.")

    username = st.text_input("Nom d'utilisateur")
    password = st.text_input("Mot de passe", type="password")

    if st.button("Se connecter"):
        users = load_users()
        if username in users and users[username] == password:
            st.session_state.authenticated = True
            st.rerun()
        else:
            st.error("Identifiants incorrects.")

    return False
