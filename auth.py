
import streamlit as st
import json

def load_users():
    with open("users.json") as f:
        return json.load(f)

def login_interface():
    st.markdown("""
        <style>
        .login-box {text-align: center; padding: 50px;}
        </style>
    """, unsafe_allow_html=True)

    st.markdown("<div class='login-box'><h2>🔐 Connexion à GESTALIS</h2>", unsafe_allow_html=True)
    username = st.text_input("Nom d'utilisateur")
    password = st.text_input("Mot de passe", type="password")
    if st.button("Se connecter"):
        users = load_users()
        if username in users and users[username] == password:
            st.session_state.authenticated = True
            st.session_state["page"] = "accueil"
            st.rerun()
        else:
            st.error("Identifiants incorrects")
    st.markdown("</div>", unsafe_allow_html=True)

def check_auth():
    if "authenticated" not in st.session_state:
        st.session_state.authenticated = False

    if "logout" in st.query_params:
        st.session_state.authenticated = False
        st.query_params.clear()
        st.rerun()

    if not st.session_state.authenticated:
        login_interface()
        return False
    return True
