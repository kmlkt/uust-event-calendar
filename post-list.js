const MONTHS = [
  "января",
  "февраля",
  "марта",
  "апреля",
  "мая",
  "июня",
  "июля",
  "августа",
  "сентября",
  "октября",
  "ноября",
  "декабря",
];

function showPosts(posts) {
  const rc = document.querySelector(".rounded-content");
  const sample = rc.querySelector("#post-sample");

  // Удаляем все посты, кроме шаблона
  for (const postEl of rc.querySelectorAll(".post")) {
    if (postEl.id != "post-sample") {
      postEl.remove();
    }
  }

  for (const post of posts) {
    const postEl = sample.cloneNode(true);
    postEl.removeAttribute("id");
    postEl.removeAttribute("hidden");

    // Дата
    const dateEl = postEl.querySelector(".date");
    if (post.day !== undefined && post.month !== undefined) {
      dateEl.textContent = `${post.day} ${MONTHS[post.month - 1]}`;
    } else {
      dateEl.remove();
    }

    // Сообщество
    const commEl = postEl.querySelector(".community-name");
    commEl.textContent = post.community_title;
    commEl.href = `https://vk.ru/wall-${post.community_id}_${post.post_id}`;

    // Фото
    const photoEl = postEl.querySelector(".photo");
    if (post.photos.length == 0) {
      photoEl.remove();
    } else {
      const leftEl = photoEl.querySelector(".left");
      const rightEl = photoEl.querySelector(".right");
      const iContainer = photoEl.querySelector(".images");
      const bContainer = photoEl.querySelector(".backgrounds");

      for (const photo of post.photos) {
        const img = new Image();
        img.src = photo;
        iContainer.appendChild(img);
        bContainer.appendChild(img.cloneNode());
      }

      iContainer.style.width = post.photos.length + "00%";

      let current = 0;

      function setImage(i) {
        if (i < 0 || i >= post.photos.length) {
          return;
        }
        bContainer.children[current].style.opacity = 0;
        bContainer.children[i].style.opacity = 1;
        iContainer.style.left = -i + "00%";
        leftEl.hidden = i == 0;
        rightEl.hidden = i == post.photos.length - 1;
        current = i;
      }

      setImage(current);

      if (post.photos.length != 1) {
        let hovered = false;
        let direction = 1;

        setInterval(() => {
          if (hovered) {
            return;
          }
          if (current == 0) {
            direction = 1;
          }
          if (current == post.photos.length - 1) {
            direction = -1;
          }
          setImage(current + direction);
        }, 5000);

        photoEl.addEventListener("mouseenter", () => {
          hovered = true;
        });
        photoEl.addEventListener("mouseleave", () => {
          hovered = false;
        });
        leftEl.addEventListener("click", () => setImage(current - 1));
        rightEl.addEventListener("click", () => setImage(current + 1));
      }
    }

    postEl.querySelector("p").innerHTML = post.text.replaceAll(/(?:\[(.*)\|(.*)\]|(http\S*))/gm,
      (_, href, title, url) => `<a href="${href ?? url}"/>${title ?? decodeURI(url)}</a>`);
    rc.appendChild(postEl);
  }
}
