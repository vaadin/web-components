/**
 * @license
 * Copyright (c) 2016 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * Whether the device supports touch events.
 */
export const touchDevice: boolean;

/**
 * A File-like Blob with mutable name property, as returned by createFile helper.
 * This extends File so it can be used with addFiles() which accepts File[].
 */
export interface TestFile extends File {
  name: string;
}

/**
 * Creates a File suitable to add to FormData.
 */
export function createFile(fileSize?: number, contentType?: string): TestFile;

/**
 * Creates an array of Files suitable to add to FormData.
 */
export function createFiles(arraySize: number, fileSize?: number, contentType?: string): TestFile[];

/**
 * Creates a FileSystemFileEntry object suitable to be used in a DataTransferItem.
 */
export function createFileSystemFileEntry(
  fileSize?: number,
  contentType?: string,
): FileSystemFileEntry & { _file: File };

/**
 * Creates a FileSystemFileEntry object that returns an error when trying to read the file.
 */
export function createUnreadableFileSystemFileEntry(): FileSystemFileEntry;

/**
 * Creates a FileSystemDirectoryEntry object suitable to be used in a DataTransferItem.
 */
export function createFileSystemDirectoryEntry(fileEntries: FileSystemEntry[]): FileSystemDirectoryEntry;

/**
 * Creates a FileSystemDirectoryEntry object that returns an error when trying to read the directory.
 */
export function createUnreadableFileSystemDirectoryEntry(): FileSystemDirectoryEntry;

export interface XhrCreatorConfig {
  size?: number;
  connectTime?: number;
  uploadTime?: number;
  stepTime?: number;
  serverTime?: number;
  message?: string;
  serverType?: string;
  serverValidation?(xhr: any): { status?: number; statusText?: string } | string | undefined;
  /** When true, executes all upload steps synchronously without setTimeout delays */
  sync?: boolean;
}

/**
 * Creates xhr objects configured for testing.
 */
export function xhrCreator(config?: XhrCreatorConfig): () => XMLHttpRequest;

/**
 * Removes a file at given index.
 */
export function removeFile(upload: HTMLElement, idx?: number): void;
