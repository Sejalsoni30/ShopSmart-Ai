import { Mail, MapPin, Phone } from 'lucide-react';

export default function LegalPage({ type }) {
  if (type === 'contact') {
    return (
      <div className="container" style={{ maxWidth: '800px', padding: '4rem 1.5rem' }}>
        <h1 className="hero-title mb-4">Contact Us</h1>
        <div className="grid grid-cols-2">
          <div className="card">
            <h3 className="mb-4">Get in Touch</h3>
            <form className="grid" onSubmit={(e) => { e.preventDefault(); alert("Message sent! (Mock)"); }}>
              <div>
                <label className="text-muted text-sm block mb-2">Name</label>
                <input type="text" className="input-field" required />
              </div>
              <div>
                <label className="text-muted text-sm block mb-2">Email</label>
                <input type="email" className="input-field" required />
              </div>
              <div>
                <label className="text-muted text-sm block mb-2">Message</label>
                <textarea className="input-field" rows="4" required></textarea>
              </div>
              <button type="submit" className="btn btn-primary">Send Message</button>
            </form>
          </div>
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h3 className="mb-4">Our Office</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <MapPin className="text-primary" />
              <span>123 AI Boulevard, Tech City, 10001</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Phone className="text-primary" />
              <span>+1 (555) 123-4567</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Mail className="text-primary" />
              <span>support@shopsmartai.demo</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const title = type === 'privacy' ? 'Privacy Policy' : 'Terms of Service';

  return (
    <div className="container" style={{ maxWidth: '800px', padding: '4rem 1.5rem' }}>
      <h1 className="hero-title mb-4">{title}</h1>
      <div className="card" style={{ padding: '3rem' }}>
        <p className="text-muted mb-4">Last updated: August 2026</p>
        <h3 className="mb-2">1. Introduction</h3>
        <p className="text-muted mb-4">This is a mock {title.toLowerCase()} for the ShopSmart AI demo application. No actual user data is permanently stored, and no real transactions take place.</p>
        
        <h3 className="mb-2">2. Data Usage</h3>
        <p className="text-muted mb-4">Any chat data sent to the AI assistant is processed momentarily to generate a response and is not used to train models.</p>

        <h3 className="mb-2">3. Disclaimer</h3>
        <p className="text-muted mb-4">Product prices, images, and specifications are entirely fictional and generated for UI testing purposes only.</p>
      </div>
    </div>
  );
}
