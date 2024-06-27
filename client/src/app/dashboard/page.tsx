'use client'

import withAuth from "../auth/withAuth";

function Dashboard(){
  return(
    <h1>Show user's devices here</h1>
  )
}

// export default withAuth(Dashboard); //TODO use this in production
export default Dashboard; //non protected route for development