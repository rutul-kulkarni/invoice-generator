import React, { useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
import {
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  Paper,
  TextField,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useFieldArray, useForm } from "react-hook-form";

function App() {
  const { register, control } = useForm({
    defaultValues: {
      items: [{ itemName: "", itemQty: "", itemPrice: "" }],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  useEffect(() => {
    console.log(fields);
  }, [fields]);

  return (
    <div className="App">
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
                padding={4}
                spacing={2}
              >
                <Grid item>
                  <Grid container rowSpacing={2}>
                    <Grid item>
                      <div style={{ fontWeight: "500" }}>Current Date: </div>
                    </Grid>
                    <Grid item>
                      <div>{` ${new Date().toLocaleDateString()}`}</div>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item>
                  <Grid container rowSpacing={2}>
                    <Grid item>
                      <div style={{ fontWeight: "500" }}>Invoice Number</div>
                    </Grid>
                    <Grid item>
                      <div>1</div>
                    </Grid>
                  </Grid>
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
                  <TextField label="Cashier" variant="standard" fullWidth />
                </Grid>
                <Grid item lg={6} md={6}>
                  <TextField label="Customer" variant="standard" fullWidth />
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
                    append({ itemName: "", itemQty: "", itemPrice: "" });
                  }}
                >
                  Add Item
                </Button>
              </Grid>
            </Paper>
          </Box>
        </Grid>
        <Grid item xs={12} sm={12} md={4} lg={4}>
          hello
        </Grid>
      </Grid>
    </div>
  );
}

export default App;
