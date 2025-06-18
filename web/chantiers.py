import streamlit as st
import pandas as pd
import os
from datetime import datetime

st.set_page_config(page_title="GESTALIS – 🏗️ Chantiers", layout="wide")
st.title("🏗️ Chantiers – Suivi des projets")

CHANTIERS_PATH = os.path.join("data", "chantiers.csv")

# Chargement ou création
if os.path.exists(CHANTIERS_PATH):
    df = pd.read_csv(CHANTIERS_PATH, dtype=str)
else:
    df = pd.DataFrame(columns=["code_chantier", "nom_chantier", "client", "date_debut", "date_fin", "statut", "commentaire"])

df["date_debut"] = pd.to_datetime(df["date_debut"], errors="coerce")
df["date_fin"] = pd.to_datetime(df["date_fin"], errors="coerce")

# 🔍 Filtres
st.sidebar.header("🔎 Filtres")
client_filter = st.sidebar.text_input("Client")
statut_filter = st.sidebar.selectbox("Statut", ["Tous"] + sorted(df["statut"].dropna().unique().tolist()))
periode_filter = st.sidebar.selectbox("Période (année)", ["Toutes"] + sorted(df["date_debut"].dt.year.dropna().astype(str).unique().tolist(), reverse=True))

filtered = df.copy()
if client_filter:
    filtered = filtered[filtered["client"].str.contains(client_filter, case=False)]
if statut_filter != "Tous":
    filtered = filtered[filtered["statut"] == statut_filter]
if periode_filter != "Toutes":
    filtered = filtered[df["date_debut"].dt.year.astype(str) == periode_filter]

# 📋 Affichage
st.markdown("### 📋 Liste des chantiers")
st.dataframe(filtered.sort_values(by="date_debut", ascending=False), use_container_width=True)

# ➕ Formulaire
st.markdown("### ➕ Ajouter / Modifier un chantier")
with st.form("form_chantier"):
    code = st.text_input("Code du chantier")
    nom = st.text_input("Nom du chantier")
    client = st.text_input("Client")
    date_debut = st.date_input("Date de début", value=datetime.today())
    date_fin = st.date_input("Date de fin", value=datetime.today())
    statut = st.selectbox("Statut", ["En cours", "Terminé", "En pause"])
    commentaire = st.text_area("Commentaire")
    submit = st.form_submit_button("💾 Enregistrer")

if submit:
    new_row = {
        "code_chantier": code, "nom_chantier": nom, "client": client,
        "date_debut": date_debut.strftime("%Y-%m-%d"),
        "date_fin": date_fin.strftime("%Y-%m-%d"),
        "statut": statut, "commentaire": commentaire
    }
    df = df[df["code_chantier"] != code]  # Suppression si existait déjà
    df = pd.concat([df, pd.DataFrame([new_row])], ignore_index=True)
    df.to_csv(CHANTIERS_PATH, index=False)
    st.success("✅ Chantier enregistré.")
    st.rerun()

# 📤 Export
st.markdown("### 📤 Export des chantiers")
st.download_button("⬇️ Export CSV", data=filtered.to_csv(index=False), file_name="chantiers_export.csv")