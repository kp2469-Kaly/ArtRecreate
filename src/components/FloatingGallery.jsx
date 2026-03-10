function FloatingGallery({ items }) {
  return (
    <div className="floating-gallery">
      {items.map((item) => (
        <article
          key={item.id}
          className="floating-card"
          style={{ background: item.gradient }}
        >
          <div className="card-top">
            <span className="card-tag">{item.tag}</span>
            <span className="card-year">{item.year}</span>
          </div>
          <div className="card-title">
            <h3>{item.title}</h3>
            <p>{item.medium}</p>
          </div>
          <div className="card-meta">
            <span>{item.size}</span>
            <span>{item.location}</span>
          </div>
        </article>
      ))}
    </div>
  )
}

export default FloatingGallery
