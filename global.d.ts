// global.d.ts
interface Window {
  Telegram?: {
    WebApp: {
      expand: () => void;
      setHeaderColor: (colorType: "bg_color" | "secondary_bg_color", color: string) => void;
      onEvent: (event: string, callback: () => void) => void;
      offEvent: (event: string) => void;
      themeParams: {
        bg_color?: string;
        secondary_bg_color?: string;
        text_color?: string;
        hint_color?: string;
        link_color?: string;
        button_color?: string;
        button_text_color?: string;
      };
    };
  };
}
