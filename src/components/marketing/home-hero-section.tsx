"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { EditorialHero } from "./editorial-hero";
import { EntryPopup } from "./entry-popup/EntryPopup";
import { PersonaChip } from "./entry-popup/PersonaChip";
import { readCurrentPersona, useEntryPopup } from "@/lib/popup/use-entry-popup";
import type { PersonaSlug } from "@/lib/popup/types";

type Props = {
  locale: "tr" | "en";
};

export function HomeHeroSection({ locale }: Props) {
  const tHero = useTranslations("home.hero");
  const tCommon = useTranslations("common");
  const popup = useEntryPopup();
  const [persona, setPersona] = React.useState<PersonaSlug | null>(null);
  // Incremented on chip-triggered reopen — forces EntryPopup remount (state reset)
  const [reopenKey, setReopenKey] = React.useState(0);

  // Read persona from cookie; re-read whenever popup open state changes
  React.useEffect(() => {
    setPersona(readCurrentPersona());
  }, [popup.open]);

  const handleChipReopen = React.useCallback(() => {
    setReopenKey((n) => n + 1);
    popup.forceOpen();
  }, [popup]);

  // Persona present → persona-specific keys; otherwise → default keys
  const editorialKey = persona ? `personas.${persona}.editorial` : "editorial";
  const supportKey = persona ? `personas.${persona}.support` : "support";

  return (
    <>
      <EditorialHero
        eyebrow={tHero("eyebrow")}
        headlineBefore={tHero(`${editorialKey}.before`)}
        headlineEmphasisA={tHero(`${editorialKey}.emphasisA`)}
        headlineMiddle={tHero(`${editorialKey}.middle`)}
        headlineEmphasisB={tHero(`${editorialKey}.emphasisB`)}
        headlineAfter={tHero(`${editorialKey}.after`)}
        supportingCopy={tHero(supportKey)}
        ctaLabel={tCommon("cta.bookConsultation")}
        ctaHref={`/${locale}/iletisim`}
        secondaryCtaLabel={tCommon("cta.viewServices")}
        secondaryCtaHref={`/${locale}/hizmetler`}
        personaChip={
          persona ? (
            <PersonaChip persona={persona} onReopen={handleChipReopen} />
          ) : null
        }
      />
      <EntryPopup key={reopenKey} open={popup.open} onClose={(_outcome) => popup.close()} />
    </>
  );
}
