import PropTypes from "prop-types";

export default function ProjectCard({ project }) {
  return (
    <article className="card">
      <div className="card-top">
      </div>

      <h3 className="card-title">{project.name}</h3>
      <p className="card-desc">
        {project.description}
      </p>

      <div className="card-bottom">
        <a
          className="btn btn-primary"
          href={project.githubUrl}
          target="_blank"
          rel="noreferrer"
        >
          GitHub
        </a>

        {project.liveUrl ? (
          <a
            className="btn btn-ghost"
            href={project.liveUrl}
            target="_blank"
            rel="noreferrer"
          >
            Live
          </a>
        ) : (
          <span className="muted small"></span>
        )}

        {project.stars > 0 && (
          <span className="muted small">★ {project.stars}</span>
        )}
      </div>
    </article>
  );
}

ProjectCard.propTypes = {
  project: PropTypes.shape({
    weekLabel: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    stars: PropTypes.number.isRequired,
    githubUrl: PropTypes.string.isRequired,
    liveUrl: PropTypes.string,
  }).isRequired,
};
