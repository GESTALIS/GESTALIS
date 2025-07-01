import streamlit as st
import pandas as pd
import os
import plotly.express as px
from datetime import datetime, timedelta

def run():
    st.title("📊 Tableau de bord – GESTALIS")

    # 📁 Chemins
    BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    DATA_DIR = os.path.join(BASE_DIR, "data")
    FACTURES_VENTE = os.path.join(DATA_DIR, "factures_vente.csv")
    FACTURES_ACHAT = os.path.join(DATA_DIR, "factures_achat.csv")
    CHANTIERS_PATH = os.path.join(DATA_DIR, "chantiers.csv")
    CESSION_DIR = os.path.join(DATA_DIR, "cessions")
    CESSION_CSV = os.path.join(CESSION_DIR, "cessions.csv")

    # 🔧 Filtres
    col1, col2 = st.columns(2)
    with col1:
        periode = st.selectbox("Période", ["Tous", "Dernier mois", "Dernier trimestre", "Dernière année"], index=0)
    with col2:
        date_ref = datetime.now()

    # 📂 Chargement des données
    @st.cache_data
    def load_data():
        df_vente = pd.read_csv(FACTURES_VENTE, dtype=str) if os.path.exists(FACTURES_VENTE) else pd.DataFrame()
        df_achat = pd.read_csv(FACTURES_ACHAT, dtype=str) if os.path.exists(FACTURES_ACHAT) else pd.DataFrame()
        df_chantiers = pd.read_csv(CHANTIERS_PATH, dtype=str) if os.path.exists(CHANTIERS_PATH) else pd.DataFrame()
        df_cessions = pd.read_csv(CESSION_CSV, encoding="utf-8-sig") if os.path.exists(CESSION_CSV) else pd.DataFrame()
        return df_vente, df_achat, df_chantiers, df_cessions

    df_vente, df_achat, df_chantiers, df_cessions = load_data()

    # Harmonisation des données
    for df in [df_vente, df_achat]:
        if not df.empty:
            df.columns = [c.strip().lower() for c in df.columns]
            df["montant_ttc"] = pd.to_numeric(df.get("montant_ttc", df.get("montant", 0)), errors='coerce')
            df["date_echeance"] = pd.to_datetime(df["date_echeance"], errors="coerce")
            df["reste_a_letrer"] = pd.to_numeric(df.get("reste_a_letrer", 0), errors='coerce')

    if not df_cessions.empty:
        df_cessions.columns = [c.strip().lower().replace(" ", "_") for c in df_cessions.columns]
        df_cessions["montant_cede_total"] = pd.to_numeric(df_cessions.get("montant_cede_total", 0), errors='coerce')
        if "date_cession" in df_cessions.columns:
            df_cessions["date_cession"] = pd.to_datetime(df_cessions["date_cession"], errors="coerce", format="%Y-%m-%d")

    if not df_chantiers.empty:
        df_chantiers.columns = [c.strip().lower().replace(" ", "_") for c in df_chantiers.columns]
        df_chantiers["date_debut"] = pd.to_datetime(df_chantiers["date_debut"], errors="coerce")
        df_chantiers["statut"] = df_chantiers.get("statut", "Inconnu")

    # 🎯 Filtrer par période
    def filter_by_periode(df, column):
        if column in df.columns and not df.empty:
            # Convertir la colonne en datetime si ce n'est pas déjà fait
            df[column] = pd.to_datetime(df[column], errors="coerce")
            mask = df[column].notna()  # Exclure les valeurs NaT
            if periode == "Dernier mois":
                return df[mask & (df[column] >= (date_ref - timedelta(days=30)))]
            elif periode == "Dernier trimestre":
                return df[mask & (df[column] >= (date_ref - timedelta(days=90)))]
            elif periode == "Dernière année":
                return df[mask & (df[column] >= (date_ref - timedelta(days=365)))]
        return df

    df_vente = filter_by_periode(df_vente, "date_echeance")
    df_achat = filter_by_periode(df_achat, "date_echeance")
    df_chantiers = filter_by_periode(df_chantiers, "date_debut")
    df_cessions = filter_by_periode(df_cessions, "date_cession") if "date_cession" in df_cessions.columns else df_cessions

    # 📊 Cartes de synthèse
    col1, col2, col3 = st.columns(3)
    with col1:
        total_factures = df_vente["montant_ttc"].sum() + df_achat["montant_ttc"].sum()
        st.metric("Total factures (€)", f"{total_factures:,.2f}")
    with col2:
        montant_regle = (df_vente["montant_ttc"] - df_vente["reste_a_letrer"]).sum() + (df_achat["montant_ttc"] - df_achat["reste_a_letrer"]).sum()
        st.metric("Réglé (€)", f"{montant_regle:,.2f}")
    with col3:
        chantiers_actifs = len(df_chantiers[df_chantiers["statut"] == "En cours"])
        st.metric("Chantiers actifs", chantiers_actifs)

    # 📈 Graphiques interactifs
    st.markdown("### 📈 Visualisations")
    col1, col2 = st.columns(2)

    with col1:
        df_factures = pd.concat([df_vente, df_achat])
        if not df_factures.empty and "date_echeance" in df_factures.columns:
            df_factures["month"] = df_factures["date_echeance"].dt.to_period("M").astype(str)
            fig_factures = px.bar(df_factures.groupby("month")["montant_ttc"].sum().reset_index(),
                                x="month", y="montant_ttc", title="Évolution des factures")
            st.plotly_chart(fig_factures, use_container_width=True)

    with col2:
        if not df_chantiers.empty and "statut" in df_chantiers.columns:
            fig_chantiers = px.pie(df_chantiers, names="statut", title="Répartition des statuts des chantiers")
            st.plotly_chart(fig_chantiers, use_container_width=True)

    # 🚨 Alertes
    st.markdown("### 🚨 Alertes")
    df_factures = pd.concat([df_vente, df_achat])
    if not df_factures.empty and "date_echeance" in df_factures.columns and "reste_a_letrer" in df_factures.columns:
        df_alertes = df_factures[
            (pd.to_datetime(df_factures["date_echeance"], errors='coerce') < (date_ref - timedelta(days=30))) &
            (pd.to_numeric(df_factures["reste_a_letrer"], errors='coerce') > 0)
        ]
        if not df_alertes.empty:
            st.warning(f"{len(df_alertes)} factures en retard détectées.")
            st.dataframe(df_alertes[["num_facture", "tiers", "montant_ttc", "reste_a_letrer", "date_echeance"]], use_container_width=True)
        else:
            st.success("Aucune facture en retard.")
    else:
        st.info("Aucune donnée disponible pour les alertes.")

    # 🔧 Actions rapides
    st.markdown("### 🔧 Actions rapides")
    if st.button("Accéder aux Factures"):
        st.session_state.selected_menu = "🧾 Factures"
        st.rerun()
    if st.button("Accéder aux Chantiers"):
        st.session_state.selected_menu = "🏗️ Chantiers"
        st.rerun()