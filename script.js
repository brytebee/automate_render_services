require("dotenv").config();

async function resume(serviceId) {
  const sdk = require("api")("@render-api/v1.0#ja8rb1jlsxhh7qu");
  const API_KEY = process.env.RENDER_API_KEY;

  if (!API_KEY) {
    return "Kindly provide an API KEY";
  }

  try {
    sdk.auth(process.env.RENDER_API_KEY);
    await sdk.resumeService({ serviceId });
    return {
      message: "Service resumed!",
    };
  } catch (error) {
    return {
      message: `Service NOT resume!\n\n ${error}`,
    };
  }
}

async function suspend(serviceId) {
  const sdk = require("api")("@render-api/v1.0#ja8rb1jlsxhh7qu");
  const API_KEY = process.env.RENDER_API_KEY;

  if (!API_KEY) {
    return "Kindly provide an API KEY";
  }

  try {
    sdk.auth(API_KEY);
    await sdk.suspendService({ serviceId });
    return {
      message: "Service suspended!",
    };
  } catch (error) {
    return {
      message: `Service NOT suspended!\n\n ${error}`,
    };
  }
}

async function listServices() {
  const sdk = require("api")("@render-api/v1.0#ja8rb1jlsxhh7qu");

  sdk.auth(process.env.RENDER_API_KEY);
  const res = await sdk.getServices({ limit: "20" });
  const data = await res.data;
  const services = data.map((service) => service?.service);
  return services;
}

async function run(web) {
  if (web) {
    const allServices = await listServices();
    if (allServices) {
      const services = allServices.filter((service) => service.name === web);
      const currentApp = services?.[0];
      if (currentApp?.suspended === "not_suspended") {
        const stop = await suspend(currentApp?.id);
        return stop.message;
      }
      const start = await resume(currentApp?.id);
      return start.message;
    }
  } else {
    return "Assest name missing!";
  }
}

async function main() {
  // service name
  F4ALL_SERVER = process.env.WEB_NAME;
  BIZK_SERVER = process.env.BIZK;

  const runner = await run(BIZK_SERVER);
  setTimeout(function () {
    console.log(runner);
  }, 5000);
}

main();
