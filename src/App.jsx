import { useEffect, useState } from 'react'
import './App.css'
import FloatingGallery from './components/FloatingGallery'
import Header from './components/Header'

const artworks = [
  {
    id: 'resin-bloom',
    title: 'Resin Bloom',
    year: '2025',
    medium: 'Resin + Pigment',
    size: '40 x 30 cm',
    location: 'Hyderabad Studio',
    tag: 'Limited',
    gradient: 'linear-gradient(145deg, rgba(122, 185, 210, 0.85) 0%, rgba(248, 251, 255, 0.95) 65%)'
  },
  {
    id: 'gold-echo',
    title: 'Gold Echo',
    year: '2024',
    medium: 'Acrylic + Gold Leaf',
    size: '50 x 50 cm',
    location: 'Private Collection',
    tag: 'Commissioned',
    gradient: 'linear-gradient(145deg, rgba(181, 161, 213, 0.9) 0%, rgba(248, 251, 255, 0.95) 70%)'
  },
  {
    id: 'midnight-pour',
    title: 'Midnight Pour',
    year: '2025',
    medium: 'Resin Flow',
    size: '60 x 40 cm',
    location: 'Art Recreate',
    tag: 'Signature',
    gradient: 'linear-gradient(145deg, rgba(122, 185, 210, 0.75) 0%, rgba(181, 161, 213, 0.8) 70%)'
  },
  {
    id: 'soft-fire',
    title: 'Soft Fire',
    year: '2023',
    medium: 'Mixed Media',
    size: '30 x 30 cm',
    location: 'Studio Wall',
    tag: 'Archive',
    gradient: 'linear-gradient(145deg, rgba(248, 251, 255, 0.9) 0%, rgba(122, 185, 210, 0.7) 70%)'
  },
  {
    id: 'opal-arc',
    title: 'Opal Arc',
    year: '2024',
    medium: 'Ink + Resin',
    size: '45 x 45 cm',
    location: 'Hyderabad',
    tag: 'Available',
    gradient: 'linear-gradient(145deg, rgba(181, 161, 213, 0.7) 0%, rgba(248, 251, 255, 0.95) 70%)'
  }
]

const defaultClasses = [
  {
    id: 'class-resin-foundations',
    title: 'Resin Foundations',
    level: 'Beginner',
    schedule: 'Saturdays 11:00 AM',
    seats: '12',
    price: 'INR 2,400',
    description: 'Learn safe setup, clean pours, and pigment basics in guided live sessions.'
  },
  {
    id: 'class-color-stories',
    title: 'Color Stories for Resin',
    level: 'Intermediate',
    schedule: 'Wednesdays 7:30 PM',
    seats: '10',
    price: 'INR 3,100',
    description: 'Build expressive palettes and layered effects that photograph beautifully.'
  }
]

const defaultWorkshops = [
  {
    id: 'workshop-studio-immersion',
    title: 'Studio Immersion Day',
    date: 'April 18, 2026',
    duration: '5 Hours',
    location: 'Subash Nagar Studio',
    capacity: '16',
    description: 'Hands-on resin and texture workshop for creators and collectors.'
  },
  {
    id: 'workshop-team-creative',
    title: 'Team Creative Workshop',
    date: 'May 2, 2026',
    duration: '3 Hours',
    location: 'On-site / Studio',
    capacity: '20',
    description: 'Collaborative art session designed for company teams and communities.'
  }
]

const STORAGE_KEYS = {
  classes: 'artrecreate_classes',
  workshops: 'artrecreate_workshops',
  theme: 'artrecreate_theme'
}

const ADMIN_SESSION_KEY = 'artrecreate_admin_logged_in'

const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'artrecreate2026'
}

const emptyClassDraft = {
  title: '',
  level: '',
  schedule: '',
  seats: '',
  price: '',
  description: ''
}

const emptyWorkshopDraft = {
  title: '',
  date: '',
  duration: '',
  location: '',
  capacity: '',
  description: ''
}

function loadStoredItems(key, fallbackItems) {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) {
      return fallbackItems
    }

    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : fallbackItems
  } catch {
    return fallbackItems
  }
}

