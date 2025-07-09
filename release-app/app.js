import '@vaadin/vaadin-lumo-styles/test/autoload.js';
import '@vaadin/button';
import '@vaadin/details';
import '@vaadin/dialog';
import '@vaadin/text-field';
import { html, LitElement } from 'lit';
import { dialogRenderer } from '@vaadin/dialog/lit.js';
import branches from './branches.json';

class ReleaseApp extends LitElement {
  createRenderRoot() {
    return this;
  }

  render() {
    const branchSections = branches.map((branch) => html` <branch-section .branch="${branch}"></branch-section>`);
    return html`
      <div>
        <h1>Release app</h1>
        ${branchSections}
      </div>
    `;
  }
}

customElements.define('ra-app', ReleaseApp);

class BranchSection extends LitElement {
  static properties = {
    branch: { type: Object },
  };

  createRenderRoot() {
    return this;
  }

  firstUpdated() {
    this.dialog = this.querySelector('vaadin-dialog');
  }

  render() {
    return html`
      <section>
        <h2>${this.branch.branch}</h2>

        <table>
          <tr>
            <td>Current version</td>
            <td>${this.branch.currentVersion}</td>
          </tr>
          <tr>
            <td>Next patch version</td>
            <td>${this.branch.nextPatchVersion}</td>
          </tr>
          <tr>
            <td>Unreleased commits</td>
            <td>${this.branch.commits.length}</td>
          </tr>
        </table>

        ${this.branch.commits.length > 0
          ? html`
              <vaadin-details summary="View unreleased commits">
                <ul>
                  ${this.branch.commits.map(
                    (commit) => html`
                      <li>
                        <a href="${commit.html_url}" target="_blank">${commit.commit.message.split('\n')[0]}</a>
                      </li>
                    `,
                  )}
                </ul>
              </vaadin-details>
            `
          : html`<p data-no-commits>No unreleased commits</p>`}

        <vaadin-button
          @click="${() => {
            this.dialog.opened = true;
          }}"
          >Release instructions
        </vaadin-button>

        <vaadin-dialog
          header-title="Release ${this.branch.branch}"
          ${dialogRenderer(() => html` <ra-release-dialog .branch="${this.branch}"></ra-release-dialog>`, [])}
        ></vaadin-dialog>
      </section>
    `;
  }
}

customElements.define('branch-section', BranchSection);

class ReleaseDialog extends LitElement {
  static properties = {
    branch: { type: Object },
    releaseVersion: { type: String },
  };

  createRenderRoot() {
    return this;
  }

  firstUpdated() {
    // Initialize the release version with the next patch version of the branch
    this.releaseVersion = this.branch.nextPatchVersion;
  }

  render() {
    return html`
      <section>
        <vaadin-text-field
          label="Version to release"
          value="${this.releaseVersion}"
          @change="${(e) => {
            this.releaseVersion = e.target.value;
          }}"
        ></vaadin-text-field>
      </section>
      <section>
        <h3>Step 1: Release web components</h3>
        <ul>
          <li>
            <a
              href="https://bender.vaadin.com/buildConfiguration/VaadinWebComponents_ReleaseVaadinWebComponents?mode=branches&release_branch=${this
                .branch.branch}&release_version=${this.releaseVersion}"
              target="_blank"
              >Open CI build on Bender</a
            >
          </li>
          <li>
            <span>Wait until the page has loaded and verify it prefilled these values:</span>
            <table>
              <tr>
                <td>Branch</td>
                <td>${this.branch.branch}</td>
              </tr>
              <tr>
                <td>Version</td>
                <td>${this.releaseVersion}</td>
              </tr>
            </table>
          </li>
          <li>Click <span class="guibutton">Run build</span></li>
          <li>Confirm if a dialog asks about using an auto-generated branch name</li>
          <li
            >Wait for the build to finish, then check that new versions have appeared on NPM (e.g.
            <a href="https://www.npmjs.com/package/@vaadin/grid/v/${this.releaseVersion}" target="_blank"
              ><code>@vaadin/grid@${this.releaseVersion}</code></a
            >)
          </li>
        </ul>
      </section>

      <section>
        <h3>Step 2: Release API docs</h3>
        <ul>
          <li>
            <a
              href="https://bender.vaadin.com/buildConfiguration/VaadinWebComponents_PublishWebComponentsApiDocs?mode=branches&release_branch=${this
                .branch.branch}&release_version=${this.releaseVersion}&release_tag=v${this.releaseVersion}"
              target="_blank"
              >Open CI build on Bender</a
            >
          </li>
          <li>
            <span>Wait until the page has loaded and verify it prefilled these values:</span>
            <table>
              <tr>
                <td>Branch</td>
                <td>${this.branch.branch}</td>
              </tr>
              <tr>
                <td>Tag</td>
                <td>v${this.releaseVersion}</td>
              </tr>
              <tr>
                <td>Version</td>
                <td>${this.releaseVersion}</td>
              </tr>
            </table>
          </li>
          <li>Click <span class="guibutton">Run build</span></li>
          <li>Confirm if a dialog asks about using an auto-generated branch name</li>
          <li>Wait for the build to finish</li>
        </ul>
      </section>

      <section>
        <h3>Step 3: Publish GitHub release</h3>
        <ul>
          <li>
            <a href="https://github.com/vaadin/web-components/releases" target="_blank"
              >Open the GitHub releases and edit the <code>v${this.releaseVersion}</code> draft release
            </a>
          </li>
          <li>Check that the documentation link works</li>
          <li>Check that the contents are correct</li>
          <li>If the release is for the latest version, check <i>Set as the latest release</i></li>
          <li>Then publish the release</li>
        </ul>
      </section>

      <section>
        <h3>Step 4: Update Flow components to use the new version</h3>
        <ul>
          <li>
            <a
              href="https://bender.vaadin.com/buildConfiguration/VaadinFlowComponents_FlowComponentsUpdateNpmPackagesWebjarsVersions?branch=${this
                .branch.branch}&mode=builds"
              target="_blank"
              >Open CI build on Bender
            </a>
          </li>
          <li>Click <span class="guibutton">Run build</span></li>
          <li>Wait for the build to finish</li>
          <li>
            <a href="https://github.com/vaadin/flow-components/pulls" target="_blank"
              >Check the pull request created by the build</a
            >
          </li>
          <li>Review, approve and merge the pull request</li>
        </ul>
      </section>
    `;
  }
}

customElements.define('ra-release-dialog', ReleaseDialog);
