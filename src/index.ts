// @ts-ignore - buildCustomElementConstructor has no exported type because
// it will be removed once this is in https://github.com/salesforce/lwc/pull/1395
import { buildCustomElementConstructor, register } from "lwc";
import { registerWireService } from "@lwc/wire-service";
import App from "./modules/ww/app/app";

registerWireService(register);
customElements.define("lwc-app", buildCustomElementConstructor(App));
const element = document.createElement("lwc-app");
document.body.appendChild(element);
