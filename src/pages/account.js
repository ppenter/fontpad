import React from "react";
import { useSelector } from "react-redux";
import CreateLaunchpad from "../components/Button/createLaunchpad";
import CreateLocker from "../components/Button/createLocker";
import IDOList from "../components/Modal/idoList";
import LockerList from "../components/Modal/lockerList";
import * as s from "../styles/global";
import LongIdoList from "../components/Modal/longIdoList";

const Account = (props) => {
  const blockchain = useSelector((state) => state.blockchain);

  if (!blockchain.account) {
    return (
      <s.Container ai="center">
        <s.TextTitle>Account</s.TextTitle>
        <s.TextDescription>Please login</s.TextDescription>
      </s.Container>
    );
  }

  let filter = { owner: blockchain.account };

  return (
    <s.Container ai="center">
      <s.TextTitle>Account</s.TextTitle>
      <s.SpacerMedium />
      <s.Container fd="row" jc="space-between">
        <s.Container flex={1}>
          <s.Container fd="row" ai="center" jc="space-between">
            <s.TextTitle style={{ flex: 1, whiteSpace: "nowrap", margin: 20 }}>
              My IDO
            </s.TextTitle>
            <CreateLaunchpad />
          </s.Container>
          <LongIdoList filter={filter} />
        </s.Container>

        <s.Container flex={1}>
          <s.Container fd="row" ai="center" jc="space-between">
            <s.TextTitle style={{ flex: 1, whiteSpace: "nowrap", margin: 20 }}>
              My Locker
            </s.TextTitle>
            <CreateLocker />
          </s.Container>
          <LockerList />
        </s.Container>
      </s.Container>
    </s.Container>
  );
};

export default Account;
