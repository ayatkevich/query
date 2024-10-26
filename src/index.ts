export class $ {
  private mutations: ((element: Element) => void)[] = [];
  constructor(public query: string) {}

  addClass(className: string) {
    this.mutations.push((element) => {
      element.classList.add(className);
    });
    return this;
  }

  *[Symbol.iterator]() {
    for (const element of document.querySelectorAll(this.query)) {
      for (const mutation of this.mutations) {
        mutation(element);
      }
      yield element;
    }
  }
}
