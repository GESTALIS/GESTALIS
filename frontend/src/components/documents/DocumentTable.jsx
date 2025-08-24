import React from 'react';

/**
 * Composant de table pour documents (BC, Factures) avec alignement parfait des montants
 * Utilise la police Inter Variable et tabular-nums
 */
export default function DocumentTable({ 
  headers, 
  data, 
  className = "",
  showTotals = true 
}) {
  // Calcul du total si demandé
  const total = showTotals ? data.reduce((sum, row) => {
    const amount = parseFloat(row.amount) || 0;
    return sum + amount;
  }, 0) : 0;

  return (
    <div className="document-table-container">
      <table className={`table-doc ${className}`}>
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th 
                key={index} 
                className={header.type === 'amount' ? 'amount' : ''}
                style={{ width: header.width }}
              >
                {header.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {headers.map((header, colIndex) => (
                <td 
                  key={colIndex} 
                  className={header.type === 'amount' ? 'amount' : ''}
                >
                  {header.type === 'amount' ? (
                    <span className="font-mono">
                      {new Intl.NumberFormat('fr-FR', {
                        style: 'currency',
                        currency: 'EUR',
                        minimumFractionDigits: 2
                      }).format(row[header.key])}
                    </span>
                  ) : (
                    row[header.key]
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        {showTotals && (
          <tfoot>
            <tr className="border-t-2 border-gray-300">
              <td 
                colSpan={headers.length - 1} 
                className="text-right font-bold text-lg"
              >
                Total
              </td>
              <td className="amount font-bold text-lg">
                <span className="font-mono">
                  {new Intl.NumberFormat('fr-FR', {
                    style: 'currency',
                    currency: 'EUR',
                    minimumFractionDigits: 2
                  }).format(total)}
                </span>
              </td>
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
}

/**
 * Exemple d'utilisation pour un bon de commande
 */
export function BonCommandeTable({ data }) {
  const headers = [
    { key: 'designation', label: 'Désignation', type: 'text', width: '40%' },
    { key: 'quantite', label: 'Quantité', type: 'number', width: '15%' },
    { key: 'unite', label: 'Unité', type: 'text', width: '15%' },
    { key: 'prixUnitaire', label: 'Prix unitaire HT', type: 'amount', width: '15%' },
    { key: 'montant', label: 'Montant HT', type: 'amount', width: '15%' }
  ];

  return (
    <DocumentTable 
      headers={headers} 
      data={data} 
      showTotals={true}
      className="bon-commande-table"
    />
  );
}

/**
 * Exemple d'utilisation pour une facture
 */
export function FactureTable({ data }) {
  const headers = [
    { key: 'designation', label: 'Désignation', type: 'text', width: '35%' },
    { key: 'quantite', label: 'Qté', type: 'number', width: '12%' },
    { key: 'unite', label: 'Unité', type: 'text', width: '12%' },
    { key: 'prixUnitaire', label: 'Prix unitaire HT', type: 'amount', width: '15%' },
    { key: 'montant', label: 'Montant HT', type: 'amount', width: '13%' },
    { key: 'tva', label: 'TVA 20%', type: 'amount', width: '13%' }
  ];

  return (
    <DocumentTable 
      headers={headers} 
      data={data} 
      showTotals={true}
      className="facture-table"
    />
  );
}

/**
 * Données d'exemple pour test
 */
export const sampleBonCommandeData = [
  {
    designation: 'Béton C25/30',
    quantite: 50,
    unite: 'm³',
    prixUnitaire: 85.50,
    montant: 4275.00
  },
  {
    designation: 'Acier HA500',
    quantite: 1200,
    unite: 'kg',
    prixUnitaire: 1.25,
    montant: 1500.00
  },
  {
    designation: 'Planches de coffrage',
    quantite: 200,
    unite: 'm²',
    prixUnitaire: 12.80,
    montant: 2560.00
  }
];

export const sampleFactureData = [
  {
    designation: 'Béton C25/30',
    quantite: 50,
    unite: 'm³',
    prixUnitaire: 85.50,
    montant: 4275.00,
    tva: 855.00
  },
  {
    designation: 'Acier HA500',
    quantite: 1200,
    unite: 'kg',
    prixUnitaire: 1.25,
    montant: 1500.00,
    tva: 300.00
  },
  {
    designation: 'Planches de coffrage',
    quantite: 200,
    unite: 'm²',
    prixUnitaire: 12.80,
    montant: 2560.00,
    tva: 512.00
  }
];

