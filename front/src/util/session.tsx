export const SESSION_KEY = "sessionAuth";

export const saveSession = (value: object) => {
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(value));
  } catch (er) {
    console.error("Error saving session:", er);
    sessionStorage.clear();
  }
};

export const loadSession = () => {
  try {
    const session = sessionStorage.getItem(SESSION_KEY);

    return session ? JSON.parse(session) : null;
  } catch (er) {
    console.error("Error loading session:", er);
    sessionStorage.clear();
    return null;
  }
};
