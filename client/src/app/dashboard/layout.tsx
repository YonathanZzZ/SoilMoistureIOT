import Header from "../components/header/Header"

interface Props {
  children: React.ReactNode
}

export default function DashboardLayout({children}: Props ){
  return(
    <>
    <Header/>
    {children}
    </>
  )
}