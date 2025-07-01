import streamlit as st
import pandas as pd
import os
from datetime import datetime

def run():
    st.markdown('<div class="main-content">', unsafe_allow_html=True)

    st.title("🧾 Factures – Clients et Fournisseurs")

    if st.button("🔄 Actualiser les données"):
        st.rerun()

    FACTURES_VENTE = "data/factures_vente.csv"
    FACTURES_ACHAT = "data/factures_achat.csv"

    # 📂 Chargement
    @st.cache_data
    def load_factures():
        df_vente = pd.read_csv(FACTURES_VENTE, dtype=str)
        df_achat = pd.read_csv(FACTURES_ACHAT, dtype=str)
        for df in [df_vente, df_achat]:
            df.columns = [c.strip().lower() for c in df.columns]
            df["montant_ttc"] = df.get("montant_ttc", df.get("montant")).astype(float)
            df["reste_a_letrer"] = df.get("reste_a_letrer", 0).astype(float)
            df["date_echeance"] = pd.to_datetime(df["date_echeance"], errors="coerce")
        return df_vente, df_achat

    df_vente, df_achat = load_factures()

    for df, colonnes_min in zip([df_vente, df_achat], [["num_facture", "tiers", "montant_ttc", "date_echeance", "type", "reste_a_letrer"]]*2):
        for col in colonnes_min:
            if col not in df.columns:
                df[col] = ""

    # 🔧 Filtres
    st.sidebar.title("🔎 Filtres factures")
    type_sel = st.sidebar.radio("Type de facture", ["Toutes", "Vente", "Achat"])
    tiers_sel = st.sidebar.text_input("Filtrer par tiers (client ou fournisseur)")
    periode_sel = st.sidebar.selectbox("Filtrer par mois", ["Tous"] + sorted(
        list(set(df_vente["date_echeance"].dt.to_period("M").dropna().astype(str).tolist() +
                 df_achat["date_echeance"].dt.to_period("M").dropna().astype(str).tolist()))
    ), index=0)

    # 🧮 Fusion
    df_vente["type"] = "Vente"
    df_achat["type"] = "Achat"
    df = pd.concat([df_vente, df_achat], ignore_index=True)

    # 🔍 Recherche
    search = st.sidebar.text_input("🔍 Rechercher par numéro de facture")
    if search:
        df = df[df["num_facture"].str.contains(search, case=False)]

    # 🎯 Application des filtres
    if type_sel != "Toutes":
        df = df[df["type"] == type_sel]
    if tiers_sel:
        df = df[df["tiers"].str.contains(tiers_sel, case=False)]
    if periode_sel != "Tous":
        df = df[df["date_echeance"].dt.to_period("M").astype(str) == periode_sel]

    # ✅ Statut lettrage
    df["statut"] = df["reste_a_letrer"].apply(lambda x: "🟢 Réglée" if float(x) == 0 else "🟡 Partielle")

    # 📊 Affichage
    st.markdown("### 📋 Liste des factures")
    st.dataframe(df[[
        "type", "num_facture", "tiers", "montant_ttc", "reste_a_letrer", "date_echeance", "statut"
    ]].sort_values(by="date_echeance", ascending=False), use_container_width=True)

    # ➕ Ajout / modification
    st.markdown("### ✏️ Ajouter une facture")
    with st.form("ajout_facture"):
        type_facture = st.selectbox("Type", ["Vente", "Achat"])
        num_facture = st.text_input("N° Facture")
        tiers = st.text_input("Tiers (client ou fournisseur)")
        montant = st.number_input("Montant TTC", step=0.01)
        reste = st.number_input("Reste à lettrer", step=0.01, value=montant)
        date_ech = st.date_input("Date d’échéance", value=datetime.today())
        submit = st.form_submit_button("💾 Enregistrer")

    if submit:
        new_row = {
            "num_facture": num_facture,
            "tiers": tiers,
            "montant_ttc": montant,
            "reste_a_letrer": reste,
            "date_echeance": date_ech.strftime("%Y-%m-%d"),
            "type": type_facture
        }
        if type_facture == "Vente":
            df_vente = pd.concat([df_vente, pd.DataFrame([new_row])], ignore_index=True)
            df_vente.to_csv(FACTURES_VENTE, index=False)
        else:
            df_achat = pd.concat([df_achat, pd.DataFrame([new_row])], ignore_index=True)
            df_achat.to_csv(FACTURES_ACHAT, index=False)
        st.success("✅ Facture enregistrée.")
        st.rerun()

    # Enregistrer dans l'historique d'import manuel
    hist_path = os.path.join("data", "historique_import_factures.csv")
    historique = pd.read_csv(hist_path, dtype=str) if os.path.exists(hist_path) else pd.DataFrame(columns=["horodatage", "type", "nom_fichier", "nb_lignes"])
    nouveau = pd.DataFrame([{
        "horodatage": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "type": type_facture.lower(),
        "nom_fichier": "ajout manuel",
        "nb_lignes": 1
    }])
    pd.concat([historique, nouveau], ignore_index=True).to_csv(hist_path, index=False)

    # 📤 Export
    st.markdown("### 📥 Export des factures")
    col1, col2 = st.columns(2)
    with col1:
        if st.download_button("⬇️ Export CSV", df.to_csv(index=False), file_name="factures_export.csv"):
            st.success("📁 Export CSV lancé.")
    with col2:
        st.caption("📄 Export PDF à venir dans un module séparé.")

    st.markdown("### 📜 Historique des imports de factures")

    hist_path = os.path.join("data", "historique_import_factures.csv")
    if os.path.exists(hist_path):
        df_hist = pd.read_csv(hist_path)
        st.dataframe(df_hist.sort_values("horodatage", ascending=False), use_container_width=True)
    else:
        st.info("Aucun historique d'import pour le moment.")

    st.markdown('</div>', unsafe_allow_html=True)