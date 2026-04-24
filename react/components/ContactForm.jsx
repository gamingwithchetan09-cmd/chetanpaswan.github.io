function ContactForm() {
  const [form, setForm] = React.useState({ name: "", phone: "", message: "" });
  const [status, setStatus] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [activeField, setActiveField] = React.useState("");

  const isPreviewMode = window.location.protocol === "file:";

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.name.trim() || !form.phone.trim() || !form.message.trim()) {
      setStatus({
        type: "error",
        message: "Please complete every field before sending your message.",
      });
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      await window.API.submitContact(form);
      setStatus({
        type: "success",
        message: "Message sent successfully. I will get back to you soon.",
      });
      setForm({ name: "", phone: "", message: "" });
    } catch {
      setStatus({
        type: isPreviewMode ? "info" : "error",
        message: isPreviewMode
          ? "Preview mode is active. Start the backend to test live submissions."
          : "Something went wrong while sending the message. Please try again.",
      });
    } finally {
      setLoading(false);
      window.setTimeout(() => setStatus(null), 4200);
    }
  };

  const renderStatus = () => {
    if (!status) return null;

    return <div className={`form-status form-status--${status.type}`}>{status.message}</div>;
  };

  return (
    <div className="surface contact-shell">
      <form className="contact-form" onSubmit={handleSubmit} noValidate>
        <div className="contact-form__header">
          <h2 className="contact-form__title">Send a direct message</h2>
          <p className="contact-form__copy">
            Share a short project brief, collaboration idea, or quick question and keep the first message simple.
          </p>
          {isPreviewMode && (
            <div className="form-status form-status--info">
              Preview mode is active. Visual QA works here even if live submission is unavailable.
            </div>
          )}
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="contact-name">Name</label>
            <div className={`field-shell ${activeField === "name" ? "is-active" : ""}`}>
              <input
                id="contact-name"
                name="name"
                type="text"
                placeholder="Your name"
                value={form.name}
                onChange={handleChange}
                onFocus={() => setActiveField("name")}
                onBlur={() => setActiveField("")}
                autoComplete="name"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="contact-phone">Phone</label>
            <div className={`field-shell ${activeField === "phone" ? "is-active" : ""}`}>
              <input
                id="contact-phone"
                name="phone"
                type="tel"
                placeholder="+91 XXXXX XXXXX"
                value={form.phone}
                onChange={handleChange}
                onFocus={() => setActiveField("phone")}
                onBlur={() => setActiveField("")}
                autoComplete="tel"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="contact-message">Message</label>
            <div className={`field-shell ${activeField === "message" ? "is-active" : ""}`}>
              <textarea
                id="contact-message"
                name="message"
                placeholder="Tell me what you need help with."
                value={form.message}
                onChange={handleChange}
                onFocus={() => setActiveField("message")}
                onBlur={() => setActiveField("")}
                required
              />
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn--primary" disabled={loading}>
            {loading ? "Sending message..." : "Send Message"}
          </button>
          {renderStatus()}
        </div>
      </form>
    </div>
  );
}

window.ContactForm = ContactForm;
