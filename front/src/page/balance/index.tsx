import "./index.css";

import { Link } from "react-router-dom";
import { useAuth } from "../../util/router/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Fragment,
  useEffect,
  useReducer,
  lazy,
  Suspense,
  useCallback,
} from "react";

import { Alert, Skeleton } from "../../component/load";
import { getDate } from "../../util/getDate";
import { getSum } from "../../util/getSum";

import {
  requestInitialState,
  requestReducer,
  REQUEST_ACTION_TYPE,
} from "../../util/request";

const BalanceItem = lazy(() => import("../../component/balance-item"));

interface TransactionItem {
  id: string;
  email: string;
  img: string;
  sum: number;
  title: string;
  type: string;
  date: string;
}

interface ConvertedData {
  list: {
    isPositive: boolean;
    id: string;
    email: string;
    img: string;
    sum: string;
    title: string;
    type: string;
    date: string;
  }[];
  isEmpty: boolean;
  balance: string;
}

export default function BalancePage() {
  const [stateRequest, dispatchRequest] = useReducer(
    requestReducer,
    requestInitialState
  );

  const { state } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!state.user.isConfirm) {
      navigate("/signup-confirm");
    }
  }, []);

  const getData = useCallback(async () => {
    dispatchRequest({
      type: REQUEST_ACTION_TYPE.PROGRESS as keyof typeof REQUEST_ACTION_TYPE,
    });
    try {
      const res = await fetch("http://localhost:4000/balance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: state.token,
          user: state.user,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        dispatchRequest({
          type: REQUEST_ACTION_TYPE.SUCCESS as keyof typeof REQUEST_ACTION_TYPE,
          payload: convertData(data),
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

  const convertData = ({
    balance,
    ...raw
  }: {
    balance: number;
    list: TransactionItem[];
  }): ConvertedData => ({
    list: raw.list
      .reverse()
      .slice(0, 8)
      .map(({ id, email, img, sum, title, type, date }) => ({
        isPositive: sum > 0,
        id,
        email,
        img,
        sum: getSum(sum),
        title,
        type,
        date: getDate(date),
      })),

    isEmpty: raw.list.length === 0,
    balance: getSum(balance),
  });

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="balance">
      <div className="balance__header">
        <div className="settings">
          <Link to="/settings">
            <img
              src="../../../svg/settings.svg"
              width="25"
              height="25"
              alt=""
            />
          </Link>

          <span>Main wallet</span>
          <Link to="/notifications">
            {" "}
            <img src="../../../svg/bell.svg" width="25" height="25" alt="" />
          </Link>
        </div>
        <h2>
          <span>
            {stateRequest.status === REQUEST_ACTION_TYPE.SUCCESS
              ? stateRequest.data.balance
              : 0}
          </span>
        </h2>
        <div className="balance__operation">
          <Link className="balance__operation--link" to="/recive">
            <span className="balance__recive"></span>
          </Link>

          <Link className="balance__operation--link" to="/send">
            <span className="balance__send"></span>
          </Link>
        </div>
      </div>
      <div className="balance__main">
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
          <Alert status={stateRequest.status} message={stateRequest.message} />
        )}

        {stateRequest.status === REQUEST_ACTION_TYPE.SUCCESS && (
          <Fragment>
            {stateRequest.data.isEmpty ? (
              <Alert message="Список транзакцій пустий" />
            ) : (
              stateRequest.data.list.map((item: TransactionItem) => (
                <Fragment key={item.id}>
                  <Suspense
                    fallback={
                      <div>
                        <Skeleton />
                      </div>
                    }
                  >
                    <Link to={`/transaction/${item.id}`}>
                      <BalanceItem {...item} />
                    </Link>
                  </Suspense>
                </Fragment>
              ))
            )}
          </Fragment>
        )}
      </div>
    </div>
  );
}