function createItemId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function App() {
  const [classes, setClasses] = useState(() =>
    loadStoredItems(STORAGE_KEYS.classes, defaultClasses),
  )
  const [workshops, setWorkshops] = useState(() =>
    loadStoredItems(STORAGE_KEYS.workshops, defaultWorkshops),
  )

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(
    () => sessionStorage.getItem(ADMIN_SESSION_KEY) === 'true',
  )
  const [currentHash, setCurrentHash] = useState(() => window.location.hash)
  const [theme, setTheme] = useState(
    () => localStorage.getItem(STORAGE_KEYS.theme) || 'light',
  )
  const [loginForm, setLoginForm] = useState({ username: '', password: '' })
  const [loginError, setLoginError] = useState('')

  const [classDraft, setClassDraft] = useState(emptyClassDraft)
  const [workshopDraft, setWorkshopDraft] = useState(emptyWorkshopDraft)
  const [editingClassId, setEditingClassId] = useState(null)
  const [editingWorkshopId, setEditingWorkshopId] = useState(null)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.classes, JSON.stringify(classes))
  }, [classes])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.workshops, JSON.stringify(workshops))
  }, [workshops])

  useEffect(() => {
    sessionStorage.setItem(ADMIN_SESSION_KEY, String(isAdminLoggedIn))
  }, [isAdminLoggedIn])

  useEffect(() => {
    const handleHashChange = () => setCurrentHash(window.location.hash)
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.theme, theme)
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const handleLoginInput = (event) => {
    const { name, value } = event.target
    setLoginForm((current) => ({ ...current, [name]: value }))
  }

  const handleAdminLogin = (event) => {
    event.preventDefault()

    const username = loginForm.username.trim()
    const password = loginForm.password.trim()

    if (
      username === ADMIN_CREDENTIALS.username &&
      password === ADMIN_CREDENTIALS.password
    ) {
      setIsAdminLoggedIn(true)
      setLoginError('')
      setLoginForm({ username: '', password: '' })
      return
    }

    setLoginError('Invalid admin username or password.')
  }

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false)
    setEditingClassId(null)
    setEditingWorkshopId(null)
    setClassDraft(emptyClassDraft)
    setWorkshopDraft(emptyWorkshopDraft)
    setLoginError('')
  }

  const handleThemeToggle = () => {
    setTheme((current) => (current === 'light' ? 'dark' : 'light'))
  }

  const handleClassInput = (event) => {
    const { name, value } = event.target
    setClassDraft((current) => ({ ...current, [name]: value }))
  }

  const handleWorkshopInput = (event) => {
    const { name, value } = event.target
    setWorkshopDraft((current) => ({ ...current, [name]: value }))
  }

  const resetClassEditor = () => {
    setEditingClassId(null)
    setClassDraft(emptyClassDraft)
  }

  const resetWorkshopEditor = () => {
    setEditingWorkshopId(null)
    setWorkshopDraft(emptyWorkshopDraft)
  }

  const handleClassSubmit = (event) => {
    event.preventDefault()

    if (!classDraft.title.trim()) {
      return
    }

    const payload = {
      title: classDraft.title.trim(),
      level: classDraft.level.trim(),
      schedule: classDraft.schedule.trim(),
      seats: classDraft.seats.trim(),
      price: classDraft.price.trim(),
      description: classDraft.description.trim()
    }

    if (editingClassId) {
      setClasses((current) =>
        current.map((item) =>
          item.id === editingClassId ? { ...item, ...payload } : item,
        ),
      )
      resetClassEditor()
      return
    }

    setClasses((current) => [
      { id: createItemId('class'), ...payload },
      ...current
    ])
    setClassDraft(emptyClassDraft)
  }

  const handleWorkshopSubmit = (event) => {
    event.preventDefault()

    if (!workshopDraft.title.trim()) {
      return
    }

    const payload = {
      title: workshopDraft.title.trim(),
      date: workshopDraft.date.trim(),
      duration: workshopDraft.duration.trim(),
      location: workshopDraft.location.trim(),
      capacity: workshopDraft.capacity.trim(),
      description: workshopDraft.description.trim()
    }

    if (editingWorkshopId) {
      setWorkshops((current) =>
        current.map((item) =>
          item.id === editingWorkshopId ? { ...item, ...payload } : item,
        ),
      )
      resetWorkshopEditor()
      return
    }

    setWorkshops((current) => [
      { id: createItemId('workshop'), ...payload },
      ...current
    ])
    setWorkshopDraft(emptyWorkshopDraft)
  }

  const startEditClass = (item) => {
    setEditingClassId(item.id)
    setClassDraft({
      title: item.title,
      level: item.level,
      schedule: item.schedule,
      seats: item.seats,
      price: item.price,
      description: item.description
    })
  }

  const startEditWorkshop = (item) => {
    setEditingWorkshopId(item.id)
    setWorkshopDraft({
      title: item.title,
      date: item.date,
      duration: item.duration,
      location: item.location,
      capacity: item.capacity,
      description: item.description
    })
  }

  const handleDeleteClass = (id) => {
    setClasses((current) => current.filter((item) => item.id !== id))

    if (editingClassId === id) {
      resetClassEditor()
    }
  }

  const handleDeleteWorkshop = (id) => {
    setWorkshops((current) => current.filter((item) => item.id !== id))

    if (editingWorkshopId === id) {
      resetWorkshopEditor()
    }
  }

  const isAdminRoute = currentHash === '#admin'

  if (isAdminRoute) {
    return (
      <div className="page admin-page">
        <main>
          <section className="admin-section">
            <div className="section-header">
              <h2>Admin Dashboard</h2>
              <p>Manage classes and workshops in one place.</p>
            </div>

            <div className="admin-route-topbar">
              <a className="ghost-button" href="/">Back to Website</a>
            </div>

            {!isAdminLoggedIn && (
              <div className="admin-login">
                <form className="admin-form" onSubmit={handleAdminLogin}>
                  <label>
                    Username
                    <input
                      type="text"
                      name="username"
                      value={loginForm.username}
                      onChange={handleLoginInput}
                      required
                    />
                  </label>
                  <label>
                    Password
                    <input
                      type="password"
                      name="password"
                      value={loginForm.password}
                      onChange={handleLoginInput}
                      required
                    />
                  </label>
                  <button className="primary-button" type="submit">Sign In</button>
                  {loginError && <p className="admin-error">{loginError}</p>}
                </form>
              </div>
            )}

            {isAdminLoggedIn && (
              <div className="admin-shell">
                <div className="admin-toolbar">
                  <p>Signed in as admin.</p>
                  <div className="admin-toolbar-actions">
                    <button className="ghost-button" onClick={handleThemeToggle}>
                      {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
                    </button>
                    <button className="ghost-button" onClick={handleAdminLogout}>
                      Log Out
                    </button>
                  </div>
                </div>

                <div className="admin-grid">
                  <article className="admin-card">
                    <h3>{editingClassId ? 'Edit Class' : 'Add Class'}</h3>
                    <form className="admin-form" onSubmit={handleClassSubmit}>
                      <label>
                        Title
                        <input
                          type="text"
                          name="title"
                          value={classDraft.title}
                          onChange={handleClassInput}
                          required
                        />
                      </label>
                      <label>
                        Level
                        <input
                          type="text"
                          name="level"
                          value={classDraft.level}
                          onChange={handleClassInput}
                        />
                      </label>
                      <label>
                        Schedule
                        <input
                          type="text"
                          name="schedule"
                          value={classDraft.schedule}
                          onChange={handleClassInput}
                        />
                      </label>
                      <label>
                        Seats
                        <input
                          type="text"
                          name="seats"
                          value={classDraft.seats}
                          onChange={handleClassInput}
                        />
                      </label>
                      <label>
                        Price
                        <input
                          type="text"
                          name="price"
                          value={classDraft.price}
                          onChange={handleClassInput}
                        />
                      </label>
                      <label>
                        Description
                        <textarea
                          name="description"
                          rows="3"
                          value={classDraft.description}
                          onChange={handleClassInput}
                        />
                      </label>
                      <div className="admin-actions">
                        <button className="primary-button" type="submit">
                          {editingClassId ? 'Update Class' : 'Add Class'}
                        </button>
                        {editingClassId && (
                          <button
                            type="button"
                            className="ghost-button"
                            onClick={resetClassEditor}
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </form>

                    <div className="admin-list">
                      {classes.map((item) => (
                        <div key={item.id} className="admin-list-row">
                          <div>
                            <p className="admin-list-title">{item.title}</p>
                            <p className="admin-list-subtitle">{item.schedule || 'No schedule set'}</p>
                          </div>
                          <div className="admin-row-actions">
                            <button className="ghost-button" onClick={() => startEditClass(item)}>
                              Edit
                            </button>
                            <button className="ghost-button" onClick={() => handleDeleteClass(item.id)}>
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </article>

                  <article className="admin-card">
                    <h3>{editingWorkshopId ? 'Edit Workshop' : 'Add Workshop'}</h3>
                    <form className="admin-form" onSubmit={handleWorkshopSubmit}>
                      <label>
                        Title
                        <input
                          type="text"
                          name="title"
                          value={workshopDraft.title}
                          onChange={handleWorkshopInput}
                          required
                        />
                      </label>
                      <label>
                        Date
                        <input
                          type="text"
                          name="date"
                          value={workshopDraft.date}
                          onChange={handleWorkshopInput}
                        />
                      </label>
                      <label>
                        Duration
                        <input
                          type="text"
                          name="duration"
                          value={workshopDraft.duration}
                          onChange={handleWorkshopInput}
                        />
                      </label>
                      <label>
                        Location
                        <input
                          type="text"
                          name="location"
                          value={workshopDraft.location}
                          onChange={handleWorkshopInput}
                        />
                      </label>
                      <label>
                        Capacity
                        <input
                          type="text"
                          name="capacity"
                          value={workshopDraft.capacity}
                          onChange={handleWorkshopInput}
                        />
                      </label>
                      <label>
                        Description
                        <textarea
                          name="description"
                          rows="3"
                          value={workshopDraft.description}
                          onChange={handleWorkshopInput}
                        />
                      </label>
                      <div className="admin-actions">
                        <button className="primary-button" type="submit">
                          {editingWorkshopId ? 'Update Workshop' : 'Add Workshop'}
                        </button>
                        {editingWorkshopId && (
                          <button
                            type="button"
                            className="ghost-button"
                            onClick={resetWorkshopEditor}
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </form>

                    <div className="admin-list">
                      {workshops.map((item) => (
                        <div key={item.id} className="admin-list-row">
                          <div>
                            <p className="admin-list-title">{item.title}</p>
                            <p className="admin-list-subtitle">{item.date || 'No date set'}</p>
                          </div>
                          <div className="admin-row-actions">
                            <button className="ghost-button" onClick={() => startEditWorkshop(item)}>
                              Edit
                            </button>
                            <button className="ghost-button" onClick={() => handleDeleteWorkshop(item.id)}>
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </article>
                </div>
              </div>
            )}
          </section>
        </main>
      </div>
    )
  }

  return (
    <div className="page">
      <Header />

      <main>
        <section className="hero">
          <div className="hero-copy">
            <p className="hero-kicker">Hyderabad, Telangana</p>
            <h1>
              Art that feels tactile,
              <span> bold, and personal.</span>
            </h1>
            <p className="hero-lede">
              A clean, simple portfolio for Art Recreate. Explore selected pieces,
              classes, and workshop opportunities in one place.
            </p>
            <div className="hero-actions">
              <button className="primary-button">View Works</button>
              <button className="ghost-button">Book Studio Visit</button>
            </div>
          </div>
          <div className="hero-sphere" aria-hidden="true">
            <div className="hero-orb" />
            <span>Signature Resin</span>
          </div>
        </section>

        <section id="works" className="gallery-section">
          <div className="section-header">
            <h2>Selected Works</h2>
            <p>A curated set of recent pieces from the studio.</p>
          </div>
          <FloatingGallery items={artworks} />
        </section>

        <section id="classes" className="class-section">
          <div className="section-header">
            <h2>Classes</h2>
            <p>Current online class schedule and enrollment details.</p>
          </div>

          <div className="offer-grid">
            {classes.map((item) => (
              <article key={item.id} className="offer-card">
                <h3>{item.title}</h3>
                <p className="offer-description">{item.description}</p>
                <div className="offer-meta">
                  <span>{item.level || 'All Levels'}</span>
                  <span>{item.schedule || 'Schedule TBA'}</span>
                </div>
                <div className="offer-meta">
                  <span>Seats: {item.seats || 'Open'}</span>
                  <span>{item.price || 'Contact for pricing'}</span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="workshops" className="custom-section">
          <div className="section-header">
            <h2>Workshops</h2>
            <p>In-person and collaborative sessions currently open for booking.</p>
          </div>

          <div className="offer-grid">
            {workshops.map((item) => (
              <article key={item.id} className="offer-card">
                <h3>{item.title}</h3>
                <p className="offer-description">{item.description}</p>
                <div className="offer-meta">
                  <span>{item.date || 'Date TBA'}</span>
                  <span>{item.duration || 'Duration TBA'}</span>
                </div>
                <div className="offer-meta">
                  <span>{item.location || 'Location TBA'}</span>
                  <span>Capacity: {item.capacity || 'Open'}</span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="contact" className="contact-section">
          <div>
            <h2>Contact</h2>
            <p>
              Studio visits are by appointment. Reach out for commissions and
              collaborations.
            </p>
          </div>
          <div className="contact-details">
            <div>
              <p className="contact-label">Email</p>
              <p>hello@artrecreate.studio</p>
            </div>
            <div>
              <p className="contact-label">Studio Hours</p>
              <p>Open until 9 PM · Subash Nagar, Hyderabad</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
