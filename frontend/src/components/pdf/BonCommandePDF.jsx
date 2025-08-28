import React from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Styles CSS intégrés pour le template PDF
const pdfStyles = `
  /* Variables de thème PRO 97 */
  :root {
    --color-primary: #004b5d;      /* Bleu PRO 97 */
    --color-accent: #f89032;       /* Orange */
    --color-text: #111111;         /* Texte principal */
    --color-text-secondary: #6a6a6a; /* Texte secondaire */
    --color-border: #e6ecef;       /* Traits/contours */
    --color-bg: #f7f9fb;          /* Fonds cartes */
    --color-white: #ffffff;
    --font-primary: 'Inter', 'Roboto', 'Source Sans Pro', sans-serif;
  }

  /* Reset et base */
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: var(--font-primary);
    font-size: 12px;
    line-height: 1.4;
    color: var(--color-text);
    background: var(--color-white);
  }

  /* Container principal */
  .po-container {
    max-width: 210mm;
    margin: 0 auto;
    padding: 15mm;
    background: var(--color-white);
  }

  /* Header */
  .po-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 20px;
    padding-bottom: 15px;
    border-bottom: 2px solid var(--color-border);
  }

  .logo-section {
    flex: 0 0 200px;
  }

  .logo-placeholder {
    position: relative;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .company-logo {
    max-height: 48px;
    max-width: 180px;
    object-fit: contain;
  }

  .logo-fallback {
    font-size: 24px;
    font-weight: 700;
    color: var(--color-primary);
    text-align: center;
  }

  .title-section {
    flex: 1;
    text-align: center;
  }

  .main-title {
    font-size: 32px;
    font-weight: 700;
    color: var(--color-primary);
    margin-bottom: 8px;
    letter-spacing: 1px;
  }

  .title-underline {
    height: 3px;
    background: var(--color-accent);
    width: 200px;
    margin: 0 auto;
  }

  /* Section adresses */
  .addresses-section {
    display: flex;
    gap: 30px;
    margin-bottom: 25px;
  }

  .address-column {
    flex: 1;
    padding: 20px;
    background: var(--color-bg);
    border: 1px solid var(--color-border);
    border-radius: 8px;
  }

  .address-title {
    font-size: 14px;
    font-weight: 600;
    color: var(--color-primary);
    margin-bottom: 15px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .company-name, .supplier-name {
    font-size: 16px;
    font-weight: 600;
    color: var(--color-text);
    margin-bottom: 8px;
  }

  .company-address, .supplier-address {
    font-size: 13px;
    color: var(--color-text-secondary);
    margin-bottom: 12px;
    line-height: 1.5;
  }

  .company-contact, .supplier-contact {
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin-bottom: 12px;
  }

  .contact-item {
    font-size: 12px;
    color: var(--color-text-secondary);
  }

  .company-details, .supplier-details {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .detail-item {
    font-size: 11px;
    color: var(--color-text-secondary);
    font-style: italic;
  }

  /* Section métadonnées */
  .meta-section {
    margin-bottom: 25px;
  }

  .meta-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
  }

  .meta-item {
    text-align: center;
    padding: 15px;
    background: var(--color-bg);
    border: 1px solid var(--color-border);
    border-radius: 6px;
  }

  .meta-label {
    display: block;
    font-size: 11px;
    font-weight: 600;
    color: var(--color-text-secondary);
    text-transform: uppercase;
    margin-bottom: 8px;
    letter-spacing: 0.5px;
  }

  .meta-value {
    font-size: 14px;
    font-weight: 600;
    color: var(--color-text);
  }

  .bdc-number {
    color: var(--color-accent);
    font-size: 16px;
    font-weight: 700;
  }

  /* Section chantier */
  .project-section {
    margin-bottom: 25px;
  }

  .project-banner {
    background: var(--color-primary);
    color: var(--color-white);
    padding: 15px 20px;
    border-radius: 8px;
    text-align: center;
  }

  .project-label {
    display: block;
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    margin-bottom: 8px;
    opacity: 0.9;
    letter-spacing: 0.5px;
  }

  .project-name {
    font-size: 18px;
    font-weight: 700;
  }

  /* Section livraison */
  .delivery-section {
    margin-bottom: 25px;
  }

  .delivery-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }

  .delivery-item {
    padding: 15px;
    background: var(--color-bg);
    border: 1px solid var(--color-border);
    border-radius: 6px;
  }

  .delivery-label {
    display: block;
    font-size: 11px;
    font-weight: 600;
    color: var(--color-text-secondary);
    text-transform: uppercase;
    margin-bottom: 8px;
    letter-spacing: 0.5px;
  }

  .delivery-value {
    font-size: 14px;
    font-weight: 500;
    color: var(--color-text);
  }

  /* Table des articles */
  .articles-section {
    margin-bottom: 25px;
  }

  .articles-table {
    width: 100%;
    border-collapse: collapse;
    border: 1px solid var(--color-border);
    border-radius: 8px;
    overflow: hidden;
  }

  .table-header {
    background: var(--color-primary);
    color: var(--color-white);
  }

  .table-header th {
    padding: 12px 15px;
    text-align: left;
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .col-ref {
    width: 15%;
  }

  .col-designation {
    width: 60%;
  }

  .col-unit {
    width: 15%;
  }

  .col-qty {
    width: 10%;
    text-align: center;
  }

  .table-body tr:nth-child(even) {
    background: var(--color-bg);
  }

  .table-row {
    border-bottom: 1px solid var(--color-border);
  }

  .table-row:last-child {
    border-bottom: none;
  }

  .table-row td {
    padding: 12px 15px;
    font-size: 12px;
    vertical-align: top;
  }

  .col-designation {
    line-height: 1.4;
    word-wrap: break-word;
  }

  .col-qty {
    text-align: center;
    font-weight: 600;
  }

  /* Section observations */
  .notes-section {
    margin-bottom: 25px;
  }

  .notes-title {
    font-size: 14px;
    font-weight: 600;
    color: var(--color-primary);
    margin-bottom: 12px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .notes-content {
    padding: 15px;
    background: var(--color-bg);
    border: 1px solid var(--color-border);
    border-radius: 6px;
    min-height: 60px;
    font-size: 12px;
    line-height: 1.5;
    color: var(--color-text);
  }

  /* Section signature */
  .signature-section {
    margin-bottom: 25px;
  }

  .signature-block {
    text-align: center;
    padding: 20px;
  }

  .signature-label {
    display: block;
    font-size: 12px;
    font-weight: 600;
    color: var(--color-text-secondary);
    margin-bottom: 15px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .signature-line {
    width: 200px;
    height: 2px;
    background: var(--color-border);
    margin: 0 auto;
    border-radius: 1px;
  }

  /* Footer */
  .po-footer {
    background: var(--color-primary);
    color: var(--color-white);
    padding: 15px 20px;
    border-radius: 8px;
    margin-top: 30px;
  }

  .footer-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .company-coordinates {
    display: flex;
    flex-direction: column;
    gap: 4px;
    font-size: 10px;
    opacity: 0.9;
  }

  .pagination {
    font-size: 12px;
    font-weight: 600;
  }

  .current-page, .total-pages {
    color: var(--color-accent);
  }

  /* Styles d'impression */
  @media print {
    body {
      font-size: 11px;
    }
    
    .po-container {
      padding: 10mm;
      max-width: none;
    }
    
    .main-title {
      font-size: 28px;
    }
    
    .meta-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 15px;
    }
    
    .delivery-grid {
      grid-template-columns: 1fr;
      gap: 15px;
    }
    
    .table-header th {
      padding: 8px 10px;
      font-size: 11px;
    }
    
    .table-row td {
      padding: 8px 10px;
      font-size: 11px;
    }
    
    /* Éviter les coupures */
    .notes-section,
    .signature-section {
      page-break-inside: avoid;
    }
    
    /* Répéter l'en-tête du tableau */
    .table-header {
      display: table-header-group;
    }
    
    /* Pagination automatique */
    .pagination {
      display: none;
    }
  }

  /* Responsive pour petits écrans */
  @media screen and (max-width: 768px) {
    .po-container {
      padding: 10mm;
    }
    
    .addresses-section {
      flex-direction: column;
      gap: 20px;
    }
    
    .meta-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 15px;
    }
    
    .delivery-grid {
      grid-template-columns: 1fr;
      gap: 15px;
    }
    
    .footer-content {
      flex-direction: column;
      gap: 15px;
      text-align: center;
    }
  }
`;

