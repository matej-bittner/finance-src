/**
 * all routes that are accessible to public
 * @type{string[]}
 **/
export const publicRoutes = ["/", "/new-verification", "/blog"];

/**
 * routes used for authentication
 * this will redirect login users to default login redirect
 * @type{string[]}
 **/
export const authRoutes = [
  "/login",
  "/register",
  "/reset",
  "/error",
  "/new-password",
];

/**
 * routes that needs to be available for login/not login users for authentication purposes
 * @type{string}
 **/
export const apiAuthPrefix = "/api/auth";

/**
 * redirect after logging in
 * @type{string}
 **/
export const DEFAULT_LOGIN_REDIRECT = "/dashboard";
export const selectSubscriptionRoutes = ["/subscription-select"];
