import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import * as s from "../../styles/global";
import { utils } from "../../utils";
import PoolRenderer from "../Card/poolRenderer";

const IDOList = (props) => {
  const [tallPools, settAllPools] = useState([]);
  const [allPools, setAllPools] = useState([]);
  const [totalInvested, setTotalInvested] = useState(0);
  const [limit, setLimit] = useState(5);
  const [loading, setLoading] = useState(false);
  const blockchain = useSelector((state) => state.blockchain);
  const contract = useSelector((state) => state.contract);

  const { filter = {} } = props;

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setLoading(false);
      setAllPools(tallPools);
    }, 3000);

    return () => clearTimeout(delayDebounceFn);
  }, [tallPools]);

  useEffect(async () => {
    settAllPools([]);
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
        settAllPools((p) => [event.returnValues, ...p]);
      }
    );
  }, [contract.web3, blockchain.account, filter]);

  const loadmore = (amount) => {
    setLimit((p) => (p < allPools.length ? p + amount : p));
  };

  if (!allPools.length) {
    return <s.TextDescription fullWidth>Loading</s.TextDescription>;
  }
  return (
    <s.Container ai="center">
      <s.Container ai="center">
        <s.Container
          fd="row"
          jc="space-around"
          style={{ flexWrap: "wrap", marginTop: 20 }}
        >
          {allPools.map((item, index) => {
            if (index >= limit) {
              return null;
            }
            return (
              <PoolRenderer
                key={index}
                idoAddress={item.idoPool}
                tokenAddress={item.rewardToken}
                distributed={item.maxDistributedTokenAmount}
                start={item.startTimestamp}
                end={item.finishTimestamp}
                min={item.minEthPayment}
                max={item.maxETHPayment}
                claimDate={item.startClaimTimestamp}
              ></PoolRenderer>
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

export default IDOList;
