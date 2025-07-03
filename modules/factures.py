import streamlit as st
import pandas as pd
import os
from datetime import datetime
from fuzzywuzzy import fuzz
import re
import traceback
from datetime import timedelta

# CSS pour personnaliser les boutons
st.markdown("""
<style>
/* Style pour les boutons de suppression (plus petits, rouges) */
button[kind="primary"][data-testid="baseButton-primary"]:has(span.supprimer) {
    background-color: #ff4d4d;
    color: white;
    padding: 0.3rem 0.6rem;
    font-size: 0.85rem;
    border-radius: 4px;
    border: 1px solid #cc0000;
}
button[kind="primary"][data-testid="baseButton-primary"]:has(span.supprimer):hover {
    background-color: #cc0000;
}
/* Style pour les boutons principaux (plus grands, verts) */
button[kind="primary"][data-testid="baseButton-primary"]:not(:has(span.supprimer)) {
    padding: 0.5rem 1rem;
    font-size: 1rem;
    background-color: #4CAF50;
    border-radius: 4px;
}
</style>
""", unsafe_allow_html=True)

# Fonction pour nettoyer le délai
def clean_delai(delai):
    try:
        digits = re.search(r'\d+', str(delai))
        return digits.group() if digits else "30"
    except Exception:
        return "30"

# Fonction pour détection intelligente du chantier
def detect_chantier(lib, chantiers_df):
    if not lib or pd.isna(lib):
        return ""
    best_match = ""
    highest_score = 0
    for code, nom in zip(chantiers_df["code_chantier"], chantiers_df.get("nom_chantier", "")):
        score = fuzz.partial_ratio(lib.upper(), str(nom).upper()) if nom else 0
        if score > highest_score and score > 70:
            highest_score = score
            best_match = code
    return best_match

# Fonction pour normaliser les chaînes en majuscules
def normalize_string(s):
    return str(s).strip().upper() if pd.notnull(s) else ""

# Fonction pour parser les dates avec correction des invalides
def try_parse_date(date_str):
    if not date_str or pd.isna(date_str) or date_str == "":
        return pd.NaT
    date_formats = ["%d/%m/%Y", "%Y-%m-%d", "%d-%m-%Y", "%Y/%m/%d"]
    for fmt in date_formats:
        try:
            dt = pd.to_datetime(date_str, format=fmt, errors="coerce")
            if dt is not pd.NaT:
                if dt.day > 28:
                    last_day = (dt.replace(day=1) + timedelta(days=32)).replace(day=1) - timedelta(days=1)
                    dt = dt.replace(day=min(dt.day, last_day.day))
                return dt
        except ValueError:
            continue
    try:
        return pd.to_datetime('1899-12-30') + pd.to_timedelta(float(date_str), unit='D')
    except (ValueError, TypeError):
        return pd.to_datetime(date_str, errors="coerce", dayfirst=True)

# Fonction pour mapper les colonnes du fichier importé
def map_columns(df):
    column_mapping = {
        'num_facture': ['num_facture', 'n int', 'numero_facture', 'facture', 'id_facture'],
        'tiers': ['tiers', 'client', 'fournisseur', 'nom_tiers'],
        'montant_ttc': ['montant_ttc', 'montant', 'total_ttc', 'montant_total', 'total'],
        'num_externe': ['num_externe', 'piece', 'numero_externe', 'ref_externe'],
        'date_echeance': ['date_echeance', 'date_échéance', 'ech', 'echeance', 'date d\'echeance'],
        'date_facture': ['date_facture', 'date', 'date facture'],
        'code_chantier': ['code_chantier', 'chantier', 'projet'],
        'modalite_paiement': ['modalite_paiement', 'modalité_paiement', 'paiement'],
        'delai_paiement': ['delai_paiement', 'délai_paiement', 'delai', 'délai'],
        'reste_a_letrer': ['reste_a_letrer', 'reste', 'solde'],
        'type': ['type', 'categorie', 'category'],
        'compte': ['compte', 'code_tiers'],
        'lib': ['lib', 'libelle', 'libellé', 'description'],
        'debit': ['debit', 'débit'],
        'credit': ['credit', 'crédit'],
        'source': ['source']
    }
    
    rename_dict = {}
    for standard_col, possible_names in column_mapping.items():
        for name in possible_names:
            if name in [c.lower() for c in df.columns]:
                rename_dict[[c for c in df.columns if c.lower() == name][0]] = standard_col
                break
    
    df = df.rename(columns=rename_dict)
    return df

# Fonction pour archiver les factures supprimées
def archive_factures(deleted_rows, archive_file):
    if not deleted_rows.empty:
        if os.path.exists(archive_file):
            df_archive = pd.read_csv(archive_file, dtype=str, encoding='utf-8')
        else:
            df_archive = pd.DataFrame(columns=deleted_rows.columns)
        df_archive = pd.concat([df_archive, deleted_rows], ignore_index=True)
        df_archive.to_csv(archive_file, index=False, encoding='utf-8')

