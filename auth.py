import streamlit as st
import json
import os

def load_users(path="users.json"):
    if not os.path.exists(path):
        return {}
    with open(path, "r") as f:
        return json.load(f)

def login_interface():
    st.sidebar.title("🔐 Connexion")
    username = st.sidebar.text_input("Identifiant")
    password = st.sidebar.text_input("Mot de passe", type="password")
    login_button = st.sidebar.button("Se connecter")

    if login_button:
        users = load_users()
        if username in users and users[username] == password:
            st.session_state["authenticated"] = True
            st.session_state["username"] = username
            st.success(f"Bienvenue {username} 👋")
            st.rerun()
        else:
            st.error("Identifiants incorrects.")

def check_auth():
    if "authenticated" not in st.session_state or not st.session_state["authenticated"]:
        login_interface()
        st.stop()
