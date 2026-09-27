const MONTH_NAMES = [
    "январь", "февраль", "март", "апрель", "май", "июнь",
    "июль", "август", "сентябрь", "октябрь", "ноябрь", "декабрь"
];

// Какие месяцы отрисовать при загрузке: [год, месяц 1–12]
const MONTHS_TO_RENDER = [
    //[2026, 8],   // август
    [2026, 9],   // сентябрь
    [2026, 10],  // октябрь
    [2026, 11],  // ноябрь
    [2026, 12],  // декабрь
];


/*
   addCalendar(year, month)
   Добавляет календарь на указанный месяц в контейнер.
   month — человеческий (1–12).
   */
function addCalendar(year, month) {
    const scroll = document.getElementById("calendarScroll");
    if (!scroll) return;

    const jsMonth = month - 1;   // 0–11 для работы с Date

    // Блок месяца
    const calendar = document.createElement("div");
    calendar.className = "calendar";
    calendar.dataset.year = year;
    calendar.dataset.month = month;

    // Заголовок
    const header = document.createElement("div");
    header.className = "calendar__header";
    header.textContent = `${MONTH_NAMES[jsMonth]} ${year}`;
    calendar.appendChild(header);

    // Сетка дней
    const grid = document.createElement("div");
    grid.className = "calendar__grid";
    calendar.appendChild(grid);

    // Расчёты
    const daysInMonth = new Date(year, jsMonth + 1, 0).getDate();
    // Первый день недели: 0 = Пн ... 6 = Вс
    const firstWeekday = (new Date(year, jsMonth, 1).getDay() + 6) % 7;

    // Пустые ячейки до первого числа
    for (let i = 0; i < firstWeekday; i++) {
        const empty = document.createElement("div");
        empty.className = "calendar__day calendar__day--empty";
        grid.appendChild(empty);
    }

    // Дни месяца
    for (let day = 1; day <= daysInMonth; day++) {
        const cell = document.createElement("button");
        cell.type = "button";
        cell.className = "calendar__day";
        cell.textContent = day;
        cell.dataset.year = year;
        cell.dataset.month = month;   // храним человеческий 1–12
        cell.dataset.day = day;

        cell.addEventListener("click", () => onDaySelected(year, month, day));

        grid.appendChild(cell);
    }

    scroll.appendChild(calendar);
}


/*
   highlightDays(days)
   days = [[год, месяц, день], ...] — месяц 1–12.
   Убирает старую подсветку со всех дней и подсвечивает переданные.
   */
function highlightDays(days) {
    // Снять обводку со всех
    document
        .querySelectorAll(".calendar__day--event")
        .forEach((el) => el.classList.remove("calendar__day--event"));

    // Повесить на переданные
    days.forEach(([year, month, day]) => {
        const cell = document.querySelector(
            `.calendar__day[data-year="${year}"][data-month="${month}"][data-day="${day}"]`
        );
        if (cell) cell.classList.add("calendar__day--event");
    });
}

function selectDay(year, month, day) {
    document
        .querySelectorAll(".calendar__day--selected")
        .forEach((el) => el.classList.remove("calendar__day--selected"));

    const cell = document.querySelector(
        `.calendar__day[data-year="${year}"][data-month="${month}"][data-day="${day}"]`
    );
    if (cell) cell.classList.add("calendar__day--selected");
}

/*
   onDaySelected(year, month, day)
   ЗАГЛУШКА
   month — 1–12.
   */

let onSelectedDayChanged = (year, month, day) => { };

function onDaySelected(year, month, day) {
  selectDay(year, month, day);
  onSelectedDayChanged(year, month, day);
}

