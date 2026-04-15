import styles from "./page.module.css";
import Scales from "@/components/Scales";


const IconArrow = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="5" y1="12" x2="19" y2="12"/>
    <polyline points="12 5 19 12 12 19"/>
  </svg>
);

const IconLogIn = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
    <polyline points="10 17 15 12 10 7"/>
    <line x1="15" y1="12" x2="3" y2="12"/>
  </svg>
);

const IconZap = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
);

const IconShield = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);

const IconMonitor = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
    <line x1="8" y1="21" x2="16" y2="21"/>
    <line x1="12" y1="17" x2="12" y2="21"/>
  </svg>
);

const IconPlay2 = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10"/>
    <polygon points="10 8 16 12 10 16 10 8"/>
  </svg>
);

const IconLink = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
  </svg>
);

const IconUsers = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

/* ── Google "G" logo SVG ─────────────────────────────────────────── */
const GoogleG = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

export default function Home() {
  return (
    <div className={styles.root}>
      {/* ── Ambient glow ─────────────────────────────────────────── */}
      <div className={styles.glow} aria-hidden="true" />
      <Scales
        orientation="diagonal"
        size={14}
        color="rgba(255,255,255,0.032)"
        style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}
      />

      {/* ── Nav ──────────────────────────────────────────────────── */}
      <nav className={styles.nav}>
        <div className={styles.navInner}>
          <span className={styles.logo}>
            <span className={styles.logoIconWrap}><img src="/icon.svg" width={30} height={30} alt="" aria-hidden="true" /></span>
            <span className={styles.logoText}>Popcorn</span>
          </span>
          <div className={styles.navLinks}>
            <a href="#how" className={styles.navLink}>How it works</a>
            <a href="#features" className={styles.navLink}>Features</a>
          </div>
          <a href="/login" className={styles.navSignIn} id="nav-signin-btn">
            Sign in
          </a>
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <main className={styles.main}>
        <section className={styles.hero}>
          <h1 className={styles.heroTitle}>
            One room.<br />
            <span className={styles.heroAccent}>Everyone in.</span>
          </h1>

          <p className={styles.heroSub}>
            Pick a movie. Share a link. Watch together — frame perfect, every time.
          </p>

          <div className={styles.heroCtas}>
            <a href="/login" className={styles.ctaPrimary} id="hero-start-btn">
              Get started
              <IconArrow />
            </a>
            <a href="#how" className={styles.ctaSecondary} id="hero-learn-btn">
              How it works
            </a>
          </div>

          {/* ── Stat bar ──────────────────────────────────────────── */}
          <div className={styles.statBar}>
            <div className={styles.stat}>
              <span className={styles.statNum}>0ms</span>
              <span className={styles.statLabel}>sync lag</span>
            </div>
            <div className={styles.statDivider} aria-hidden="true" />
            <div className={styles.stat}>
              <span className={styles.statNum}>4K</span>
              <span className={styles.statLabel}>quality</span>
            </div>
            <div className={styles.statDivider} aria-hidden="true" />
            <div className={styles.stat}>
              <span className={styles.statNum}>∞</span>
              <span className={styles.statLabel}>library</span>
            </div>
          </div>
        </section>

        {/* ── Player preview ─────────────────────────────────────── */}
        <section className={styles.playerPreview} aria-label="App preview">
          <div className={styles.scalesFrame}>
            <div className={styles.playerWindow}>
              <div className={styles.playerBar}>
                <span className={styles.dot} style={{ background: "#FF5F57" }} />
                <span className={styles.dot} style={{ background: "#FEBC2E" }} />
                <span className={styles.dot} style={{ background: "#28C840" }} />
              </div>
              <div className={styles.playerScreen}>
                <div className={styles.playerOverlay}>
                  <div className={styles.playerControls}>
                    <button className={styles.playBtn} id="preview-play-btn" aria-label="Play">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </button>
                    <div className={styles.playerInfo}>
                      <span className={styles.playerTitle}>Movie Night.mp4</span>
                      <span className={styles.playerTime}>1:23:45 / 2:10:00</span>
                    </div>
                  </div>
                  <div className={styles.progressBar}>
                    <div className={styles.progressFill} />
                    <div className={styles.progressThumb} />
                  </div>
                </div>
                <div className={styles.avatarStack}>
                  <span className={styles.avatar} style={{ background: "#6D28D9" }}>N</span>
                  <span className={styles.avatar} style={{ background: "#0891B2" }}>A</span>
                  <span className={styles.avatar} style={{ background: "#15803D" }}>S</span>
                  <span className={styles.avatarExtra}>+2</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── How it works ─────────────────────────────────────────── */}
        <section className={styles.steps} id="how">
          <h2 className={styles.sectionTitle}>Simple by design</h2>
          <div className={styles.stepsGrid}>
            {[
              {
                num: "01",
                icon: <IconLogIn />,
                title: "Login",
                desc: "Sign in. Your library appears. Nothing to configure.",
              },
              {
                num: "02",
                icon: <img src="/icon.svg" width={18} height={18} alt="" aria-hidden="true" />,
                title: "Pick",
                desc: "Choose what's on tonight. Hit play when you're ready.",
              },
              {
                num: "03",
                icon: <IconUsers />,
                title: "Watch",
                desc: "Share the link. Everyone joins. Every frame stays in sync.",
              },
            ].map((step) => (
              <div className={styles.scalesAccent} key={step.num}>
                <div className={styles.stepCard}>
                  <div className={styles.stepIconRow}>
                    <span className={styles.stepIconWrap}>{step.icon}</span>
                    <span className={styles.stepNum}>{step.num}</span>
                  </div>
                  <h3 className={styles.stepTitle}>{step.title}</h3>
                  <p className={styles.stepDesc}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Features ─────────────────────────────────────────────── */}
        <section className={styles.features} id="features">
          <h2 className={styles.sectionTitle}>Built to disappear</h2>
          <div className={styles.featuresGrid}>
            {[
              {
                icon: <IconZap />,
                title: "Real-time sync",
                desc: "Play, pause, seek — everyone moves together.",
              },
              {
                icon: <IconShield />,
                title: "Private by default",
                desc: "Your content stays yours. We stream it, never store it.",
              },
              {
                icon: <IconMonitor />,
                title: "Nothing to install",
                desc: "No plugins. No apps. Just a link.",
              },
              {
                icon: <IconPlay2 />,
                title: "Full quality",
                desc: "Stream at source resolution with instant seeking.",
              },
            ].map((f) => (
              <div className={styles.featureCard} key={f.title}>
                <span className={styles.featureIconWrap}>{f.icon}</span>
                <h3 className={styles.featureTitle}>{f.title}</h3>
                <p className={styles.featureDesc}>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA Banner ───────────────────────────────────────────── */}
        <section className={styles.ctaBanner}>
          <h2 className={styles.ctaBannerTitle}>Tonight&apos;s film awaits.</h2>
          <p className={styles.ctaBannerSub}>
            Thirty seconds from now, everyone&apos;s in.
          </p>
          <a href="/login" className={styles.googleBtnLarge} id="footer-start-btn">
            <GoogleG />
            <span>Continue with Google</span>
          </a>
        </section>
      </main>

      {/* ── Footer ───────────────────────────────────────────────── */}
      <footer className={styles.footer}>
        <span className={styles.footerLogo}>
          <span className={styles.footerLogoIcon}><img src="/icon.svg" width={18} height={18} alt="" aria-hidden="true" /></span>
          Popcorn
        </span>
        <span className={styles.footerCopy}>Next.js · Go · Socket.IO</span>
      </footer>
    </div>
  );
}
