import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";

import {
  GALLERY_CATEGORIES,
  SERMON_CATEGORIES,
  addToStore,
  now,
  uid,
  useSiteContent,
} from "@/lib/site-content";
import { payWithFlutterwave } from "@/lib/flutterwave";
import {
  syncMemberToSupabase,
  syncMessageToSupabase,
  syncPrayerToSupabase,
  syncSubscriberToSupabase,
  syncDonationToSupabase,
} from "@/lib/supabaseClient";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Family Imbuto Z'Agakiza | Fruits of Salvation Family" },
      {
        name: "description",
        content:
          "Family Imbuto Z'Agakiza spreads the gospel of Jesus Christ in Rwanda: crusades, prayer, youth mentorship, compassion outreach and support for the vulnerable.",
      },
      { property: "og:title", content: "Family Imbuto Z'Agakiza | Fruits of Salvation Family" },
      {
        property: "og:description",
        content:
          "Gospel crusades, prayer ministries, youth mentorship and compassion outreach in Kigali, Rwanda. Join the family, watch sermons or give online.",
      },
    ],
  }),
  component: HomePage,
});

const lines = (value: string) =>
  value
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

function HomePage() {
  const { content } = useSiteContent();
  const s = content.settings;

  const [menuOpen, setMenuOpen] = useState(false);
  const [sermonCat, setSermonCat] = useState("all");
  const [galleryCat, setGalleryCat] = useState("all");
  const [donateOpen, setDonateOpen] = useState(false);
  const [prayerOpen, setPrayerOpen] = useState(false);
  const [joinNote, setJoinNote] = useState("");
  const [contactNote, setContactNote] = useState("");
  const [newsNote, setNewsNote] = useState("");
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 300);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const nav: [string, string][] = [
    ["#home", "Home"],
    ["#about", "About Us"],
    ["#ministry", "Ministries"],
    ["#sermons", "Sermons"],
    ["#events", "Events"],
    ["#gallery", "Gallery"],
    ["#join", "Join Us"],
    ["#donate", "Donate"],
    ["#contact", "Contact"],
  ];

  const scrollTo = (hash: string) => {
    setMenuOpen(false);
    const el = document.querySelector(hash);
    if (el) window.scrollTo({ top: (el as HTMLElement).offsetTop - 70, behavior: "smooth" });
  };

  const handleJoin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const newMember = {
      id: uid(),
      name: String(f.get("name") ?? ""),
      email: String(f.get("email") ?? ""),
      phone: String(f.get("phone") ?? ""),
      location: String(f.get("location") ?? ""),
      interest: String(f.get("interest") ?? ""),
      date: now(),
    };
    addToStore("members", newMember);
    syncMemberToSupabase(newMember);
    e.currentTarget.reset();
    setJoinNote("Thank you! Your membership request has been received.");
  };

  const handleContact = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const newMessage = {
      id: uid(),
      name: String(f.get("name") ?? ""),
      email: String(f.get("email") ?? ""),
      subject: String(f.get("subject") ?? ""),
      message: String(f.get("message") ?? ""),
      date: now(),
    };
    addToStore("messages", newMessage);
    syncMessageToSupabase(newMessage);
    e.currentTarget.reset();
    setContactNote("Message sent. We will get back to you soon.");
  };

  const handlePrayer = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const newPrayer = {
      id: uid(),
      name: String(f.get("name") ?? ""),
      email: String(f.get("email") ?? ""),
      request: String(f.get("request") ?? ""),
      date: now(),
    };
    addToStore("prayers", newPrayer);
    syncPrayerToSupabase(newPrayer);
    setPrayerOpen(false);
    alert("Your prayer request has been sent. God bless you.");
  };

  const handleNewsletter = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const newSub = { id: uid(), email: String(f.get("email") ?? ""), date: now() };
    addToStore("newsletter", newSub);
    syncSubscriberToSupabase(newSub);
    e.currentTarget.reset();
    setNewsNote("Subscribed!");
  };

  const sermons =
    sermonCat === "all" ? content.sermons : content.sermons.filter((x) => x.category === sermonCat);
  const gallery =
    galleryCat === "all"
      ? content.gallery
      : content.gallery.filter((x) => x.category === galleryCat);

  return (
    <>
      <header className="site-header">
        <div className="container" style={{ position: "relative" }}>
          <a
            className="brand"
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              scrollTo("#home");
            }}
          >
            <span className="brand-mark">IZ</span>
            <span>
              <span className="brand-name">{s.siteName}</span>
              <br />
              <span className="brand-sub">Fruits of Salvation</span>
            </span>
          </a>
          <nav>
            <button
              className="menu-toggle"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Menu"
            >
              ☰
            </button>
            <ul className={menuOpen ? "nav-list open" : "nav-list"}>
              {nav.map(([hash, label]) => (
                <li key={hash}>
                  <a
                    href={hash}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollTo(hash);
                    }}
                  >
                    {label}
                  </a>
                </li>
              ))}
              <li>
                <Link to="/admin">Admin</Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section id="home" className="hero">
          <div className="container">
            <h1>{s.siteName}</h1>
            <p className="subtitle">{s.subtitle}</p>
            <div className="verse">
              <p className="verse-text">{s.verseText}</p>
              <p className="verse-ref">{s.verseRef}</p>
            </div>
            <div className="hero-buttons">
              <button className="btn btn-gold" onClick={() => scrollTo("#join")}>
                Join the Family
              </button>
              <button className="btn btn-ghost-light" onClick={() => setDonateOpen(true)}>
                Donate
              </button>
              <button className="btn btn-ghost-light" onClick={() => scrollTo("#sermons")}>
                Watch Sermons
              </button>
              <button className="btn btn-ghost-light" onClick={() => setPrayerOpen(true)}>
                Request Prayer
              </button>
            </div>
          </div>
        </section>

        {/* About */}
        <section id="about" className="section">
          <div className="container">
            <h2>Who We Are</h2>
            <p className="lead">{content.about.intro}</p>
            <div className="grid grid-2">
              <div className="card">
                <h3>Vision</h3>
                <p>{content.about.vision}</p>
              </div>
              <div className="card">
                <h3>Mission</h3>
                <ul>
                  {lines(content.about.mission).map((m) => (
                    <li key={m}>{m}</li>
                  ))}
                </ul>
              </div>
            </div>
            <h3 style={{ textAlign: "center", margin: "2.5rem 0 1.2rem", color: "var(--brand)" }}>
              Core Values
            </h3>
            <div className="grid grid-4">
              {content.values.map((v) => (
                <div className="card" key={v.id}>
                  <span className="card-icon">{v.icon}</span>
                  <h3>{v.title}</h3>
                  <p>{v.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Leadership */}
        <section id="leadership" className="section section-alt">
          <div className="container">
            <h2>Leadership</h2>
            <div className="grid grid-3">
              {content.leaders.map((l) => (
                <div className="card" key={l.id}>
                  {l.image ? (
                    <div
                      style={{
                        width: "100%",
                        height: 200,
                        borderRadius: "10px",
                        overflow: "hidden",
                        marginBottom: "1rem",
                        backgroundColor: "var(--surface-alt)",
                      }}
                    >
                      <img
                        src={l.image}
                        alt={l.name}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        loading="lazy"
                      />
                    </div>
                  ) : (
                    <span className="card-icon">{l.icon || "👤"}</span>
                  )}
                  <h3>{l.name}</h3>
                  <p className="role">{l.role}</p>
                  {l.bio ? <p>{l.bio}</p> : null}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Ministries */}
        <section id="ministry" className="section">
          <div className="container">
            <h2>Our Ministries</h2>
            <div className="grid grid-3">
              {content.ministries.map((m) => (
                <div className="card" key={m.id}>
                  <span className="card-icon">{m.icon}</span>
                  <h3>{m.title}</h3>
                  {m.text ? <p>{m.text}</p> : null}
                  {m.items ? (
                    <ul>
                      {lines(m.items).map((i) => (
                        <li key={i}>{i}</li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Events */}
        <section id="events" className="section section-alt">
          <div className="container">
            <h2>Programs & Events</h2>
            <div className="grid grid-3">
              {content.events.map((ev) => (
                <div className="card event-card" key={ev.id}>
                  {ev.featured ? <span className="badge">Upcoming</span> : null}
                  <h3>{ev.title}</h3>
                  <p>📅 {ev.date}</p>
                  <p>📍 {ev.location}</p>
                  <p>⏰ {ev.time}</p>
                  {ev.details ? <p>🎤 {ev.details}</p> : null}
                  <button
                    className="btn btn-primary btn-small"
                    style={{ marginTop: "1rem" }}
                    onClick={() => scrollTo("#join")}
                  >
                    Register
                  </button>
                </div>
              ))}
              {content.events.length === 0 ? (
                <p className="empty">No events published yet.</p>
              ) : null}
            </div>
          </div>
        </section>

        {/* Sermons */}
        <section id="sermons" className="section">
          <div className="container">
            <h2>Sermons</h2>
            <div className="chips">
              {SERMON_CATEGORIES.map((c) => (
                <button
                  key={c.key}
                  className={sermonCat === c.key ? "chip active" : "chip"}
                  onClick={() => setSermonCat(c.key)}
                >
                  {c.label}
                </button>
              ))}
            </div>
            <div className="grid grid-3">
              {sermons.map((sm) => (
                <div className="card" key={sm.id}>
                  <div className="tile-media">📹</div>
                  <h3>{sm.title}</h3>
                  <p>{sm.text}</p>
                  {sm.link ? (
                    <a
                      className="btn btn-outline btn-small"
                      style={{ marginTop: ".8rem" }}
                      href={sm.link}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Watch / Listen
                    </a>
                  ) : null}
                </div>
              ))}
              {sermons.length === 0 ? (
                <p className="empty">No sermons in this category yet.</p>
              ) : null}
            </div>
          </div>
        </section>

        {/* Gallery */}
        <section id="gallery" className="section section-alt">
          <div className="container">
            <h2>Gallery</h2>
            <div className="chips">
              {GALLERY_CATEGORIES.map((c) => (
                <button
                  key={c.key}
                  className={galleryCat === c.key ? "chip active" : "chip"}
                  onClick={() => setGalleryCat(c.key)}
                >
                  {c.label}
                </button>
              ))}
            </div>
            <div className="grid grid-4">
              {gallery.map((g) => (
                <div className="card" key={g.id}>
                  <div className="tile-media">
                    {g.image ? <img src={g.image} alt={g.caption} loading="lazy" /> : g.icon}
                  </div>
                  <p>{g.caption}</p>
                </div>
              ))}
              {gallery.length === 0 ? (
                <p className="empty">No photos in this category yet.</p>
              ) : null}
            </div>
          </div>
        </section>

        {/* Testimonies */}
        <section id="testimonies" className="section">
          <div className="container">
            <h2>Testimonies</h2>
            <div className="grid grid-3">
              {content.testimonies.map((t) => (
                <div className="card" key={t.id}>
                  <span className="card-icon">✨</span>
                  <p className="quote">“{t.text}”</p>
                  <p className="role" style={{ marginTop: ".7rem" }}>
                    — {t.author}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Join */}
        <section id="join" className="section section-alt">
          <div className="container">
            <h2>Join the Family</h2>
            <p className="lead">
              Become a member, join a ministry team, or simply let us know you would like to walk
              with us.
            </p>
            <form
              className="card"
              style={{ maxWidth: 640, margin: "0 auto" }}
              onSubmit={handleJoin}
            >
              <div className="field-grid">
                <div className="field">
                  <label htmlFor="j-name">Full name</label>
                  <input id="j-name" name="name" required />
                </div>
                <div className="field">
                  <label htmlFor="j-email">Email</label>
                  <input id="j-email" name="email" type="email" required />
                </div>
                <div className="field">
                  <label htmlFor="j-phone">Phone</label>
                  <input id="j-phone" name="phone" required />
                </div>
                <div className="field">
                  <label htmlFor="j-loc">Location</label>
                  <input id="j-loc" name="location" />
                </div>
              </div>
              <div className="field">
                <label htmlFor="j-int">Ministry of interest</label>
                <select id="j-int" name="interest" defaultValue="Evangelism">
                  <option>Evangelism</option>
                  <option>Prayer</option>
                  <option>Worship</option>
                  <option>Compassion & Outreach</option>
                  <option>Youth</option>
                </select>
              </div>
              <p className="form-note">{joinNote}</p>
              <button className="btn btn-primary btn-block" type="submit">
                Send request
              </button>
            </form>
          </div>
        </section>

        {/* Donate */}
        <section id="donate" className="section donate">
          <div className="container">
            <h2>Support the Ministry</h2>
            <p className="lead">
              Your support enables people to hear the gospel and receive practical life assistance.
            </p>
            <div className="grid grid-4">
              <div className="card">
                <span className="card-icon">📱</span>
                <h3>Mobile Money</h3>
                <p>MTN MoMo, Airtel Money</p>
                <span className="method-details">{s.momoCode}</span>
              </div>
              <div className="card">
                <span className="card-icon">🏦</span>
                <h3>Bank Account</h3>
                <p>{s.bankName}</p>
                <span className="method-details">{s.bankAccount}</span>
              </div>
              <div className="card">
                <span className="card-icon">🌍</span>
                <h3>Cards & Online</h3>
                <p>Visa, Mastercard, MoMo instant</p>
                <span className="method-details">Secure Flutterwave checkout</span>
              </div>
              <div className="card">
                <span className="card-icon">🔄</span>
                <h3>Monthly Partnership</h3>
                <p>Recurring giving</p>
                <span className="method-details">Join Imbuto Partners</span>
              </div>
            </div>
            <div style={{ textAlign: "center", marginTop: "2rem" }}>
              <button className="btn btn-gold" onClick={() => setDonateOpen(true)}>
                Donate Now
              </button>
            </div>
          </div>
        </section>

        {/* News */}
        <section id="news" className="section">
          <div className="container">
            <h2>News & Updates</h2>
            <div className="grid grid-3">
              {content.news.map((n) => (
                <article className="card" key={n.id}>
                  <p className="news-date">{n.date}</p>
                  <h3>{n.title}</h3>
                  <p>{n.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="section section-alt">
          <div className="container">
            <h2>Contact Us</h2>
            <div className="grid grid-2">
              <div>
                <div className="contact-item">
                  <span className="icon">📍</span>
                  <div>
                    <h3>Address</h3>
                    <p>{s.address}</p>
                  </div>
                </div>
                <div className="contact-item">
                  <span className="icon">📞</span>
                  <div>
                    <h3>Phone</h3>
                    <p>
                      <a href={`tel:${s.phone}`}>{s.phone}</a>
                    </p>
                  </div>
                </div>
                <div className="contact-item">
                  <span className="icon">✉️</span>
                  <div>
                    <h3>Email</h3>
                    <p>
                      <a href={`mailto:${s.email}`}>{s.email}</a>
                    </p>
                  </div>
                </div>
                <div className="contact-item">
                  <span className="icon">🌐</span>
                  <div>
                    <h3>Website</h3>
                    <p>{s.website}</p>
                  </div>
                </div>
                <div className="contact-item">
                  <span className="icon">🕐</span>
                  <div>
                    <h3>Working Hours</h3>
                    <p>{s.hours}</p>
                  </div>
                </div>
                <div className="social-links">
                  <a href={s.facebook} title="Facebook">
                    📘
                  </a>
                  <a href={s.youtube} title="YouTube">
                    📺
                  </a>
                  <a href={s.instagram} title="Instagram">
                    📷
                  </a>
                  <a href={s.tiktok} title="TikTok">
                    🎵
                  </a>
                  <a href={`https://wa.me/${s.whatsapp}`} title="WhatsApp">
                    💬
                  </a>
                </div>
              </div>
              <form className="card" onSubmit={handleContact}>
                <div className="field">
                  <label htmlFor="c-name">Name</label>
                  <input id="c-name" name="name" required />
                </div>
                <div className="field">
                  <label htmlFor="c-email">Email</label>
                  <input id="c-email" name="email" type="email" required />
                </div>
                <div className="field">
                  <label htmlFor="c-subject">Subject</label>
                  <input id="c-subject" name="subject" required />
                </div>
                <div className="field">
                  <label htmlFor="c-msg">Message</label>
                  <textarea id="c-msg" name="message" rows={5} required />
                </div>
                <p className="form-note">{contactNote}</p>
                <button className="btn btn-primary btn-block" type="submit">
                  Send Message
                </button>
              </form>
            </div>
            {s.mapEmbed ? (
              <div className="map-frame">
                <iframe src={s.mapEmbed} title="Location map" loading="lazy" />
              </div>
            ) : null}
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container">
          <div className="grid grid-3">
            <div>
              <h3>{s.siteName}</h3>
              <p>
                {s.verseText} — {s.verseRef}
              </p>
            </div>
            <div>
              <h3>Quick Links</h3>
              <ul>
                {(
                  [
                    ["#about", "About Us"],
                    ["#sermons", "Sermons"],
                    ["#events", "Events"],
                    ["#donate", "Donate"],
                    ["#contact", "Contact Us"],
                  ] as [string, string][]
                ).map(([hash, label]) => (
                  <li key={hash}>
                    <a
                      href={hash}
                      onClick={(e) => {
                        e.preventDefault();
                        scrollTo(hash);
                      }}
                    >
                      {label}
                    </a>
                  </li>
                ))}
                <li>
                  <Link to="/admin">Admin Panel</Link>
                </li>
              </ul>
            </div>
            <div>
              <h3>Newsletter</h3>
              <p>Subscribe to receive the latest updates</p>
              <form className="newsletter-form" onSubmit={handleNewsletter}>
                <input name="email" type="email" placeholder="Enter your email" required />
                <button className="btn btn-gold" type="submit">
                  Subscribe
                </button>
              </form>
              <p className="form-note">{newsNote}</p>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© {new Date().getFullYear()} Family Imbuto Z'Agakiza. All Rights Reserved.</p>
          </div>
        </div>
      </footer>

      <a
        className="float-btn whatsapp-float"
        href={`https://wa.me/${s.whatsapp}`}
        target="_blank"
        rel="noreferrer"
        aria-label="WhatsApp"
      >
        💬
      </a>
      {showTop ? (
        <button
          className="float-btn back-to-top"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to top"
        >
          ↑
        </button>
      ) : null}

      {donateOpen ? <DonateModal onClose={() => setDonateOpen(false)} /> : null}

      {prayerOpen ? (
        <div className="modal-backdrop" onClick={() => setPrayerOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setPrayerOpen(false)} aria-label="Close">
              ×
            </button>
            <h3>Request Prayer</h3>
            <form onSubmit={handlePrayer}>
              <div className="field">
                <label htmlFor="p-name">Name</label>
                <input id="p-name" name="name" required />
              </div>
              <div className="field">
                <label htmlFor="p-email">Email</label>
                <input id="p-email" name="email" type="email" required />
              </div>
              <div className="field">
                <label htmlFor="p-req">Your prayer request</label>
                <textarea id="p-req" name="request" rows={5} required />
              </div>
              <button className="btn btn-primary btn-block" type="submit">
                Send Request
              </button>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}

function DonateModal({ onClose }: { onClose: () => void }) {
  const { content } = useSiteContent();
  const s = content.settings;
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState("");

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const name = String(f.get("name") ?? "");
    const email = String(f.get("email") ?? "");
    const phone = String(f.get("phone") ?? "");
    const amount = Number(f.get("amount") ?? 0);

    if (!s.flutterwaveKey) {
      setNote(
        "Online payment is not configured yet. Add your Flutterwave public key in the Admin panel → Settings, or use the MoMo code above.",
      );
      return;
    }

    setBusy(true);
    setNote("");
    try {
      const result = await payWithFlutterwave({
        publicKey: s.flutterwaveKey,
        name,
        email,
        phone,
        amount,
        currency: s.currency,
        title: s.siteName,
      });
      if (!result) {
        setNote("Payment window closed before completing.");
      } else {
        const donationRecord = {
          id: uid(),
          name,
          email,
          amount,
          currency: s.currency,
          reference: result.reference,
          status: result.status,
          date: now(),
        };
        addToStore("donations", donationRecord);
        syncDonationToSupabase(donationRecord);
        setNote(`Thank you ${name}! Payment ${result.status}. Ref: ${result.reference}`);
      }
    } catch (err) {
      setNote(err instanceof Error ? err.message : "Payment failed. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">
          ×
        </button>
        <h3>Hitamo uburyo bwo gutanga impano</h3>

        <h4 style={{ color: "var(--brand)", marginBottom: ".4rem" }}>1. MoMo Pay Direct</h4>
        <p style={{ fontSize: ".9rem", color: "var(--ink-muted)", marginBottom: ".6rem" }}>
          Kanda kodo ikurikira kuri telefone yawe:
        </p>
        <div className="code-box">{s.momoCode}</div>

        <hr className="divider" />

        <h4 style={{ color: "var(--brand)", marginBottom: ".6rem" }}>
          2. Kwishyura online (Cards / MoMo instant)
        </h4>
        <form onSubmit={submit}>
          <div className="field-grid">
            <div className="field">
              <label htmlFor="d-name">Izina ryawe</label>
              <input id="d-name" name="name" required />
            </div>
            <div className="field">
              <label htmlFor="d-email">Email</label>
              <input id="d-email" name="email" type="email" required />
            </div>
            <div className="field">
              <label htmlFor="d-phone">Telefone</label>
              <input id="d-phone" name="phone" />
            </div>
            <div className="field">
              <label htmlFor="d-amount">Amount ({s.currency})</label>
              <input
                id="d-amount"
                name="amount"
                type="number"
                min="100"
                defaultValue={5000}
                required
              />
            </div>
          </div>
          <p className="form-note">{note}</p>
          <button className="btn btn-primary btn-block" type="submit" disabled={busy}>
            {busy ? "Processing…" : "Kwishyura ako kanya"}
          </button>
        </form>
      </div>
    </div>
  );
}
