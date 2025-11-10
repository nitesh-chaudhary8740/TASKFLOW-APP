import React from 'react'
import "../../assets/css/Footer.css"
import { Link } from 'react-router-dom'
function Footer() {
  return (
   
        <footer className="footer">
      <div className="container footer-text">
        © 2025 TaskFlow Inc. All rights reserved. |{" "}
        <Link to="/">Privacy Policy</Link>
      </div>
    </footer>

  )
}

export default Footer
