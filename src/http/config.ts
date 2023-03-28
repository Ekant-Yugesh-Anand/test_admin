export const baseUrl = process.env.REACT_APP_BASE_URL || "";

export const baseUrl4=process.env.REACT_APP_BASE_URL_V4 ||"";

// export const auth0BaseUrl = `https://dev-pwaq157w.us.auth0.com/`;
// export const baseUrlImg =
//   "https://api-dev.dev.dev-cglcloud.com/api/remoteassistance/digitalsaathi/v4";

// export const auth0Config = {
//   client_id: "3ywL4I5FpbCrn5auVuIUJygaYUrQhwQp",
//   client_secret:
//     "f7QeCrdXl84gitgwE5vXuJLGrcjizAzzK8IqsY97eFPnl8Evh5qzrWmnjj5V-9ch",
//   audience: "https://dev-pwaq157w.us.auth0.com/api/v2/",
//   grant_type: "client_credentials",
// };

export const auth0BaseUrl = process.env.REACT_APP_AUTH0_BASEURL
  ? process.env.REACT_APP_AUTH0_BASEURL
  : `https://dev-pwaq157w.us.auth0.com/`;
export const baseUrlImg = process.env.REACT_APP_BASE_URL_IMG || "";

export const auth0Config = {
  client_id: process.env.REACT_APP_AUTH0_CLIENT_ID,
  client_secret: process.env.REACT_APP_AUTH0_CLIENT_SECRET,
  audience: process.env.REACT_APP_UTH0_AUDIENCE,
  grant_type: process.env.REACT_APP_AUTH0_GRANT_TYPE,
};

export const accessKeyId = process.env.REACT_APP_S3_ACCESS_KEY || "";
export const secretAccessKey = process.env.REACT_APP_S3_SECRET_ACCESS_KEY || "";
export const region = process.env.REACT_APP_S3_BUCKET_REGION || "";
export const bucketName = process.env.REACT_APP_S3_BUCKET_NAME || "";
export const imgJwt = process.env.REACT_APP_IMGJWT || "";
export const RetailerUrl = process.env.REACT_APP_RETAILER_URL || "https://digitalsaathi-retailer.cglcloud.com/"
export const DeliveryUrl = process.env.REACT_APP_DELIVERY_URL || "https://digitalsaathi-delivery.cglcloud.com/"
export const CMSUrl = process.env.REACT_APP_CMS_URL || "https://digitalsaathi-cms.cglcloud.com/"