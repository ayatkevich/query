export class $ {
  private mutations: ((element: Element) => void)[] = [];
  constructor(public query: string) {}

  addClass(className: string) {
    this.mutations.push((element) => {
      element.classList.add(className);
    });
    return this;
  }

  removeClass(className: string) {
    this.mutations.push((element) => {
      element.classList.remove(className);
    });
    return this;
  }

  toggleClass(className: string) {
    this.mutations.push((element) => {
      element.classList.toggle(className);
    });
    return this;
  }

  replaceClass(oldClassName: string, newClassName: string) {
    this.mutations.push((element) => {
      element.classList.replace(oldClassName, newClassName);
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
