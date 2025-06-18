import streamlit as st
import pandas as pd
import os
from difflib import get_close_matches
from unidecode import unidecode

st.set_page_config(page_title="GESTALIS – Import Banque", layout="wide")
st.title("🏦 Importer un relevé bancaire")

REGLEMENTS_PATH = os.path.join("data", "reglements.csv")

# 🔄 Charger le fichier existant
if os.path.exists(REGLEMENTS_PATH):
    df_reglements = pd.read_csv(REGLEMENTS_PATH, dtype=str)
else:
    df_reglements = pd.DataFrame(columns=[
        "date", "numero_reglement", "code_tiers", "libelle", "montant", "commentaire"
    ])

# 📥 Charger un fichier Excel
st.markdown("### 📤 Charger un fichier bancaire Excel (.xlsx)")
uploaded_file = st.file_uploader("Fichier Excel", type=["xlsx"])

if uploaded_file:
    df_import = pd.read_excel(uploaded_file)
    df_import.columns = [unidecode(c).lower().strip().replace(" ", "_") for c in df_import.columns]
    st.success("✅ Fichier chargé avec succès !")

    # 📌 Tentative de détection des colonnes attendues
    mapping = {
        "date": ["date", "valeur", "date_operation", "date_de_valeur"],
        "numero_reglement": ["numero", "reference", "ref", "num_operation"],
        "libelle": ["libelle", "intitule", "designation"],
        "debit": ["debit", "retrait"],
        "credit": ["credit", "versement"],
        "commentaire": ["commentaire", "memo", "notes"]
    }

    def detect_col(cible):
        for col in df_import.columns:
            if unidecode(col.lower()) in mapping.get(cible, []):
                return col
        # Recherche floue
        match = get_close_matches(cible, df_import.columns, n=1, cutoff=0.6)
        return match[0] if match else None

    # ✅ Appliquer le mapping automatique
    col_date = detect_col("date")
    col_ref = detect_col("numero_reglement")
    col_lib = detect_col("libelle")
    col_debit = detect_col("debit")
    col_credit = detect_col("credit")
    col_comment = detect_col("commentaire")

    if not all([col_date, col_ref, col_lib, col_debit or col_credit]):
        st.error("❌ Colonnes clés introuvables. Vérifie ton fichier.")
        st.stop()

    # 💰 Calcul du montant : crédit - débit
    df_import["montant"] = df_import[col_credit].fillna(0) - df_import[col_debit].fillna(0)

    # 🧠 Détection des tiers avec dictionnaire simple
    dictionnaire_tiers = df_reglements["code_tiers"].dropna().unique().tolist()

    def detect_tiers(libelle):
        libelle_norm = unidecode(str(libelle).lower())
        match = get_close_matches(libelle_norm, [unidecode(str(x).lower()) for x in dictionnaire_tiers], n=1, cutoff=0.6)
        return dictionnaire_tiers[[unidecode(str(x).lower()) for x in dictionnaire_tiers].index(match[0])] if match else "ATTENTE"

    df_import["code_tiers"] = df_import[col_lib].apply(detect_tiers)

    # 📋 Remplir les autres colonnes
    df_import["date"] = pd.to_datetime(df_import[col_date]).dt.strftime("%Y-%m-%d")
    df_import["numero_reglement"] = df_import[col_ref].astype(str)
    df_import["libelle"] = df_import[col_lib].astype(str)
    df_import["commentaire"] = df_import[col_comment] if col_comment else ""

    # Sélection des colonnes finales
    df_final = df_import[[
        "date", "numero_reglement", "code_tiers", "libelle", "montant", "commentaire"
    ]]

    st.markdown("### 🖋️ Vérifiez les données avant validation")
    lignes_valides = st.multiselect("✅ Sélectionner les lignes à valider", df_final.index.tolist(), format_func=lambda i: f"{df_final.at[i, 'date']} | {df_final.at[i, 'montant']} € | {df_final.at[i, 'libelle']}")
    df_selection = df_final.loc[lignes_valides]

    st.dataframe(df_selection, use_container_width=True)

    if st.button("💾 Ajouter au fichier reglements.csv"):
        if not df_selection.empty:
            df_reglements = pd.concat([df_reglements, df_selection], ignore_index=True)
            df_reglements.to_csv(REGLEMENTS_PATH, index=False)
            st.success(f"✅ {len(df_selection)} ligne(s) ajoutée(s) à reglements.csv")
            st.rerun()
        else:
            st.warning("❗ Aucune ligne sélectionnée.")
else:
    st.info("Veuillez charger un fichier Excel pour commencer.")
