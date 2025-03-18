const i18n = require("i18n");
const path = require("path");

i18n.configure({
  locales: ["en", "hi", "de", "fr"],
  directory: path.join(__dirname, "../locales"),
  defaultLocale: "en",
  queryParameter: "lang", // Allows users to set language via query (?lang=hi)
  cookie: "lang", // Allows storing language in a cookie
  register: global,
  autoReload: true,
  syncFiles: true,
  objectNotation: true, // Allows nested translations
  api:{
    __: "t"
  },
  header: "accept-language",
});

module.exports = i18n;