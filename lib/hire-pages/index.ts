import type { Service } from "../services";
import fullStackPage from "./hire-full-stack-developer-india";
import backendPage from "./hire-backend-developer-india";
import frontendPage from "./hire-frontend-developer-india";
import nodejsPage from "./hire-nodejs-developer-india";
import typescriptPage from "./hire-typescript-developer-india";
import javascriptPage from "./hire-javascript-developer-india";
import angularPage from "./hire-angular-developer-india";
import reactNativePage from "./hire-react-native-developer-india";
import electronPage from "./hire-electron-developer-india";
import awsPage from "./hire-aws-developer-india";
import aiPage from "./hire-ai-developer-india";
import blockchainPage from "./hire-blockchain-developer-india";
import dedicatedPage from "./hire-dedicated-developer-india";
import remotePage from "./hire-remote-developer-india";
import offshorePage from "./hire-offshore-developer-india";
import cppPage from "./hire-cpp-developer-india";
import vuejsPage from "./hire-vuejs-developer-india";
import mobileAppPage from "./hire-mobile-app-developer-india";
import flutterPage from "./hire-flutter-developer-india";
import androidPage from "./hire-android-developer-india";
import iosPage from "./hire-ios-developer-india";
import kotlinPage from "./hire-kotlin-developer-india";
import devopsEngPage from "./hire-devops-engineer-india";
import qaEngPage from "./hire-qa-engineer-india";
import shopifyPage from "./hire-shopify-developer-india";

/**
 * Hire pages beyond the original three, one file per page.
 * Layouts rotate theme, "What I do", "Why me" and process styles on different
 * cycles (4, 3, 3 and 2), so neighbouring pages never look the same.
 */
export const HIRE_PAGES: Service[] = [
  {
    ...fullStackPage,
    layout: {
      theme: "mint",
      duties: "list",
      why: "numbered",
      process: "timeline",
    },
  },
  {
    ...backendPage,
    layout: { theme: "sky", duties: "bento", why: "cards", process: "row" },
  },
  {
    ...frontendPage,
    layout: {
      theme: "lilac",
      duties: "grid",
      why: "split",
      process: "timeline",
    },
  },
  {
    ...nodejsPage,
    layout: { theme: "peach", duties: "list", why: "numbered", process: "row" },
  },
  {
    ...typescriptPage,
    layout: {
      theme: "mint",
      duties: "bento",
      why: "cards",
      process: "timeline",
    },
  },
  {
    ...javascriptPage,
    layout: { theme: "sky", duties: "grid", why: "split", process: "row" },
  },
  {
    ...angularPage,
    layout: {
      theme: "lilac",
      duties: "list",
      why: "numbered",
      process: "timeline",
    },
  },
  {
    ...reactNativePage,
    layout: { theme: "peach", duties: "bento", why: "cards", process: "row" },
  },
  {
    ...electronPage,
    layout: {
      theme: "mint",
      duties: "grid",
      why: "split",
      process: "timeline",
    },
  },
  {
    ...awsPage,
    layout: { theme: "sky", duties: "list", why: "numbered", process: "row" },
  },
  {
    ...aiPage,
    layout: {
      theme: "lilac",
      duties: "bento",
      why: "cards",
      process: "timeline",
    },
  },
  {
    ...blockchainPage,
    layout: { theme: "peach", duties: "grid", why: "split", process: "row" },
  },
  {
    ...dedicatedPage,
    layout: {
      theme: "mint",
      duties: "list",
      why: "numbered",
      process: "timeline",
    },
  },
  {
    ...remotePage,
    layout: { theme: "sky", duties: "bento", why: "cards", process: "row" },
  },
  {
    ...offshorePage,
    layout: {
      theme: "lilac",
      duties: "grid",
      why: "split",
      process: "timeline",
    },
  },
  {
    ...cppPage,
    layout: { theme: "peach", duties: "list", why: "numbered", process: "row" },
  },
  {
    ...vuejsPage,
    layout: {
      theme: "mint",
      duties: "bento",
      why: "cards",
      process: "timeline",
    },
  },
  {
    ...mobileAppPage,
    layout: { theme: "sky", duties: "grid", why: "split", process: "row" },
  },
  {
    ...flutterPage,
    layout: {
      theme: "lilac",
      duties: "list",
      why: "numbered",
      process: "timeline",
    },
  },
  {
    ...androidPage,
    layout: { theme: "peach", duties: "bento", why: "cards", process: "row" },
  },
  {
    ...iosPage,
    layout: {
      theme: "mint",
      duties: "grid",
      why: "split",
      process: "timeline",
    },
  },
  {
    ...kotlinPage,
    layout: { theme: "sky", duties: "list", why: "numbered", process: "row" },
  },
  {
    ...devopsEngPage,
    layout: {
      theme: "lilac",
      duties: "grid",
      why: "split",
      process: "timeline",
    },
  },
  {
    ...qaEngPage,
    layout: { theme: "peach", duties: "list", why: "numbered", process: "row" },
  },
  {
    ...shopifyPage,
    layout: {
      theme: "mint",
      duties: "bento",
      why: "cards",
      process: "timeline",
    },
  },
];
