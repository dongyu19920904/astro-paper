// Constants
const THEME = "theme";
const LIGHT = "light";
const DARK = "dark";

// Initial color scheme
// Can be "light", "dark", or empty string for system's prefers-color-scheme
const initialColorScheme = "";

function readStoredTheme(): string | null {
  try {
    const saved = localStorage.getItem(THEME);
    return saved === LIGHT || saved === DARK ? saved : null;
  } catch {
    return null;
  }
}

let hasExplicitPreference = readStoredTheme() !== null;

function getPreferTheme(): string {
  const currentTheme = readStoredTheme();
  if (currentTheme) return currentTheme;

  // return initial color scheme if it is set (site default)
  if (initialColorScheme) return initialColorScheme;

  // return user device's prefer color scheme (system fallback)
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? DARK
    : LIGHT;
}

// Use existing theme value from inline script if available, otherwise detect
const activeTheme = window.theme?.getTheme();
let themeValue =
  activeTheme === LIGHT || activeTheme === DARK
    ? activeTheme
    : getPreferTheme();

function setPreference(): void {
  hasExplicitPreference = true;
  // Rendering must not depend on storage access succeeding.
  reflectPreference();
  try {
    localStorage.setItem(THEME, themeValue);
  } catch {
    // The current tab remains usable even if persistence is blocked.
  }
}

function reflectPreference(): void {
  document.firstElementChild?.setAttribute("data-theme", themeValue);

  const themeButton = document.querySelector("#theme-btn");
  const themeAction = themeValue === DARK ? "切换到日间" : "切换到夜间";
  themeButton?.setAttribute("aria-label", themeAction);
  themeButton?.setAttribute("title", themeAction);

  // Get a reference to the body element
  const body = document.body;

  // Check if the body element exists before using getComputedStyle
  if (body) {
    // Get the computed styles for the body element
    const computedStyles = window.getComputedStyle(body);

    // Get the background color property
    const bgColor = computedStyles.backgroundColor;

    // Set the background color in <meta theme-color ... />
    document
      .querySelector("meta[name='theme-color']")
      ?.setAttribute("content", bgColor);
  }
}

// Keep the early bootstrap and navigation on one active theme controller.
window.theme = {
  themeValue,
  setPreference,
  reflectPreference,
  getTheme: () => themeValue,
  setTheme: (val: string) => {
    if (val === LIGHT || val === DARK) {
      themeValue = val;
      if (window.theme) window.theme.themeValue = val;
    }
  },
};

// Ensure theme is reflected (in case body wasn't ready when inline script ran)
reflectPreference();

const boundThemeButtons = new WeakSet<Element>();

function setThemeFeature(): void {
  // set on load so screen readers can get the latest value on the button
  reflectPreference();

  // now this script can find and listen for clicks on the control
  const button = document.querySelector("#theme-btn");
  if (!button || boundThemeButtons.has(button)) return;
  boundThemeButtons.add(button);
  button.addEventListener("click", () => {
    themeValue = themeValue === LIGHT ? DARK : LIGHT;
    window.theme?.setTheme(themeValue);
    setPreference();
  });
}

// Set up theme features after page load
setThemeFeature();

// Runs on view transitions navigation
document.addEventListener("astro:after-swap", setThemeFeature);

// Set theme-color value before page transition
// to avoid navigation bar color flickering in Android dark mode
document.addEventListener("astro:before-swap", event => {
  const astroEvent = event;
  const bgColor = document
    .querySelector("meta[name='theme-color']")
    ?.getAttribute("content");

  if (bgColor) {
    astroEvent.newDocument
      .querySelector("meta[name='theme-color']")
      ?.setAttribute("content", bgColor);
  }
});

// sync with system changes
window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", ({ matches: isDark }) => {
    if (hasExplicitPreference) return;
    themeValue = isDark ? DARK : LIGHT;
    window.theme?.setTheme(themeValue);
    reflectPreference();
  });
