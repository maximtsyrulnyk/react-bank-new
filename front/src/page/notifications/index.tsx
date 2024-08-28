import "./index.css";

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
import BackButton from "../../component/back-button";
import Heading from "../../component/heading";

import { getDate } from "../../util/getDate";

import {
  requestInitialState,
  requestReducer,
  REQUEST_ACTION_TYPE,
} from "../../util/request";

const BalanceItem = lazy(() => import("../../component/balance-item"));

interface NotificationItem {
  id: string;
  type: string;
  title: string;
  img: string;
  date: string;
}

interface ConvertedData {
  list: NotificationItem[];
  isEmpty: boolean;
}

export default function NotificationsPage() {
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
      const res = await fetch("http://localhost:4000/notifications", {
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

  const convertData = (raw: any): ConvertedData => ({
    list: raw.list.map((item: NotificationItem) => ({
      id: item.id,
      type: item.type,
      title: item.title,
      img: item.img,
      date: getDate(item.date),
    })),

    isEmpty: raw.list.length === 0,
  });

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="notification">
      <div className="notification__header">
        <BackButton />
        <Heading title="Notifications" className="private" />
      </div>
      <div className="notification__main">
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
              <Alert message="Список нотифікацій пустий" />
            ) : (
              stateRequest.data.list
                .reverse()
                .slice(0, 8)
                .map((item: NotificationItem) => (
                  <Fragment key={item.id}>
                    <Suspense
                      fallback={
                        <div>
                          <Skeleton />
                        </div>
                      }
                    >
                      <BalanceItem {...item} />
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
