export const REG_EXP_EMAIL: RegExp = new RegExp(
  /^[\w-\.]+@([\w-]+\.)+[\w-]{2,}$/
);

export const REG_EXP_PASSWORD: RegExp = new RegExp(
  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/
);

export interface ALERT_NAME {
  email?: string | null;
  password?: string | null;
  code?: string | null;
  amount?: string | null;
  disabled?: string;
}

export const FORM_ALERT_NAME = {
  EMAIL: "email",
  PASSWORD: "password",
  CODE: "code",
  AMOUNT: "amount",
  RESET: "reset",
};

export const FIELD_STATUS = {
  DISABLED: "disabled",
};

export const FIELD_ERROR = {
  IS_EMPTY: "Введіть значення в поле",
  IS_BIG: "Дуже довге значення, приберіть зайве",
  EMAIL: "Введіть коректне значення e-mail адреси",
  PASSWORD:
    "Пароль повинен складатися з не менше, ніж 8 символів, включаючи хоча б одну цифру, малу та велику літеру",
  AMOUNT: "Сума повинна бути більше нуля",
};

export const validate = (name: string, value: any) => {
  if (String(value).trim().length < 1) {
    return {
      [name]: FIELD_ERROR.IS_EMPTY,
      [FIELD_STATUS.DISABLED]: FIELD_STATUS.DISABLED,
    };
  }

  if (String(value).length > 20) {
    return {
      [name]: FIELD_ERROR.IS_BIG,
      [FIELD_STATUS.DISABLED]: FIELD_STATUS.DISABLED,
    };
  }

  if (name === FORM_ALERT_NAME.EMAIL) {
    if (!REG_EXP_EMAIL.test(String(value))) {
      return {
        [name]: FIELD_ERROR.EMAIL,
        [FIELD_STATUS.DISABLED]: FIELD_STATUS.DISABLED,
      };
    }
  }

  if (name === FORM_ALERT_NAME.PASSWORD) {
    if (!REG_EXP_PASSWORD.test(String(value))) {
      return {
        [name]: FIELD_ERROR.PASSWORD,
        [FIELD_STATUS.DISABLED]: FIELD_STATUS.DISABLED,
      };
    }
  }

  if (name === FORM_ALERT_NAME.AMOUNT) {
    if (Number(value) <= 0) {
      return {
        [name]: FIELD_ERROR.AMOUNT,
        [FIELD_STATUS.DISABLED]: FIELD_STATUS.DISABLED,
      };
    }
    if (String(value).length > 9) {
      return {
        [name]: FIELD_ERROR.IS_BIG,
        [FIELD_STATUS.DISABLED]: FIELD_STATUS.DISABLED,
      };
    }
  }

  return {
    [name]: null,
  };
};

export const validateAll = (obj: { [key: string]: any }): ALERT_NAME => {
  const obj1: { [key: string]: any } = {};
  for (const key in obj) {
    const value = validate(key, obj[key]);
    if (value[key]) {
      obj1[key] = value[key];
      obj1[FIELD_STATUS.DISABLED] = FIELD_STATUS.DISABLED;
    } else {
      obj1[key] = null;
    }
  }

  if (!obj1.hasOwnProperty(FIELD_STATUS.DISABLED)) {
    obj1[FIELD_STATUS.DISABLED] = "";
  }

  return obj1;
};
