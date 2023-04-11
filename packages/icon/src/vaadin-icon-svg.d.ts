/**
 * @license
 * Copyright (c) 2000 - 2023 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */
import { nothing, SVGTemplateResult } from 'lit';

export type IconSvgLiteral = SVGTemplateResult | typeof nothing;

/**
 * Clone given node and return its content as SVG literal.
 */
export function cloneSvgNode(source: Element): IconSvgLiteral;

/**
 * Test if the given argument is a valid SVG literal.
 */
export function isValidSvg(source: unknown): source is IconSvgLiteral;

/**
 * Create a valid SVG literal based on the argument.
 */
export function ensureSvgLiteral(source: unknown): IconSvgLiteral;

/**
 * Render a given SVG literal to the container.
 */
export function renderSvg(source: unknown, container: SVGElement): void;

/**
 * Create an SVG literal from source string.
 */
export function unsafeSvgLiteral(source: string): IconSvgLiteral;
