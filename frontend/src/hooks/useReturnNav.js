import { useLocation, useNavigate } from "react-router-dom";

export function useReturnNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const isPicker = params.get("context") === "picker";
  const { returnTo, returnField = "compte_comptable", draftId } = (location.state || {});

  const goBackWith = (payload) => {
    if (isPicker && returnTo) {
      // Nettoyer le state pour éviter les ré-injections
      navigate(returnTo, {
        state: {
          type: "PICKED_COMPTE",
          field: returnField,
          value: { 
            ...payload, 
            label: `${payload.numero} — ${payload.intitule}` 
          },
          draftId,
        },
        replace: true // Remplace l'historique pour éviter les retours en arrière
      });
    }
  };

  const cancelAndReturn = () => {
    if (returnTo) {
      // Nettoyer le state et retourner
      navigate(returnTo, { 
        state: { type: "CANCELLED_PICK", draftId },
        replace: true 
      });
    }
  };

  const setAwaitingPick = () => {
    if (isPicker && draftId) {
      const timestamp = Date.now();
      sessionStorage.setItem('awaiting_pick', `1|${timestamp}|${draftId}`);
    }
  };

  const clearAwaitingPick = () => {
    sessionStorage.removeItem('awaiting_pick');
  };

  const checkAwaitingPick = () => {
    const awaiting = sessionStorage.getItem('awaiting_pick');
    if (awaiting) {
      const [, timestamp, storedDraftId] = awaiting.split('|');
      const age = Date.now() - parseInt(timestamp);
      const isExpired = age > 10 * 60 * 1000; // 10 minutes
      const isCurrentDraft = storedDraftId === draftId;
      
      return { isExpired, isCurrentDraft, age };
    }
    return { isExpired: true, isCurrentDraft: false, age: 0 };
  };

  return { 
    isPicker, 
    returnTo, 
    returnField, 
    draftId, 
    goBackWith, 
    cancelAndReturn,
    setAwaitingPick,
    clearAwaitingPick,
    checkAwaitingPick
  };
}