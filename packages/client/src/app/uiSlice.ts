import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Language = "ar" | "en";
export type Direction = "rtl" | "ltr";

/**
 * Derives text and layout direction strictly from the given language.
 */
export const getLanguageDirection = (lang: Language): Direction => {
  return lang === "ar" ? "rtl" : "ltr";
};

/**
 * Synchronizes document.documentElement attributes with the specified language and direction.
 */
export const applyDocumentDirection = (lang: Language): Direction => {
  const dir = getLanguageDirection(lang);
  if (typeof document !== "undefined" && document.documentElement) {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
    document.documentElement.setAttribute("lang", lang);
    document.documentElement.setAttribute("dir", dir);
  }
  return dir;
};

/**
 * Reads and validates persisted language preference from localStorage.
 * Defaults to "en" if not set or invalid.
 */
export const getInitialLanguage = (): Language => {
  if (typeof window === "undefined") return "en";
  try {
    const saved = localStorage.getItem("language") || localStorage.getItem("alhadab_lang");
    if (saved === "ar" || saved === "en") {
      return saved;
    }
  } catch (e) {
    // localStorage might be unavailable or restricted
  }
  return "en";
};

// Initial startup synchronization
const initialLang: Language = getInitialLanguage();
const initialDir: Direction = applyDocumentDirection(initialLang);

interface UiState {
  language: Language;
  direction: Direction;
  mobileMenuOpen: boolean;
  prequalModalOpen: boolean;
  activeVerticalFilter: string | null;
  activeRegionFilter: string | null;
}

const initialState: UiState = {
  language: initialLang,
  direction: initialDir,
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
      const nextDir = applyDocumentDirection(nextLang);
      state.language = nextLang;
      state.direction = nextDir;
      try {
        localStorage.setItem("language", nextLang);
        localStorage.setItem("alhadab_lang", nextLang);
      } catch (e) {}
    },
    setLanguage: (state, action: PayloadAction<Language>) => {
      const targetLang: Language = action.payload === "ar" ? "ar" : "en";
      const targetDir = applyDocumentDirection(targetLang);
      state.language = targetLang;
      state.direction = targetDir;
      try {
        localStorage.setItem("language", targetLang);
        localStorage.setItem("alhadab_lang", targetLang);
      } catch (e) {}
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
