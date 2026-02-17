#!/usr/bin/env python3
"""Run the create-aura-props-test skill for multiple Vaadin components via Claude Code headless mode."""

import argparse
import os
import subprocess
import sys

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SKILL_PATH = os.path.join(REPO_ROOT, ".claude/skills/create-aura-props-test/SKILL.md")
TEST_DIR = os.path.join(REPO_ROOT, "test/aura-props")

# Map component names to their styling docs URLs.
# Components with empty URLs will be skipped unless URL is provided.
COMPONENTS = {
    "accordion": "https://vaadin.com/docs/latest/components/accordion/styling",
    "app-layout": "https://vaadin.com/docs/latest/components/app-layout/styling",
    "avatar": "https://vaadin.com/docs/latest/components/avatar/styling",
    "avatar-group": "https://vaadin.com/docs/latest/components/avatar/styling",
    "badge": "https://vaadin.com/docs/latest/components/badge/styling",
    "board": "",
    "button": "https://vaadin.com/docs/latest/components/button/styling",
    "card": "https://vaadin.com/docs/latest/components/card/styling",
    "charts": "",
    "checkbox": "https://vaadin.com/docs/latest/components/checkbox/styling",
    "combo-box": "https://vaadin.com/docs/latest/components/combo-box/styling",
    "confirm-dialog": "https://vaadin.com/docs/latest/components/confirm-dialog/styling",
    "context-menu": "https://vaadin.com/docs/latest/components/context-menu/styling",
    "cookie-consent": "",
    "crud": "https://vaadin.com/docs/latest/components/crud/styling",
    "custom-field": "https://vaadin.com/docs/latest/components/custom-field/styling",
    "dashboard": "https://vaadin.com/docs/latest/components/dashboard/styling",
    "date-picker": "https://vaadin.com/docs/latest/components/date-picker/styling",
    "date-time-picker": "https://vaadin.com/docs/latest/components/date-time-picker/styling",
    "details": "https://vaadin.com/docs/latest/components/details/styling",
    "dialog": "https://vaadin.com/docs/latest/components/dialog/styling",
    "email-field": "https://vaadin.com/docs/latest/components/email-field/styling",
    "form-layout": "https://vaadin.com/docs/latest/components/form-layout/styling",
    "grid": "https://vaadin.com/docs/latest/components/grid/styling",
    "grid-pro": "https://vaadin.com/docs/latest/components/grid-pro/styling",
    "horizontal-layout": "https://vaadin.com/docs/latest/components/horizontal-layout/styling",
    "icon": "https://vaadin.com/docs/latest/components/icon/styling",
    "integer-field": "https://vaadin.com/docs/latest/components/integer-field/styling",
    "list-box": "https://vaadin.com/docs/latest/components/list-box/styling",
    "login": "https://vaadin.com/docs/latest/components/login/styling",
    "map": "",
    "markdown": "",
    "master-detail-layout": "https://vaadin.com/docs/latest/components/master-detail-layout/styling",
    "menu-bar": "https://vaadin.com/docs/latest/components/menu-bar/styling",
    "message-input": "https://vaadin.com/docs/latest/components/message-input/styling",
    "message-list": "https://vaadin.com/docs/latest/components/message-list/styling",
    "multi-select-combo-box": "https://vaadin.com/docs/latest/components/multi-select-combo-box/styling",
    "notification": "https://vaadin.com/docs/latest/components/notification/styling",
    "number-field": "https://vaadin.com/docs/latest/components/number-field/styling",
    "password-field": "https://vaadin.com/docs/latest/components/password-field/styling",
    "popover": "https://vaadin.com/docs/latest/components/popover/styling",
    "progress-bar": "https://vaadin.com/docs/latest/components/progress-bar/styling",
    "radio-group": "https://vaadin.com/docs/latest/components/radio-button/styling",
    "rich-text-editor": "https://vaadin.com/docs/latest/components/rich-text-editor/styling",
    "scroller": "https://vaadin.com/docs/latest/components/scroller/styling",
    "select": "https://vaadin.com/docs/latest/components/select/styling",
    "side-nav": "https://vaadin.com/docs/latest/components/side-nav/styling",
    "slider": "https://vaadin.com/docs/latest/components/slider/styling",
    "split-layout": "https://vaadin.com/docs/latest/components/split-layout/styling",
    "spreadsheet": "",
    "tabs": "https://vaadin.com/docs/latest/components/tabs/styling",
    "text-area": "https://vaadin.com/docs/latest/components/text-area/styling",
    "text-field": "https://vaadin.com/docs/latest/components/text-field/styling",
    "time-picker": "https://vaadin.com/docs/latest/components/time-picker/styling",
    "tooltip": "https://vaadin.com/docs/latest/components/tooltip/styling",
    "upload": "https://vaadin.com/docs/latest/components/upload/styling",
    "vertical-layout": "https://vaadin.com/docs/latest/components/vertical-layout/styling",
    "virtual-list": "https://vaadin.com/docs/latest/components/virtual-list/styling",
}


