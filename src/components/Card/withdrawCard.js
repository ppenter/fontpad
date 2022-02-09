import BigNumber from "bignumber.js";
import React, { useEffect, useState } from "react";
import Countdown from "react-countdown";
import { useDispatch, useSelector } from "react-redux";
import IDOPool from "../../contracts/IDOPool.json";
import { fetchData } from "../../redux/data/dataActions";
import * as s from "../../styles/global";
import { utils } from "../../utils";

const WithdrawETH = (props) => {
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [idoInfo, setIdoInfo] = useState(null);
  const [price, setPrice] = useState("0");
  const [loading, setLoading] = useState(false);
  const { idoAddress } = props;
  const dispatch = useDispatch();

  useEffect(async () => {
    if (blockchain.account && blockchain.web3 && idoAddress !== "") {
      try {
        let result = await utils.loadPoolData(
          idoAddress,
          blockchain.web3,
          blockchain.account
        );

        setIdoInfo(result);
      } catch (e) {
        console.log(e);
      }
    }
  }, [idoAddress, blockchain.account, data.ETHamount]);

  if (!blockchain.account || !idoInfo || !blockchain.web3) {
    return null;
  }

  if (!utils.isValidPool(idoInfo)) {
    return null;
  }

  if (idoInfo.owner.toLowerCase() !== blockchain.account.toLowerCase()) {
    return null;
  }

  const web3 = blockchain.web3;

  const withdrawToken = async () => {
    setLoading(true);
    const web3 = blockchain.web3;
    try {
      const IDOPoolContract = await new web3.eth.Contract(
        IDOPool.abi,
        idoAddress
      );

      IDOPoolContract.methods
        .withdrawETH()
        .send({
          from: blockchain.account,
        })
        .once("error", (err) => {
          setLoading(false);
          console.log(err);
        })
        .then((receipt) => {
          setLoading(false);
          console.log(receipt);
          dispatch(fetchData(blockchain.account));
        });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <s.Card
      style={{
        minWidth: 350,
        flex: 1,
        margin: 10,
      }}
    >
      <s.TextTitle>WITHDRAW</s.TextTitle>
      <s.TextID>(Pool owner only)</s.TextID>
      <s.SpacerSmall />
      <s.Container fd="row" ai="center" jc="space-between">
        <s.Container flex={3}>
          <s.TextID>Can withdraw after</s.TextID>
        </s.Container>

        <Countdown date={idoInfo.end * 1000} />
      </s.Container>
      <s.TextID style={{ lineHeight: "0" }}>Or process {">"} 90%</s.TextID>
      <s.SpacerMedium />
      <s.Container fd="row" ai="center" jc="space-between">
        <s.Container flex={2}>
          <s.TextID>Total invested</s.TextID>
          <s.TextDescription>
            {BigNumber(web3.utils.fromWei(idoInfo.balance)).toFixed(2) +
              " " +
              process.env.REACT_APP_CURRENCY}
          </s.TextDescription>
        </s.Container>
        <s.button
          disabled={
            parseInt(Date.now() / 1000) < parseInt(idoInfo.end) ||
            (parseInt(Date.now() / 1000) < parseInt(idoInfo.end) &&
              idoInfo.progress > 90)
          }
          onClick={(e) => {
            e.preventDefault();
            withdrawToken();
          }}
        >
          WITHDRAW
        </s.button>
      </s.Container>
    </s.Card>
  );
};
export default WithdrawETH;
