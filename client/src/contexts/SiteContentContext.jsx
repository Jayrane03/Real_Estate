import { createContext, useContext, useEffect, useState } from "react";
import api from "../lib/api.js";
import { cover } from "../lib/site.js";

export const DEFAULT_SITE_CONTENT = {
  brandName: "Aurelia Residences",
  brandDescriptor: "RESIDENCES & TOWERS",
  headline: "Space to become.",
  subheadline: "A private world above the Arabian Sea.",
  heroImage: cover,
  contactEmail: "concierge@aureliaresidences.com",
  phone: "+91 (022) 6982 4000",
  notice: {
    location: "Worli Sea Face, South Mumbai",
    registration: "MahaRERA: P51900028472",
    conciergeLabel: "Concierge",
  },
  navigation: {
    residences: "Residences",
    address: "The address",
    amenities: "Amenities",
    gallery: "Gallery",
    enquire: "Private enquiry",
  },
  hero: {
    eyebrow: "A NEW PERSPECTIVE ON WORLI",
    title: "Space to",
    highlight: "become.",
    description: "A private world above the Arabian Sea.",
    secondaryLine: "An address that feels entirely your own.",
    cta: "Discover the residences",
    coordinates: "19°00' N · 72°49' E",
    location: "WORLI · MUMBAI",
    counter: "01 — 03",
    collection: "THE WORLI COLLECTION",
    scrollLabel: "SCROLL TO EXPLORE ↓",
  },
  story: {
    index: "01 — A SENSE OF PLACE",
    eyebrow: "A RARER WAY TO LIVE",
    heading: "Above the rhythm.",
    highlight: "Within reach.",
    body: "At the edge of Worli Sea Face, the city opens up and the horizon takes over. Aurelia is a limited collection of residences designed around light, privacy, and the luxury of having room to breathe.",
    addressLabel: "THE ADDRESS",
    address: "Worli Sea Face Boulevard\nSouth Mumbai, Maharashtra",
    cta: "Explore the neighbourhood",
  },
  residences: {
    eyebrow: "THE PRIVATE COLLECTION",
    heading: "Distinctly",
    highlight: "Aurelia.",
    searchPlaceholder: "Search residences",
    cta: "Request the complete collection",
  },
  propertyDetail: {
    backLabel: "All residences",
    eyebrow: "THE RESIDENCE",
    heading: "A home that makes",
    highlight: "room for more.",
    amenitiesLabel: "RESIDENT PRIVILEGES",
    floorPlansLabel: "FLOOR PLANS",
    asideEyebrow: "A PRIVATE INTRODUCTION",
    asideHeading: "Experience it",
    asideHighlight: "for yourself.",
    asideDescription: "Speak with a senior director about availability, plans, and private viewings.",
    asideCta: "Arrange a private viewing",
    startingAtLabel: "INDICATIVE FROM",
  },
  gallery: {
    eyebrow: "THE AURELIA EXPERIENCE",
    heading: "Quietly exceptional.",
    highlight: "In every detail.",
    image: cover,
    linkLabel: "VIEW THE GALLERY ↗",
  },
  amenities: {
    index: "02 — PRIVATE BY DESIGN",
    eyebrow: "A WORLD OF YOUR OWN",
    heading: "Considered for",
    highlight: "the way you live.",
    items: [
      { number: "01", name: "Private residents' lounge" },
      { number: "02", name: "Sea-facing infinity pool" },
      { number: "03", name: "Landscaped sky gardens" },
      { number: "04", name: "Wellness & recovery suite" },
      { number: "05", name: "Concierge, at every hour" },
      { number: "06", name: "Valet & private arrival" },
    ],
  },
  contact: {
    eyebrow: "A PRIVATE CONVERSATION",
    heading: "Some things are",
    highlight: "better in person.",
    description: "Our senior client directors can arrange a discreet presentation, a private viewing, or simply answer your questions.",
    formEyebrow: "PRIVATE ENQUIRY",
    formHeading: "How may we reach you?",
    submitLabel: "Request a private conversation",
    successHeading: "Your enquiry is with us.",
    successMessage: "A senior director will be in touch shortly to arrange your private conversation.",
    privacyNote: "Your details are treated with discretion.",
  },
  footer: {
    address: "Worli Sea Face, South Mumbai",
    registration: "MahaRERA P51900028472",
  },
  seo: {
    title: "Aurelia Residences | Worli Sea Face",
    description: "A considered collection of private residences on the Worli Sea Face.",
    keywords: "luxury residences, Worli, Mumbai, Aurelia",
  },
};

const contentSections = [
  "notice",
  "navigation",
  "hero",
  "story",
  "residences",
  "propertyDetail",
  "gallery",
  "amenities",
  "contact",
  "footer",
  "seo",
];

const SiteContentContext = createContext({
  siteContent: DEFAULT_SITE_CONTENT,
  refresh: async () => {},
});

function mergeContent(data) {
  const content = { ...DEFAULT_SITE_CONTENT, ...data };
  for (const section of contentSections) {
    content[section] = {
      ...DEFAULT_SITE_CONTENT[section],
      ...(data[section] || {}),
    };
  }
  if (!content.amenities.items?.length) {
    content.amenities.items = DEFAULT_SITE_CONTENT.amenities.items;
  }
  return content;
}

export function SiteContentProvider({ children }) {
  const [siteContent, setSiteContent] = useState(DEFAULT_SITE_CONTENT);

  const refresh = async () => {
    try {
      const { data } = await api.get("/content");
      setSiteContent(mergeContent(data));
    } catch {
      setSiteContent(DEFAULT_SITE_CONTENT);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  return (
    <SiteContentContext.Provider value={{ siteContent, refresh }}>
      {children}
    </SiteContentContext.Provider>
  );
}

export function useSiteContent() {
  return useContext(SiteContentContext);
}