import { useEffect, useMemo, useRef, useState } from "react";

export default function SmartPicker({
  value,
  onChange,
  fetcher,
  placeholder = "Rechercher…",
  label,
  required = false,
  className = "",
  createUrl = null,
  createLabel = "Créer",
}) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [results, setResults] = useState([]);
  const [highlight, setHighlight] = useState(-1);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  // Debounce
  const debouncedQ = useMemo(() => q, [q]);
  useEffect(() => {
    const t = setTimeout(async () => {
      if (!debouncedQ?.trim()) { 
        setResults([]); 
        setOpen(false);
        return; 
      }
      
      setLoading(true);
      try {
        const rows = await fetcher(debouncedQ.trim());
        setResults(rows || []);
        setOpen(true);
        setHighlight(rows?.length ? 0 : -1);
      } catch (error) {
        console.error('Erreur lors de la recherche:', error);
        setResults([]);
        setOpen(false);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [debouncedQ, fetcher]);

  const pick = (row) => {
    onChange(row);
    setQ(row?.label || "");
    setOpen(false);
  };

  const clear = () => {
    onChange(null);
    setQ("");
    setOpen(false);
    inputRef.current?.focus();
  };

  const shouldShowCreateButton = () => {
    const shouldShow = createUrl && q.trim().length >= 2 && results.length === 0 && !loading;
    console.log('🔍 SmartPicker Debug:', {
      createUrl,
      queryLength: q.trim().length,
      resultsLength: results.length,
      loading,
      shouldShow
    });
    return shouldShow;
  };

  const handleCreate = () => {
    if (createUrl) {
      // Générer un ID unique pour le brouillon
      const draftId = `draft_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Sauvegarder le brouillon du formulaire actuel
      const currentFormData = {
        searchTerm: q.trim(),
        field: label?.toLowerCase().replace('*', '').trim() || 'field',
        timestamp: Date.now()
      };
      
      localStorage.setItem(`draft_smartpicker_${draftId}`, JSON.stringify(currentFormData));
      
      console.log('💾 Sauvegarde du contexte de création:', currentFormData);
      console.log('🆔 Draft ID généré:', draftId);
      
      // Construire l'URL avec les paramètres de retour
      const returnUrl = `${createUrl}?context=picker&from=smartpicker&field=${label?.toLowerCase().replace('*', '').trim() || 'field'}`;
      
      // Sauvegarder le contexte de retour dans sessionStorage
      sessionStorage.setItem('smartpicker_return_context', JSON.stringify({
        returnTo: window.location.href,
        returnField: label?.toLowerCase().replace('*', '').trim() || 'field',
        draftId,
        searchTerm: q.trim()
      }));
      
      console.log('🚀 Navigation vers:', returnUrl);
      
      // Rediriger vers la page de création
      window.location.href = returnUrl;
    }
  };

  const onKeyDown = (e) => {
    if (!open && (e.key === "ArrowDown" || e.key === "ArrowUp")) { 
      setOpen(true); 
      return; 
    }
    if (e.key === "ArrowDown") { 
      e.preventDefault(); 
      setHighlight((h) => Math.min(h + 1, results.length - 1)); 
    }
    if (e.key === "ArrowUp") { 
      e.preventDefault(); 
      setHighlight((h) => Math.max(h - 1, 0)); 
    }
    if (e.key === "Enter" && open && highlight >= 0) { 
      e.preventDefault(); 
      pick(results[highlight]); 
    }
    if (e.key === "Escape") { 
      setOpen(false); 
    }
  };

  // Initialiser avec la valeur sélectionnée
  useEffect(() => {
    if (value?.label) {
      setQ(value.label);
    } else if (!value) {
      setQ("");
    }
  }, [value]);

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      {/* Affichage de la valeur sélectionnée (optionnel) */}
      {value && (
        <div className="mb-2 p-2 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between">
          <div className="text-sm font-medium text-green-800">
            ✓ {value.label}
          </div>
          <button
            type="button"
            onClick={clear}
            className="text-green-600 hover:text-green-800 p-1 text-sm"
            title="Effacer la sélection"
          >
            ✕
          </button>
        </div>
      )}
      
      {/* Champ de recherche (toujours visible) */}
      <div className="relative">
        <input
          ref={inputRef}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onFocus={() => { if (results.length) setOpen(true); }}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        
        {/* Indicateur de recherche ou chargement */}
        {loading ? (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            🔍
          </div>
        )}
          
          {/* Résultats de recherche */}
          {open && results?.length > 0 && (
            <ul className="absolute z-[9999] mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg max-h-64 overflow-y-auto">
              {results.map((row, idx) => (
                <li key={row.id}>
                  <button
                    type="button"
                    className={`block w-full text-left px-3 py-2 text-sm ${
                      idx === highlight 
                        ? "bg-blue-100 text-blue-900" 
                        : "hover:bg-gray-50 text-gray-900"
                    }`}
                    onMouseEnter={() => setHighlight(idx)}
                    onClick={() => pick(row)}
                  >
                    {row.label}
                  </button>
                </li>
              ))}
            </ul>
          )}
          
          {/* Message si aucun résultat ou bouton créer */}
          {open && results?.length === 0 && !loading && q.trim() && !value && (
            <div className="absolute z-[9999] mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg">
              {shouldShowCreateButton() ? (
                <div className="p-3">
                  <div className="text-sm text-gray-500 mb-2">
                    Aucun résultat trouvé pour "{q}"
                  </div>
                  <button
                    type="button"
                    onClick={handleCreate}
                    className="w-full text-left px-3 py-2 text-sm bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 rounded-md transition-colors"
                  >
                    + {createLabel} "{q}"
                  </button>
                </div>
              ) : (
                <div className="p-3 text-sm text-gray-500">
                  Aucun résultat trouvé pour "{q}"
                </div>
              )}
            </div>
          )}
        </div>
    </div>
  );
}
