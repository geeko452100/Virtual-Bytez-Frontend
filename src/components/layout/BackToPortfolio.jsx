import { PORTFOLIO_PROJECTS_URL } from '../../lib/config'

function RetroBackArrow({ className = '' }) {
  return (
    <svg
      width="18"
      height="14"
      viewBox="0 0 18 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M7 1L1 7L7 13"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
      <path d="M1 7H17" stroke="currentColor" strokeWidth="1.75" strokeLinecap="square" />
    </svg>
  )
}

export default function BackToPortfolio({ className = '' }) {
  return (
    <a
      href={PORTFOLIO_PROJECTS_URL}
      className={`group inline-flex items-center gap-2.5 font-mono text-sm text-text-muted no-underline transition-colors hover:text-accent ${className}`}
      aria-label="Return to portfolio"
    >
      <RetroBackArrow className="transition-transform duration-200 group-hover:-translate-x-0.5" />
      <span>Portfolio</span>
    </a>
  )
}
