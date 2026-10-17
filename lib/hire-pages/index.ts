import type { Service } from "../services";
import fullStack from "./hire-full-stack-developer-india";
import backend from "./hire-backend-developer-india";
import frontend from "./hire-frontend-developer-india";
import nodejs from "./hire-nodejs-developer-india";
import typescript from "./hire-typescript-developer-india";
import javascript from "./hire-javascript-developer-india";
import angular from "./hire-angular-developer-india";
import reactNative from "./hire-react-native-developer-india";
import electron from "./hire-electron-developer-india";
import aws from "./hire-aws-developer-india";
import ai from "./hire-ai-developer-india";
import blockchain from "./hire-blockchain-developer-india";
import dedicated from "./hire-dedicated-developer-india";
import remote from "./hire-remote-developer-india";
import offshore from "./hire-offshore-developer-india";

/**
 * Hire pages beyond the original three, one file per page.
 * Layouts rotate theme, "What I do", "Why me" and process styles on different
 * cycles (4, 3, 3 and 2), so neighbouring pages never look the same.
 */
export const HIRE_PAGES: Service[] = [
  {
    ...fullStack,
    layout: {
      theme: "mint",
      duties: "list",
      why: "numbered",
      process: "timeline",
    },
  },
  {
    ...backend,
    layout: { theme: "sky", duties: "bento", why: "cards", process: "row" },
  },
  {
    ...frontend,
    layout: {
      theme: "lilac",
      duties: "grid",
      why: "split",
      process: "timeline",
    },
  },
  {
    ...nodejs,
    layout: { theme: "peach", duties: "list", why: "numbered", process: "row" },
  },
  {
    ...typescript,
    layout: {
      theme: "mint",
      duties: "bento",
      why: "cards",
      process: "timeline",
    },
  },
  {
    ...javascript,
    layout: { theme: "sky", duties: "grid", why: "split", process: "row" },
  },
  {
    ...angular,
    layout: {
      theme: "lilac",
      duties: "list",
      why: "numbered",
      process: "timeline",
    },
  },
  {
    ...reactNative,
    layout: { theme: "peach", duties: "bento", why: "cards", process: "row" },
  },
  {
    ...electron,
    layout: {
      theme: "mint",
      duties: "grid",
      why: "split",
      process: "timeline",
    },
  },
  {
    ...aws,
    layout: { theme: "sky", duties: "list", why: "numbered", process: "row" },
  },
  {
    ...ai,
    layout: {
      theme: "lilac",
      duties: "bento",
      why: "cards",
      process: "timeline",
    },
  },
  {
    ...blockchain,
    layout: { theme: "peach", duties: "grid", why: "split", process: "row" },
  },
  {
    ...dedicated,
    layout: {
      theme: "mint",
      duties: "list",
      why: "numbered",
      process: "timeline",
    },
  },
  {
    ...remote,
    layout: { theme: "sky", duties: "bento", why: "cards", process: "row" },
  },
  {
    ...offshore,
    layout: {
      theme: "lilac",
      duties: "grid",
      why: "split",
      process: "timeline",
    },
  },
];
