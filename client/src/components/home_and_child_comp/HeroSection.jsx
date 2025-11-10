import React from 'react'
import { Link, Navigate } from 'react-router-dom'
import "../../assets/css/HeroSection.css"

function HeroSection() {
  return (
       <main className="hero-section">
      <div className="hero-content">
        {/* Tagline */}
        <p className="tagline">Simplify. Organize. Achieve.</p>
        {/* Main Heading */}
        <h1 className="main-heading">
          Conquer Complexity <br className="hidden-sm-inline" /> with
          **Integrated Workflow.**
        </h1>
        {/* Subheading/Value Proposition */}
        <p className="sub-heading">
          TaskFlow unifies your team, whether you're an Admin overseeing
          operations or an Employee executing daily tasks. Everything in one
          place.
        </p>
        {/* Call to Action Buttons */}
        <div className="cta-group">
          {/* Primary CTA: Sign Up */}
          <Link
            to="/admin-dashboard"
            className="cta-btn cta-primary"
          >
            Get Started Free <i className="fas fa-arrow-right" />
          </Link>
          {/* Secondary CTA: Demo/Explore */}
          <Link
            to="#"
            
            className="cta-btn cta-secondary"
          >
            See the Demo
          </Link>
        </div>
        {/* Trust Banner Placeholder */}
        <div className="trust-banner">
          Join 1,000+ teams using TaskFlow to boost efficiency.
        </div>
      </div>
    </main>
  )
}

export default HeroSection
