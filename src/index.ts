export class $ {
  constructor(
    public query: string,
    private mutations: readonly ((element: HTMLElement) => void)[] = []
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

  setAttribute(name: string, value: string) {
    return new $(this.query, [
      ...this.mutations,
      (element) => {
        element.setAttribute(name, value);
      },
    ]);
  }

  removeAttribute(name: string) {
    return new $(this.query, [
      ...this.mutations,
      (element) => {
        element.removeAttribute(name);
      },
    ]);
  }

  toggleAttribute(name: string) {
    return new $(this.query, [
      ...this.mutations,
      (element) => {
        element.toggleAttribute(name);
      },
    ]);
  }

  data(data: Record<string, string>) {
    return new $(this.query, [
      ...this.mutations,
      (element) => {
        Object.entries(data).forEach(([key, value]) => {
          element.dataset[key] = value;
        });
      },
    ]);
  }

  removeData(key: string) {
    return new $(this.query, [
      ...this.mutations,
      (element) => {
        delete element.dataset[key];
      },
    ]);
  }

  *[Symbol.iterator]() {
    for (const element of document.querySelectorAll(this.query)) {
      for (const mutation of this.mutations) {
        mutation(element as HTMLElement);
      }
      yield element as HTMLElement;
    }
  }
}
