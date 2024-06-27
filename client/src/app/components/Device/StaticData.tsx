import { Grid, Paper, Box, Typography } from "@mui/material";
import image from "next/image";

interface Props {
  name: string;
  description?: string;
  image: string;
}

export default function StaticDeviceData({ name, description, image }: Props) {
  
  return (
    <Grid
      container
      sx={{
        background: "linear-gradient(to right , #5b9ee2, #bcdeff)",
        borderRadius: "1em",
      }}
    >
      <Grid
        item
        xs={12}
        sm={6}
        sx={{
          display: "flex",
          justifyContent: {xs: 'center', sm: 'left'},
          alignItems: "center",
          height: '250px',
          padding: '0.5em',
        }}
      >
        <Paper
          elevation={3}
          component="img"
          sx={{
            width: '100%',
            height: '100%',
            borderRadius: "1em",
            overflow: "hidden",
            objectFit: "cover",
          }}
          src={image}
          alt={name}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <Box
          margin="1em"
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
          alignItems={{ xs: "center", md: "inherit" }}
        >
          <Typography variant="h5">{name}</Typography>

          {description && (
            <Typography variant="body2">{description}</Typography>
          )}
        </Box>
      </Grid>
    </Grid>
  );
}
