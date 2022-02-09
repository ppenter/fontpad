import BigNumber from "bignumber.js";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import * as s from "../../styles/global";
import { utils } from "../../utils";
import ProgressBar from "../Modal/ProgressBar";
import PoolCountdown from "../Utils/poolCountdown";

const LongIdo = (props) => {
  const contract = useSelector((state) => state.contract);
  const [idoInfo, setIdoInfo] = useState(null);
  const [image, setImage] = useState("");
  const { idoAddress } = props;

  let imageSolid = require("../../assets/images/image-solid.png");

  useEffect(async () => {
    if (contract.web3) {
      const web3 = contract.web3;

      let result = await utils.loadPoolData(idoAddress, web3, "");
      setIdoInfo(result);
      setImage(result.metadata.image);
    }
  }, [idoAddress]);

  if (!utils.isValidPool(idoInfo)) {
    return (
      <s.Card ai="center" style={{ maxWidth: 500, margin: 20, minWidth: 400 }}>
        Loading
      </s.Card>
    );
  }

  return (
    <NavLink
      to={"/launchpad/" + idoAddress}
      style={{
        textDecoration: "none",
        color: "white",
        width: "100%",
      }}
    >
      <s.Container>
        <s.Card
          fd="row"
          p={"20px"}
          ai="center"
          style={{ width: "100%" }}
          jc="space-between"
        >
          <s.Container
            flex={3}
            fd={"row"}
            ai="center"
            style={{ flexWrap: "nowrap" }}
          >
            <img
              style={{ width: 60, height: 60, borderRadius: 10 }}
              src={image}
              onError={(e) => {
                setImage(imageSolid.default);
              }}
            ></img>
            <s.Container flex={1} ai="flex-start" style={{ paddingLeft: 20 }}>
              <s.TextDescription>{idoInfo.tokenName}</s.TextDescription>
              <s.TextID>${idoInfo.tokenSymbol}</s.TextID>
            </s.Container>
          </s.Container>

          <s.Container flex={1} ai="flex-end">
            <PoolCountdown start={idoInfo.start} end={idoInfo.end} />
          </s.Container>
          <ProgressBar
            now={BigNumber(idoInfo.currentDistributed)
              .times(100)
              .dividedBy(BigNumber(idoInfo.maxDistributed))}
          />
        </s.Card>
      </s.Container>
    </NavLink>
  );
};
export default LongIdo;
