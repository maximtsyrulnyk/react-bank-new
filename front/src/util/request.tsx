export const REQUEST_ACTION_TYPE: {
  PROGRESS: string;
  SUCCESS: string;
  ERROR: string;
  RESET: string;
} = {
  PROGRESS: "progress",
  SUCCESS: "success",
  ERROR: "error",
  RESET: "reset",
};

export const requestInitialState: {
  status: string | null;
  message: string | null;
  data: null | any;
} = {
  status: null,
  message: null,
  data: null,
};

type RequestAction = {
  type: keyof typeof REQUEST_ACTION_TYPE;
  payload?: any;
};

export const requestReducer = (
  state: typeof requestInitialState,
  action: RequestAction
) => {
  switch (action.type) {
    case REQUEST_ACTION_TYPE.PROGRESS:
      return {
        ...state,
        status: action.type,
      };

    case REQUEST_ACTION_TYPE.SUCCESS:
      return {
        ...state,
        status: action.type,
        data: action.payload,
      };

    case REQUEST_ACTION_TYPE.ERROR:
      return {
        ...state,
        status: action.type,
        message: action.payload,
      };

    case REQUEST_ACTION_TYPE.RESET:
      return { ...requestInitialState };

    default:
      return state;
  }
};
