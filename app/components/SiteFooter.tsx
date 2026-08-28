const socials = [
  ["GitHub", "https://github.com/divya-soni"],
  ["LinkedIn", "https://linkedin.com/in/divya-soni14"],
  ["X", "https://x.com/thedivyasoni"],
  ["Email", "mailto:divya.rajeshsoni@gmail.com"],
] as const;

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell footer-inner">
        <p>Divya Soni, {new Date().getFullYear()}</p>
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
    </footer>
  );
}
