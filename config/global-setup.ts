import { FullConfig } from "@playwright/test";
import { apiGlobalSetup } from "./api-global-setup";
import { uiGlobalSetup } from "./ui-global-setup";

export default async function globalSetup(config: FullConfig) {
  console.log("[Ejecutando global-setup combinado]");

  // Detectar el tipo de proyecto en ejecución
  const projectNames = config.projects.map((p) => p.name);

  if (projectNames.some((name) => name.includes("api"))) {
    console.log("Ejecutando setup de API...");
    await apiGlobalSetup(config);
  } else if (projectNames.some((name) => name.includes("ui"))) {
    console.log("Ejecutando setup de UI...");
    await uiGlobalSetup(config);
  } else {
    console.log("No se encontró un proyecto válido (ni api ni ui).");
  }

  console.log("[Global-setup completado correctamente]");
}