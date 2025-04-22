import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import useMediaQuery from "@mui/material/useMediaQuery";
import "bootstrap/dist/css/bootstrap.min.css";
import woman from "assets/images/homepage/woman.jpg";

import * as React from "react";
import Box from "@mui/material/Box";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { useTheme, styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const cards = [
  {
    id: 1,
    title: "New Facility",
    description:
      "Applying for New Services in Health Facility. It is an additional services in the existing facility.",
  },
  {
    id: 2,
    title: "Upgrade",
    description:
      "Authorization for Upgrade from one category of Health Facility to Another. It is a service requested by Private Health Facilities after fullfulling the requirements to change the category.",
  },
  {
    id: 3,
    title: "Inspection Request",
    description:
      "Request for Inspection of New Health Facility. This service is for an entity holding provisional authorization for the registration of a health facility. Inspections shall be conducted twice a year",
  },
  {
    id: 4,
    title: "Request to amment Staff list",
    description: "Request to Add Staff. This is done when there is a changing in staffing.",
  },
];

function DefaultBody() {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const [selectedCard, setSelectedCard] = React.useState(0);
  const theme = useTheme();
  // Media queries to match CSS breakpoints
  const isSm = useMediaQuery(theme.breakpoints.up("sm")); // 576px
  const isMd = useMediaQuery(theme.breakpoints.up("md")); // 768px
  const isLg = useMediaQuery(theme.breakpoints.up("lg")); // 992px

  // Determine max-width dynamically
  let maxWidth = "85%";
  if (isLg) maxWidth = "960px";
  else if (isMd) maxWidth = "720px";
  else if (isSm) maxWidth = "540px";

  return (
    <>
      <Grid container justifyContent="center" sx={{ my: 8, px: 2 }}>
        <Grid
          item
          xs={12}
          sx={{
            maxWidth,
            width: "85%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Card
            sx={{
              mt: -16,
              width: "85%",
              overflowX: "hidden",
              borderRadius: "4px",
              backgroundColor: "rgba(255, 255, 255, 0.3)", // semi-transparent white
              boxShadow: "none", // remove any default shadow
            }}
          >
            <Card
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div className="container text-center">
                <div className="row g-0">
                  <div
                    className="col-md-12 d-flex align-items-left"
                    style={{ margin: "32px 0", paddingLeft: "16px", paddingRight: "16px" }}
                  >
                    <h5
                      className="card-title text-capitalize"
                      style={{
                        fontWeight: 650,
                        display: "block",
                        color: "#0096FF",
                        textAlign: "left",
                        fontSize: "24px",
                      }}
                    >
                      PRIVATE FACILITY INSPECTION & LICENSING
                    </h5>
                  </div>
                </div>
                <div className="card mb-3" style={{ maxWidth: "1440px" }}>
                  <div className="row g-0">
                    {/* Text Section */}
                    <div className="col-md-7 d-flex align-items-center">
                      <div className="card-body">
                        <p
                          className="card-text text-justify"
                          style={{
                            color: "#000000",
                            textAlign: "left",
                            fontSize: "18px",
                          }}
                        >
                          The Health Facility Licensing Platform is an innovative system that
                          revolutionizes the licensing process for health facilities. It offers a
                          user-friendly solution, enhancing accessibility, transparency, and
                          efficiency. This platform reduces processing time, minimizes required
                          documentation, and eliminates physical visits to regulatory offices. With
                          real-time application tracking and seamless integrations, it sets a new
                          standard for transparency and accountability, improving healthcare service
                          delivery and ensuring regulatory compliance.
                          <br />
                          <Button
                            onClick={handleClickOpen}
                            sx={{
                              mr: 4,
                              mt: 2,
                              backgroundColor: "#e0e0e0",
                              color: "#000",
                              borderRadius: 2,
                              paddingX: 3,
                              paddingY: 1,
                              boxShadow: "none",
                              "&:hover": {
                                backgroundColor: "#d5d5d5",
                                boxShadow: "none",
                              },
                            }}
                          >
                            Register
                          </Button>
                          <Button
                            onClick={handleClickOpen}
                            sx={{
                              mt: 2,
                              backgroundColor: "#e0e0e0",
                              color: "#000",
                              borderRadius: 2,
                              paddingX: 3,
                              paddingY: 1,
                              boxShadow: "none",
                              "&:hover": {
                                backgroundColor: "#d5d5d5",
                                boxShadow: "none",
                              },
                            }}
                          >
                            Login
                          </Button>
                        </p>
                      </div>
                    </div>

                    {/* Image Section */}
                    <div className="col-md-5" style={{ overflow: "hidden" }}>
                      <img src={woman} alt="Apple Icon" className="img-fluid" />
                    </div>
                  </div>
                </div>
              </div>

              <Box
                sx={{
                  width: "100%",
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(min(200px, 100%), 1fr))",
                  gap: 2,
                }}
              >
                {cards.map((card, index) => (
                  <Card>
                    <CardActionArea
                      onClick={() => setSelectedCard(index)}
                      data-active={selectedCard === index ? "" : undefined}
                      sx={{
                        height: "100%",
                        "&[data-active]": {
                          backgroundColor: "action.selected",
                          "&:hover": {
                            backgroundColor: "action.selectedHover",
                          },
                        },
                      }}
                    >
                      <CardContent sx={{ height: "100%" }}>
                        <Typography variant="h5" component="div">
                          {card.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {card.description}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                ))}
              </Box>
            </Card>

            <br />
            <br />
            <br />
            <Card
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div className="container text-center">
                <div className="row g-0">
                  <div
                    className="col-md-12 d-flex align-items-left"
                    style={{ margin: "32px 0", paddingLeft: "16px", paddingRight: "16px" }}
                  >
                    <h5
                      className="card-title text-capitalize"
                      style={{
                        fontWeight: 650,
                        display: "block",
                        color: "#0096FF",
                        textAlign: "left",
                        fontSize: "24px",
                      }}
                    >
                      GOVERNMENT / PUBLIC FACILITY SURVEYS & ASSESSMENT
                    </h5>
                  </div>
                </div>
                <div className="card mb-3" style={{ maxWidth: "1440px" }}>
                  <div className="row g-0">
                    {/* Text Section */}
                    <div className="col-md-7 d-flex align-items-center">
                      <div className="card-body">
                        <p
                          className="card-text text-justify"
                          style={{
                            color: "#000000",
                            textAlign: "left",
                            fontSize: "18px",
                          }}
                        >
                          Health Facilty survey and assessment platform is to facilitate the
                          planning, execution, and reporting of health-related surveys and
                          assessments. The module supports national health assessments,
                          facility-based surveys, and specialized research studies conducted by the
                          HI, DHS, and other relevant stakeholders. It ensures that data collection
                          follows a standardized methodology, allowing for consistent analysis and
                          evidence-based decision-making.
                        </p>
                      </div>
                    </div>

                    {/* Image Section */}
                    <div className="col-md-5" style={{ overflow: "hidden" }}>
                      <img src={woman} alt="Apple Icon" className="img-fluid" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="row g-0">
                <div className="col-md-12 d-flex align-items-center" />
              </div>
            </Card>
          </Card>
        </Grid>
      </Grid>

      <BootstrapDialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Registration Form
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          <Typography gutterBottom>
            <TextField fullWidth label="email" id="email" />
          </Typography>
          <Typography gutterBottom>
            <TextField id="outlined-basic" label="username" variant="outlined" />
            <TextField id="outlined-basic" label="password" variant="outlined" />
          </Typography>
          <br />
          <Typography gutterBottom>
            <TextField id="outlined-basic" label="FirstName" variant="outlined" />
            <TextField id="outlined-basic" label="Surname" variant="outlined" />
          </Typography>
          <Typography gutterBottom>
            <TextField id="outlined-basic" label="Cellnumber" variant="outlined" />
          </Typography>
          <Typography gutterBottom>
            <TextField id="outlined-basic" label="Type of professional" variant="outlined" />
          </Typography>
          <Typography gutterBottom>
            <TextField id="outlined-basic" label="Registration number" variant="outlined" />
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            Save
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </>
  );
}

export default DefaultBody;
