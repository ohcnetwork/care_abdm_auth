const PORT = process.env.PORT || 3000;
const ABDM_AUTH_URL =
  process.env.ABDM_AUTH_URL || "https://dev.abdm.gov.in/gateway/v0.5/sessions";

const ABDM_CLIENT_ID = process.env.ABDM_CLIENT_ID;
const ABDM_CLIENT_SECRET = process.env.ABDM_CLIENT_SECRET;

const requiredEnvs = ["ABDM_CLIENT_ID", "ABDM_CLIENT_SECRET"];
const missingEnvs = requiredEnvs.filter((env) => !process.env[env]);
if (missingEnvs.length > 0) {
  console.error(
    `Missing required environment variables: ${missingEnvs.join(", ")}`
  );
  process.exit(1);
}

module.exports = {
  PORT,
  ABDM_AUTH_URL,
  ABDM_CLIENT_ID,
  ABDM_CLIENT_SECRET,
};
