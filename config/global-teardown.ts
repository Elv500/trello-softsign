import { FullConfig } from "@playwright/test";
import { apiGlobalTeardown } from "./api-global-teardown";
import { uiGlobalTeardown } from "./ui-global-teardown";

export default async function globalTeardown(config: FullConfig) {
  console.log("[Ejecutando global-teardown combinado]");

  const projectNames = config.projects.map((p) => p.name);

  if (projectNames.some((name) => name.includes("api"))) {
    console.log("Ejecutando teardown de API...");
    await apiGlobalTeardown();
  } else if (projectNames.some((name) => name.includes("ui"))) {
    console.log("Ejecutando teardown de UI...");
    await uiGlobalTeardown(config);
  } else {
    console.log("No se detectó tipo de proyecto (ni API ni UI).");
  }

  console.log("[Global-teardown completado correctamente]");
}