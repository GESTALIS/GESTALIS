import streamlit as st
import pandas as pd
import os
from datetime import date

st.set_page_config(page_title="GESTALIS – Cessions + Avenants", layout="wide")
st.title("📋 GESTALIS – Cessions + Avenants")

# 🎯 Barre de recherche discrète pour filtrer les cessions existantes
st.markdown("#### 🔎 Rechercher une cession")
recherche = st.text_input("Filtrer par Tiers ou Code Chantier", "", placeholder="Tapez un nom ou un code...")

if recherche:
    df_cessions = df_cessions[
        df_cessions["tiers_cessionnaire"].str.contains(recherche, case=False, na=False) |
        df_cessions["code_chantier"].astype(str).str.contains(recherche, case=False, na=False)
    ]


# 📁 Chemins
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
DATA_DIR = os.path.join(BASE_DIR, "data")
CESSION_DIR = os.path.join(DATA_DIR, "cessions")
FACTURES_VENTE = os.path.join(DATA_DIR, "factures_vente.csv")
CESSION_CSV = os.path.join(CESSION_DIR, "cessions.csv")
AVENANTS_CSV = os.path.join(CESSION_DIR, "avenants_cessions.csv")

# Vérification du fichier
if not os.path.exists(CESSION_CSV):
    st.error(f"❌ Le fichier {CESSION_CSV} n'existe pas.")
    st.stop()

# 📂 Chargement
try:
    df_cessions = pd.read_csv(CESSION_CSV, encoding="utf-8-sig")
except UnicodeDecodeError:
    df_cessions = pd.read_csv(CESSION_CSV, encoding="latin1")
df_cessions.columns = [str(col).strip().lower().replace(" ", "_") for col in df_cessions.columns]
st.write("📄 Aperçu du fichier cessions.csv :")
st.write("Colonnes trouvées :", df_cessions.columns.tolist())
st.dataframe(df_cessions)

df_factures = pd.read_csv(FACTURES_VENTE) if os.path.exists(FACTURES_VENTE) else pd.DataFrame()
df_avenants = pd.read_csv(AVENANTS_CSV) if os.path.exists(AVENANTS_CSV) else pd.DataFrame()

# 🔍 Vérification colonnes
colonnes_attendues = ["id_cession", "date_cession", "tiers_cessionnaire", "code_chantier", "montant_cede_total", "factures_liees", "document_cession_pdf", "commentaire"]
colonnes_manquantes = [col for col in colonnes_attendues if col not in df_cessions.columns]
if colonnes_manquantes:
    st.error(f"❌ Colonnes manquantes : {colonnes_manquantes}")
    st.stop()
else:
    st.success("✅ Colonnes OK")

# Harmonisation autres DataFrames
for df in [df_factures, df_avenants]:
    df.columns = [str(col).strip().lower().replace(" ", "_") for col in df.columns]

# 🔍 Colonne facture
col_num_facture = "numero_facture" if "numero_facture" in df_factures.columns else "num_facture"

# 📊 Synthèse
st.markdown("### ✅ Synthèse des cessions")
synthese = []
for _, row in df_cessions.iterrows():
    id_cession = row["id_cession"]
    montant_cede = row["montant_cede_total"]
    montant_avenants = df_avenants[df_avenants["id_cession"] == id_cession]["montant_supplémentaire"].sum()
    montant_total = montant_cede + montant_avenants
    factures_str = str(row["factures_liees"]) if not pd.isna(row["factures_liees"]) else ""
    factures = [f.strip() for f in factures_str.split(";") if f.strip()]

    montant_initial = df_factures[df_factures[col_num_facture].isin(factures)]["montant_ttc"].sum()
    reste_letrer = df_factures[df_factures[col_num_facture].isin(factures)]["reste_a_letrer"].sum()
    montant_regle = montant_initial - reste_letrer
    montant_restant = montant_total - montant_regle
    synthese.append({
        "ID": id_cession,
        "Tiers": row["tiers_cessionnaire"],
        "Chantier": row["code_chantier"],
        "Montant cédé (€)": montant_cede,
        "Avenants (€)": montant_avenants,
        "Total signé (€)": montant_total,
        "Réglé (€)": montant_regle,
        "Restant (€)": montant_restant
    })

