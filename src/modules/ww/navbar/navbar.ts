import { LightningElement } from "lwc";
// @ts-ignore
import { buildCustomElementConstructor } from "lwc";
import "side-drawer";
import "wc-menu-button";
import { SideDrawer } from "side-drawer";
import { WcMenuButton } from "wc-menu-button";
import Drawer from "../../ww/drawer/drawer";

export default class NavBar extends LightningElement {
    private menuButton?: WcMenuButton;
    private sideDrawer?: SideDrawer;

    public connectedCallback(): void {
        if (this.menuButton === undefined) {
            this.menuButton = document.createElement(
                "wc-menu-button"
            ) as WcMenuButton;
        }

        if (this.sideDrawer === undefined) {
            this.sideDrawer = document.createElement(
                "side-drawer"
            ) as SideDrawer;

            if (customElements.get("ww-drawer") === undefined) {
                customElements.define(
                    "ww-drawer",
                    buildCustomElementConstructor(Drawer)
                );
            }

            this.sideDrawer.appendChild(document.createElement("ww-drawer"));
        }

        this.menuButton.addEventListener("opened", this.handleMenuOpened);
        this.sideDrawer.addEventListener("open", this.handleDrawerOpened);
        this.sideDrawer.addEventListener("close", this.handleDrawerClosed);
    }

    public disconnectedCallback(): void {
        if (this.menuButton) {
            this.menuButton.removeEventListener(
                "opened",
                this.handleMenuOpened
            );
        }
        if (this.sideDrawer) {
            this.sideDrawer.removeEventListener(
                "open",
                this.handleDrawerOpened
            );
            this.sideDrawer.removeEventListener(
                "close",
                this.handleDrawerClosed
            );
        }
    }

    public renderedCallback(): void {
        const buttonContainer = (this.template as any).querySelector(
            ".menu-button"
        );
        if (buttonContainer && buttonContainer.childNodes.length < 1) {
            buttonContainer.appendChild(this.menuButton);
        }

        const drawerContainer = (this.template as any).querySelector(".drawer");
        if (drawerContainer && drawerContainer.childNodes.length < 1) {
            drawerContainer.appendChild(this.sideDrawer);
        }
    }

    private handleMenuOpened = (): void => {
        if (this.sideDrawer) {
            this.sideDrawer.open = true;
        }
    };

    private handleDrawerOpened = (): void => {
        if (this.menuButton) {
            this.menuButton.open = true;
        }
    };

    private handleDrawerClosed = (): void => {
        if (this.menuButton) {
            this.menuButton.open = false;
        }
    };
}
