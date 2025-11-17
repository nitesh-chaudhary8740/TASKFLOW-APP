import { User } from 'lucide-react'
import React from 'react'

function ProfileSummary() {
  return (
     <div className="action-profile-column">
                    {/* Placeholder for Employee Profile/Info Box */}
                    <div className="content-box profile-box">
                        <h2 className="box-title profile-title">
                            <User className="icon-mr" /> 
                            Profile Summary
                        </h2>
                        <p className="text-main">Role: Developer</p>
                        <p className="text-sub">Joined: Jan 2023</p>
                    </div>
                </div>
  )
}

export default ProfileSummary
