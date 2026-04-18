"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { EditorialHero } from "./editorial-hero";
import { PersonaChip } from "./entry-popup/PersonaChip";
import { readCurrentPersona } from "@/lib/popup/use-entry-popup";
import { usePopup } from "@/lib/popup/popup-context";
import type { PersonaSlug } from "@/lib/popup/types";

type Props = {
  locale: "tr" | "en";
};

export function HomeHeroSection({ locale }: Props) {
  const tHero = useTranslations("home.hero");
  const tCommon = useTranslations("common");
  const { open, openPopup } = usePopup();
  const [persona, setPersona] = React.useState<PersonaSlug | null>(null);

  React.useEffect(() => {
    setPersona(readCurrentPersona());
  }, [open]);

  const editorialKey = persona ? `personas.${persona}.editorial` : "editorial";
  const supportKey = persona ? `personas.${persona}.support` : "support";

  return (
    <EditorialHero
      eyebrow={tHero("eyebrow")}
      headlineBefore={tHero(`${editorialKey}.before`)}
      headlineEmphasisA={tHero(`${editorialKey}.emphasisA`)}
      headlineMiddle={tHero(`${editorialKey}.middle`)}
      headlineEmphasisB={tHero(`${editorialKey}.emphasisB`)}
      headlineAfter={tHero(`${editorialKey}.after`)}
      supportingCopy={tHero(supportKey)}
      ctaLabel={tCommon("cta.bookConsultation")}
      secondaryCtaLabel={tCommon("cta.viewServices")}
      secondaryCtaHref={`/${locale}/hizmetler`}
      personaChip={
        persona ? (
          <PersonaChip persona={persona} onReopen={openPopup} />
        ) : null
      }
      id="section-hero"
      navLabel={locale === "tr" ? "Başlangıç" : "Start"}
    />
  );
}
