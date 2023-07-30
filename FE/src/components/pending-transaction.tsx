import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { convertTimeVN, convertVND } from "../helpers";
import LoadingButton from "@mui/lab/LoadingButton";
import HandymanIcon from "@mui/icons-material/Handyman";
import { userStore } from "../helpers";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

interface IPendingTransaction {
  from: string;
  to: string;
  amount: number;
  date: string;
  fromUser: string;
  toUser: string;
}

export const PendingTransaction = () => {
  const [list, setList] = useState([] as IPendingTransaction[]);
  const [isLoading, setLoading] = useState(false);
  const { getUser } = userStore();

  const getBlock = async () => {
    try {
      const fetch = axios.get(`${process.env.REACT_APP_API_URL}/transaction`, {
        validateStatus: () => true,
      });

      const res = await toast.promise(fetch, {
        pending: "Loading...",
      });

      if (res.status !== 200) {
        return toast.error(res.data.error);
      }

      setList(res.data.transaction);
    } catch (error) {
      return toast.error(error.message);
    }
  };

  const startMining = async () => {
    try {
      setLoading(true);
      const fetch = axios.post(
        `${process.env.REACT_APP_API_URL}/mine`,
        {
          userName: getUser().userName,
        },
        {
          validateStatus: () => true,
        },
      );

      const res = await toast.promise(fetch, {
        pending: "Loading...",
      });

      if (res.status !== 200) {
        setLoading(false);
        return toast.error(res.data.error);
      }

      setList(res.data.transaction);
      setLoading(false);
      toast.success("Mining transaction success and receive reward");
    } catch (error) {
      setLoading(false);
      return toast.error(error.message);
    }
  };

  useEffect(() => {
    getBlock();
  }, []);

  return (
    <Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell align="center">Index</StyledTableCell>
              <StyledTableCell align="center">From</StyledTableCell>
              <StyledTableCell align="center">To</StyledTableCell>
              <StyledTableCell align="center">Amount</StyledTableCell>
              <StyledTableCell align="center">Date</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {list.map((t, index) => (
              <StyledTableRow key={index}>
                <StyledTableCell align="center">{index + 1}</StyledTableCell>
                <StyledTableCell align="center">{t.fromUser}</StyledTableCell>
                <StyledTableCell align="center">{t.toUser}</StyledTableCell>
                <StyledTableCell align="center">{convertVND(t.amount)}</StyledTableCell>
                <StyledTableCell align="center">{convertTimeVN(t.date)}</StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <LoadingButton
        color="secondary"
        onClick={() => startMining()}
        loading={isLoading}
        loadingPosition="start"
        startIcon={<HandymanIcon />}
        variant="contained"
        style={{ marginTop: "10px" }}
      >
        <span>Start mining</span>
      </LoadingButton>
    </Box>
  );
};
