import streamlit as st
import json
import os

def load_users(path="users.json"):
    if not os.path.exists(path):
        return {}
    with open(path, "r") as f:
        return json.load(f)

def login_interface():
    st.markdown(
        "<h2 style='text-align: center; color: #0558A6;'>🔐 Connexion à GESTALIS</h2>",
        unsafe_allow_html=True
    )
    st.markdown("<hr>", unsafe_allow_html=True)
    st.markdown("Veuillez entrer vos identifiants pour accéder à la plateforme.")

    username = st.text_input("👤 Identifiant")
    password = st.text_input("🔑 Mot de passe", type="password")
    login_button = st.button("Se connecter ✅")

    if login_button:
        users = load_users()
        if username in users and users[username] == password:
            st.session_state["authenticated"] = True
            st.session_state["username"] = username
            st.success(f"Bienvenue {username} 👋")
            st.rerun()
        else:
            st.error("❌ Identifiants incorrects.")

def check_auth():
    if "authenticated" not in st.session_state or not st.session_state["authenticated"]:
        st.sidebar.title("🔒 Connexion requise")
        login_interface()
        st.stop()
    else:
        with st.sidebar:
            st.success(f"✅ Connecté : {st.session_state['username']}")
            if st.button("🔓 Se déconnecter"):
                for key in ["authenticated", "username"]:
                    st.session_state.pop(key, None)
                st.rerun()
