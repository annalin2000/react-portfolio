const CONTACT = {
  linkedin: "https://www.linkedin.com/in/anna-lin-4b1262212",
  github: "https://github.com/annalin2000",
  email: "annalin1510@outlook.com",
};

export default function Contact() {
  return (
    <section className="container">
      <div className="page-head">
        <h1 className="page-title">Let’s connect</h1>
      </div>

      <div className="contact-grid">
        <a className="contact-card" href={CONTACT.linkedin} target="_blank" rel="noreferrer">
          <div className="contact-title">LinkedIn</div>
          <div className="muted">Connect professionally</div>
          <div className="contact-cta">Open →</div>
        </a>

        <a className="contact-card" href={CONTACT.github} target="_blank" rel="noreferrer">
          <div className="contact-title">GitHub</div>
          <div className="muted">See my code and repos</div>
          <div className="contact-cta">Open →</div>
        </a>

        <a className="contact-card" href={`mailto:${CONTACT.email}`}>
          <div className="contact-title">Email</div>
          <div className="muted">{CONTACT.email}</div>
          <div className="contact-cta">Send →</div>
        </a>
      </div>
    </section>
  );
}
