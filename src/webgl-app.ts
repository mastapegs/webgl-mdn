import { html, css, LitElement } from "lit";
import { customElement, query } from "lit/decorators.js";
import { initShaderProgram, drawScene, initBuffers } from "./util";

import vertexShaderSource from "./vertexShader.glsl?raw";
import fragmentShaderSource from "./fragmentShader.glsl?raw";

@customElement("webgl-app")
export class WebGLApp extends LitElement {
  static styles = css`
    :host {
      font: 16px/1.5 Arial, Helvetica, sans-serif;
    }
    .container {
      display: flex;
      padding-top: 2rem;
      justify-content: center;
    }
  `;

  @query("canvas") canvas: any;

  _webGL() {
    const gl = (this.canvas as HTMLCanvasElement).getContext(
      "webgl"
    ) as WebGLRenderingContext;

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    const shaderProgram = initShaderProgram(
      gl,
      vertexShaderSource,
      fragmentShaderSource
    ) as WebGLProgram;

    const programInfo = {
      program: shaderProgram,
      attribLocations: {
        vertexPosition: gl.getAttribLocation(shaderProgram, "aVertexPosition"),
      },
      uniformLocations: {
        projectionMatrix: gl.getUniformLocation(
          shaderProgram,
          "uProjectionMatrix"
        ),
        modelViewMatrix: gl.getUniformLocation(
          shaderProgram,
          "uModelViewMatrix"
        ),
      },
    };

    drawScene(gl, programInfo, initBuffers(gl));
  }

  connectedCallback() {
    super.connectedCallback();
    setTimeout(this._webGL.bind(this));
  }

  render() {
    return html`<div class="container">
      <canvas width="640" height="480"></canvas>
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "webgl-app": WebGLApp;
  }
}
