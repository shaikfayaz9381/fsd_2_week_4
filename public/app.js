const API_URL = "/api/items";


// ----------------------------------
// LOAD ALL ITEMS
// ----------------------------------
async function loadItems() {

    try {

        const response = await fetch(API_URL);

        const items = await response.json();

        displayItems(items);

    } catch (error) {

        console.error(error);

        document.getElementById("item-list").innerHTML =
            "<p>Unable to load items.</p>";
    }
}


// ----------------------------------
// DISPLAY ITEMS
// ----------------------------------
function displayItems(items) {

    const itemList = document.getElementById("item-list");

    itemList.innerHTML = "";

    if (items.length === 0) {

        itemList.innerHTML = "<p>No items available.</p>";

        return;
    }


    items.forEach(item => {

        const div = document.createElement("div");

        div.className = "item";


        div.innerHTML = `
            <h3>${item.name}</h3>

            <p>
                <strong>Price:</strong>
                $${Number(item.price).toFixed(2)}
            </p>

            <p>
                <strong>Status:</strong>
                ${item.inStock ? "In Stock" : "Out of Stock"}
            </p>

            <p>
                <strong>Description:</strong>
                ${item.description || "No description"}
            </p>

            <button
                class="edit-button"
                onclick="editItem('${item._id}')"
            >
                Edit
            </button>

            <button
                class="delete-button"
                onclick="deleteItem('${item._id}')"
            >
                Delete
            </button>
        `;

        itemList.appendChild(div);

    });
}


// ----------------------------------
// ADD / UPDATE ITEM
// ----------------------------------
document
    .getElementById("item-form")
    .addEventListener("submit", async function(event) {

        event.preventDefault();


        const id =
            document.getElementById("item-id").value;

        const item = {

            name:
                document.getElementById("name").value,

            description:
                document.getElementById("description").value,

            price:
                Number(document.getElementById("price").value),

            inStock:
                document.getElementById("inStock").checked
        };


        try {

            let response;


            // UPDATE
            if (id) {

                response = await fetch(
                    `${API_URL}/${id}`,
                    {
                        method: "PUT",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify(item)
                    }
                );

            }

            // CREATE
            else {

                response = await fetch(
                    API_URL,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify(item)
                    }
                );

            }


            if (!response.ok) {

                const error = await response.json();

                alert(error.error || "Operation failed");

                return;
            }


            // Clear form
            resetForm();

            // Refresh item list
            loadItems();

        } catch (error) {

            console.error(error);

            alert("Server error");
        }

    });


// ----------------------------------
// EDIT ITEM
// ----------------------------------
async function editItem(id) {

    try {

        const response =
            await fetch(`${API_URL}/${id}`);

        const item =
            await response.json();


        document.getElementById("item-id").value =
            item._id;

        document.getElementById("name").value =
            item.name;

        document.getElementById("description").value =
            item.description || "";

        document.getElementById("price").value =
            item.price;

        document.getElementById("inStock").checked =
            item.inStock;


        document.getElementById("form-title").textContent =
            "Edit Item";

        document.getElementById("cancel-button").style.display =
            "inline-block";

        window.scrollTo(0, 0);

    } catch (error) {

        console.error(error);

        alert("Unable to load item");
    }
}


// ----------------------------------
// DELETE ITEM
// ----------------------------------
async function deleteItem(id) {

    if (!confirm("Are you sure you want to delete this item?")) {
        return;
    }


    try {

        const response =
            await fetch(`${API_URL}/${id}`, {
                method: "DELETE"
            });


        if (!response.ok) {

            const error =
                await response.json();

            alert(error.error || "Delete failed");

            return;
        }


        loadItems();

    } catch (error) {

        console.error(error);

        alert("Unable to delete item");
    }
}


// ----------------------------------
// CANCEL EDIT
// ----------------------------------
function cancelEdit() {

    resetForm();
}


// ----------------------------------
// RESET FORM
// ----------------------------------
function resetForm() {

    document.getElementById("item-form").reset();

    document.getElementById("item-id").value = "";

    document.getElementById("form-title").textContent =
        "Add Item";

    document.getElementById("cancel-button").style.display =
        "none";
}


// ----------------------------------
// INITIAL LOAD
// ----------------------------------
loadItems();