'use client'

import withAuth from "../auth/withAuth";
import Header from "../components/header/Header";

function Dashboard(){
  return(
    <h1>Show user's devices here</h1>
  )
}

export default withAuth(Dashboard);