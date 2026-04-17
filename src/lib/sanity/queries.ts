export const pillarDetailQuery = `
  *[_type == "pillar" && slug.current.{$locale} == $slug][0] {
    "name": name.{$locale},
    "tagline": tagline.{$locale},
    "heroDescription": heroDescription.{$locale}
  }
`;

export const packageListQuery = `
  *[_type == "package" && active == true] | order(_createdAt desc) {
    "title": title.{$locale},
    "slug": slug.current.{$locale},
    pillar,
    "outcome": outcome.{$locale},
    durationWeeks,
    priceTRY,
    priceEUR,
    priceUSD
  }
`;

export const caseStudyListQuery = `
  *[_type == "caseStudy" && ($problemType == null || problemType == $problemType)] | order(publishedAt desc)[0...$limit] {
    "title": title.{$locale},
    "slug": slug.current.{$locale},
    clientName,
    clientSector,
    problemType,
    pillar,
    "lead": lead.{$locale}
  }
`;
