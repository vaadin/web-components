export default function filterEmptyItems<I>(arr: Array<I | undefined | false | null>): I[];
export default function filterEmptyItems<I>(arr: ReadonlyArray<I | undefined | false | null>): readonly I[];
export default function filterEmptyItems(arr: ReadonlyArray<unknown | undefined | false | null>): readonly unknown[] {
  return arr.filter(Boolean);
}