const BonCommandePDF = ({ bonCommande, onClose }) => {
  const generatePDF = async () => {
    const element = document.getElementById('bon-commande-pdf');
    
    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      
      let position = 0;
      
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      pdf.save(`Bon_Commande_${bonCommande.numero || 'BC' + Date.now()}.pdf`);
    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error);
      alert('❌ Erreur lors de la génération du PDF');
    }
  };

  return (
    <>
      {/* Styles CSS intégrés */}
      <style>{pdfStyles}</style>
      
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
          {/* Header du modal */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white rounded-t-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">Aperçu PDF - Bon de Commande</h3>
              <div className="flex gap-3">
                <button
                  onClick={generatePDF}
                  className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors font-medium"
                >
                  📄 Télécharger PDF
                </button>
                <button
                  onClick={onClose}
                  className="text-white/80 hover:text-white"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
          
          {/* Aperçu du PDF */}
          <div className="p-6">
            <div id="bon-commande-pdf" className="bg-white mx-auto" style={{ width: '210mm', minHeight: '297mm' }}>
              {/* Container principal */}
              <div className="po-container">
                {/* Header avec logo et titre */}
                <header className="po-header">
                  <div className="logo-section">
                    <div className="logo-placeholder">
                      <div className="logo-fallback">GESTALIS</div>
                    </div>
                  </div>
                  <div className="title-section">
                    <h1 className="main-title">BON DE COMMANDE</h1>
                    <div className="title-underline"></div>
                  </div>
                </header>

                {/* Adresses expéditeur/destinataire */}
                <section className="addresses-section">
                  <div className="address-column sender-address">
                    <h3 className="address-title">Expéditeur</h3>
                    <div className="company-info">
                      <div className="company-name">GESTALIS</div>
                      <div className="company-address">123 Avenue des Travaux Publics<br />97300 Cayenne, Guyane</div>
                      <div className="company-contact">
                        <span className="contact-item">contact@gestalis.com</span>
                        <span className="contact-item">0594 12 34 56</span>
                      </div>
                      <div className="company-details">
                        <span className="detail-item">SIRET: 12345678901234</span>
                        <span className="detail-item">NAF: 4391C</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="address-column recipient-address">
                    <h3 className="address-title">Destinataire</h3>
                    <div className="supplier-info">
                      <div className="supplier-name">{bonCommande.client?.nom || 'Nom du fournisseur'}</div>
                      <div className="supplier-address">{bonCommande.client?.adresse || 'Adresse du fournisseur'}</div>
                      <div className="supplier-contact">
                        <span className="contact-item">{bonCommande.client?.email || 'email@fournisseur.com'}</span>
                        <span className="contact-item">{bonCommande.client?.telephone || 'Téléphone'}</span>
                      </div>
                      <div className="supplier-details">
                        <span className="detail-item">N° Compte: {bonCommande.client?.numero || 'Code fournisseur'}</span>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Métadonnées */}
                <section className="meta-section">
                  <div className="meta-grid">
                    <div className="meta-item">
                      <label className="meta-label">N° BDC</label>
                      <div className="meta-value bdc-number">{bonCommande.numero || 'BC-' + Date.now()}</div>
                    </div>
                    <div className="meta-item">
                      <label className="meta-label">Date</label>
                      <div className="meta-value">{bonCommande.date || new Date().toLocaleDateString('fr-FR')}</div>
                    </div>
                    <div className="meta-item">
                      <label className="meta-label">Créateur</label>
                      <div className="meta-value">{bonCommande.representant || 'Nom du créateur'}</div>
                    </div>
                    <div className="meta-item">
                      <label className="meta-label">Demandeur</label>
                      <div className="meta-value">{bonCommande.representant || 'Nom du demandeur'}</div>
                    </div>
                  </div>
                </section>

                {/* Nom du chantier */}
                <section className="project-section">
                  <div className="project-banner">
                    <label className="project-label">NOM DU CHANTIER</label>
                    <div className="project-name">{bonCommande.lieuLivraison || 'Nom du chantier'}</div>
                  </div>
                </section>

                {/* Livraison et Contact */}
                <section className="delivery-section">
                  <div className="delivery-grid">
                    <div className="delivery-item">
                      <label className="delivery-label">Adresse de livraison</label>
                      <div className="delivery-value">{bonCommande.lieuLivraison || 'Site/Chantier, Ville — Code postal'}</div>
                    </div>
                    <div className="delivery-item">
                      <label className="delivery-label">Contact chantier</label>
                      <div className="delivery-value">{bonCommande.representant || 'Nom du contact'}</div>
                    </div>
                  </div>
                </section>

                {/* Table des articles */}
                <section className="articles-section">
                  <table className="articles-table">
                    <thead className="table-header">
                      <tr>
                        <th className="col-ref">Réf.</th>
                        <th className="col-designation">Désignation</th>
                        <th className="col-unit">Unité</th>
                        <th className="col-qty">Qté</th>
                      </tr>
                    </thead>
                    <tbody className="table-body">
                      {bonCommande.articles && bonCommande.articles.length > 0 ? (
                        bonCommande.articles.map((article, index) => (
                          <tr key={index} className="table-row">
                            <td className="col-ref">{article.code || 'Code'}</td>
                            <td className="col-designation">{article.designation || 'Désignation'}</td>
                            <td className="col-unit">{article.unite || 'U'}</td>
                            <td className="col-qty">{article.quantite || '0'}</td>
                          </tr>
                        ))
                      ) : (
                        // Lignes vides pour exemple
                        Array.from({ length: 8 }).map((_, index) => (
                          <tr key={index} className="table-row">
                            <td className="col-ref">-</td>
                            <td className="col-designation">-</td>
                            <td className="col-unit">-</td>
                            <td className="col-qty">-</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </section>

                {/* Observations */}
                <section className="notes-section">
                  <h3 className="notes-title">Observations / Conditions particulières</h3>
                  <div className="notes-content">{bonCommande.observations || 'Aucune observation particulière'}</div>
                </section>

                {/* Signature */}
                <section className="signature-section">
                  <div className="signature-block">
                    <label className="signature-label">Signature du créateur</label>
                    <div className="signature-line"></div>
                  </div>
                </section>

                {/* Footer */}
                <footer className="po-footer">
                  <div className="footer-content">
                    <div className="company-coordinates">
                      <span>123 Avenue des Travaux Publics, 97300 Cayenne, Guyane</span>
                      <span>0594 12 34 56</span>
                      <span>contact@gestalis.com</span>
                      <span>SIRET: 12345678901234 | NAF: 4391C</span>
                      <span>IBAN: FR76 1234 5678 9012 3456 7890 123 | BIC: ABCDEF12</span>
                    </div>
                    <div className="pagination">
                      Page <span className="current-page">1</span> / <span className="total-pages">1</span>
                    </div>
                  </div>
                </footer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BonCommandePDF;
