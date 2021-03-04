(() => {
  let burgerWidth = 0;
  let lastWidthItem = 0;

  const init = (menu, menuList, itemsMenu, burgerMenu) => {
    itemsMenu.forEach((elem) => {
      elem.classList.add("amenu__item");
    });

    // добавляем класс селектору menu burger
    burgerMenu.classList.add("amenu__burger");

    // получаем кнопку и список
    const [burgerBtn, burgerList] = createBurgerMenu(burgerMenu);

    // функция для адаптации меню
    updateMenu(menu, menuList, burgerMenu, burgerBtn, burgerList);

    window.addEventListener("resize", () => {
      updateMenu(menu, menuList, burgerMenu, burgerBtn, burgerList);
    });
    // или использоват bind и первым арг передать null
    // window.addEventListener('resize', updateMenu.bind(null, menu, menuList,
    // burgerMenu, burgerBtn, burgerList))
  };

  const createBurgerMenu = (parrentBurger) => {
    // создем кнопку для нашего меню
    const burgerBtn = document.createElement("button");
    parrentBurger.append(burgerBtn);
    burgerBtn.classList.add("amenu__burger-btn");

    const toggleMenu = function () {
      parrentBurger.classList.toggle("amenu__burger-open");
    };

    // при клике по кнопке открывается и скрывается выпадающее меню
    burgerBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleMenu();
    });

    // при клике в любом месте экрана меню скрывается
    document.addEventListener("click", (e) => {
      const target = e.target;
      const its_BurgerMenu =
        target == parrentBurger || parrentBurger.contains(target);
      const its_burgerBtn = target == burgerBtn;
      const menu_is_active = parrentBurger.classList.contains(
        "amenu__burger-open"
      );

      if (!its_BurgerMenu && !its_burgerBtn && menu_is_active) {
        toggleMenu();
      }
      // если burgerMenu имеет класс amenu__burger-open, то его надо удалить и всё
    });

    // создаем выпадающий список меню, но оно уже не нужно
    const burgerList = document.createElement("ul");
    parrentBurger.append(burgerList);
    burgerList.classList.add("amenu__burger-list");

    return [burgerBtn, burgerList]; // чтобы потом использовать эти переменнные в другом месте
  };

  // создание функции адаптации меню по событию
  const updateMenu = (menu, menuList, burgerMenu, burgerBtn, burgerList) => {
    const menuItems = menuList.querySelectorAll(".amenu__item"); //показаны на экране
    const burgerItems = burgerList.querySelectorAll(".amenu__item"); // скрыты в бургер меню

    // получаем ширину экрана меню
    const widthMenu = menu.offsetWidth;

    // ширина нашего бургег меню
    burgerWidth = burgerMenu.offsetWidth || burgerWidth;

    const widthAllItems =
      [...menuItems].reduce((acc, elem) => {
        // возвращаем ширину меню в окне
        return (
          acc +
          elem.offsetWidth +
          parseFloat(getComputedStyle(elem).marginRight)
        );
      }, 0) + burgerWidth;
    // spread syntax. acc - аккамулятор. acc+elem.offsetWidth - ширина без правых отступов

    // условаие для перенесения пунктов в бургер меню
    if (widthMenu < widthAllItems) {
      const lastItem = menuItems[menuItems.length - 1];
      lastWidthItem =
        lastItem.offsetWidth +
        parseFloat(getComputedStyle(lastItem).marginRight);
      burgerList.prepend(lastItem);
      return updateMenu(menu, menuList, burgerMenu, burgerBtn, burgerList);
      // вызываем снова функцию updateMenu, чтобы проверить а влезает ли пункт меню и его переместить в бургер
    }

    // защита от двух пунктов
    if (widthMenu > widthAllItems + lastWidthItem && burgerItems.length) {
      const firstElem = burgerItems[0];
      menuList.append(firstElem);
      return updateMenu(menu, menuList, burgerMenu, burgerBtn, burgerList);
    }

    // функция отображения/неотображения кнопки бургера
    checkBurgerItems(burgerItems.length, burgerBtn, burgerList);
  };

  const checkBurgerItems = (burgerItemsCount, burgerBtn, burgerList) => {
    if (burgerItemsCount) {
      burgerBtn.classList.add("amenu__burger-btn_active");
      burgerList.classList.remove("amenu__burger-list_not-active");
    } else {
      burgerBtn.classList.remove("amenu__burger-btn_active");
      burgerList.classList.add("amenu__burger-list_not-active");
    }
  };

  // видно внешне
  window.amenu = (
    selectorMenu,
    selectorMenuList,
    selectorItemsMenu,
    SelectorBurgerMenu
  ) => {
    const menu = document.querySelector(selectorMenu),
      menuList = document.querySelector(selectorMenuList),
      itemsMenu = document.querySelectorAll(selectorItemsMenu),
      burgerMenu = document.querySelector(SelectorBurgerMenu);

    init(menu, menuList, itemsMenu, burgerMenu);
  };
})();
