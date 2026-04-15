import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import styles from "./page.module.css";

export const metadata = {
  title: "Library — Popcorn",
  description: "Your movie library",
};

function formatBytes(bytes) {
  if (!bytes) return "";
  const n = parseInt(bytes, 10);
  if (n >= 1e9) return (n / 1e9).toFixed(1) + " GB";
  if (n >= 1e6) return (n / 1e6).toFixed(0) + " MB";
  return (n / 1e3).toFixed(0) + " KB";
}

function badgeLabel(mimeType) {
  return mimeType === "video/mp4" ? "MP4" : "MKV";
}

export default async function LibraryPage() {
  // Server components don't have browser cookies automatically.
  // We must read the session_id from the incoming request and forward it manually.
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("session_id")?.value;

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/me`, {
    headers: {
      Cookie: `session_id=${sessionId ?? ""}`,
    },
    cache: "no-store", // never cache auth checks
  });

  if (!res.ok) {
    redirect("/login");
  }

  const user = await res.json();

  // Fetch Drive files — forward the same session cookie
  const filesRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/drive/files`, {
    headers: { Cookie: `session_id=${sessionId ?? ""}` },
    cache: "no-store",
  });

  const files = filesRes.ok ? await filesRes.json() : [];

  return (
    <div className={styles.root}>
      <div className={styles.glow} aria-hidden="true" />

      <header className={styles.header}>
        <a href="/" className={styles.logoLink}>
          <img src="/icon.svg" width={20} height={20} alt="" aria-hidden="true" />
          <span>Popcorn</span>
        </a>

        <div className={styles.userChip}>
          {user.picture && (
            <img
              src={user.picture}
              alt={user.name}
              className={styles.avatar}
              referrerPolicy="no-referrer"
            />
          )}
          <span className={styles.userName}>{user.name}</span>
        </div>
      </header>

      <main className={styles.main}>
        <section className={styles.welcomeSection}>
          <h1 className={styles.title}>
            Your library
            {files.length > 0 && (
              <span className={styles.count}>
                {files.length} file{files.length !== 1 ? "s" : ""}
              </span>
            )}
          </h1>
          {files.length === 0 && (
            <p className={styles.empty}>
              No .mp4 or .mkv files found in your Google Drive.
            </p>
          )}
        </section>

        {files.length > 0 && (
          <section className={styles.grid} aria-label="Movie library">
            {files.map((file) => (
              <a key={file.id} href={`/watch/${file.id}`} className={styles.cardLink}>
              <div className={styles.card}>
                <div className={styles.thumb}>
                  {file.thumbnailLink ? (
                    <img
                      src={file.thumbnailLink}
                      alt={file.name}
                      className={styles.thumbImg}
                    />
                  ) : (
                    <div className={styles.thumbPlaceholder}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                        <rect x="2" y="2" width="20" height="20" rx="2.18"/>
                        <line x1="7" y1="2" x2="7" y2="22"/>
                        <line x1="17" y1="2" x2="17" y2="22"/>
                        <line x1="2" y1="12" x2="22" y2="12"/>
                      </svg>
                    </div>
                  )}
                  <span className={styles.extBadge}>{badgeLabel(file.mimeType)}</span>
                </div>
                <div className={styles.cardInfo}>
                  <p className={styles.fileName} title={file.name}>
                    {file.name.replace(/\.(mkv|mp4)$/i, "")}
                  </p>
                  {file.size && (
                    <p className={styles.fileMeta}>{formatBytes(file.size)}</p>
                  )}
                </div>
              </div>
              </a>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}
