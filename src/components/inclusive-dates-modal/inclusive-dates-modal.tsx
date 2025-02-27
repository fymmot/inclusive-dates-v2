import {
  Component,
  Event,
  EventEmitter,
  h,
  Host,
  Listen,
  Method,
  Prop,
  State
} from "@stencil/core";
import "@a11y/focus-trap";
import { hideOthers } from "aria-hidden";

/**
 * @slot slot - The dialog content
 */
@Component({
  shadow: true,
  styleUrl: "inclusive-dates-modal.css",
  tag: "inclusive-dates-modal"
})
export class InclusiveDatesModal {
  // Mandatory for accessibility
  @Prop() label!: string;
  @State() closing = false;
  @State() showing = false;
  @Event() opened: EventEmitter;
  @Event() closed: EventEmitter;

  private triggerElement: HTMLElement;
  private anchorEl: HTMLElement;
  private bodyRef: HTMLElement;
  private el: HTMLElement;
  private undo: () => void;

  /**
   * Open the dialog.
   */
  @Method()
  async open() {
    this.showing = true;
    this.undo = hideOthers(this.el);
    this.opened.emit(undefined);
    setTimeout(() => {
      if (this.bodyRef) {
      }
      // this.bodyRef.focus();
    }, 50);
  }

  /**
   * Close the dialog.
   */
  @Method()
  async close() {
    this.showing = false;
    this.closed.emit(undefined);
    this.undo();

    if (this.triggerElement) this.triggerElement.focus();
  }
  @Method()
  async getState() {
    return this.showing;
  }

  @Method()
  async setTriggerElement(element: HTMLElement) {
    this.triggerElement = element;
  }

  @Method()
  async setAnchorElement(element: HTMLElement) {
    this.anchorEl = element;
  }

  onKeyDown = (event: KeyboardEvent) => {
    if (event.code === "Escape") {
      this.close();
    }
  };

  @Listen("click", { capture: true, target: "window" })
  handleClick(event) {
    if (this.showing && !this.el.contains(event.target as Node)) {
      this.close();
    }
  }

  private updatePosition = () => {
    if (this.bodyRef && this.anchorEl && this.showing) {
      /*this.bodyRef.style.cssText =
        `transform:translate3d(${this.anchorEl.getBoundingClientRect().x}px, ${this.anchorEl.getBoundingClientRect().y}px, 0px)`*/
    }
  };

  componentDidRender() {
    this.updatePosition();
  }

  render() {
    return (
      <Host
        showing={this.showing}
        ref={(r) => {
          this.el = r;
        }}
      >
        {this.showing && (
          <div
            part="body"
            ref={(r) => {
              this.bodyRef = r;
            }}
            onKeyDown={this.onKeyDown}
            role="dialog"
            tabindex={-1}
            aria-hidden={!this.showing}
            aria-label={this.label}
            aria-modal={this.showing}
          >
            <focus-trap>
              <div part="content">
                <slot />
              </div>
            </focus-trap>
          </div>
        )}
      </Host>
    );
  }
}
