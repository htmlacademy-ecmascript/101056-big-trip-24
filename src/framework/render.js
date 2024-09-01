const RenderPosition = {
  BEFOREBEGIN: 'beforebegin', // вставить элемент перед началом контейнера
  AFTERBEGIN: 'afterbegin', // вставить элемент сразу после начала контейнера
  BEFOREEND: 'beforeend', // вставить элемент перед концом контейнера
  AFTEREND: 'afterend', // вставить элемент сразу после конца контейнера
};

function createElement(template) { // принимает template в виде html кода
  const newElement = document.createElement('div'); // создается новый `div`
  newElement.innerHTML = template; // устанавливается содержимое этого `div`

  return newElement.firstElementChild; // возвращается первый дочерний элемент созданного `div`
}

/*
component - объект компонента, который должен иметь метод `getElement()`, возвращающий элемент DOM
container - элемент DOM, в который будет вставлен новый элемент
place - позиция, где будет вставлен элемент (по умолчанию `BEFOREEND`)
*/
function render(component, container, place = RenderPosition.BEFOREEND) {
  container.insertAdjacentElement(place, component.getElement());
}

export {RenderPosition, createElement, render};
