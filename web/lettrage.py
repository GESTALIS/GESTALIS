import streamlit as st
import pandas as pd
from datetime import datetime
import os

st.set_page_config(page_title="GESTALIS – 💳 Lettrage", layout="wide")

# 📁 Chemins
FACTURES_VENTE_PATH = "data/factures_vente.csv"
FACTURES_ACHAT_PATH = "data/factures_achat.csv"
REGLEMENTS_PATH = "data/reglements.csv"
LETTRAGES_PATH = "data/lettrages.csv"

@st.cache_data
def load_data():
    df_vente = pd.read_csv(FACTURES_VENTE_PATH, dtype=str)
    df_achat = pd.read_csv(FACTURES_ACHAT_PATH, dtype=str)
    df_regl = pd.read_csv(REGLEMENTS_PATH, dtype=str)
    try:
        df_lettrages = pd.read_csv(LETTRAGES_PATH, dtype=str)
    except FileNotFoundError:
        df_lettrages = pd.DataFrame(columns=[
            "date_lettrage", "type_facture", "num_facture", "code_tiers",
            "montant_lettré", "ref_reglement", "commentaire"
        ])
    return df_vente, df_achat, df_regl, df_lettrages

df_vente, df_achat, df_regl, df_lettrages = load_data()

def to_float(val):
    try:
        return float(str(val).replace(",", "."))
    except:
        return 0.0

# Harmonisation
for df in [df_vente, df_achat]:
    df.columns = [c.strip().lower().replace(" ", "_") for c in df.columns]
    if "montant_ttc" in df.columns:
        df["montant_ttc"] = df["montant_ttc"].apply(to_float)
    elif "montant" in df.columns:
        df["montant_ttc"] = df["montant"].apply(to_float)
    if "numero_facture" in df.columns:
        df.rename(columns={"numero_facture": "num_facture"}, inplace=True)

df_lettrages["montant_lettré"] = df_lettrages.get("montant_lettré", df_lettrages.get("montant", 0)).apply(to_float)

if "ref_reglement" not in df_regl.columns and "numero_reglement" in df_regl.columns:
    df_regl["ref_reglement"] = df_regl["numero_reglement"]
if "ref_reglement" not in df_lettrages.columns and "numero_reglement" in df_lettrages.columns:
    df_lettrages["ref_reglement"] = df_lettrages["numero_reglement"]
if "num_facture" not in df_lettrages.columns and "numero_facture" in df_lettrages.columns:
    df_lettrages["num_facture"] = df_lettrages["numero_facture"]

st.sidebar.title("🔧 Filtres")
mode = "Par règlement"
st.title("💳 Module de lettrage bancaire – GESTALIS")

def get_reste_facture(num):
    all_f = pd.concat([df_vente, df_achat])
    montant = all_f[all_f["num_facture"] == num]["montant_ttc"].astype(float).sum()
    lettré = df_lettrages[df_lettrages["num_facture"] == num]["montant_lettré"].sum()
    return round(montant - lettré, 2)

def get_reste_reglement(ref):
    montant = df_regl[df_regl["ref_reglement"] == ref]["montant"].astype(float).sum()
    lettré = df_lettrages[df_lettrages["ref_reglement"] == ref]["montant_lettré"].sum()
    return round(montant - lettré, 2)

def enregistrer_lettrage(date_lettrage, type_facture, num_facture, code_tiers, montant, ref_reglement, commentaire):
    new = pd.DataFrame([{
        "date_lettrage": date_lettrage,
        "type_facture": type_facture,
        "num_facture": num_facture,
        "code_tiers": code_tiers,
        "montant_lettré": montant,
        "ref_reglement": ref_reglement,
        "commentaire": commentaire
    }])
    df_new = pd.concat([df_lettrages, new], ignore_index=True)
    df_new.to_csv(LETTRAGES_PATH, index=False)
    st.success("✅ Lettrage enregistré.")
    st.experimental_rerun()

if mode == "Par règlement":
    st.subheader("💰 Lettrage par règlement")
    df_regl["reste"] = df_regl["ref_reglement"].apply(get_reste_reglement)
    dispo = df_regl[df_regl["reste"] > 0]
    if dispo.empty:
        st.info("Aucun règlement disponible avec un solde.")
    else:
        ref = st.selectbox("Référence règlement", dispo["ref_reglement"])
        reste = get_reste_reglement(ref)
        st.info(f"Montant restant sur ce règlement : {reste:.2f} €")

        all_f = pd.concat([df_vente.assign(type="Vente"), df_achat.assign(type="Achat")])
        all_f["reste"] = all_f["num_facture"].apply(get_reste_facture)
        all_f = all_f[all_f["reste"] > 0]

        fact_labels = all_f.apply(
            lambda row: f"{row['num_facture']} | {row['tiers']} | {row['montant_ttc']} € | {row['type']}",
            axis=1
        ).tolist()

        fact_map = dict(zip(fact_labels, all_f["num_facture"]))
        fact_label_selected = st.selectbox("📄 Facture à lettrer", fact_labels)
        fact = fact_map[fact_label_selected]
        ligne = all_f[all_f["num_facture"] == fact].iloc[0]
        montant_f = ligne["reste"]

        use_full = st.checkbox("💯 Lettrer entièrement", value=True)
        montant = montant_f if use_full else st.number_input("Montant à lettrer", 0.0, reste, min(montant_f, reste), step=0.01)
        commentaire = st.text_input("Commentaire")
        if st.button("✅ Valider le lettrage"):
            if montant > 0:
                enregistrer_lettrage(datetime.today().strftime("%d/%m/%Y"), ligne["type"], fact, ligne["tiers"], montant, ref, commentaire)

st.markdown("---")
st.subheader("📜 Historique des lettrages")

if not df_lettrages.empty:
    selected = st.selectbox("Modifier ou supprimer un lettrage :", df_lettrages.apply(
        lambda row: f"{row['date_lettrage']} | {row['num_facture']} | {row['ref_reglement']} | {row['montant_lettré']} €", axis=1
    ))
    index = df_lettrages.index[df_lettrages.apply(
        lambda row: f"{row['date_lettrage']} | {row['num_facture']} | {row['ref_reglement']} | {row['montant_lettré']} €", axis=1
    ) == selected].tolist()[0]

    ligne = df_lettrages.loc[index]
    new_montant = st.number_input("Modifier montant lettré", min_value=0.0, value=float(ligne["montant_lettré"]), step=0.01)
    new_comment = st.text_input("Modifier commentaire", value=ligne.get("commentaire", ""))
    col1, col2 = st.columns(2)
    with col1:
        if st.button("💾 Enregistrer les modifications"):
            df_lettrages.at[index, "montant_lettré"] = new_montant
            df_lettrages.at[index, "commentaire"] = new_comment
            df_lettrages.to_csv(LETTRAGES_PATH, index=False)
            st.success("✅ Modifications enregistrées.")
            st.experimental_rerun()
    with col2:
        if st.button("🗑 Supprimer ce lettrage"):
            df_lettrages.drop(index=index).to_csv(LETTRAGES_PATH, index=False)
            st.warning("🗑 Lettrage supprimé.")
            st.experimental_rerun()

st.dataframe(df_lettrages, use_container_width=True)
