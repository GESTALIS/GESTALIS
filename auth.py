import streamlit as st
import json

def load_users():
    with open("users.json") as f:
        return json.load(f)

def login_interface():
    st.markdown("""
        <style>
        .login-box {
            margin-top: 100px;
            padding: 40px;
            text-align: center;
        }
        </style>
        <div class='login-box'>
        <h2>🔐 Connexion à GESTALIS</h2>
    """, unsafe_allow_html=True)

    username = st.text_input("Nom d'utilisateur")
    password = st.text_input("Mot de passe", type="password")

    if st.button("Se connecter"):
        users = load_users()
        if username in users and users[username] == password:
            st.session_state.authenticated = True
            st.session_state.user = username
            st.query_params.clear()  # 🔁 Nettoie le paramètre logout
            st.rerun()
        else:
            st.error("Identifiants incorrects")

    st.markdown("</div>", unsafe_allow_html=True)

def check_auth():
    if "logout" in st.query_params:
        st.session_state.authenticated = False
        st.session_state.user = None
        st.query_params.clear()
        st.rerun()

    if "authenticated" not in st.session_state or not st.session_state.authenticated:
        login_interface()
        return False

    return True
