import Rox from "rox-browser";
import { betaAccess, isLoggedIn, getCompany } from "./users";

export const configurationFetchedHandler = (fetcherResults) => {
  // console.log(fetcherResults)
  if (fetcherResults.hasChanges && fetcherResults.fetcherStatus === 'APPLIED_FROM_NETWORK') {
    window.location.reload(false)
  }
};

export const impressionHandler = (reporting) => {
  if (reporting.targeting) {
    // console.log('flag ' + reporting.name + ' value is ' + reporting.value)
  } else {
    // console.log('No experiment configured for flag ' + reporting.name + '. default value ' + reporting.value + ' was used')
  }
};

const options = {
  configurationFetchedHandler: configurationFetchedHandler,
  impressionHandler: impressionHandler,
};

// Add VPC-specific configuration if USE_VPC is enabled
if (window.APP_CONFIG.USE_VPC === 'true') {
  const instance = window.APP_CONFIG.FM_INSTANCE;
  const vpcApiHost = `api.${instance}`;
  options.configuration = {
    API_HOST: vpcApiHost,
    CD_API_ENDPOINT: `https://${vpcApiHost}/device/get_configuration`,
    CD_S3_ENDPOINT: `https://rox-conf.${instance}/`,
    SS_API_ENDPOINT: `https://${vpcApiHost}/device/update_state_store/`,
    SS_S3_ENDPOINT: `https://rox-state.${instance}/`,
    NOTIFICATIONS_ENDPOINT: `https://sdk-notification-service.${instance}/sse`,
    ANALYTICS_ENDPOINT: `https://fm-analytics.${instance}`,
  };
}

export const Flags = {
  score: new Rox.Flag(false),
  ask: new Rox.Flag(false),
  show: new Rox.Flag(false),
  headerColor: new Rox.RoxString("is-dark", [
    "is-dark",
    "is-primary",
    "is-white",
  ]),
};

Rox.setCustomBooleanProperty("isBetaUser", betaAccess());
Rox.setCustomBooleanProperty("isLoggedIn", isLoggedIn());
Rox.setCustomStringProperty("company", getCompany());

Rox.register("default", Flags);
Rox.setup(window.APP_CONFIG.FM_KEY, options);