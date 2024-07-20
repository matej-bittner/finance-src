export const languages = [
  { value: "en", title: "English" },
  { value: "cs", title: "Česky" },
];

export const plans = [
  {
    link:
      process.env.NODE_ENV === "development"
        ? "https://buy.stripe.com/test_6oE4gJcFf8T0cDu28a"
        : "https://buy.stripe.com/4gw6s28Ds4oHgUg8wx",
    priceId:
      process.env.NODE_ENV === "development"
        ? "price_1PbodmLy1KHXEetojHh6lTdn"
        : "price_1Peh1cLy1KHXEetob0IekXBA",
    duration: "yearly",
  },
  {
    link:
      process.env.NODE_ENV === "development"
        ? "https://buy.stripe.com/test_14k28BbBbgls5b2eUX"
        : "https://buy.stripe.com/6oE8Aa06W6wP6fC3cc",
    priceId:
      process.env.NODE_ENV === "development"
        ? "price_1PbodKLy1KHXEetoMwxPTsvU"
        : "price_1PegqvLy1KHXEetosMvdUyEq",
    duration: "monthly",
  },
];

export const colors = [
  {
    id: 1,
    color: "red",
    background: "bg-[#E90000]",
    stroke: "stroke-[#E90000]",
    fill: "fill-[#E90000]",
  },
  {
    id: 2,
    color: "blue",
    background: "bg-[#007BFF]",
    stroke: "stroke-[#007BFF]",
    fill: "fill-[#007BFF]",
  },
  {
    id: 3,
    color: "green",
    background: "bg-[#28A745]",
    stroke: "stroke-[#28A745]",
    fill: "fill-[#28A745]",
  },
  {
    id: 4,
    color: "yellow",
    background: "bg-[#ffc107]",
    stroke: "stroke-[#ffc107]",
    fill: "fill-[#ffc107]",
  },
  {
    id: 5,
    color: "purple",
    background: "bg-[#6F42C1]",
    stroke: "stroke-[#6F42C1]",
    fill: "fill-[#6F42C1]",
  },
  {
    id: 6,
    color: "orange",
    background: "bg-[#fd7e14]",
    stroke: "stroke-[#fd7e14]",
    fill: "fill-[#fd7e14]",
  },
  {
    id: 7,
    color: "pink",
    background: "bg-[#ffc0cb]",
    stroke: "stroke-[#ffc0cb]",
    fill: "fill-[#ffc0cb]",
  },
  {
    id: 8,
    color: "teal",
    background: "bg-[#00BDBE]",
    stroke: "stroke-[#00BDBE]",
    fill: "fill-[#00BDBE]",
  },
  {
    id: 9,
    color: "gray",
    background: "bg-[#808080]",
    stroke: "stroke-[#808080]",
    fill: "fill-[#808080]",
  },
];
export const icons = [
  "brush",
  "building",
  "cake",
  "calendar",
  "car",
  "game",
  "gameboy",
  "gift",
  "holiday",
  "hospital",
  "house",
  "mobile",
  "snow",
  "teacher",
  "truck",
];

// prelozeno
export const transactionType = [
  {
    title: "income",
    transaction: "income-transaction",
    abbreviation: "in",
    id: 1,
  },
  {
    title: "expenses",
    transaction: "expenses-transaction",
    abbreviation: "out",
    id: 2,
  },
  {
    title: "between",
    transaction: "between-transaction",
    abbreviation: "between",
    id: 3,
  },
  {
    title: "standing",
    transaction: "standing-transaction",
    abbreviation: "standing",
    id: 4,
  },
];

// prelozeno
export const categories = [
  { id: 1, value: "travel", icon: "car" },
  { id: 2, value: "housing", icon: "building" },
  { id: 3, value: "entertainment", icon: "entertainment" },
  { id: 4, value: "food", icon: "food" },
  { id: 5, value: "shopping", icon: "shop" },
  { id: 6, value: "other", icon: "other" },
];

export const socialsData = [
  {
    title: "Facebook",
    icon: "facebook",
    link: "https://www.facebook.com/profile.php?id=61562829755166",
  },
  {
    title: "Instagram",
    icon: "instagram",
    link: "https://www.instagram.com/walletrecap",
  },
  // {
  //   title: "X",
  //   icon: "x",
  //   link: "#",
  // },
  { title: "E-mail", icon: "", link: "", address: "info@walletrecap.com" },
];

export const currencies = [
  {
    id: 1,
    value: "czk",
    symbol: "Kč",
  },
  {
    id: 2,
    value: "eur",
    symbol: "€",
  },
  {
    id: 3,
    value: "usd",
    symbol: "$",
  },
];
// prelozeno
export const frequencies = [
  {
    value: "7",
    selectText: "7days",
    title: "everyWeek",
  },
  {
    value: "14",
    selectText: "14days",
    title: "everyTwoWeeks",
  },
  {
    value: "30",
    selectText: "1month",
    title: "everyMonth",
  },
  {
    value: "60",
    selectText: "2months",
    title: "everyTwoMonths",
  },
  {
    value: "360",
    selectText: "1year",
    title: "everyYear",
  },
];

//prelozeno
export const accountType = [
  { title: "current", id: 1 },
  { title: "credit", id: 2 },
  { title: "saving", id: 3 },
  { title: "investment", id: 4 },
];

export const navLinks = [
  {
    title: "dashboard.title",
    icon: "home",
    link: "/dashboard",
    "form-title": "goals.form-title",
    "form-desc": "goals.form-desc",
  },
  {
    title: "goals.title",
    icon: "goals",
    link: "/dashboard/goals",
    "form-title": "goals.form-title",
    "form-desc": "goals.form-desc",
  },
  {
    title: "transactions.title",
    icon: "wallet-money",
    link: "/dashboard/transactions",
    "form-title": "transactions.form-title",
    "form-desc": "transactions.form-desc",
  },
  {
    title: "subscriptions.title",
    icon: "ticket-expired",
    link: "/dashboard/subscriptions",
    "form-title": "subscriptions.form-title",
    "form-desc": "subscriptions.form-desc",
  },
  // {
  //   title: "Statistics",
  //   icon: "graph",
  //   link: "/",
  //
  // },
  {
    title: "accounts.title",
    icon: "account",
    link: "/dashboard/accounts",
    "form-title": "goals.form-title",
    "form-desc": "goals.form-desc",
  },
];
