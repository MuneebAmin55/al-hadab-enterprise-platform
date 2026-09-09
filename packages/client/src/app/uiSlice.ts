import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Language = "ar" | "en";
export type Direction = "rtl" | "ltr";

interface UiState {
  language: Language;
  direction: Direction;
  mobileMenuOpen: boolean;
  prequalModalOpen: boolean;
  activeVerticalFilter: string | null;
  activeRegionFilter: string | null;
}

const initialLang: Language = (localStorage.getItem("alhadab_lang") as Language) || "ar";

const initialState: UiState = {
  language: initialLang,
  direction: initialLang === "ar" ? "rtl" : "ltr",
  mobileMenuOpen: false,
  prequalModalOpen: false,
  activeVerticalFilter: null,
  activeRegionFilter: null
};

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleLanguage: (state) => {
      const nextLang: Language = state.language === "ar" ? "en" : "ar";
      state.language = nextLang;
      state.direction = nextLang === "ar" ? "rtl" : "ltr";
      localStorage.setItem("alhadab_lang", nextLang);
      document.documentElement.setAttribute("lang", nextLang);
      document.documentElement.setAttribute("dir", state.direction);
    },
    setLanguage: (state, action: PayloadAction<Language>) => {
      state.language = action.payload;
      state.direction = action.payload === "ar" ? "rtl" : "ltr";
      localStorage.setItem("alhadab_lang", action.payload);
      document.documentElement.setAttribute("lang", action.payload);
      document.documentElement.setAttribute("dir", state.direction);
    },
    setMobileMenuOpen: (state, action: PayloadAction<boolean>) => {
      state.mobileMenuOpen = action.payload;
    },
    setPrequalModalOpen: (state, action: PayloadAction<boolean>) => {
      state.prequalModalOpen = action.payload;
    },
    setVerticalFilter: (state, action: PayloadAction<string | null>) => {
      state.activeVerticalFilter = action.payload;
    },
    setRegionFilter: (state, action: PayloadAction<string | null>) => {
      state.activeRegionFilter = action.payload;
    },
    resetFilters: (state) => {
      state.activeVerticalFilter = null;
      state.activeRegionFilter = null;
    }
  }
});

export const {
  toggleLanguage,
  setLanguage,
  setMobileMenuOpen,
  setPrequalModalOpen,
  setVerticalFilter,
  setRegionFilter,
  resetFilters
} = uiSlice.actions;

export default uiSlice.reducer;
