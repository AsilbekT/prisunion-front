const OPEN_CLASS = 'collapsable-container--open';

interface IOptions {
  element: HTMLElement | string;
  toggler: HTMLElement | string;
  container: HTMLElement | string;
  onToggle?: (isOpen: boolean, height: number) => void;
  openClass?: string;
}

class Collapsable {
  isOpen = false;
  element: HTMLElement;
  togglerEl: HTMLElement;
  container: HTMLElement;
  onToggle?: IOptions['onToggle'];
  openClass: string = OPEN_CLASS;

  height = 0;

  initialized = false;

  constructor({ element, toggler, container, onToggle, openClass }: IOptions) {
    this.element = Collapsable.select(element);
    this.togglerEl = Collapsable.select(toggler);
    this.container = Collapsable.select(container);
    this.onToggle = onToggle;
    if (openClass) {
      this.openClass = openClass;
    }
    this.init();
  }

  init() {
    if (!this.element) return;

    this.resetHeight();
    this.element.classList.add('collapsable', 'collapsable-init');
    this.container.classList.add('collapsable-container');
    this.togglerEl.addEventListener('click', this.toggle.bind(this));

    window.addEventListener('load', this.resetAll.bind(this));
    this.initialized = true;
  }

  resetAll() {
    this.update();
    this.resetHeight();
  }

  resetHeight() {
    this.height = this.element.offsetHeight || this.element.scrollHeight;
  }

  static select(el: HTMLElement | string) {
    if (typeof el === 'object') return el;
    return document.querySelector(el)! as HTMLElement;
  }

  open() {
    this.isOpen = true;
    this.element.style.height = `${this.height}px`;
    this.container.classList.add(OPEN_CLASS, this.openClass);
  }

  update() {
    this.element.style.visibility = 'hidden';
    this.element.style.removeProperty('height');
    this.height = this.element.offsetHeight;
    this.element.style.removeProperty('visibility');
  }

  close() {
    this.isOpen = false;
    this.element.style.height = '0';
    this.container.classList.remove(OPEN_CLASS, this.openClass);
  }

  toggle() {
    if (this.isOpen) this.close();
    else this.open();
    this.onToggle && this.onToggle(this.isOpen, this.height);
  }
}

export default Collapsable;
