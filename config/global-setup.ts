import { FullConfig } from "@playwright/test";
import { apiGlobalSetup } from "./api-global-setup";
import { uiGlobalSetup } from "./ui-global-setup";

export default async function globalSetup(config: FullConfig) {
  console.log("[Ejecutando global-setup combinado]");

  // Detectar los nombres de los proyectos configurados
  const projectNames = config.projects.map((p) => p.name);

  // Ejecutar setup de API si corresponde
  if (projectNames.some((name) => name.includes("api"))) {
    console.log(">>>Ejecutando global-setup - API<<<");
    await apiGlobalSetup(config);
    console.log(">>>Global-setup - API completado correctamente<<<");
  }

  // Ejecutar setup de UI si corresponde
  if (projectNames.some((name) => name.includes("ui"))) {
    console.log(">>>Ejecutando global-setup - UI<<<");
    await uiGlobalSetup(config);
    console.log(">>>Global-setup - UI completado correctamente<<<");
  }

  console.log("[Global-setup combinado completado]");
}