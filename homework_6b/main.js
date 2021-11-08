/************************************
 * Changes storage
 */

/**
 * Called when user click on select in browsing page.
 */
 function setBunType(newBunType) {
  localStorage.setItem("bunType", JSON.stringify(newBunType));
}

/**
 * Called when user toggles the dropdown for glazing
 */
function setGlazing(select) {
  // elem is the select tag in html
  let newGlazing = select.options[select.selectedIndex].value;
  localStorage.setItem("glazingType", JSON.stringify(newGlazing));
}

/**
 * Utility function called by updateRollNumber
 * updates UI
 */

function updateRollNumberUI(newRollNumber) {
  let rollUI = document.getElementById("rollNumber");
  rollUI.innerHTML = newRollNumber;
}

/**
 * Called when user increments / decrements the roll number
 */
function updateRollNumber(opType) {
  var rollNumber = localStorage.getItem("rollNumber");
  rollNumber = parseInt(rollNumber);

  if (opType === "plus") {
    if (rollNumber === 1) {
      rollNumber += 2;
    } else {
      rollNumber *= 2;
    }
  } else {
    if (rollNumber === 3) {
      rollNumber -= 2;
    } else {
      rollNumber /= 2;
    }
  }

  if (rollNumber > 12) {
    rollNumber = 12;
  }
  if (rollNumber < 1) {
    rollNumber = 1;
  }
  localStorage.setItem("rollNumber", rollNumber);
  updateRollNumberUI(rollNumber);
}

/**
 * Utility function called by updateCart
 * Updates UI
 */
function updateCartNum(num) {
  var cartNum = JSON.parse(localStorage.getItem("cartNumber"));
  cartNum += num;
  localStorage.setItem("cartNumber", JSON.stringify(cartNum));
  var cartElem = document.getElementById("cartItemsNumber");
  cartElem.innerHTML = cartNum;
}

function updateCartNumDirect(cartNum) {
  localStorage.setItem("cartNumber", JSON.stringify(cartNum));
  var cartElem = document.getElementById("cartItemsNumber");
  cartElem.innerHTML = cartNum;
}

/**
 * Called when user clicks on a delete button for any items in cart
 */
function onDeleteItem() { 
  // Storage
  let container = this.parentNode.parentNode.parentNode.parentNode;
  let product_name = container.querySelector('#product_name').innerHTML;
  let product_glazing = container.querySelector('#product_glazing').innerHTML;

  // Update storage
  var products = JSON.parse(localStorage.getItem("cartProducts"));
  var newProducts = [];
  var newProductNum = JSON.parse(localStorage.getItem("cartNumber"));

  for (let i = 0; i < products.length; i++) {
    if (products[i].bunType !== product_name || products[i].glazingType !== product_glazing) {
      newProducts.push(products[i])
    } else { 
      newProductNum -= products[i].inCartNum;
    }
  }
  products = newProducts;
  localStorage.setItem("cartProducts", JSON.stringify(products));
  updateCartNumDirect(newProductNum); // update number

  // UI
  var productBlock = this.parentNode.parentNode.parentNode.parentNode.parentNode;
  productBlock.parentNode.removeChild(productBlock);
}


/**
 * Called when user clicks on add to cart
 */

/**
 * For each object in `carProducts` in storage, we store the following info:
 *      - glazingType
 *      - bunType
 *      - inCartNum
 */
function updateCart() {
  /**
   * We want to retrieve the current selected glazing, roll number, and bun type
   * in the storage, and updates
   *
   * 1) cart products
   * 2) cart number
   */
  let curBun = JSON.parse(localStorage.getItem("bunType"));
  let curGlaze = JSON.parse(localStorage.getItem("glazingType"));
  let curRoll = JSON.parse(localStorage.getItem("rollNumber"));

  /* first we check if this item is already in cart, if it's in cart, we just want
   * increment its inCart number */
  let cartItems = localStorage.getItem("cartProducts");
  cartItems = JSON.parse(cartItems);

  if (cartItems !== null) {
    // cart is not empty, so we want to check if there is a match for the bun and
    // glazing combination
    let found = false; // we need to know if we found it in the cart or not
    for (var i = 0; i < cartItems.length; i++) {
      if (
        cartItems[i]["bunType"] === curBun &&
        cartItems[i]["glazingType"] === curGlaze
      ) {
        // we found it so we increment
        cartItems[i]["inCartNum"] += curRoll;
        found = true;
        localStorage.setItem("cartProducts", JSON.stringify(cartItems));
        break; // no longer need to look further
      }
    }

    if (!found) {
      // not found then we need to create a new obj to append to list
      let newCartItem = {
        glazingType: curGlaze,
        bunType: curBun,
        inCartNum: curRoll,
      };
      cartItems.push(newCartItem);
      localStorage.setItem("cartProducts", JSON.stringify(cartItems));
    }
  } else {
    // cart is null (theoretically shouldn't happen because we init it to empty in
    // on load, but just to be safe)
    let newCartItem = {
      glazingType: curGlaze,
      bunType: curBun,
      inCartNum: curRoll,
    };
    let newCart = [newCartItem];
    localStorage.setItem("cartProducts", JSON.stringify(newCart));
  }

  updateCartNum(curRoll);
}

/************************************
 * Onload handlers
 *
 * Called when the javascript is loaded.
 */

