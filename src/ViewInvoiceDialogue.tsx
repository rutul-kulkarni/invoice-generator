import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import { Divider, Grid, Typography } from "@mui/material";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";

const ViewInvoiceDialogue = ({
  open,
  setOpen,
  cashier,
  customer,
  items,
  totalList,
  total,
}: any) => {
  const handleClose = () => {
    setOpen(false);
    window.location.reload();
  };

  const SaveAsPDFHandler = () => {
    const dom: any = document.getElementById("print");
    toPng(dom)
      .then((dataUrl) => {
        const img = new Image();
        img.crossOrigin = "annoymous";
        img.src = dataUrl;
        img.onload = () => {
          // Initialize the PDF.
          const pdf = new jsPDF({
            orientation: "portrait",
            unit: "in",
            format: [5.5, 8.5],
          });

          // Define reused data
          const imgProps = pdf.getImageProperties(img);
          const imageType = imgProps.fileType;
          const pdfWidth = pdf.internal.pageSize.getWidth();

          // Calculate the number of pages.
          const pxFullHeight = imgProps.height;
          const pxPageHeight = Math.floor((imgProps.width * 8.5) / 5.5);
          const nPages = Math.ceil(pxFullHeight / pxPageHeight);

          // Define pageHeight separately so it can be trimmed on the final page.
          let pageHeight = pdf.internal.pageSize.getHeight();

          // Create a one-page canvas to split up the full image.
          const pageCanvas = document.createElement("canvas");
          const pageCtx: any = pageCanvas.getContext("2d");
          pageCanvas.width = imgProps.width;
          pageCanvas.height = pxPageHeight;

          for (let page = 0; page < nPages; page++) {
            // Trim the final page to reduce file size.
            if (page === nPages - 1 && pxFullHeight % pxPageHeight !== 0) {
              pageCanvas.height = pxFullHeight % pxPageHeight;
              pageHeight = (pageCanvas.height * pdfWidth) / pageCanvas.width;
            }
            // Display the page.
            const w = pageCanvas.width;
            const h = pageCanvas.height;
            pageCtx.fillStyle = "white";
            pageCtx.fillRect(0, 0, w, h);
            pageCtx.drawImage(img, 0, page * pxPageHeight, w, h, 0, 0, w, h);

            // Add the page to the PDF.
            if (page) pdf.addPage();

            const imgData = pageCanvas.toDataURL(`image/${imageType}`, 1);
            pdf.addImage(imgData, imageType, 0, 0, pdfWidth, pageHeight);
          }
          // Output / Save
          pdf.save(`invoice.pdf`);
        };
      })
      .catch((error) => {
        console.error("oops, something went wrong!", error);
      });
  };

  return (
    <React.Fragment>
      <Dialog fullWidth maxWidth="sm" open={open} onClose={handleClose}>
        <DialogContent>
          <Grid id="print" padding={2}>
            <Grid container justifyContent="center" paddingBottom={2}>
              <Typography fontWeight={600}>INVOICE</Typography>
            </Grid>
            <Divider />
            <Grid
              container
              spacing={5}
              lg={6}
              justifyContent="space-between"
              paddingTop={2}
            >
              <Grid item>
                <Typography fontWeight={600}>Cashier</Typography>
              </Grid>
              <Grid item>
                <Typography>{cashier}</Typography>
              </Grid>
            </Grid>
            <Grid container spacing={5} lg={6} justifyContent="space-between">
              <Grid item>
                <Typography fontWeight={600}>Customer</Typography>
              </Grid>
              <Grid item>
                <Typography>{customer}</Typography>
              </Grid>
            </Grid>
            <Grid container marginTop={2} padding={2}>
              <Grid item lg={8} md={8} textAlign="left">
                <Typography fontSize={16} fontWeight={600}>
                  ITEM
                </Typography>
              </Grid>
              <Grid item lg={4} md={4}>
                <Grid container>
                  <Grid item lg={3} md={3}>
                    <Typography fontSize={16} fontWeight={600}>
                      QTY.
                    </Typography>
                  </Grid>
                  <Grid item lg={6} md={6}>
                    <Typography fontSize={16} fontWeight={600}>
                      PRICE
                    </Typography>
                  </Grid>
                  <Grid item lg={3} md={3}>
                    <Typography fontSize={16} fontWeight={600}>
                      AMOUNT
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Divider />
            {items.map((item: any, index: number) => (
              <Grid container padding={2}>
                <Grid item lg={8} md={8} textAlign="left">
                  <Typography fontSize={16}>{item.itemName}</Typography>
                </Grid>
                <Grid item lg={4} md={4}>
                  <Grid container>
                    <Grid item lg={3} md={3}>
                      <Typography fontSize={16}>{item.itemQty}</Typography>
                    </Grid>
                    <Grid item lg={6} md={6}>
                      <Typography fontSize={16}>{item.itemPrice}</Typography>
                    </Grid>
                    <Grid item lg={3} md={3}>
                      <Typography fontSize={16}>
                        {item.itemQty * item.itemPrice}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            ))}
            <Divider />
            {totalList.map((val: any, index: any) => (
              <>
                <Grid container padding={2}>
                  <Grid container justifyContent="space-between" lg={6} md={6}>
                    {""}
                  </Grid>
                  <Grid container justifyContent="space-between" lg={6} md={6}>
                    <Grid item>
                      <Typography style={{ fontWeight: "600" }}>
                        {val.label} :
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography>{total[val.label]}</Typography>
                    </Grid>
                  </Grid>
                </Grid>
                {index === totalList.length - 2 && <Divider variant="middle" />}
              </>
            ))}
          </Grid>
          <Grid container spacing={3}>
            <Grid item lg={6} md={6}>
              <Button variant="contained" onClick={SaveAsPDFHandler} fullWidth>
                <FileDownloadIcon />
                Download
              </Button>
            </Grid>
            <Grid item lg={6} md={6}>
              <Button variant="outlined" onClick={handleClose} fullWidth>
                <SkipNextIcon />
                Next
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
};

export default ViewInvoiceDialogue;
