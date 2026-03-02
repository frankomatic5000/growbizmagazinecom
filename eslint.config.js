import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({ baseDirectory: __dirname });

const eslintConfig = [
  {
    ignores: [
      "src/_lovable_pages/**",
      "src/components/admin/**",
      "src/components/magazine/**",
      "src/components/ArticlePreview.tsx",
      "src/components/WavyBackground.tsx",
      "src/components/BlogHero.tsx",
      "src/components/CenteredContent.tsx",
      "src/components/GridContainer.tsx",
      "src/components/Header.tsx",
      "src/components/Section.tsx",
      "src/integrations/**",
      "src/hooks/**",
      "src/data/**",
      "src/types/**",
      "src/App.tsx",
      "src/main.tsx",
      "src/components/ui/accordion.tsx",
      "src/components/ui/alert.tsx",
      "src/components/ui/aspect-ratio.tsx",
      "src/components/ui/avatar.tsx",
      "src/components/ui/breadcrumb.tsx",
      "src/components/ui/calendar.tsx",
      "src/components/ui/carousel.tsx",
      "src/components/ui/chart.tsx",
      "src/components/ui/checkbox.tsx",
      "src/components/ui/collapsible.tsx",
      "src/components/ui/command.tsx",
      "src/components/ui/context-menu.tsx",
      "src/components/ui/drawer.tsx",
      "src/components/ui/dropdown-menu.tsx",
      "src/components/ui/hover-card.tsx",
      "src/components/ui/input-otp.tsx",
      "src/components/ui/menubar.tsx",
      "src/components/ui/navigation-menu.tsx",
      "src/components/ui/pagination.tsx",
      "src/components/ui/popover.tsx",
      "src/components/ui/progress.tsx",
      "src/components/ui/radio-group.tsx",
      "src/components/ui/resizable.tsx",
      "src/components/ui/scroll-area.tsx",
      "src/components/ui/select.tsx",
      "src/components/ui/sidebar.tsx",
      "src/components/ui/slider.tsx",
      "src/components/ui/switch.tsx",
      "src/components/ui/table.tsx",
      "src/components/ui/tabs.tsx",
      "src/components/ui/toggle-group.tsx",
      "src/components/ui/use-toast.ts",
    ],
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/ban-ts-comment": "off",
      "react-hooks/exhaustive-deps": "warn",
      "@next/next/no-img-element": "warn",
    },
  },
];

export default eslintConfig;
