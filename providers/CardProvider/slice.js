import { createSlice } from "@reduxjs/toolkit";
import { logOut } from "providers/AuthProvider/slice";
import { PAYMENT_PROVIDER, CARD_PROVIDER } from "@utils/constants";

const initialState = {
  addCardVisible: false,
  list: [],
  defaultCard: null,
  provider: null,
  loading: false,
};

const cardSlice = createSlice({
  name: "card",
  initialState,
  reducers: {
    setCardList(state, action) {
      const { cardList = [], defaultCard, provider } = action.payload;
      return {
        ...state,
        list: cardList,
        defaultCard,
        provider,
        selectedProvider:
          defaultCard &&
          [CARD_PROVIDER.STRIPE, CARD_PROVIDER.VERITRANS].includes(provider)
            ? PAYMENT_PROVIDER.CREDIT_CARD
            : null,
      };
    },
    setSelectedProvider(state, action) {
      const { selectedProvider } = action.payload;
      return { ...state, selectedProvider };
    },
    setPaymentProvider(state, action) {
      const { provider } = action.payload;
      return { ...state, provider };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(logOut.type, () => initialState);
  },
});

export const { setCardList, setSelectedProvider, setPaymentProvider } =
  cardSlice.actions;

export default cardSlice.reducer;