st.dataframe(pd.DataFrame(synthese), use_container_width=True)

# ➕ Formulaire avenant
st.markdown("### ➕ Gérer un avenant")
liste_ids = df_avenants["id_avenant"].tolist() if not df_avenants.empty else []
modif_id = st.selectbox("Sélectionner un avenant à modifier (ou laisser vide)", [""] + liste_ids)

if modif_id:
    avenant = df_avenants[df_avenants["id_avenant"] == modif_id].iloc[0]
    default_id_cession = avenant["id_cession"]
    default_date = pd.to_datetime(avenant["date_avenant"]).date()
    default_montant = avenant["montant_supplémentaire"]
    default_commentaire = avenant["commentaire_avenant"]
else:
    default_id_cession = ""
    default_date = date.today()
    default_montant = 0.0
    default_commentaire = ""

with st.form("form_avenant"):
    id_cession = st.selectbox(
        "Cession concernée :", df_cessions["id_cession"].tolist(),
        index=0 if not modif_id else df_cessions["id_cession"].tolist().index(default_id_cession)
    )
    date_avenant = st.date_input("Date de l’avenant", value=default_date)
    montant = st.number_input("Montant supplémentaire (€)", step=100.0, value=float(default_montant))
    commentaire = st.text_area("Commentaire", value=default_commentaire)
    submit = st.form_submit_button("💾 Enregistrer")

if submit:
    if modif_id:
        df_avenants.loc[df_avenants["id_avenant"] == modif_id, ["id_cession", "date_avenant", "montant_supplémentaire", "commentaire_avenant"]] = [
            id_cession, date_avenant, montant, commentaire
        ]
        st.success(f"✅ Avenant {modif_id} modifié.")
    else:
        new_id = len(df_avenants) + 1
        nouveau = pd.DataFrame([{
            "id_cession": id_cession,
            "id_avenant": f"AV-{new_id:03d}",
            "date_avenant": date_avenant,
            "montant_supplémentaire": montant,
            "commentaire_avenant": commentaire
        }])
        df_avenants = pd.concat([df_avenants, nouveau], ignore_index=True)
        st.success(f"✅ Avenant AV-{new_id:03d} ajouté.")
    df_avenants.to_csv(AVENANTS_CSV, index=False)
    st.rerun()

# ❌ Suppression
st.markdown("### 🗑️ Supprimer un avenant")
if not df_avenants.empty:
    to_delete = st.selectbox("Sélectionner un avenant à supprimer", df_avenants["id_avenant"].tolist())
    if st.button("❌ Supprimer"):
        df_avenants = df_avenants[df_avenants["id_avenant"] != to_delete]
        df_avenants.to_csv(AVENANTS_CSV, index=False)
        st.success(f"✅ Avenant {to_delete} supprimé.")
        st.rerun()

# ➕ Créer une nouvelle cession
st.markdown("### ➕ Ajouter une nouvelle cession")

with st.form("form_creation_cession"):
    date_cession = st.date_input("Date de cession", value=date.today())
    tiers = st.text_input("Tiers cessionnaire")
    chantier = st.text_input("Code chantier")
    montant = st.number_input("Montant cédé (€)", step=100.0, min_value=0.0)
    factures = st.text_input("Factures liées (séparées par ';')")
    commentaire = st.text_area("Commentaire")
    submit_cession = st.form_submit_button("💾 Enregistrer la cession")

if submit_cession:
    if not all([tiers, chantier, montant, factures]):
        st.warning("Tous les champs obligatoires doivent être remplis.")
    else:
        new_id = df_cessions["id_cession"].max() + 1 if not df_cessions.empty else 1
        nouvelle_cession = pd.DataFrame([{
            "id_cession": new_id,
            "date_cession": date_cession,
            "tiers_cessionnaire": tiers,
            "code_chantier": chantier,
            "montant_cede_total": montant,
            "factures_liees": factures,
            "document_cession_pdf": "",
            "commentaire": commentaire
        }])
        df_cessions = pd.concat([df_cessions, nouvelle_cession], ignore_index=True)
        df_cessions.to_csv(CESSION_CSV, index=False, encoding="utf-8-sig")
        st.success(f"✅ Cession {new_id} ajoutée avec succès.")
        st.rerun()
