import { useCallback, useEffect, useState } from "react";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export type ValueItem = { id: string; icon: string; title: string; text: string };
export type Leader = {
  id: string;
  icon: string;
  name: string;
  role: string;
  bio: string;
  image?: string;
};
export type Ministry = { id: string; icon: string; title: string; text: string; items: string };
export type EventItem = {
  id: string;
  title: string;
  date: string;
  location: string;
  time: string;
  details: string;
  featured: boolean;
};
export type Sermon = {
  id: string;
  title: string;
  text: string;
  category: string;
  link: string;
};
export type GalleryItem = {
  id: string;
  icon: string;
  caption: string;
  category: string;
  image: string;
};
export type Testimony = { id: string; text: string; author: string };
export type NewsItem = { id: string; date: string; title: string; text: string };

export type SiteContent = {
  settings: {
    siteName: string;
    subtitle: string;
    verseText: string;
    verseRef: string;
    adminUsername: string;
    adminPassword: string;
    whatsapp: string;
    flutterwaveKey: string;
    currency: string;
    momoCode: string;
    bankName: string;
    bankAccount: string;
    address: string;
    phone: string;
    email: string;
    website: string;
    hours: string;
    mapEmbed: string;
    facebook: string;
    youtube: string;
    instagram: string;
    tiktok: string;
  };
  about: { intro: string; vision: string; mission: string };
  values: ValueItem[];
  leaders: Leader[];
  ministries: Ministry[];
  events: EventItem[];
  sermons: Sermon[];
  gallery: GalleryItem[];
  testimonies: Testimony[];
  news: NewsItem[];
};

export type Member = {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  interest: string;
  date: string;
};
export type Message = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
};
export type Prayer = { id: string; name: string; email: string; request: string; date: string };
export type Subscriber = { id: string; email: string; date: string };
export type Donation = {
  id: string;
  name: string;
  email: string;
  amount: number;
  currency: string;
  reference: string;
  status: string;
  date: string;
};

/* ------------------------------------------------------------------ */
/* Defaults                                                            */
/* ------------------------------------------------------------------ */

export const uid = () => Math.random().toString(36).slice(2, 10);

