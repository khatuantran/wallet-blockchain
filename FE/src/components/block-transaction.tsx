import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { convertTimeVN, convertVND } from "../helpers";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";

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

export interface SimpleDialogProps {
  open: boolean;
  selectedValue: number;
  onClose: () => void;
}

export const BlockTransaction = (props: SimpleDialogProps) => {
  const [list, setList] = useState([] as IPendingTransaction[]);

  const getBlock = async () => {
    try {
      const fetch = axios.get(`${process.env.REACT_APP_API_URL}/block-transaction?index=${props.selectedValue}`, {
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

  useEffect(() => {
    getBlock();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Dialog onClose={() => props.onClose()} open={props.open}>
      <DialogTitle>Transaction in block {props.selectedValue}</DialogTitle>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 1000 }} aria-label="customized table">
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
                <StyledTableCell align="center">
                  {t.fromUser === undefined ? "REWARD SYSTEM" : t.fromUser}
                </StyledTableCell>
                <StyledTableCell align="center">{t.toUser}</StyledTableCell>
                <StyledTableCell align="center">{convertVND(t.amount)}</StyledTableCell>
                <StyledTableCell align="center">{convertTimeVN(t.date)}</StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Dialog>
  );
};
