export function html(strings: TemplateStringsArray, ...values: any[]) {
  const container = document.createElement('div');
  container.innerHTML = String.raw({ raw: strings }, ...values);
  return container.children[0] as HTMLElement;
}

export class $ {
  constructor(
    public readonly query: string,
    private readonly mutations: readonly ((element: HTMLElement) => void)[] = []
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

  setData(data: Record<string, string>) {
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

  append(node: Node) {
    return new $(this.query, [
      ...this.mutations,
      (element) => {
        element.appendChild(node);
      },
    ]);
  }

  unwrap() {
    return Array.from(this);
  }

  *[Symbol.iterator]() {
    for (const element of document.querySelectorAll<HTMLElement>(this.query)) {
      for (const mutation of this.mutations) {
        mutation(element);
      }
      yield element;
    }
  }
}
