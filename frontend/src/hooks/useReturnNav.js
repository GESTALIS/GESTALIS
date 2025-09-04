import { useLocation, useNavigate } from "react-router-dom";

export function useReturnNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const isPicker = params.get("context") === "picker";
  const { returnTo, returnField = "compte_comptable", draftId } = (location.state || {});

  const goBackWith = (payload) => {
    if (isPicker && returnTo) {
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
      });
    }
  };

  const cancelAndReturn = () => {
    if (returnTo) {
      navigate(returnTo);
    }
  };

  return {
    isPicker,
    returnTo,
    returnField,
    draftId,
    goBackWith,
    cancelAndReturn
  };
}