function onLoadBunType() {
  let bunType = localStorage.getItem("bunType");

  // have not been initialized in storage
  if (!bunType) {
    localStorage.setItem("bunType", JSON.stringify("None"));
  }

  if (document.getElementById("bunType") !== null) {
    document.getElementById("bunType").innerHTML = JSON.parse(
      localStorage.getItem("bunType")
    );
  }
}

function onLoadGlazing() {
  let glazing = localStorage.getItem("glazingType");

  // have not been initialized in storage
  if (!glazing) {
    localStorage.setItem("glazingType", JSON.stringify("No"));
  }

  var glazingElem = document.getElementById("glazing");
  if (glazingElem !== null) {
    let options = glazingElem.options;
    let glazingVal = JSON.parse(localStorage.getItem("glazingType"));

    // change UI to 'select' the glazing that is selected in storage
    for (var i = 0; i < options.length; i++) {
      if (options[i].value === glazingVal) {
        glazingElem.selectedIndex = i;
        break;
      }
    }
  }
}

function onLoadRollNumber() {
  let rollNum = localStorage.getItem("rollNumber");
  rollNum = parseInt(rollNum);

  // have not been initialized in storage
  if (!rollNum) {
    localStorage.setItem("rollNumber", 1);
  }

  var rollNumElem = document.getElementById("rollNumber");
  if (rollNumElem !== null) {
    rollNumElem.innerHTML = JSON.parse(localStorage.getItem("rollNumber"));
  }
}

function onLoadCartNumber() {
  console.log("ON load");
  let cartNum = localStorage.getItem("cartNumber");
  cartNum = parseInt(cartNum);

  // have not been initialized in storage
  if (!cartNum) {
    console.log("init");
    localStorage.setItem("cartNumber", 0);
  }

  var cartNumberElem = document.getElementById("cartItemsNumber");
  if (cartNumberElem !== null) {
    console.log("Has data", localStorage.getItem("cartNumber"));
    cartNumberElem.innerHTML = JSON.parse(localStorage.getItem("cartNumber"));
  }
}

function onLoadCart() {
  let cartArr = localStorage.getItem("cartProducts");

  // have not been initialized in storage
  if (!cartArr) {
    localStorage.setItem("cartProducts", JSON.stringify([]));
  }

  var cartElem = document.getElementById("cartContainer");
  if (cartElem !== null) {
    displayCartProducts();
  }
}


function makeCartItem(products, i) {
  var name = document.createElement("span");
  var glazing = document.createElement("span");
  var quantity = document.createElement("span");
  var product_name = products[i]["bunType"];
  var product_quantity = products[i]["inCartNum"];
  var product_glazing = products[i]["glazingType"];
  var button = document.createElement("button");
  var button2 = document.createElement("button");

  name.innerHTML = product_name;
  name.id = "product_name"; // later for deletion searching
  quantity.innerHTML = product_quantity;
  glazing.innerHTML = product_glazing;
  glazing.id = "product_glazing"; // later for deletion searching
  button.innerHTML = "<span>Edit</span>";
  button2.innerHTML = "Delete";
  button.className = 'button1';
  button2.className = 'button2';

  // edit button
  button.addEventListener("click", function() {
    document.location.href = 'detail.html';
  })

  // delete button
  button2.addEventListener('click', onDeleteItem)

  tbl = document.createElement('table');
  tbl.cellPadding = '10';
    for (let i = 0; i < 2; i++) { //rows i
      const tr = tbl.insertRow();
      for (let j = 0; j < 2; j++) { //columns j
        const container = tr.insertCell();
          if (i === 0 && j === 0) { // i 0 j 0
            container.setAttribute('rowSpan', '2');
            container.setAttribute('class', 'pictd');
            container.innerHTML += 
            `<img src="images/browsingimg.png"> `
          } else if (i === 0 && j === 1) {
            container.append(name,", ",glazing," glazing, ",quantity," roll(s) ");
          } else if (i === 1 && j === 0) {
            container.append(button, "  ", button2);
          }
      }
    } 
    return tbl;
}

// count how many odd even/table
/**
 * Called when cart page is loaded.
 */
function displayCartProducts() {
  var products = JSON.parse(localStorage.getItem("cartProducts"));
  var container = document.getElementById("cartContainer");

  if (products.length % 2 == 0) {
    var numRows = products.length / 2
  } else {
    var numRows = Math.floor(products.length / 2) + 1
  }
  
  for (let r = 0; r < numRows; r++) {
    var productLeft = 2 * r
    var productRight = 2 * r + 1
    if (productLeft >= 0 && productLeft < products.length) {
      var leftItem = makeCartItem(products, productLeft)
    }
    if (productRight >= 0 && productRight < products.length) {
      var rightItem = makeCartItem(products, productRight)
    } else {
      var rightItem = document.createElement("span")
      rightItem.innerText = ""
    }

    var rowTableRow = document.createElement("tr");
    var rowTableRowCellLeft = document.createElement("td");
    var rowTableRowCellRight = document.createElement("td");
    rowTableRowCellLeft.appendChild(leftItem);
    rowTableRowCellRight.appendChild(rightItem);
    rowTableRow.appendChild(rowTableRowCellLeft);
    rowTableRow.appendChild(rowTableRowCellRight);
    container.appendChild(rowTableRow);
  }
}

/************************************
/* load (initialize if not initialized yet) localStorage data
 */
onLoadBunType();
onLoadRollNumber();
onLoadCartNumber();
onLoadGlazing();
onLoadCart();
