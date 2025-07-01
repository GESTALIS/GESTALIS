import streamlit as st
import pandas as pd
import os
from datetime import datetime

def run():
    st.markdown('<div class="main-content">', unsafe_allow_html=True)

    st.title("📥 Importer des factures (Vente ou Achat)")

    FACTURES_ACHAT = "data/factures_achat.csv"
    FACTURES_VENTE = "data/factures_vente.csv"
    HISTORIQUE = "data/historique_import_factures.csv"

    uploaded_file = st.file_uploader("📤 Charger un fichier Excel", type=["xlsx"])
    type_facture = st.selectbox("Type de factures", ["Vente", "Achat"])

    if uploaded_file:
        try:
            df_import = pd.read_excel(uploaded_file)
            st.success("✅ Fichier chargé avec succès !")
            st.dataframe(df_import.head())

            # Déterminer le chemin cible
            target_file = FACTURES_VENTE if type_facture == "Vente" else FACTURES_ACHAT
            df_cible = pd.read_csv(target_file, dtype=str) if os.path.exists(target_file) else pd.DataFrame()

            # Fusion intelligente
            df_import.columns = [c.strip().lower() for c in df_import.columns]
            df_import["type"] = type_facture
            df_combined = pd.concat([df_cible, df_import], ignore_index=True)

            if st.button("💾 Importer dans GESTALIS"):
                df_combined.to_csv(target_file, index=False)

                # Historique
                historique = pd.read_csv(HISTORIQUE) if os.path.exists(HISTORIQUE) else pd.DataFrame(columns=["horodatage", "type", "nom_fichier", "nb_lignes"])
                nouveau = pd.DataFrame([{
                    "horodatage": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                    "type": type_facture.lower(),
                    "nom_fichier": uploaded_file.name,
                    "nb_lignes": len(df_import)
                }])
                pd.concat([historique, nouveau], ignore_index=True).to_csv(HISTORIQUE, index=False)

                st.success("✅ Données importées avec succès dans le fichier de factures.")
                st.rerun()

        except Exception as e:
            st.error(f"❌ Erreur : {e}")
    else:
        st.info("Veuillez charger un fichier Excel .xlsx à importer.")

    st.markdown('</div>', unsafe_allow_html=True)