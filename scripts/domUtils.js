export function createElement(tag, attributes = {}, textContent = '') {
  const element = document.createElement(tag);
  Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
  if (textContent) element.textContent = textContent;
  return element;
}

export function clearElement(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

export function appendChildren(parent, ...children) {
  children.forEach(child => parent.appendChild(child));
}