# Fonction pour journaliser les actions
def log_action(historique_file, num_facture, action, user_id):
    if os.path.exists(historique_file):
        df_historique = pd.read_csv(historique_file, encoding='utf-8')
    else:
        df_historique = pd.DataFrame(columns=["horodatage", "num_facture", "action", "utilisateur"])
    new_action = pd.DataFrame([{
        "horodatage": datetime.now().strftime("%d/%m/%Y %H:%M:%S"),
        "num_facture": num_facture,
        "action": action,
        "utilisateur": user_id
    }])
    df_historique = pd.concat([df_historique, new_action], ignore_index=True)
    df_historique.to_csv(historique_file, index=False, encoding='utf-8')

def run():
    if "authenticated" not in st.session_state or not st.session_state.authenticated:
        st.error("❌ Veuillez vous connecter.")
        st.stop()

    st.markdown('<div class="main-content">', unsafe_allow_html=True)
    st.title("🧾 Factures – Clients et Fournisseurs")

    # Chemins
    BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    DATA_DIR = os.path.join(BASE_DIR, "data")
    FACTURES_VENTE = os.path.join(DATA_DIR, "factures_vente.csv")
    FACTURES_ACHAT = os.path.join(DATA_DIR, "factures_achat.csv")
    CHANTIERS_PATH = os.path.join(DATA_DIR, "chantiers.csv")
    FOURNISSEURS_PATH = os.path.join(DATA_DIR, "fournisseurs.csv")
    HISTORIQUE_PATH = os.path.join(DATA_DIR, "historique_import_factures.csv")
    ARCHIVE_PATH = os.path.join(DATA_DIR, "archive_factures.csv")
    HISTORIQUE_ACTIONS_PATH = os.path.join(DATA_DIR, "historique_actions_factures.csv")

    # Chargement (sans cache)
    def load_data():
        required_columns = ["num_facture", "num_externe", "tiers", "montant_ttc", "reste_a_letrer", 
                           "date_echeance", "date_facture", "code_chantier", "modalite_paiement", 
                           "delai_paiement", "type", "source"]
        try:
            df_vente = pd.read_csv(FACTURES_VENTE, dtype=str, encoding='utf-8') if os.path.exists(FACTURES_VENTE) else pd.DataFrame(columns=required_columns)
            df_achat = pd.read_csv(FACTURES_ACHAT, dtype=str, encoding='utf-8') if os.path.exists(FACTURES_ACHAT) else pd.DataFrame(columns=required_columns)
            df_chantiers = pd.read_csv(CHANTIERS_PATH, dtype=str, encoding='utf-8') if os.path.exists(CHANTIERS_PATH) else pd.DataFrame(columns=["code_chantier", "nom_chantier"])
            df_fournisseurs = pd.read_csv(FOURNISSEURS_PATH, dtype=str, encoding='utf-8') if os.path.exists(FOURNISSEURS_PATH) else pd.DataFrame(columns=["code_tiers", "nom_tiers", "modalite_paiement", "delai_paiement"])
        except Exception as e:
            st.markdown(f'<span style="color:red">❌ Erreur lors du chargement des fichiers CSV : {e}</span>', unsafe_allow_html=True)
            st.stop()

        for df in [df_vente, df_achat]:
            df.columns = [c.strip().lower() for c in df.columns]
            for col in required_columns:
                if col not in df.columns:
                    df[col] = "" if col not in ['montant_ttc', 'reste_a_letrer'] else "0"
            df["montant_ttc"] = pd.to_numeric(df.get("montant_ttc", "0"), errors="coerce").fillna(0)
            df["reste_a_letrer"] = pd.to_numeric(df.get("reste_a_letrer", "0"), errors="coerce").fillna(0)
            df["date_echeance"] = pd.to_datetime(df.get("date_echeance", None), errors="coerce", dayfirst=True, format="%d/%m/%Y").dt.strftime("%d/%m/%Y")
            df["date_facture"] = pd.to_datetime(df.get("date_facture", None), errors="coerce", dayfirst=True, format="%d/%m/%Y").dt.strftime("%d/%m/%Y")
            df["tiers"] = df["tiers"].apply(normalize_string)
            df["source"] = df["source"].fillna("manuel")
        if "code_chantier" not in df_chantiers.columns:
            df_chantiers["code_chantier"] = ""
        df_fournisseurs["nom_tiers"] = df_fournisseurs["nom_tiers"].apply(normalize_string)
        return df_vente, df_achat, df_chantiers, df_fournisseurs

    # Charger les données globales
    df_vente, df_achat, df_chantiers, df_fournisseurs = load_data()

    # Définir les onglets
    tab1, tab2, tab3, tab4 = st.tabs(["Recherche", "Ajouter une facture", "Importer des factures", "Historique"])

    with tab1:
        st.markdown("### 🔎 Filtres")
        # Initialiser les clés de session_state
        if "filtered_df" not in st.session_state:
            st.session_state.filtered_df = None
        if "filters_applied" not in st.session_state:
            st.session_state.filters_applied = False
        if "selected_rows" not in st.session_state:
            st.session_state.selected_rows = pd.DataFrame()

        # Filtres
        type_sel = st.radio("Type de facture", ["Toutes", "Vente", "Achat", "Avoir"], key="type_filter")
        tiers_options = ["Tous"] + (sorted(df_fournisseurs["nom_tiers"].tolist()) if not df_fournisseurs.empty else [])
        tiers_sel = st.selectbox("Filtrer par tiers", tiers_options, key="tiers_filter")
        chantier_options = ["Tous"] + (sorted(df_chantiers["code_chantier"].tolist()) if not df_chantiers.empty else [])
        chantier_sel = st.selectbox("Filtrer par chantier", chantier_options, key="chantier_filter")
        periode_sel = st.selectbox("Filtrer par mois", ["Tous"] + sorted(
            list(set(pd.to_datetime(df_vente["date_echeance"], format="%d/%m/%Y", errors="coerce").dt.to_period("M").dropna().astype(str).tolist() +
                     pd.to_datetime(df_achat["date_echeance"], format="%d/%m/%Y", errors="coerce").dt.to_period("M").dropna().astype(str).tolist()))
        ), index=0, key="periode_filter")
        num_facture_search = st.text_input("Filtrer par numéro de facture", key="num_facture_filter")
        num_externe_search = st.text_input("Filtrer par numéro externe", key="num_externe_filter")
        montant_search = st.number_input("Filtrer par montant", min_value=0.0, step=0.01, key="montant_filter")

        if st.button("Appliquer les filtres"):
            # Recharger les données
            df_vente, df_achat, _, _ = load_data()
            df_vente["type"] = df_vente["type"].fillna("Vente")
            df_achat["type"] = df_achat["type"].fillna("Achat")
            df = pd.concat([df_vente, df_achat], ignore_index=True)

            # Appliquer les filtres
            if tiers_sel != "Tous" and tiers_sel:
                df = df[df["tiers"] == tiers_sel]
            if num_facture_search:
                df = df[df["num_facture"].str.contains(num_facture_search, case=False, na=False)]
            if num_externe_search:
                df = df[df["num_externe"].str.contains(num_externe_search, case=False, na=False)]
            if type_sel != "Toutes":
                df = df[df["type"] == type_sel]
            if periode_sel != "Tous":
                df = df[pd.to_datetime(df["date_echeance"], format="%d/%m/%Y", errors="coerce").dt.to_period("M").astype(str) == periode_sel]
            if montant_search > 0:
                df = df[abs(df["montant_ttc"] - montant_search) < 0.1]

            # Stocker les données filtrées
            st.session_state.filtered_df = df
            st.session_state.filters_applied = True
            st.session_state.selected_rows = pd.DataFrame()

        st.markdown("### 📋 Résultats des filtres")
        if st.session_state.filters_applied and st.session_state.filtered_df is not None and not st.session_state.filtered_df.empty:
            df_with_checkbox = st.session_state.filtered_df.copy()
            df_with_checkbox["Sélectionner"] = df_with_checkbox["source"] == "manuel"

            # Restaurer les sélections
            if not st.session_state.selected_rows.empty:
                df_with_checkbox["Sélectionner"] = df_with_checkbox["num_facture"].isin(st.session_state.selected_rows["num_facture"])

            # Afficher le tableau interactif
            edited_df = st.data_editor(
                df_with_checkbox[[
                    "Sélectionner", "type", "date_facture", "num_facture", "num_externe", "tiers", "montant_ttc",
                    "code_chantier", "date_echeance", "delai_paiement", "modalite_paiement", "source"
                ]],
                use_container_width=True,
                key="factures_table"
            )

            # Mettre à jour les sélections
            selected_rows = edited_df[edited_df["Sélectionner"]][["num_facture"]]
            st.session_state.selected_rows = selected_rows

            # Bouton pour supprimer les factures manuelles
            if st.button("Supprimer les factures sélectionnées <span class='supprimer'></span>", key="delete_button", help="Supprimer les factures manuelles sélectionnées"):
                if not st.session_state.selected_rows.empty:
                    selected_factures = st.session_state.filtered_df[st.session_state.filtered_df["num_facture"].isin(st.session_state.selected_rows["num_facture"])]
                    if not selected_factures[selected_factures["source"] == "manuel"].empty:
                        with st.expander("Confirmer la suppression"):
                            st.warning("⚠️ Êtes-vous sûr de vouloir supprimer les factures sélectionnées ? Cette action est irréversible.")
                            st.write(f"Nombre de factures à supprimer : {len(selected_factures)}")
                            if st.button("Confirmer la suppression <span class='supprimer'></span>", key="confirm_delete"):
                                # Archiver et journaliser
                                archive_factures(selected_factures, ARCHIVE_PATH)
                                user_id = st.session_state.get("user_id", "Inconnu")
                                for num_facture in selected_factures["num_facture"]:
                                    log_action(HISTORIQUE_ACTIONS_PATH, num_facture, "supprimée_manuelle", user_id)
                                # Mettre à jour les DataFrames globaux
                                df_vente = df_vente[~df_vente["num_facture"].isin(selected_factures["num_facture"])]
                                df_achat = df_achat[~df_achat["num_facture"].isin(selected_factures["num_facture"])]
                                df_vente.to_csv(FACTURES_VENTE, index=False, encoding='utf-8')
                                df_achat.to_csv(FACTURES_ACHAT, index=False, encoding='utf-8')
                                # Réinitialiser l'état
                                st.session_state.filtered_df = None
                                st.session_state.filters_applied = False
                                st.session_state.selected_rows = pd.DataFrame()
                                st.success("✅ Factures supprimées avec succès.")
                                st.rerun()
                    else:
                        st.warning("⚠️ Seules les factures manuelles peuvent être supprimées.")
                else:
                    st.warning("⚠️ Aucune facture sélectionnée.")

        else:
            st.info("Appliquez les filtres pour voir les résultats.")

        st.markdown("### 📥 Export des factures")
        if st.button("Exporter les résultats filtrés"):
            if st.session_state.filters_applied and st.session_state.filtered_df is not None:
                st.download_button(
                    "⬇️ Export CSV",
                    st.session_state.filtered_df[[
                        "type", "date_facture", "num_facture", "num_externe", "tiers", "montant_ttc",
                        "code_chantier", "date_echeance", "delai_paiement", "modalite_paiement", "source"
                    ]].to_csv(index=False),
                    file_name="factures_filtrees_export.csv"
                )
                st.markdown('<span style="color:red">✅ Export avec succès.</span>', unsafe_allow_html=True)
            else:
                st.markdown('<span style="color:red">❌ Aucun résultat à exporter. Appliquez les filtres d’abord.</span>', unsafe_allow_html=True)

    with tab2:
        st.markdown("### ✏️ Ajouter une facture")
        with st.form("ajout_facture"):
            num_facture = st.text_input("N° Facture")
            last_externe = df_achat["num_externe"].iloc[-1] if not df_achat.empty else ""
            num_externe = st.text_input("N° Externe", value=last_externe)
            montant = st.number_input("Montant TTC", step=0.01, help="Entrez un montant positif ou négatif. Les avoirs auront un montant négatif.")
            reste = st.number_input("Reste à lettrer", value=abs(montant), step=0.01)
            facture_type = st.selectbox("Type de facture", ["Vente", "Achat", "Avoir"], key="facture_type_add")
            tiers_search = st.text_input("Rechercher un tiers", key="tiers_add")
            if not df_fournisseurs.empty:
                matching_tiers = df_fournisseurs[
                    df_fournisseurs["nom_tiers"].str.contains(tiers_search, case=False, na=False) |
                    df_fournisseurs["code_tiers"].str.contains(tiers_search, case=False, na=False)
                ]["nom_tiers"].tolist() if tiers_search else df_fournisseurs["nom_tiers"].tolist()
                tiers = st.selectbox("Sélectionner un tiers", sorted(matching_tiers), key="tiers_select_add") if matching_tiers else st.text_input("Nouveau tiers", key="new_tiers")
            else:
                tiers = st.text_input("Nouveau tiers", key="new_tiers")
            if tiers and normalize_string(tiers) in df_fournisseurs["nom_tiers"].values:
                selected_fournisseur = df_fournisseurs[df_fournisseurs["nom_tiers"] == normalize_string(tiers)].iloc[0]
                default_modalite = selected_fournisseur["modalite_paiement"]
                default_delai = selected_fournisseur["delai_paiement"]
            else:
                default_modalite = "Virement"
                default_delai = "30"
            modalite_paiement = st.selectbox("Modalité de paiement", ["Virement", "Chèque", "Espèces", "Comptant"], index=["Virement", "Chèque", "Espèces", "Comptant"].index(default_modalite) if default_modalite in ["Virement", "Chèque", "Espèces", "Comptant"] else 0)
            delai_paiement = st.selectbox("Délai de paiement (jours)", ["0", "30", "60", "90"], index=["0", "30", "60", "90"].index(default_delai) if default_delai in ["0", "30", "60", "90"] else 0)
            date_facture = st.date_input("Date de facture", value=datetime.now(), format="DD/MM/YYYY")
            date_ech = st.date_input("Date d’échéance", value=datetime.now() + pd.Timedelta(days=int(clean_delai(default_delai))), format="DD/MM/YYYY")
            chantier_options = ["Aucun"] + (sorted(df_chantiers["code_chantier"].tolist()) if not df_chantiers.empty else [])
            if normalize_string(tiers) in df_fournisseurs["nom_tiers"].values:
                chantiers_associes = df_chantiers[df_chantiers["client"] == normalize_string(tiers)]["code_chantier"].tolist() if "client" in df_chantiers.columns else []
                if chantiers_associes:
                    code_chantier = st.selectbox("Chantier associé", ["Aucun"] + chantiers_associes, key="chantier_select_add")
                else:
                    code_chantier = st.selectbox("Chantier associé", chantier_options, key="chantier_select_add")
            else:
                code_chantier = st.selectbox("Chantier associé", chantier_options, key="chantier_select_add")
            submit = st.form_submit_button("💾 Enregistrer")

        if submit:
            # Validation des champs
            if not num_facture:
                st.markdown('<span style="color:red">❌ Le numéro de facture ne peut pas être vide.</span>', unsafe_allow_html=True)
                st.stop()
            if not tiers:
                st.markdown('<span style="color:red">❌ Le tiers ne peut pas être vide.</span>', unsafe_allow_html=True)
                st.stop()
            df_all_factures = pd.concat([df_vente, df_achat], ignore_index=True)
            if num_facture in df_all_factures["num_facture"].values:
                st.markdown(f'<span style="color:red">❌ Le numéro de facture \'{num_facture}\' existe déjà. Veuillez utiliser un numéro unique.</span>', unsafe_allow_html=True)
                st.stop()

            # Calculer le délai de paiement
            if date_ech and date_facture:
                delta_days = (date_ech - date_facture).days
                delai_paiement = str(delta_days)
                if delta_days == 0:
                    modalite_paiement = "Comptant"

            # Créer la nouvelle facture
            new_row = {
                "num_facture": num_facture,
                "num_externe": num_externe,
                "tiers": normalize_string(tiers),
                "montant_ttc": -abs(montant) if facture_type in ["Vente", "Avoir"] else abs(montant),
                "reste_a_letrer": abs(reste),
                "date_echeance": date_ech.strftime("%d/%m/%Y") if date_ech else "",
                "date_facture": date_facture.strftime("%d/%m/%Y") if date_facture else "",
                "type": facture_type,
                "code_chantier": code_chantier if code_chantier != "Aucun" else "",
                "modalite_paiement": modalite_paiement,
                "delai_paiement": delai_paiement,
                "source": "manuel"
            }
            if new_row["type"] in ["Vente", "Avoir"]:
                df_vente = pd.concat([df_vente, pd.DataFrame([new_row])], ignore_index=True)
                df_vente.to_csv(FACTURES_VENTE, index=False, encoding='utf-8')
            else:
                df_achat = pd.concat([df_achat, pd.DataFrame([new_row])], ignore_index=True)
                df_achat.to_csv(FACTURES_ACHAT, index=False, encoding='utf-8')
            if tiers and normalize_string(tiers) not in df_fournisseurs["nom_tiers"].values:
                new_fournisseur = pd.DataFrame([{
                    "code_tiers": f"T{len(df_fournisseurs) + 1:03d}",
                    "nom_tiers": normalize_string(tiers),
                    "modalite_paiement": modalite_paiement,
                    "delai_paiement": delai_paiement
                }])
                df_fournisseurs = pd.concat([df_fournisseurs, new_fournisseur], ignore_index=True)
                df_fournisseurs.to_csv(FOURNISSEURS_PATH, index=False, encoding='utf-8')
            st.markdown(f'<span style="color:red">✅ Facture enregistrée ({facture_type}, montant: {new_row["montant_ttc"]}).</span>', unsafe_allow_html=True)
            if st.button("Réinitialiser le formulaire"):
                st.rerun()

    with tab3:
        st.markdown("### 📥 Importer des factures")
        default_type = st.selectbox("Type de facture (si non détecté automatiquement)", ["Achat", "Vente", "Avoir"], index=0)
        uploaded_file = st.file_uploader("📤 Charger un fichier", type=["xlsx", "csv"])

        with st.spinner("Traitement du fichier..."):
            if uploaded_file:
                try:
                    encoding_options = ['utf-8', 'latin1', 'windows-1252']
                    df_import = None
                    for encoding in encoding_options:
                        try:
                            if uploaded_file.name.endswith(".xlsx"):
                                try:
                                    import openpyxl
                                    df_import = pd.read_excel(uploaded_file)
                                except ImportError:
                                    st.markdown('<span style="color:red">❌ La bibliothèque \'openpyxl\' est requise pour lire les fichiers Excel (.xlsx). Installez-la avec : `pip install openpyxl`</span>', unsafe_allow_html=True)
                                    st.stop()
                            else:
                                df_import = pd.read_csv(uploaded_file, sep=",", decimal=",", encoding=encoding, header=0)
                            break
                        except (UnicodeDecodeError, pd.errors.ParserError):
                            continue

                    if df_import is None or df_import.empty:
                        raise ValueError("Fichier vide ou non lisible.")

                    df_import = df_import.astype(str)
                    df_import.columns = [c.strip().lower() for c in df_import.columns]
                    df_import = map_columns(df_import)

                    if "lib" in df_import.columns:
                        df_import["tiers"] = df_import["lib"].str.split("/").str[0].str.strip().apply(normalize_string)
                    elif "compte" in df_import.columns:
                        df_import["tiers"] = df_import["compte"].str.strip().apply(normalize_string)
                    else:
                        df_import["tiers"] = "INCONNU"

                    if df_import["num_facture"].isna().any() or (df_import["num_facture"] == "").any():
                        st.markdown('<span style="color:red">❌ Certaines factures ont un numéro de facture vide. Veuillez corriger le fichier.</span>', unsafe_allow_html=True)
                        st.stop()

                    if "credit" in df_import.columns and "debit" in df_import.columns:
                        df_import["credit"] = pd.to_numeric(df_import["credit"].str.replace(" ", "").replace("", "0"), errors="coerce").fillna(0)
                        df_import["debit"] = pd.to_numeric(df_import["debit"].str.replace(" ", "").replace("", "0"), errors="coerce").fillna(0)
                        df_import["montant_ttc"] = df_import["credit"]
                        mask_credit = df_import["montant_ttc"] > 0
                        df_import.loc[~mask_credit, "montant_ttc"] = df_import["debit"]
                    else:
                        df_import["montant_ttc"] = pd.to_numeric(df_import.get("montant_ttc", "0").str.replace(" ", "").replace("", "0"), errors="coerce").fillna(0)

                    df_import["reste_a_letrer"] = df_import["montant_ttc"].abs()
                    df_import["num_facture"] = df_import.get("num_facture", "").str.strip()
                    df_import["num_externe"] = df_import.get("num_externe", "").str.strip()

                    if "date_facture" in df_import.columns:
                        df_import["date_facture"] = df_import["date_facture"].apply(try_parse_date)
                    if "date_echeance" in df_import.columns:
                        df_import["date_echeance"] = df_import["date_echeance"].apply(try_parse_date)

                    df_import["delai_paiement"] = df_import.apply(
                        lambda row: str(int((row["date_echeance"] - row["date_facture"]).days)) if pd.notnull(row["date_echeance"]) and pd.notnull(row["date_facture"]) and row["date_echeance"] > row["date_facture"] else
                        "0" if pd.notnull(row["date_facture"]) and (pd.isna(row["date_echeance"]) or row["date_echeance"] == "") else
                        df_import.get("delai_paiement", "30").iloc[0] if "delai_paiement" in df_import.columns else "30",
                        axis=1
                    )
                    df_import["modalite_paiement"] = df_import.apply(
                        lambda row: "Comptant" if pd.notnull(row["date_facture"]) and (pd.isna(row["date_echeance"]) or row["date_echeance"] == "" or row["date_echeance"] == row["date_facture"]) else
                        df_import.get("modalite_paiement", "Virement").iloc[0] if "modalite_paiement" in df_import.columns else "Virement",
                        axis=1
                    )
                    df_import["date_echeance"] = df_import.apply(
                        lambda row: row["date_facture"] if pd.isna(row["date_echeance"]) or row["date_echeance"] == "" else row["date_echeance"],
                        axis=1
                    ).dt.strftime("%d/%m/%Y").fillna("")

                    if "type" in df_import.columns:
                        df_import["type"] = df_import["type"].str.strip()
                    else:
                        if "compte" in df_import.columns:
                            df_import["type"] = df_import.apply(
                                lambda row: "Achat" if row["compte"].startswith("F") and pd.to_numeric(row.get("debit", "0"), errors="coerce") > 0 else
                                            "Avoir" if row["compte"].startswith("F") and pd.to_numeric(row.get("credit", "0"), errors="coerce") > 0 else
                                            "Vente" if row["compte"].startswith("C") and pd.to_numeric(row.get("credit", "0"), errors="coerce") > 0 else
                                            "Avoir" if row["compte"].startswith("C") and pd.to_numeric(row.get("debit", "0"), errors="coerce") > 0 else
                                            default_type, axis=1
                            )
                        elif "tiers" in df_import.columns:
                            df_import["type"] = df_import["tiers"].apply(
                                lambda x: "Vente" if any(df_fournisseurs[df_fournisseurs["nom_tiers"] == x]["code_tiers"].str.startswith("C")) else default_type
                            )
                        else:
                            df_import["type"] = default_type

                    if "type" in df_import.columns:
                        df_import.loc[df_import["type"] == "Vente", "montant_ttc"] = -df_import.loc[df_import["type"] == "Vente", "montant_ttc"].abs()
                        df_import.loc[df_import["type"] == "Avoir", "montant_ttc"] = -df_import.loc[df_import["type"] == "Avoir", "montant_ttc"].abs()

                    df_import["date_facture"] = df_import["date_facture"].dt.strftime("%d/%m/%Y").fillna("")

                    if "code_chantier" in df_import.columns:
                        df_import["code_chantier"] = df_import["code_chantier"].str.strip()
                    else:
                        df_import["code_chantier"] = df_import["lib"].apply(lambda x: detect_chantier(x, df_chantiers)) if "lib" in df_import.columns else ""

                    df_import["source"] = f"import_{uploaded_file.name}"

                    df_vente, df_achat, _, _ = load_data()
                    df_all_factures = pd.concat([df_vente, df_achat], ignore_index=True)
                    doublons = df_import[df_import["num_facture"].isin(df_all_factures["num_facture"]) & (df_import["num_facture"] != "")]

                    if not doublons.empty:
                        st.markdown(f'<span style="color:red">⚠️ {len(doublons)} numéro(s) de facture déjà existants détectés !</span>', unsafe_allow_html=True)
                        available_columns = ["type", "date_facture", "num_facture", "num_externe", "tiers", "montant_ttc", 
                                            "code_chantier", "date_echeance", "delai_paiement", "modalite_paiement", "source"]
                        st.dataframe(doublons[available_columns])
                    else:
                        st.markdown('<span style="color:red">✅ Aucun doublon détecté.</span>', unsafe_allow_html=True)

                    columns_to_display = ["type", "date_facture", "num_facture", "num_externe", "tiers", "montant_ttc", 
                                         "code_chantier", "date_echeance", "delai_paiement", "modalite_paiement", "source"]
                    available_columns = [col for col in columns_to_display if col in df_import.columns]
                    if available_columns:
                        st.session_state["df_import_preview"] = df_import
                        st.dataframe(df_import[available_columns])
                    else:
                        st.markdown('<span style="color:red">❌ Aucune colonne valide à afficher.</span>', unsafe_allow_html=True)

                    if st.button("💾 Importer dans GESTALIS"):
                        if not doublons.empty:
                            st.markdown(f'<span style="color:red">❌ Échec de l’import : doublons détectés. Corrigez votre fichier.</span>', unsafe_allow_html=True)
                            st.stop()

                        target_file = FACTURES_VENTE if any(df_import["type"] == "Vente") else FACTURES_ACHAT
                        df_cible = pd.read_csv(target_file, dtype=str, encoding='utf-8') if os.path.exists(target_file) else pd.DataFrame(columns=df_import.columns)
                        df_cible = map_columns(df_cible)
                        df_combined = pd.concat([df_cible, st.session_state["df_import_preview"]], ignore_index=True)
                        df_combined.to_csv(target_file, index=False, encoding='utf-8')

                        historique = pd.read_csv(HISTORIQUE_PATH, encoding='utf-8') if os.path.exists(HISTORIQUE_PATH) else pd.DataFrame(columns=["horodatage", "type", "nom_fichier", "nb_lignes", "import_par"])
                        if "import_par" not in historique.columns:
                            historique["import_par"] = ""
                        nouveau = pd.DataFrame([{
                            "horodatage": datetime.now().strftime("%d/%m/%Y %H:%M:%S"),
                            "type": default_type.lower() if not any(df_import["type"] == "Vente") else "vente",
                            "nom_fichier": uploaded_file.name,
                            "nb_lignes": len(df_import),
                            "import_par": st.session_state.get("user_id", "Inconnu")
                        }])
                        pd.concat([historique, nouveau], ignore_index=True).to_csv(HISTORIQUE_PATH, index=False, encoding='utf-8')

                        st.markdown(f'<span style="color:red">✅ Import avec succès dans {os.path.basename(target_file)} ({len(df_import)} lignes).</span>', unsafe_allow_html=True)
                        if st.button("Réinitialiser l’importation"):
                            del st.session_state["df_import_preview"]
                            st.rerun()

                except Exception as e:
                    st.markdown(f'<span style="color:red">❌ Échec de l’import : {e}</span>', unsafe_allow_html=True)
                    st.markdown(f'<span style="color:red">Détails de l\'erreur : {traceback.format_exc()}</span>', unsafe_allow_html=True)

            if not uploaded_file:
                st.info("Chargez un fichier.")

    with tab4:
        st.markdown("### 📜 Historique des actions")
        try:
            # Charger et afficher l’historique des imports
            if os.path.exists(HISTORIQUE_PATH):
                df_hist_imports = pd.read_csv(HISTORIQUE_PATH, encoding='utf-8')
                if "import_par" not in df_hist_imports.columns:
                    df_hist_imports["import_par"] = ""
                if "action" not in df_hist_imports.columns:
                    df_hist_imports["action"] = "import"
                if "horodatage_suppression" not in df_hist_imports.columns:
                    df_hist_imports["horodatage_suppression"] = ""
            else:
                df_hist_imports = pd.DataFrame(columns=["horodatage", "type", "nom_fichier", "nb_lignes", "import_par", "action", "horodatage_suppression"])
                st.info("Aucun historique d'imports disponible.")

            # Charger et afficher l’historique des actions
            if os.path.exists(HISTORIQUE_ACTIONS_PATH):
                df_hist_actions = pd.read_csv(HISTORIQUE_ACTIONS_PATH, encoding='utf-8')
            else:
                df_hist_actions = pd.DataFrame(columns=["horodatage", "num_facture", "action", "utilisateur"])
                st.info("Aucun historique d'actions disponible.")

            # Combiner les historiques
            hist_imports = df_hist_imports[["horodatage", "nom_fichier", "action", "import_par"]].rename(columns={"nom_fichier": "détail", "import_par": "utilisateur"})
            hist_actions = df_hist_actions[["horodatage", "num_facture", "action", "utilisateur"]].rename(columns={"num_facture": "détail"})
            df_hist_combined = pd.concat([hist_imports, hist_actions], ignore_index=True)

            # Filtres pour l’historique
            action_filter = st.selectbox("Filtrer par action", ["Toutes", "import", "supprimée_manuelle", "supprimé"], key="action_filter")
            date_filter = st.text_input("Filtrer par date (DD/MM/YYYY)", key="date_action_filter")

            # Appliquer les filtres
            if action_filter != "Toutes":
                df_hist_combined = df_hist_combined[df_hist_combined["action"] == action_filter]
            if date_filter:
                df_hist_combined = df_hist_combined[df_hist_combined["horodatage"].str.contains(date_filter, na=False)]

            # Afficher l’historique
            if not df_hist_combined.empty:
                st.dataframe(df_hist_combined.sort_values(by="horodatage", ascending=False), use_container_width=True)
            else:
                st.info("Aucun résultat dans l’historique avec ces filtres.")

            # Suppression d’un import complet
            st.markdown("#### 🗑️ Supprimer un import complet")
            if not df_hist_imports.empty:
                import_options = df_hist_imports[df_hist_imports["action"] == "import"]["nom_fichier"].tolist()
                selected_import = st.selectbox("Sélectionner un import à supprimer", [""] + import_options, key="import_delete")
                if selected_import:
                    import_data = df_hist_imports[df_hist_imports["nom_fichier"] == selected_import]
                    st.write(f"Import sélectionné : {selected_import} ({import_data['nb_lignes'].iloc[0]} lignes, importé le {import_data['horodatage'].iloc[0]})")
                    
                    # Afficher un aperçu des factures
                    df_all = pd.concat([df_vente, df_achat], ignore_index=True)
                    import_factures = df_all[df_all["source"] == f"import_{selected_import}"]
                    if not import_factures.empty:
                        st.dataframe(import_factures[["type", "date_facture", "num_facture", "num_externe", "tiers", "montant_ttc", "source"]])
                    else:
                        st.warning("⚠️ Aucune facture trouvée pour cet import.")

                    # Confirmation forte
                    confirmation_text = st.text_input("Saisissez 'OUI, SUPPRIMER' pour confirmer la suppression", key="confirm_import_delete")
                    if st.button("Supprimer l’import <span class='supprimer'></span>", key="delete_import_button"):
                        if confirmation_text == "OUI, SUPPRIMER":
                            # Archiver les factures
                            archive_factures(import_factures, ARCHIVE_PATH)
                            # Supprimer des fichiers principaux
                            df_vente = df_vente[~df_vente["num_facture"].isin(import_factures["num_facture"])]
                            df_achat = df_achat[~df_achat["num_facture"].isin(import_factures["num_facture"])]
                            df_vente.to_csv(FACTURES_VENTE, index=False, encoding='utf-8')
                            df_achat.to_csv(FACTURES_ACHAT, index=False, encoding='utf-8')
                            # Mettre à jour l’historique des imports
                            df_hist_imports.loc[df_hist_imports["nom_fichier"] == selected_import, "action"] = "supprimé"
                            df_hist_imports.loc[df_hist_imports["nom_fichier"] == selected_import, "horodatage_suppression"] = datetime.now().strftime("%d/%m/%Y %H:%M:%S")
                            df_hist_imports.loc[df_hist_imports["nom_fichier"] == selected_import, "import_par"] = st.session_state.get("user_id", "Inconnu")
                            df_hist_imports.to_csv(HISTORIQUE_PATH, index=False, encoding='utf-8')
                            st.success(f"✅ Import {selected_import} supprimé avec succès.")
                            st.rerun()
                        else:
                            st.error("❌ Saisissez exactement 'OUI, SUPPRIMER' pour confirmer.")
            else:
                st.info("Aucun import disponible.")

        except Exception as e:
            st.markdown(f'<span style="color:red">❌ Erreur lors du chargement de l’historique : {e}</span>', unsafe_allow_html=True)
            st.markdown(f'<span style="color:red">Détails de l\'erreur : {traceback.format_exc()}</span>', unsafe_allow_html=True)

    st.markdown('</div>', unsafe_allow_html=True)