import { TextField } from "@mui/material";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import LockerList from "../components/Modal/lockerList";
import * as s from "../styles/global";
import { utils } from "../utils";

const Locker = (props) => {
  const [address, setAddress] = useState("");
  const contract = useSelector((state) => state.contract);

  if (!contract.web3) {
    return null;
  }

  let filter = { tokenAddress: address };
  return (
    <s.Container ai="center">
      <s.TextTitle>Locker</s.TextTitle>
      <s.SpacerMedium />
      <TextField
        fullWidth
        label={"Search by token address "}
        onChange={async (e) => {
          e.preventDefault();
          await utils.typewatch(2000);
          setAddress(e.target.value);
        }}
      />
      <LockerList
        filter={
          address !== ""
            ? contract.web3.utils.isAddress(address)
              ? filter
              : { tokenAddress: "0x0000000000000000000000000000000000000000" }
            : {}
        }
      />
    </s.Container>
  );
};

export default Locker;
