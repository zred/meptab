export function createElement(tag, attributes = {}, textContent = '') {
  const element = document.createElement(tag);
  Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
  if (textContent) element.textContent = textContent;
  return element;
}

export async function clearElement(element) {
  while (element.firstChild) {
    await new Promise(resolve => setTimeout(resolve, 0)); // Yield to event loop
    element.removeChild(element.firstChild);
  }
}

export async function appendChildren(parent, ...children) {
  for (const child of children) {
    await new Promise(resolve => setTimeout(resolve, 0)); // Yield to event loop
    parent.appendChild(child);
  }
}
