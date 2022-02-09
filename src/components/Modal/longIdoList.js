import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import * as s from "../../styles/global";
import { utils } from "../../utils";
import LongIdo from "../Card/longIdo";

const LongIdoList = (props) => {
  const [allPools, setAllPools] = useState([]);
  const [totalInvested, setTotalInvested] = useState(0);
  const [limit, setLimit] = useState(5);
  const [loading, setLoading] = useState(false);
  const blockchain = useSelector((state) => state.blockchain);
  const contract = useSelector((state) => state.contract);

  const { filter = {} } = props;

  useEffect(async () => {
    if (!contract.IDOFactory) {
      return null;
    }
    setLoading(true);
    contract.IDOFactory.events.IDOCreated(
      {
        fromBlock: 0,
        filter: filter,
      },
      async function (error, event) {
        setAllPools((p) => [event.returnValues, ...p]);
        await utils.timeout(3000);
        setLoading(false);
      }
    );
  }, [contract.web3, blockchain.account]);

  const loadmore = (amount) => {
    setLimit((p) => (p < allPools.length ? p + amount : p));
  };

  return (
    <s.Container ai="center">
      <s.Container ai="center">
        <s.Container
          jc="space-around"
          style={{ flexWrap: "wrap", marginTop: 20 }}
        >
          {allPools.map((item, index) => {
            if (index >= limit) {
              return null;
            }
            return (
              <s.Container style={{ padding: 10 }}>
                <LongIdo idoAddress={item.idoPool} />
              </s.Container>
            );
          })}
        </s.Container>
      </s.Container>
      <s.SpacerSmall />
      {limit >= allPools.length ? null : (
        <s.button
          onClick={async (e) => {
            e.preventDefault();
            setLoading(true);
            await utils.timeout(1000);
            loadmore(6);
            setLoading(false);
          }}
        >
          {loading ? "LOADING . . ." : "LOADMORE"}
        </s.button>
      )}
    </s.Container>
  );
};

export default LongIdoList;