export const defaultContent: SiteContent = {
  settings: {
    siteName: "FAMILY IMBUTO Z'AGAKIZA",
    subtitle:
      "Spreading the good news of Jesus Christ, helping the needy, and building lives grounded in God.",
    verseText: "\u201cFor the Son of Man came to seek and to save the lost.\u201d",
    verseRef: "Luke 19:10",
    adminUsername: "admin",
    adminPassword: "123456",
    whatsapp: "250727777791",
    flutterwaveKey: "",
    currency: "RWF",
    momoCode: "*182*8*1*123456#",
    bankName: "Bank of Kigali",
    bankAccount: "00000-00000000-00",
    address: "Kigali, Rwanda",
    phone: "+250727777791",
    email: "familyimbutozagakiza@gmail.com",
    website: "www.familyimbuto.org",
    hours: "Monday \u2013 Friday: 08:00 \u2013 17:00",
    mapEmbed: "https://www.google.com/maps?q=Kigali,Rwanda&output=embed",
    facebook: "#",
    youtube: "#",
    instagram: "#",
    tiktok: "#",
  },
  about: {
    intro:
      "FAMILY IMBUTO Z'AGAKIZA is a Christian organization established to spread the good news of Jesus Christ, support the poor and vulnerable, visit the sick, orphans, and widows, and help people recover from drug addiction.",
    vision: "To see all people come to know Christ and live a full life in salvation.",
    mission:
      "Proclaim the good news of Jesus Christ\nPray and equip people with God's word\nEngage in acts of love and compassion\nSupport youth and families\nBuild fellowship among believers",
  },
  values: [
    { id: uid(), icon: "\u271D\uFE0F", title: "Faith", text: "Trusting God in everything" },
    { id: uid(), icon: "\u2764\uFE0F", title: "Love", text: "Loving God and people" },
    { id: uid(), icon: "\u2B50", title: "Holiness", text: "Living set apart" },
    { id: uid(), icon: "\uD83E\uDD1D", title: "Service", text: "Serving others" },
    { id: uid(), icon: "\uD83D\uDC65", title: "Unity", text: "One family in Christ" },
    { id: uid(), icon: "\u2713", title: "Integrity", text: "Honesty in all things" },
  ],
  leaders: [
    {
      id: uid(),
      icon: "\uD83D\uDC64",
      name: "NIYITANGA FABRICE",
      role: "Founder & President",
      bio: "Founder and President of Family Imbuto Z'Agakiza",
      image: "",
    },
    {
      id: uid(),
      icon: "\uD83D\uDC64",
      name: "S. MUHOZA JEANCHRISOSTOME",
      role: "Vice President",
      bio: "",
      image: "",
    },
    {
      id: uid(),
      icon: "\uD83D\uDCCB",
      name: "Secretariat",
      role: "Secretaries",
      bio: "",
      image: "",
    },
    {
      id: uid(),
      icon: "\uD83D\uDCB0",
      name: "Finance Department",
      role: "Finance Officers",
      bio: "",
      image: "",
    },
    {
      id: uid(),
      icon: "\uD83D\uDCE2",
      name: "Evangelism Team",
      role: "Evangelists",
      bio: "",
      image: "",
    },
  ],
  ministries: [
    {
      id: uid(),
      icon: "\uD83D\uDCE2",
      title: "Evangelism",
      text: "Preaching the Gospel in churches, streets, and crusades.",
      items: "",
    },
    {
      id: uid(),
      icon: "\uD83D\uDE4F",
      title: "Prayer Ministries",
      text: "",
      items: "Night vigils\nPrayers for the sick\nPrayers for families\nPrayers for youth",
    },
    {
      id: uid(),
      icon: "\uD83C\uDFB5",
      title: "Worship Ministries",
      text: "Worship and praise songs to honor God.",
      items: "",
    },
    {
      id: uid(),
      icon: "\uD83D\uDC9D",
      title: "Compassion & Outreach",
      text: "",
      items: "Visiting orphans\nVisiting the sick\nSupporting the needy\nProviding school supplies",
    },
    {
      id: uid(),
      icon: "\uD83D\uDC65",
      title: "Youth Ministries",
      text: "",
      items: "Youth mentorship\nFighting substance abuse\nDeveloping talents",
    },
  ],
  events: [
    {
      id: uid(),
      title: "JESUS IS REAL GOSPEL CRUSADE",
      date: "16 August 2026",
      location: "Kigali Great Hotel, Kiyovu",
      time: "10:00 AM",
      details: "Guest Preachers \u2022 Worship Team",
      featured: true,
    },
  ],
  sermons: [
    {
      id: uid(),
      title: "Jeremiah 1:5",
      text: "Life and God's Purpose",
      category: "video",
      link: "",
    },
  ],
  gallery: [
    { id: uid(), icon: "\uD83D\uDCF8", caption: "Crusade Event", category: "crusades", image: "" },
    { id: uid(), icon: "\uD83D\uDE4F", caption: "Prayer Meeting", category: "prayer", image: "" },
    { id: uid(), icon: "\uD83C\uDFB5", caption: "Worship Service", category: "worship", image: "" },
    { id: uid(), icon: "\uD83D\uDC9D", caption: "Charity Work", category: "charity", image: "" },
  ],
  testimonies: [
    {
      id: uid(),
      text: "After joining the prayer sessions of Family Imbuto Z'Agakiza, God healed my illness and granted me peace.",
      author: "Member Testimony",
    },
  ],
  news: [
    {
      id: uid(),
      date: "Aug 2026",
      title: "Conference Announcement",
      text: "The annual leadership conference is approaching soon.",
    },
    {
      id: uid(),
      date: "Jul 2026",
      title: "New Prayer Program",
      text: "Weekly prayer sessions have launched this month.",
    },
    {
      id: uid(),
      date: "Jul 2026",
      title: "Mission Report",
      text: "Outcomes from our recent outreach mission.",
    },
  ],
};

