export type PersonaSlug = "donusum-teknoloji" | "buyume-pazarlar";

export type Pillar = "growth" | "transform" | "build";

export type ServiceSlug =
  | "performance-marketing"
  | "cro"
  | "brand-strategy"
  | "ecommerce"
  | "uiux-design"
  | "ai-consulting"
  | "digital-transformation"
  | "business-automation"
  | "business-intelligence"
  | "business-engineering"
  | "custom-software"
  | "tech-infrastructure";

export type ProblemSlug = string;

export type ProblemDef = {
  slug: ProblemSlug;
  persona: PersonaSlug;
  i18nKey: string;
  services: ServiceSlug[];
  pillars: Pillar[];
  weight: number;
};

export type PopupStage =
  | "stage1"
  | "stage2"
  | "stage3"
  | "booking"
  | "contact"
  | "success-booking"
  | "success-contact"
  | "existing-booking";

export type PopupSubmissionType = "booking" | "contact" | "dismissed" | "skipped";

export type PopupLeadForm = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  company: string;
  title: string;
  kvkkConsent: boolean;
};

export type PopupState = {
  stage: PopupStage;
  persona: PersonaSlug | null;
  problems: ProblemSlug[];
  lead?: PopupLeadForm;
};

export type PopupCookieState = {
  version: 1;
  lastShownAt: string;
  outcome: "completed" | "skipped" | "dismissed";
  persona: PersonaSlug | null;
  problems: ProblemSlug[];
  expiresAt: string;
  submissionType?: "booking" | "contact";
  bookingSlot?: { date: string; time: string };
};
