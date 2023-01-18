const urlOrigin = window.location.origin;

const convertName = (name) =>
  name
    .toLowerCase()
    .replaceAll(" ", "-")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const subItem = (subitem) => {
  return subitem.map((menuItem) => {
    const item = `
      {
        "id": "menu-item-${convertName(menuItem.name)}",
        "type": "custom",
        "highlight": false,
        "itemProps": {
          "type": "internal",
          "href": "${menuItem.url.replaceAll(urlOrigin, "")}",
          "noFollow": false,
          "tagTitle": "${menuItem.name}",
          "text": "${menuItem.name}"
        }
      }
    `;
    return item;
  });
};

const createMenuJson = (response) => {
  const menuChildren = []
  const menu = response.map((item) => {
    const newName = convertName(item.name);
    menuChildren.push("vtex.menu@2.x:menu#" + newName)
    const itemMenu = `
      "vtex.menu@2.x:menu#${newName}": {
        "props": {
          "items": [
            ${subItem(item.children)}
          ]
        }
      }
    `;
    return itemMenu;
  });
  console.log(
    "%c LOG: __children ",
    "background: orange; color: black;",
    menuChildren
  );
  return menu
};

const createMenu = async () => {
  const options = {
    method: "GET",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
  };

  const getCategories = await fetch(
    "/api/catalog_system/pub/category/tree/1",
    options
  );
  const response = await getCategories.json();
  const result = `
    {
        ${createMenuJson(response)}
    }
  `;
  console.log(
    "%c LOG: __menu ",
    "background: green; color: white;",
    JSON.parse(result)
  );
};

createMenu();
