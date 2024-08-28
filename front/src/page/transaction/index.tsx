import "./index.css";

import { useParams } from "react-router-dom";
import { useAuth } from "../../util/router/AuthContext";

import { Fragment, useEffect, useReducer, Suspense, useCallback } from "react";

import { Alert, Skeleton } from "../../component/load";
import { getDate } from "../../util/getDate";
import BackButton from "../../component/back-button";
import Heading from "../../component/heading";
import { getSum } from "../../util/getSum";

import {
  requestInitialState,
  requestReducer,
  REQUEST_ACTION_TYPE,
} from "../../util/request";

interface TransactionData {
  id: string;
  email: string;
  sum: number;
  type: string;
  date: string;
}

export default function TransactionPage() {
  const { transactionId } = useParams<{ transactionId: string }>();

  const [stateRequest, dispatchRequest] = useReducer(
    requestReducer,
    requestInitialState
  );

  const { state } = useAuth();

  const getData = useCallback(async () => {
    dispatchRequest({
      type: REQUEST_ACTION_TYPE.PROGRESS as keyof typeof REQUEST_ACTION_TYPE,
    });
    try {
      const res = await fetch("http://localhost:4000/transaction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: state.token,
          user: state.user,
          id: transactionId,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        dispatchRequest({
          type: REQUEST_ACTION_TYPE.SUCCESS as keyof typeof REQUEST_ACTION_TYPE,
          payload: convertData(data.transaction),
        });
      } else {
        dispatchRequest({
          type: REQUEST_ACTION_TYPE.ERROR as keyof typeof REQUEST_ACTION_TYPE,
          payload: data.message,
        });
      }
    } catch (error: any) {
      dispatchRequest({
        type: REQUEST_ACTION_TYPE.ERROR as keyof typeof REQUEST_ACTION_TYPE,
        payload: error.message,
      });
    }
  }, []);

  useEffect(() => {
    getData();
  }, [getData, transactionId]);

  const convertData = ({ id, email, sum, type, date }: TransactionData) => ({
    isPositive: sum > 0,
    id: id,
    email: email,
    sum: getSum(sum),
    type: type,
    date: getDate(date),
  });

  return (
    <div className="transaction">
      <div className="transaction__header">
        <BackButton />
        <Heading title="Transaction" className="private" />
      </div>
      <div className="transaction__main">
        <h2>
          {stateRequest.status === REQUEST_ACTION_TYPE.SUCCESS && (
            <span
              className={stateRequest.data.isPositive ? "positive__sum" : ""}
            >
              {stateRequest.data.isPositive ? "+" : ""}
              {stateRequest.data.sum}
            </span>
          )}
        </h2>

        <div className="transaction__main-content">
          {stateRequest.status === REQUEST_ACTION_TYPE.PROGRESS && (
            <Fragment>
              <div>
                <Skeleton />
              </div>
              <div>
                <Skeleton />
              </div>
            </Fragment>
          )}
          {stateRequest.status === REQUEST_ACTION_TYPE.ERROR && (
            <Alert
              status={stateRequest.status}
              message={stateRequest.message}
            />
          )}

          {stateRequest.status === REQUEST_ACTION_TYPE.SUCCESS && (
            <Suspense
              fallback={
                <div>
                  <Skeleton />
                </div>
              }
            >
              <div>
                <span>Date</span> <span>{stateRequest.data.date}</span>
              </div>
              <div className="transaction__main-divider"></div>
              <div>
                <span>Address</span> <span>{stateRequest.data.email}</span>
              </div>
              <div className="transaction__main-divider"></div>

              <div>
                <span>Type</span> <span>{stateRequest.data.type}</span>
              </div>
            </Suspense>
          )}
        </div>
      </div>
    </div>
  );
}
