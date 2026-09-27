//Связка: список сообществ -- список постов -- календарь.

//Состояние
let allEvents = [];              // плоский массив постов
let selectedCommunities = [];    // выбранные community_title
let selectedDay = null;          // {year, month, day} или null

//Утилиты

//events.json (год - месяц - день - [посты]) разворачиваем в плоский массив
function flattenEvents(data) {
    const posts = [];
    for (const year of Object.keys(data)) {
        for (const month of Object.keys(data[year])) {
            for (const day of Object.keys(data[year][month])) {
                for (const post of data[year][month][day]) {
                    posts.push({
                        ...post,
                        year: Number(year),
                        month: Number(month),
                        day: Number(day),
                    });
                }
            }
        }
    }
    return posts;
}

//Фильтр по выбранным сообществам (сравниваем по community_title)
function filterByCommunities(posts) {
    if (selectedCommunities.length === 0) return posts;
    return posts.filter((p) =>
        selectedCommunities.includes(p.community_title)
    );
}

//Уникальные дни из постов: [[y, m, d], ...]
function collectDays(posts) {
    const set = new Set();
    for (const p of posts) set.add(`${p.year}-${p.month}-${p.day}`);
    return [...set].map((s) => s.split("-").map(Number));
}

//Сортировка постов по дате
function sortByDate(posts) {
    return [...posts].sort(
        (a, b) =>
            a.year - b.year ||
            a.month - b.month ||
            a.day - b.day
    );
}

//Обновление UI

//Перерисовать список постов
function updatePosts() {
    const visible = filterByCommunities(allEvents);

    if (selectedDay) {
        //Посты выбранного дня
        const posts = visible.filter(
            (p) =>
                p.year === selectedDay.year &&
                p.month === selectedDay.month &&
                p.day === selectedDay.day
        );
        showPosts(sortByDate(posts));
    } else {
        //Первые 10 постов
        const posts = sortByDate(visible).slice(0, 10);
        showPosts(posts);
    }
}

// Перерисовать подсветку дней в календаре
function updateCalendarHighlight() {
    const visible = filterByCommunities(allEvents);
    highlightDays(collectDays(visible));
}

//Загрузка

async function loadEvents() {
    const res = await fetch("events.json");
    if (!res.ok) throw new Error("Не удалось загрузить events.json");
    const data = await res.json();
    allEvents = flattenEvents(data);
}

//Инициализация

document.addEventListener("DOMContentLoaded", async () => {
    try {
        await loadEvents();
    } catch (e) {
        console.error(e);
        return;
    }

    //Рисуем календари на месяцы из MONTHS_TO_RENDER объявлен в calendar.js)
    MONTHS_TO_RENDER.forEach(([year, month]) => addCalendar(year, month));

    //Реакция на клик по дню
    onSelectedDayChanged = (year, month, day) => {
        selectedDay = { year, month, day };
        updatePosts();
    };

    //Рисуем чекбоксы сообществ из events.json
    //Пока — только те, у кого есть посты
    const names = [...new Set(allEvents.map((p) => p.community_title))];
    setCommunities(names, (selected) => {
        selectedCommunities = selected;
        updatePosts();
        updateCalendarHighlight();
    });

    // Первичный рендер
    updateCalendarHighlight();
    updatePosts();
});