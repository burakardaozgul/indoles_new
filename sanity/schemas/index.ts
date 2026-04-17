import { pillarSchema } from "./pillar";
import { packageSchema } from "./package";
import { caseStudySchema } from "./caseStudy";
import { articleSchema } from "./article";
import { consultantProfileSchema } from "./consultantProfile";
import { localeString, localeSlug, localeRichText } from "./objects";

export const schemaTypes = [
  // Objects
  localeString,
  localeSlug,
  localeRichText,
  // Documents
  pillarSchema,
  packageSchema,
  caseStudySchema,
  articleSchema,
  consultantProfileSchema,
];
