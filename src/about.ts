// @ts-ignore - buildCustomElementConstructor has no exported type because
// it will be removed once this is in https://github.com/salesforce/lwc/pull/1395
import { buildCustomElementConstructor, register } from "lwc";
import { registerWireService } from "@lwc/wire-service";
import About from "./modules/ww/about/about";

registerWireService(register);
customElements.define("lwc-app-about", buildCustomElementConstructor(About));
const element = document.createElement("lwc-app-about");
document.body.appendChild(element);
