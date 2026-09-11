import ProjectList from '@/components/custom/dashboard/ProjectList'
import WelcomeBanner from '@/components/custom/dashboard/WelcomeBanner'
import { UserButton } from '@clerk/nextjs'
import React, { Suspense } from 'react'

function page() {
  // The project list reads the URL query to keep the Active/Archive view
  // shareable and compatible with the sidebar navigation.
  return (
    <div>
      {/* Welcome Banner */}
      <WelcomeBanner/>

      {/* Project List  */}
      <Suspense fallback={<div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3"><div className="h-64 animate-pulse rounded-2xl bg-white/70 ring-1 ring-black/5" /><div className="h-64 animate-pulse rounded-2xl bg-white/70 ring-1 ring-black/5" /><div className="h-64 animate-pulse rounded-2xl bg-white/70 ring-1 ring-black/5" /></div>}>
        <ProjectList/>
      </Suspense>
    </div>
  )
}

export default page
