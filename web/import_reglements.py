import streamlit as st
import pandas as pd
import os

st.set_page_config(page_title="📥 Importer Règlements", layout="wide")
st.title("📥 Importer un fichier de règlements (Excel)")

# 📁 Chemins
DATA_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "data"))
REGLEMENTS_XLSX = os.path.join(DATA_DIR, "reglements.xlsx")
REGLEMENTS_CSV = os.path.join(DATA_DIR, "reglements.csv")

# 📤 Téléversement du fichier Excel
uploaded_file = st.file_uploader("Déposer le fichier Excel des règlements :", type=["xlsx"])

if uploaded_file:
    try:
        df = pd.read_excel(uploaded_file)
        st.success("✅ Fichier chargé avec succès.")
        st.dataframe(df)

        if st.button("💾 Enregistrer dans le système GESTALIS"):
            df.to_csv(REGLEMENTS_CSV, index=False, encoding="utf-8-sig")
            st.success(f"✅ Enregistré dans : {REGLEMENTS_CSV}")
    except Exception as e:
        st.error(f"❌ Erreur lors du chargement : {e}")
else:
    if os.path.exists(REGLEMENTS_XLSX):
        df = pd.read_excel(REGLEMENTS_XLSX)
        st.info("📁 Fichier Excel par défaut chargé automatiquement.")
        st.dataframe(df)
        if st.button("💾 Enregistrer dans le système GESTALIS"):
            df.to_csv(REGLEMENTS_CSV, index=False, encoding="utf-8-sig")
            st.success(f"✅ Enregistré dans : {REGLEMENTS_CSV}")
