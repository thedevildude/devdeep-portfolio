import { SERVICES, type Service } from "./services";

/**
 * How the hire pages are grouped in the footer. Slugs without a page yet are
 * skipped, and a page missing from every group lands in the last one, so new
 * pages always show up somewhere.
 */
const GROUPS: { title: string; slugs: string[] }[] = [
  {
    title: "Ways to hire me",
    slugs: [
      "hire-software-engineer-india",
      "hire-forward-deployed-engineer-india",
      "hire-full-stack-developer-india",
      "hire-dedicated-developer-india",
      "hire-remote-developer-india",
      "hire-offshore-developer-india",
    ],
  },
  {
    title: "Web & frontend",
    slugs: [
      "hire-react-nextjs-developer-india",
      "hire-frontend-developer-india",
      "hire-javascript-developer-india",
      "hire-typescript-developer-india",
      "hire-angular-developer-india",
      "hire-vuejs-developer-india",
    ],
  },
  {
    title: "Backend",
    slugs: [
      "hire-backend-developer-india",
      "hire-nodejs-developer-india",
      "hire-python-developer-india",
      "hire-java-developer-india",
      "hire-dotnet-developer-india",
      "hire-golang-developer-india",
      "hire-ruby-on-rails-developer-india",
      "hire-php-developer-india",
      "hire-laravel-developer-india",
      "hire-cpp-developer-india",
    ],
  },
  {
    title: "Mobile & desktop",
    slugs: [
      "hire-mobile-app-developer-india",
      "hire-react-native-developer-india",
      "hire-flutter-developer-india",
      "hire-android-developer-india",
      "hire-ios-developer-india",
      "hire-kotlin-developer-india",
      "hire-electron-developer-india",
      "hire-unity-developer-india",
    ],
  },
  {
    title: "AI, data & cloud",
    slugs: [
      "hire-ai-developer-india",
      "hire-machine-learning-engineer-india",
      "hire-data-engineer-india",
      "hire-data-scientist-india",
      "hire-aws-developer-india",
      "hire-devops-engineer-india",
      "hire-qa-engineer-india",
      "hire-blockchain-developer-india",
    ],
  },
  {
    title: "Commerce & CMS",
    slugs: [
      "hire-shopify-developer-india",
      "hire-woocommerce-developer-india",
      "hire-wordpress-developer-india",
      "hire-magento-developer-india",
    ],
  },
];

export const getHireGroups = (): { title: string; pages: Service[] }[] => {
  const bySlug = new Map(SERVICES.map((s) => [s.slug, s]));
  const listed = new Set(GROUPS.flatMap((g) => g.slugs));
  const unlisted = SERVICES.filter((s) => !listed.has(s.slug));
  return GROUPS.map((g, i) => ({
    title: g.title,
    pages: [
      ...g.slugs.flatMap((slug) => bySlug.get(slug) ?? []),
      ...(i === GROUPS.length - 1 ? unlisted : []),
    ],
  })).filter((g) => g.pages.length > 0);
};
