import { sendGAEvent } from "@next/third-parties/google";

type Params = Record<string, string | number | boolean | undefined>;

/** Single entry point for GA4 events. Never pass personal data (names, emails, message text). */
export const track = (name: string, params: Params = {}) => {
  if (typeof window === "undefined") return;
  sendGAEvent("event", name, params);
};
