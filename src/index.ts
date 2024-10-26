export class $ {
  constructor(
    public query: string,
    private mutations: readonly ((element: Element) => void)[] = []
  ) {}

  addClass(className: string) {
    return new $(this.query, [
      ...this.mutations,
      (element) => {
        element.classList.add(className);
      },
    ]);
  }

  removeClass(className: string) {
    return new $(this.query, [
      ...this.mutations,
      (element) => {
        element.classList.remove(className);
      },
    ]);
  }

  toggleClass(className: string) {
    return new $(this.query, [
      ...this.mutations,
      (element) => {
        element.classList.toggle(className);
      },
    ]);
  }

  replaceClass(oldClassName: string, newClassName: string) {
    return new $(this.query, [
      ...this.mutations,
      (element) => {
        element.classList.replace(oldClassName, newClassName);
      },
    ]);
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
