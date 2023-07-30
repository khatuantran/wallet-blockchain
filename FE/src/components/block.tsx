import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import moment from "moment-timezone";
import Divider from "@mui/material/Divider";
import axios from "axios";
import { Card, CardContent, Grid, Typography, CardActionArea } from "@mui/material";
import { convertTimeVN } from "../helpers";
import { BlockTransaction } from "./block-transaction";

interface IBlock {
  index: number;
  hash: string;
  previousHash: string;
  date: string;
  nonce: number;
}

export const Block = () => {
  // const { getUser } = userStore();
  const [list, setList] = useState([] as IBlock[]);
  const [open, setOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(null);

  const getBlock = async () => {
    const fetch = axios.get(`${process.env.REACT_APP_API_URL}/block`, {
      validateStatus: () => true,
    });

    try {
      const res = await toast.promise(fetch, {
        pending: "Loading...",
      });

      if (!res) {
        return toast.error("Fail to fetch");
      }

      if (res.status !== 200) {
        return toast.error(res.data.error);
      }

      setList(res.data.block);
    } catch (error) {
      return toast.error(error.message);
    }
  };

  useEffect(() => {
    getBlock();
  }, []);

  const handleClickOpen = (index) => {
    console.log(index);
    setSelectedValue(index);
    setOpen(true);
  };

  const handleClose = (value: number) => {
    console.log("aa");
    setOpen(false);
    setSelectedValue(null);
  };

  return (
    <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
      {list.map((block, index) => (
        <Grid item xs={2} sm={4} md={4} key={index}>
          <Card sx={{ minWidth: 250 }} style={{ border: "1px solid black" }}>
            <CardActionArea key={index} onClick={() => handleClickOpen(index)}>
              <CardContent>
                <Typography variant="body1" component="div" align="left" minHeight="2rem">
                  Block {index === 0 ? `${index + 1} (Genesis block)` : index + 1}
                </Typography>
              </CardContent>
              <Divider />
              <CardContent>
                <Typography variant="body1" component="div" align="left">
                  Hash
                </Typography>
                <Typography variant="body2" component="div" align="left" color="#9c27b0">
                  {block.hash}
                </Typography>
                <Typography variant="body1" component="div" align="left" marginTop="10px">
                  Hash of previous block
                </Typography>
                <Typography variant="body2" component="div" align="left" color="#651fff">
                  {block.previousHash}
                </Typography>
              </CardContent>
              <Divider />
              <CardContent>
                <Typography variant="body1" component="div" align="left">
                  Nonce
                </Typography>
                <Typography variant="body2" component="div" align="left" color="#ff3d00">
                  {block.nonce}
                </Typography>
              </CardContent>
              <Divider />
              <CardContent>
                <Typography variant="body1" component="div" align="left">
                  Date
                </Typography>
                <Typography variant="body2" component="div" align="left">
                  {convertTimeVN(block.date)}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      ))}
      <BlockTransaction selectedValue={selectedValue} open={open} onClose={handleClose} />
    </Grid>
  );
};
