import streamlit as st
import json
import os
import importlib

# ⚙️ DOIT être la toute première commande
st.set_page_config(page_title="GESTALIS", layout="wide", initial_sidebar_state="expanded")

# 🎨 Chargement du CSS
css_path = os.path.join(os.path.dirname(__file__), "style.css")
if os.path.exists(css_path):
    with open(css_path, "r", encoding="utf-8") as f:
        st.markdown(f"<style>{f.read()}</style>", unsafe_allow_html=True)
else:
    st.error("❌ Fichier style.css introuvable")

# 🔐 Authentification
if "authenticated" not in st.session_state:
    st.session_state.authenticated = False

if not st.session_state.authenticated:
    st.title("🔐 Connexion à GESTALIS")
    try:
        with open("users.json", "r", encoding="utf-8") as f:
            users = json.load(f)
            st.write("Fichier users.json chargé avec succès.")
    except FileNotFoundError:
        st.error("❌ Fichier users.json introuvable. Créez-le avec un utilisateur.")
        st.stop()
    except json.JSONDecodeError:
        st.error("❌ Erreur dans le format de users.json. Vérifiez le fichier.")
        st.stop()
    except Exception as e:
        st.error(f"❌ Erreur inattendue : {e}")
        st.stop()

    with st.form("login_form"):
        identifiant = st.text_input("Identifiant")
        mot_de_passe = st.text_input("Mot de passe", type="password")
        submit = st.form_submit_button("Se connecter")

    if submit:
        if identifiant in users and users[identifiant] == mot_de_passe:
            st.session_state.authenticated = True
            st.rerun()
        else:
            st.error("❌ Identifiant ou mot de passe incorrect")
    st.stop()

# 📂 Menu latéral avec boutons
st.sidebar.title("📂 Menu général")
if "selected_menu" not in st.session_state:
    st.session_state.selected_menu = "📊 Tableau de bord"

modules = {
    "📊 Tableau de bord": "tableau_de_bord",
    "🧾 Factures": "factures",
    "🏗️ Chantiers": "chantiers",
    "💳 Lettrage bancaire": "lettrage",
    "📥 Import factures": "import_factures",
    "🏦 Import règlements": "import_reglements",
    "📊 Import banque Excel": "import_banque",
    "📋 Cessions + Avenants": "cessions_avenants",
    "🧑‍💼 Synthèse client": "synthese_client"
}

for label, module_name in modules.items():
    if st.sidebar.button(label, key=f"btn_{module_name}"):
        st.session_state.selected_menu = label
        st.rerun()

# ▶️ Contenu principal sans bloc blanc
module_name = modules.get(st.session_state.selected_menu, "tableau_de_bord")
try:
    module = importlib.import_module(f"modules.{module_name}")
    module.run()
except ImportError as e:
    st.error(f"❌ Module {module_name} non trouvé : {e}")
except AttributeError:
    st.error(f"❌ Module {module_name} manque la fonction 'run()'")

# 🔓 Bouton de déconnexion fonctionnel
if st.sidebar.button("🔓 Se déconnexion", key="btn_deconnexion"):
    st.session_state.clear()
    st.rerun()