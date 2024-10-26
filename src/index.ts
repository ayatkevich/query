export class $ {
  constructor(public query: string) {}

  *[Symbol.iterator]() {
    for (const element of document.querySelectorAll(this.query)) {
      yield element;
    }
  }
}
