import BigNumber from "bignumber.js";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import * as s from "../../styles/global";
import { utils } from "../../utils";

const LongLocker = (props) => {
  const contract = useSelector((state) => state.contract);
  const [lockerInfo, setLockerInfo] = useState(null);
  const [image, setImage] = useState("");
  const { lockerAddress } = props;

  useEffect(async () => {
    if (contract.web3 && lockerAddress) {
      const web3 = contract.web3;

      let result = await utils.getLockerData(lockerAddress, web3);
      setLockerInfo(result);
    }
  }, [lockerAddress]);

  if (!lockerAddress || !lockerInfo) {
    return (
      <s.Card ai="center" style={{ maxWidth: 500, margin: 20, minWidth: 400 }}>
        Loading
      </s.Card>
    );
  }

  return (
    <NavLink
      to={"/locker/" + lockerAddress}
      style={{
        textDecoration: "none",
        color: "white",
        width: "100%",
      }}
    >
      <s.Card
        fd="row"
        p={"20px"}
        style={{ maxWidth: "100%" }}
        jc="space-between"
      >
        {console.log(lockerInfo)}
        <s.TextDescription>{lockerInfo.token.tokenName}</s.TextDescription>
        <s.TextDescription>
          {BigNumber(lockerInfo.balance)
            .dividedBy(
              BigNumber(10 ** parseInt(lockerInfo.token.tokenDecimals))
            )
            .toFixed(2) +
            " $" +
            lockerInfo.token.tokenSymbol}
        </s.TextDescription>
      </s.Card>
    </NavLink>
  );
};
export default LongLocker;
