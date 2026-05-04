const Footer = () => {
  return (
    <footer className="footer" style={{ padding: '2rem 0', textAlign: 'center', borderTop: '1px solid var(--border)', marginTop: '4rem' }}>
      <div className="container">
        <p>&copy; {new Date().getFullYear()} Portfolio. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
