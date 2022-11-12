import { useEffect, useState } from "react";
import "./App.css";
import {
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import PercentIcon from "@mui/icons-material/Percent";
import DeleteIcon from "@mui/icons-material/Delete";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import ViewInvoiceDialogue from "./ViewInvoiceDialogue";

const Invoice = () => {
  const { register, control } = useForm({
    defaultValues: {
      items: [{ itemName: "", itemQty: 1, itemPrice: 0 }],
      discountRate: 0,
      taxRate: 0,
      cashier: "",
      customer: "",
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const customerWatch = useWatch({
    control,
    name: "customer",
  });

  const itemsWatch = useWatch({
    control,
    name: "items",
  });

  const cashierWatch = useWatch({
    control,
    name: "cashier",
  });

  const discountRateWatch = useWatch({
    control,
    name: "discountRate",
  });

  const taxRateWatch = useWatch({
    control,
    name: "taxRate",
  });

  const [totalObj, setTotalObj] = useState<any>({
    Subtotal: "0",
    Discount: "0",
    Tax: "0",
    Total: "0",
  });
  const [openDialogue, setOpenDialogue] = useState(false);

  const calculateTotal = () => {
    let Subtotal = 0;
    itemsWatch.forEach((val) => {
      if (val.itemName.trim() !== "" && val.itemName.trim().length > 3) {
        Subtotal = Subtotal + val.itemQty * val.itemPrice;
      }
    });
    let Discount = discountRateWatch
      ? ((Subtotal * discountRateWatch) / 100).toFixed(2)
      : 0;
    let Tax = taxRateWatch ? ((Subtotal * taxRateWatch) / 100).toFixed(2) : 0;

    setTotalObj({
      Subtotal,
      Discount: `( ${discountRateWatch}% ) ${Discount}`,
      Tax: `( ${taxRateWatch}% ) ${Tax}`,
      Total: (Subtotal + Number(Tax) - Number(Discount)).toFixed(2),
    });
  };

  useEffect(() => {
    calculateTotal();
  }, [itemsWatch, discountRateWatch, taxRateWatch]);

  const totalList = [
    {
      label: "Subtotal",
    },
    {
      label: "Discount",
    },
    {
      label: "Tax",
    },
    {
      label: "Total",
    },
  ];

  const handleClickOpen = () => {
    setOpenDialogue(true);
  };

  return (
    <>
      <Grid container padding={6} paddingLeft={16}>
        <Grid item xs={12} sm={12} md={8} lg={8}>
          <Box
            sx={{
              display: "flex",
              "& > :not(style)": {
                m: 1,
                width: "900px",
                minHeight: "600px",
              },
            }}
          >
            <Paper elevation={1}>
              <Grid
                container
                justifyContent="space-between"
                padding={2}
                spacing={2}
              >
                <Grid item>
                  <Typography style={{ fontWeight: "500" }}>
                    {`Current Date: ${new Date().toLocaleDateString()}`}
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography style={{ fontWeight: "500" }}>
                    {`Invoice Number: ${Math.floor(
                      Math.random() * (9999 - 1000 + 1) + 1000
                    )}`}
                  </Typography>
                </Grid>
              </Grid>

              <Grid container justifyContent="center">
                <p style={{ fontWeight: "700" }}>INVOICE</p>
              </Grid>

              <Grid
                container
                justifyContent="space-between"
                spacing={2}
                padding={2}
              >
                <Grid item lg={6} md={6}>
                  <TextField
                    {...register(`cashier`)}
                    label="Cashier"
                    variant="standard"
                    fullWidth
                  />
                </Grid>
                <Grid item lg={6} md={6}>
                  <TextField
                    {...register(`customer`)}
                    label="Customer"
                    variant="standard"
                    fullWidth
                  />
                </Grid>
              </Grid>

              <Grid container marginTop={2} padding={2}>
                <Grid item lg={8} md={8} textAlign="left">
                  <div style={{ fontWeight: "700" }}>ITEM</div>
                </Grid>
                <Grid item lg={4} md={4}>
                  <Grid container>
                    <Grid item lg={3} md={3}>
                      <div style={{ fontWeight: "500" }}>QTY.</div>
                    </Grid>
                    <Grid item lg={6} md={6}>
                      <div style={{ fontWeight: "500" }}>PRICE</div>
                    </Grid>
                    <Grid item lg={3} md={3}>
                      <div style={{ fontWeight: "500" }}>ACTION</div>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Divider variant="middle" />

              {fields.map((item, index) => (
                <Grid container padding={2}>
                  <Grid item lg={8} md={8} textAlign="left">
                    <TextField
                      label=""
                      variant="standard"
                      fullWidth
                      {...register(`items.${index}.itemName`)}
                      defaultValue={item.itemName}
                    />
                  </Grid>
                  <Grid item lg={4} md={4}>
                    <Grid container>
                      <Grid item lg={3} md={3}>
                        <TextField
                          label=""
                          variant="standard"
                          style={{ width: "60%" }}
                          type="number"
                          {...register(`items.${index}.itemQty`)}
                          defaultValue={item.itemQty}
                        />
                      </Grid>
                      <Grid item lg={6} md={6}>
                        <TextField
                          label=""
                          variant="standard"
                          style={{ width: "60%" }}
                          {...register(`items.${index}.itemPrice`)}
                          defaultValue={item.itemPrice}
                          type="number"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <CurrencyRupeeIcon fontSize="small" />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                      <Grid item lg={3} md={3}>
                        <IconButton
                          onClick={() => {
                            remove(index);
                          }}
                        >
                          <DeleteIcon style={{ color: "red" }} />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              ))}

              <Grid container padding={2}>
                <Button
                  variant="text"
                  onClick={() => {
                    append({ itemName: "", itemQty: 1, itemPrice: 0 });
                  }}
                >
                  Add Item
                </Button>
              </Grid>

              {totalList.map((val, index) => (
                <>
                  <Grid container padding={2}>
                    <Grid
                      container
                      justifyContent="space-between"
                      lg={6}
                      md={6}
                    >
                      {""}
                    </Grid>
                    <Grid
                      container
                      justifyContent="space-between"
                      lg={6}
                      md={6}
                    >
                      <Grid item>
                        <Typography style={{ fontWeight: "600" }}>
                          {val.label} :
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography>{totalObj[val.label]}</Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                  {index === totalList.length - 2 && (
                    <Divider variant="middle" />
                  )}
                </>
              ))}
            </Paper>
          </Box>
        </Grid>
        <Grid
          container
          item
          xs={12}
          sm={12}
          md={4}
          lg={4}
          paddingLeft={3}
          paddingTop={3}
          spacing={3}
          flexDirection="column"
        >
          <Grid item>
            <Button variant="contained" fullWidth onClick={handleClickOpen}>
              Review Invoice
            </Button>
          </Grid>
          <Grid item>
            <TextField
              label="Tax Rate"
              variant="standard"
              fullWidth
              type="number"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <PercentIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
              {...register("taxRate")}
            />
          </Grid>
          <Grid item>
            <TextField
              label="Discount Rate"
              variant="standard"
              fullWidth
              type="number"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <PercentIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
              {...register("discountRate")}
            />
          </Grid>
        </Grid>
      </Grid>
      <ViewInvoiceDialogue
        open={openDialogue}
        setOpen={setOpenDialogue}
        cashier={cashierWatch}
        customer={customerWatch}
        items={itemsWatch}
        totalList={totalList}
        total={totalObj}
      />
    </>
  );
};

export default Invoice;
