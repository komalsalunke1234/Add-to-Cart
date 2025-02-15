import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, push, onChildAdded, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

// Initialize Firebase
const appSettings = {
    databaseURL: "https://playground-a75b5-default-rtdb.firebaseio.com/"
};
const app = initializeApp(appSettings);
const database = getDatabase(app);
const shoppingListInDB = ref(database, "shoppingList");

// DOM Elements
const inputFieldEl = document.getElementById("input-field");
const addButtonEL = document.getElementById("add-button");
const shoppingListEL = document.getElementById("shopping-list");

// Add item on button click
addButtonEL.addEventListener("click", () => {
    const inputValue = inputFieldEl.value.trim();
    if (inputValue) {
        push(shoppingListInDB, inputValue);
        inputFieldEl.value = "";
    } else {
        console.log("Please enter an item.");
    }
});

// Update list in real-time
onChildAdded(shoppingListInDB, (snapshot) => {
    const itemKey = snapshot.key;
    const itemValue = snapshot.val();

    // Create list item
    const li = document.createElement("li");
    li.textContent = itemValue;

    // Attach click event with confirmation prompt
    li.addEventListener("click", () => {
        const confirmDelete = window.confirm(`Delete "${itemValue}"?`);
        if (confirmDelete) {
            const itemRef = ref(database, `shoppingList/${itemKey}`);
            remove(itemRef);
            li.remove();
        }
    });

    shoppingListEL.appendChild(li);
});
