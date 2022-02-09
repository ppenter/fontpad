import { TextField } from "@mui/material";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import IDOList from "../components/Modal/idoList";
import * as s from "../styles/global";
import { utils } from "../utils";

const Launchpad = (props) => {
  const [address, setAddress] = useState("");
  const contract = useSelector((state) => state.contract);

  if (!contract.web3) {
    return null;
  }

  let filter = { rewardToken: address };
  return (
    <s.Container ai="center">
      <s.TextTitle>Launchpad</s.TextTitle>
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
      <IDOList
        filter={
          address !== ""
            ? contract.web3.utils.isAddress(address)
              ? filter
              : { rewardToken: "0x0000000000000000000000000000000000000000" }
            : {}
        }
      />
    </s.Container>
  );
};

export default Launchpad;