export const SERMON_CATEGORIES = [
  { key: "all", label: "All" },
  { key: "video", label: "Video Sermons" },
  { key: "audio", label: "Audio Sermons" },
  { key: "written", label: "Written Sermons" },
  { key: "bible", label: "Bible Studies" },
];

export const GALLERY_CATEGORIES = [
  { key: "all", label: "All" },
  { key: "crusades", label: "Crusades" },
  { key: "prayer", label: "Prayer Meetings" },
  { key: "worship", label: "Worship" },
  { key: "charity", label: "Charity" },
  { key: "conferences", label: "Conferences" },
  { key: "youth", label: "Youth Events" },
];

/* ------------------------------------------------------------------ */
/* Storage                                                             */
/* ------------------------------------------------------------------ */

const CONTENT_KEY = "fiz_content";

function mergeContent(saved: Partial<SiteContent> | null): SiteContent {
  if (!saved) return defaultContent;
  return {
    ...defaultContent,
    ...saved,
    settings: { ...defaultContent.settings, ...(saved.settings ?? {}) },
    about: { ...defaultContent.about, ...(saved.about ?? {}) },
  };
}

export function readContent(): SiteContent {
  if (typeof window === "undefined") return defaultContent;
  try {
    const raw = window.localStorage.getItem(CONTENT_KEY);
    return mergeContent(raw ? (JSON.parse(raw) as SiteContent) : null);
  } catch {
    return defaultContent;
  }
}

export function writeContent(content: SiteContent) {
  window.localStorage.setItem(CONTENT_KEY, JSON.stringify(content));
  window.dispatchEvent(new Event("fiz:content"));
}

/** Reads content on the client after hydration (SSR-safe). */
export function useSiteContent() {
  const [content, setContent] = useState<SiteContent>(defaultContent);

  useEffect(() => {
    setContent(readContent());
    const sync = () => setContent(readContent());
    window.addEventListener("fiz:content", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("fiz:content", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const save = useCallback((next: SiteContent) => {
    writeContent(next);
    setContent(next);
  }, []);

  return { content, save };
}

/* --- generic collection storage for form submissions --------------- */

export const STORE_KEYS = {
  members: "fiz_members",
  messages: "fiz_messages",
  prayers: "fiz_prayers",
  newsletter: "fiz_newsletter",
  donations: "fiz_donations",
} as const;

export type StoreKey = keyof typeof STORE_KEYS;

export function readStore<T>(key: StoreKey): T[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(STORE_KEYS[key]) ?? "[]") as T[];
  } catch {
    return [];
  }
}

export function writeStore<T>(key: StoreKey, rows: T[]) {
  window.localStorage.setItem(STORE_KEYS[key], JSON.stringify(rows));
  window.dispatchEvent(new Event("fiz:store"));
}

export function addToStore<T extends { id: string }>(key: StoreKey, row: T) {
  const rows = readStore<T>(key);
  rows.unshift(row);
  writeStore(key, rows);
}

export function useStore<T extends { id: string }>(key: StoreKey) {
  const [rows, setRows] = useState<T[]>([]);

  useEffect(() => {
    const sync = () => setRows(readStore<T>(key));
    sync();
    window.addEventListener("fiz:store", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("fiz:store", sync);
      window.removeEventListener("storage", sync);
    };
  }, [key]);

  const add = useCallback(
    (row: T) => {
      const next = [row, ...readStore<T>(key)];
      writeStore(key, next);
      setRows(next);
    },
    [key],
  );

  const remove = useCallback(
    (id: string) => {
      const next = readStore<T>(key).filter((r) => r.id !== id);
      writeStore(key, next);
      setRows(next);
    },
    [key],
  );

  const clear = useCallback(() => {
    writeStore(key, []);
    setRows([]);
  }, [key]);

  return { rows, add, remove, clear };
}

export const now = () => new Date().toLocaleString();
