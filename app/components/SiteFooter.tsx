const socials = [
  ["GitHub", "https://github.com/divya-soni"],
  ["LinkedIn", "https://linkedin.com/in/divya-soni14"],
  ["X", "https://x.com/thedivyasoni"],
  ["Email", "mailto:divya.rajeshsoni@gmail.com"],
] as const;

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell">
        <div className="site-footer__lead">
          <p className="eyebrow">Open to a good conversation</p>
          <a className="footer-email display" href="mailto:divya.rajeshsoni@gmail.com">
            Let&apos;s build something thoughtful.
            <span aria-hidden="true">↗</span>
          </a>
        </div>
        <div className="site-footer__base">
          <p>built with next.js, tailwind, and mass amounts of tokens</p>
          <div className="footer-links" aria-label="Social links">
            {socials.map(([label, href]) => (
              <a
                key={label}
                href={href}
                target={href.startsWith("mailto") ? undefined : "_blank"}
                rel={href.startsWith("mailto") ? undefined : "noopener noreferrer"}
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