def read_skill_template():
    """Read SKILL.md and strip YAML frontmatter."""
    with open(SKILL_PATH) as f:
        content = f.read()

    # Strip YAML frontmatter (between first two --- lines)
    lines = content.split("\n")
    if lines[0].strip() == "---":
        end = -1
        for i in range(1, len(lines)):
            if lines[i].strip() == "---":
                end = i
                break
        if end > 0:
            content = "\n".join(lines[end + 1 :])

    return content.strip()


def build_prompt(template, component, url):
    """Replace $0 and $1 placeholders in the template."""
    prompt = template.replace("$0", component).replace("$1", url)
    return prompt


def has_existing_test(component):
    """Check if a test file already exists for this component."""
    return os.path.exists(os.path.join(TEST_DIR, f"{component}.test.js"))


def run_claude(prompt, component):
    """Run claude -p with the prompt piped via stdin."""
    cmd = [
        "claude",
        "-p",
        "--output-format", "text",
        "--allowedTools", "Read,Edit,Write,Bash(yarn test:aura-props *),Glob,Grep,WebFetch",
        "--append-system-prompt", f"Work in the directory: {REPO_ROOT}",
    ]

    result = subprocess.run(
        cmd,
        input=prompt,
        text=True,
        cwd=REPO_ROOT,
    )
    return result.returncode


def main():
    parser = argparse.ArgumentParser(
        description="Run the create-aura-props-test skill for Vaadin components."
    )
    parser.add_argument(
        "components",
        nargs="*",
        help="Component names to process (e.g., slider tabs upload)",
    )
    parser.add_argument(
        "--all",
        action="store_true",
        help="Run for all components with a configured URL",
    )
    parser.add_argument(
        "--skip-existing",
        action="store_true",
        help="Skip components that already have a test file",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Print the prompt without executing Claude",
    )

    args = parser.parse_args()

    if not args.components and not args.all:
        parser.error("Specify component names or use --all")

    # Determine which components to process
    if args.all:
        targets = [(name, url) for name, url in COMPONENTS.items() if url]
    else:
        targets = []
        for name in args.components:
            if name not in COMPONENTS:
                print(f"Error: Unknown component '{name}'")
                sys.exit(1)
            url = COMPONENTS[name]
            if not url:
                print(f"Error: No URL configured for '{name}'")
                sys.exit(1)
            targets.append((name, url))

    # Filter existing tests if requested
    if args.skip_existing:
        before = len(targets)
        targets = [(n, u) for n, u in targets if not has_existing_test(n)]
        skipped = before - len(targets)
        if skipped:
            print(f"Skipping {skipped} component(s) with existing tests")

    if not targets:
        print("No components to process.")
        return

    # Read and prepare template
    template = read_skill_template()

    total = len(targets)
    results = {"success": [], "failure": []}

    for i, (component, url) in enumerate(targets, 1):
        print(f"\n{'=' * 60}")
        print(f"[{i}/{total}] Processing: {component}")
        print(f"URL: {url}")
        print(f"{'=' * 60}\n")

        prompt = build_prompt(template, component, url)

        if args.dry_run:
            print("--- PROMPT ---")
            print(prompt[:500])
            print(f"... ({len(prompt)} chars total)")
            print("--- COMMAND ---")
            print(
                f"claude -p --output-format text "
                f"--allowedTools 'Read,Edit,Write,Bash(yarn test:aura-props *),Glob,Grep,WebFetch' "
                f"--append-system-prompt 'Work in the directory: {REPO_ROOT}'"
            )
            results["success"].append(component)
            continue

        returncode = run_claude(prompt, component)
        if returncode == 0:
            results["success"].append(component)
        else:
            print(f"\nError: Claude exited with code {returncode} for {component}")
            results["failure"].append(component)

    # Summary
    print(f"\n{'=' * 60}")
    print("SUMMARY")
    print(f"{'=' * 60}")
    print(f"Total: {total}")
    print(f"Success: {len(results['success'])} - {', '.join(results['success']) or 'none'}")
    print(f"Failure: {len(results['failure'])} - {', '.join(results['failure']) or 'none'}")


if __name__ == "__main__":
    main()
