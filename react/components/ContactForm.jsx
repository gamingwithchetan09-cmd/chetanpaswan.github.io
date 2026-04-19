/* ContactForm — Submits to backend API */
function ContactForm() {
  const [form, setForm] = React.useState({ name: '', phone: '', message: '' });
  const [status, setStatus] = React.useState(null); // 'success' | 'error' | null
  const [loading, setLoading] = React.useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim() || !form.message.trim()) {
      setStatus('error');
      return;
    }

    setLoading(true);
    try {
      await window.API.submitContact(form);
      setStatus('success');
      setForm({ name: '', phone: '', message: '' });
    } catch {
      setStatus('error');
    } finally {
      setLoading(false);
      setTimeout(() => setStatus(null), 4000);
    }
  };

  return (
    <div className="contact-wrapper">
      <form className="contact-form" onSubmit={handleSubmit} id="contact-form">
        <div className="form-group">
          <label htmlFor="contact-name">Name</label>
          <input
            type="text" id="contact-name" name="name"
            value={form.name} onChange={handleChange}
            placeholder="Your name" required
          />
        </div>
        <div className="form-group">
          <label htmlFor="contact-phone">Phone</label>
          <input
            type="tel" id="contact-phone" name="phone"
            value={form.phone} onChange={handleChange}
            placeholder="+91 XXXXX XXXXX" required
          />
        </div>
        <div className="form-group">
          <label htmlFor="contact-message">Message</label>
          <textarea
            id="contact-message" name="message"
            value={form.message} onChange={handleChange}
            placeholder="How can I help you?" required
          />
        </div>
        <button type="submit" className="btn btn--primary" disabled={loading} style={{ width: '100%', justifyContent: 'center' }}>
          {loading ? 'Sending...' : 'Send Message'}
        </button>

        {status === 'success' && (
          <div className="form-status form-status--success">
            ✓ Message sent! I'll get back to you soon.
          </div>
        )}
        {status === 'error' && (
          <div className="form-status form-status--error">
            ✗ Something went wrong. Please fill all fields and try again.
          </div>
        )}
      </form>
    </div>
  );
}

window.ContactForm = ContactForm;
