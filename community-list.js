document.addEventListener("DOMContentLoaded", function () {
  const selectAll = document.getElementById("selectALL");
  const communityList = document.getElementById("communityList");
  let onChange = (_) => {};

  // Создаём чекбоксы для переданных сообществ
  function setCommunities(names, onChangeAction) {
    // Очищаем старый список
    communityList.innerHTML = "";

    // Убираем повторяющиеся названия
    const uniqueNames = [...new Set(names)];

    // Создаём чекбокс для каждого сообщества
    uniqueNames.forEach(function (name) {
      const label = document.createElement("label");
      label.className = "community";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.value = name;

      const span = document.createElement("span");
      span.textContent = name;

      label.appendChild(checkbox);
      label.appendChild(span);

      communityList.appendChild(label);
    });

    // Сохраняем колбэк (один раз, вне цикла)
    onChange = onChangeAction;

    // Сбрасываем состояние «Выбрать все»
    selectAll.checked = false;
    selectAll.indeterminate = false;
  }

  // Получаем названия выбранных сообществ
  function getSelectedCommunities() {
    const checkboxes = communityList.querySelectorAll(
      'input[type="checkbox"]:checked',
    );

    return Array.from(checkboxes).map(function (checkbox) {
      return checkbox.value;
    });
  }

  // Выбираем или снимаем все сообщества
  selectAll.addEventListener("change", function () {
    const checkboxes = communityList.querySelectorAll('input[type="checkbox"]');

    checkboxes.forEach(function (checkbox) {
      checkbox.checked = selectAll.checked;
    });

    selectAll.indeterminate = false;

    // Сообщаем наружу
    onChange(getSelectedCommunities());
  });

  // Обрабатываем выбор отдельных сообществ
  communityList.addEventListener("change", function () {
    const checkboxes = [
      ...communityList.querySelectorAll('input[type="checkbox"]'),
    ];

    const checkedCount = checkboxes.filter(
      (checkbox) => checkbox.checked,
    ).length;

    selectAll.checked =
      checkboxes.length > 0 && checkedCount === checkboxes.length;

    selectAll.indeterminate =
      checkedCount > 0 && checkedCount < checkboxes.length;

    // Сообщаем наружу (было console.log)
    onChange(getSelectedCommunities());
  });

  window.setCommunities = setCommunities;
  window.getSelectedCommunities = getSelectedCommunities;
});
