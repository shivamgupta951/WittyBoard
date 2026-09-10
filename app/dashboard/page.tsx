import ProjectList from '@/components/custom/dashboard/ProjectList'
import WelcomeBanner from '@/components/custom/dashboard/WelcomeBanner'
import { UserButton } from '@clerk/nextjs'
import React from 'react'

function page() {
  return (
    <div>
      {/* Welcome Banner */}
      <WelcomeBanner/>

      {/* Project List  */}
      <ProjectList/>
    </div>
  )
}

export default page
