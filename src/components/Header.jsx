import './Header.css'

function Header() {
  return (
    <header className="site-header">
      <div className="brand">
        <img
          className="brand-logo"
          src="/art-recreate-logo.png"
          alt="Art Recreate logo"
        />
        <div>
          <p className="brand-title">Art Recreate</p>
          <p className="brand-subtitle">Ramya Kovida</p>
        </div>
      </div>
      <nav className="site-nav">
        <a href="#works">Works</a>
        <a href="#classes">Classes</a>
        <a href="#workshops">Workshops</a>
        <a href="#contact">Contact</a>
      </nav>
      <a className="cta-button" href="#workshops">Book Now</a>
    </header>
  )
}

export default Header
