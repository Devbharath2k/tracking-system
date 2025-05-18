export const BASEURL = "http://localhost:4000";

export const APIpaths = {
  AUTH: {
    LOGIN: "/api/login",
    REGISTER: "/api/register",
    LOGOUT: "/api/logout"
  },
  DASHBOARD: {
    GETDATA: "/api/dashboard"
  },
  INCOME: {
    CREATE_INCOME: "/api/createIncome",
    GETTING_ALLINCOME: "/api/allincome",
    DELETE_INCOME: (incomeId) => `/api/deleteIncome/${incomeId}`,
    DOWNLOAD_INCOMEXCEL: "/api/downloadincome"
  },
  EXPENSE: {
    CREATE_EXPENSE: "/api/create/expense",
    GETING_ALLEXPENSE: "/api/allexpense",
    DELETE_ALLEXPENSE: (expenseId) => `/api/deleteExpense/${expenseId}`,
    DOWNLOAD_EXPENSEXCEL: "/api/downloadExpense"
  }
};
