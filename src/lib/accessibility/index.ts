/**
 * Accessibility System Index
 * WCAG 2.1 AA compliant accessibility features for anime-themed Python learning platform
 */

// Accessibility hooks
export {
  useKeyboardNavigation,
  useFocusManagement,
  useScreenReader,
  useColorPreferences,
  useAriaLive,
  useSkipLinks,
  useFormAccessibility,
  useKeyboardShortcuts,
  useLanguagePreferences,
  useViewportAccessibility,
  useTextScaling,
} from "./hooks";

// Accessibility components
export {
  SkipLinks,
  ScreenReaderOnly,
  LiveRegion,
  FocusTrap,
  AccessibleButton,
  AccessibleField,
  HighContrastToggle,
  TextSizeControls,
  KeyboardShortcutsHelp,
  AccessibleModal,
  AccessibleProgress,
} from "./components";

// Accessibility utilities and constants
export const accessibility = {
  // WCAG 2.1 color contrast ratios
  contrastRatios: {
    normal: 4.5, // AA level for normal text
    large: 3, // AA level for large text (18pt+ or 14pt+ bold)
    enhanced: 7, // AAA level for normal text
    largeEnhanced: 4.5, // AAA level for large text
  },

  // ARIA roles for common UI patterns
  roles: {
    button: "button",
    link: "link",
    navigation: "navigation",
    main: "main",
    complementary: "complementary",
    contentinfo: "contentinfo",
    banner: "banner",
    search: "search",
    form: "form",
    dialog: "dialog",
    alert: "alert",
    status: "status",
    progressbar: "progressbar",
    tab: "tab",
    tabpanel: "tabpanel",
    tablist: "tablist",
  },

  // Common keyboard keys
  keys: {
    ENTER: "Enter",
    SPACE: " ",
    TAB: "Tab",
    ESCAPE: "Escape",
    ARROW_UP: "ArrowUp",
    ARROW_DOWN: "ArrowDown",
    ARROW_LEFT: "ArrowLeft",
    ARROW_RIGHT: "ArrowRight",
    HOME: "Home",
    END: "End",
    PAGE_UP: "PageUp",
    PAGE_DOWN: "PageDown",
  },

  // Focus management utilities
  focus: {
    // Get all focusable elements within a container
    getFocusableElements: (container: HTMLElement): HTMLElement[] => {
      const selector = [
        "a[href]",
        "button:not([disabled])",
        "input:not([disabled])",
        "select:not([disabled])",
        "textarea:not([disabled])",
        '[tabindex]:not([tabindex="-1"])',
        '[contenteditable="true"]',
      ].join(", ");

      return Array.from(container.querySelectorAll(selector)) as HTMLElement[];
    },

    // Move focus to first focusable element
    focusFirst: (container: HTMLElement): boolean => {
      const focusableElements =
        accessibility.focus.getFocusableElements(container);
      if (focusableElements.length > 0) {
        focusableElements[0].focus();
        return true;
      }
      return false;
    },

    // Move focus to last focusable element
    focusLast: (container: HTMLElement): boolean => {
      const focusableElements =
        accessibility.focus.getFocusableElements(container);
      if (focusableElements.length > 0) {
        focusableElements[focusableElements.length - 1].focus();
        return true;
      }
      return false;
    },

    // Check if element is focusable
    isFocusable: (element: HTMLElement): boolean => {
      if (element.tabIndex < 0) return false;
      if (element.hasAttribute("disabled")) return false;
      if (element.getAttribute("aria-hidden") === "true") return false;

      const rect = element.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0;
    },
  },

  // ARIA attribute helpers
  aria: {
    // Create unique IDs for ARIA relationships
    generateId: (prefix: string = "aria"): string => {
      return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
    },

    // Common ARIA attributes
    attributes: {
      // For form controls
      required: (isRequired: boolean) =>
        isRequired ? { "aria-required": "true" } : {},
      invalid: (hasError: boolean) => ({
        "aria-invalid": hasError ? "true" : "false",
      }),
      describedBy: (id: string) => ({ "aria-describedby": id }),
      labelledBy: (id: string) => ({ "aria-labelledby": id }),

      // For interactive elements
      expanded: (isExpanded: boolean) => ({
        "aria-expanded": isExpanded ? "true" : "false",
      }),
      selected: (isSelected: boolean) => ({
        "aria-selected": isSelected ? "true" : "false",
      }),
      pressed: (isPressed: boolean) => ({
        "aria-pressed": isPressed ? "true" : "false",
      }),
      checked: (isChecked: boolean) => ({
        "aria-checked": isChecked ? "true" : "false",
      }),

      // For dynamic content
      live: (priority: "polite" | "assertive" = "polite") => ({
        "aria-live": priority,
      }),
      atomic: (isAtomic: boolean = true) => ({
        "aria-atomic": isAtomic ? "true" : "false",
      }),

      // For navigation
      current: (
        type: "page" | "step" | "location" | "date" | "time" | "true" | "false"
      ) => ({ "aria-current": type }),

      // For content structure
      hidden: (isHidden: boolean) =>
        isHidden ? { "aria-hidden": "true" } : {},
      label: (label: string) => ({ "aria-label": label }),
    },
  },

  // Screen reader announcements
  announcements: {
    // Common announcement messages in Turkish
    messages: {
      loading: "Yükleniyor, lütfen bekleyin",
      loaded: "İçerik yüklendi",
      saving: "Kaydediliyor",
      saved: "Kaydedildi",
      error: "Bir hata oluştu",
      success: "İşlem başarılı",
      required: "Bu alan zorunludur",
      invalid: "Geçersiz değer",
      navigationChanged: "Sayfa değişti",
      menuOpened: "Menü açıldı",
      menuClosed: "Menü kapandı",
      modalOpened: "Dialog açıldı",
      modalClosed: "Dialog kapandı",
      tabSelected: "Sekme seçildi",
      sortChanged: "Sıralama değişti",
      filterApplied: "Filtre uygulandı",
      searchResults: (count: number) => `${count} sonuç bulundu`,
      pageChanged: (page: number, total: number) => `Sayfa ${page} / ${total}`,
      progressUpdate: (percent: number) => `%${percent} tamamlandı`,
    },
  },

  // Keyboard navigation patterns
  keyboard: {
    // Standard keyboard shortcuts
    shortcuts: {
      help: ["?", "F1"],
      search: ["/", "Ctrl+F"],
      menu: ["Alt+M", "F10"],
      home: ["Alt+H", "Ctrl+Home"],
      skip: ["Alt+S"],
      settings: ["Alt+P", "Ctrl+,"],
    },

    // Arrow key navigation for grids and lists
    handleArrowNavigation: (
      event: KeyboardEvent,
      currentIndex: number,
      itemCount: number,
      isGrid: boolean = false,
      columns: number = 1
    ) => {
      let newIndex = currentIndex;

      switch (event.key) {
        case accessibility.keys.ARROW_UP:
          newIndex = isGrid
            ? Math.max(0, currentIndex - columns)
            : Math.max(0, currentIndex - 1);
          break;
        case accessibility.keys.ARROW_DOWN:
          newIndex = isGrid
            ? Math.min(itemCount - 1, currentIndex + columns)
            : Math.min(itemCount - 1, currentIndex + 1);
          break;
        case accessibility.keys.ARROW_LEFT:
          newIndex = Math.max(0, currentIndex - 1);
          break;
        case accessibility.keys.ARROW_RIGHT:
          newIndex = Math.min(itemCount - 1, currentIndex + 1);
          break;
        case accessibility.keys.HOME:
          newIndex = 0;
          break;
        case accessibility.keys.END:
          newIndex = itemCount - 1;
          break;
        default:
          return currentIndex;
      }

      if (newIndex !== currentIndex) {
        event.preventDefault();
      }

      return newIndex;
    },
  },

  // Color and contrast utilities
  color: {
    // Calculate relative luminance (for contrast ratio calculation)
    getLuminance: (r: number, g: number, b: number): number => {
      const [rs, gs, bs] = [r, g, b].map((c) => {
        c = c / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
    },

    // Calculate contrast ratio between two colors
    getContrastRatio: (
      rgb1: [number, number, number],
      rgb2: [number, number, number]
    ): number => {
      const l1 = accessibility.color.getLuminance(...rgb1);
      const l2 = accessibility.color.getLuminance(...rgb2);
      const lighter = Math.max(l1, l2);
      const darker = Math.min(l1, l2);
      return (lighter + 0.05) / (darker + 0.05);
    },

    // Check if color combination meets WCAG requirements
    meetsWCAG: (
      foreground: [number, number, number],
      background: [number, number, number],
      level: "AA" | "AAA" = "AA",
      isLargeText: boolean = false
    ): boolean => {
      const ratio = accessibility.color.getContrastRatio(
        foreground,
        background
      );
      const required =
        level === "AAA"
          ? isLargeText
            ? accessibility.contrastRatios.largeEnhanced
            : accessibility.contrastRatios.enhanced
          : isLargeText
          ? accessibility.contrastRatios.large
          : accessibility.contrastRatios.normal;

      return ratio >= required;
    },
  },

  // Text and content utilities
  text: {
    // Calculate reading time estimate
    getReadingTime: (text: string, wordsPerMinute: number = 200): number => {
      const words = text.trim().split(/\s+/).length;
      return Math.ceil(words / wordsPerMinute);
    },

    // Truncate text while preserving word boundaries
    truncate: (
      text: string,
      maxLength: number,
      suffix: string = "..."
    ): string => {
      if (text.length <= maxLength) return text;

      const truncated = text.substring(0, maxLength - suffix.length);
      const lastSpace = truncated.lastIndexOf(" ");

      return (
        (lastSpace > 0 ? truncated.substring(0, lastSpace) : truncated) + suffix
      );
    },

    // Convert text to kebab-case for IDs
    toKebabCase: (text: string): string => {
      return text
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
    },
  },
};

// Type definitions for accessibility
export type ContrastLevel = "AA" | "AAA";
export type AriaRole = keyof typeof accessibility.roles;
export type KeyboardKey = keyof typeof accessibility.keys;
export type AnnouncementPriority = "polite" | "assertive";

// Accessibility context type
export interface AccessibilityContextType {
  isKeyboardUser: boolean;
  announcements: string[];
  preferences: {
    highContrast: boolean;
    reducedMotion: boolean;
    darkMode: boolean;
    textScale: number;
  };
  announce: (message: string, priority?: AnnouncementPriority) => void;
}
