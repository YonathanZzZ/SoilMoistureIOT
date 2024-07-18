import { Container } from "@mui/material";

interface Props{
  children: React.ReactNode
}

export default function Content({children}: Props){
  return(
    <Container maxWidth={false}>
      {children}
    </Container>
  )
}