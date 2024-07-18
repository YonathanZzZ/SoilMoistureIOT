import { Typography } from "@mui/material";

interface Props {
  text: string;
}

export default function HeaderTitle({ text }: Props) {
  return (
    <Typography
      variant="h6"
      noWrap
      component="div"
      sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
    >
      {text}
    </Typography>
  );
}
