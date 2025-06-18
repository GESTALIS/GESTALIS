import streamlit as st
import os

st.set_page_config(page_title="GESTALIS", layout="wide")
st.title("🧠 GESTALIS – Gestion TP complète")

st.sidebar.title("📂 Menu général")
menu = st.sidebar.radio("Naviguer vers :", [
    "📊 Tableau de bord",
    "🧾 Factures",
    "🏗️ Chantiers",
    "💳 Lettrage bancaire",
    "🏦 Import règlements",
    "📥 Import banque Excel",
    "📋 Cessions + Avenants",
    "🧑‍💼 Synthèse client",
    "🚨 Alertes"
])

if menu == "📊 Tableau de bord":
    os.system("streamlit run web/dashboard.py")
elif menu == "🧾 Factures":
    os.system("streamlit run web/factures.py")
elif menu == "🏗️ Chantiers":
    os.system("streamlit run web/chantiers.py")
elif menu == "💳 Lettrage bancaire":
    os.system("streamlit run web/lettrage.py")
elif menu == "🏦 Import règlements":
    os.system("streamlit run web/import_reglements.py")
elif menu == "📥 Import banque Excel":
    os.system("streamlit run web/import_banque.py")
elif menu == "📋 Cessions + Avenants":
    os.system("streamlit run web/GESTALIS_Cessions_Avenants_FINAL.py")
elif menu == "🧑‍💼 Synthèse client":
    os.system("streamlit run web/synthese_client.py")
elif menu == "🚨 Alertes":
    os.system("streamlit run web/alertes.py")
