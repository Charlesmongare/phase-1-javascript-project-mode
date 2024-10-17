const baseUrl = "db.json";
const cartItems = []; // Array to store items added to cart
let cartCount = 0;    // Variable to track number of items in cart
let totalPrice = 0;   // Variable to track total price of items in the cart

document.addEventListener("DOMContentLoaded", () => {
    // Fetch data from the JSON file
    async function getData() {
        try {
            let response = await fetch(baseUrl);
            let data = await response.json();
            let sneakers = data.sneakers; // Accessing the sneakers array
            sneakers.forEach(sneaker => displaySneaker(sneaker));
        } catch (err) {
            console.error("Error fetching data:", err);
        }
    }

    // Fetch initial data on page load
    getData();

    // Form submit event to add a new sneaker
    let addForm = document.getElementById("add-form");
    addForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        let formData = new FormData(e.target);
        let sneakerObj = {
            name: formData.get("name"),
            image_url: formData.get("image"),
            price: parseInt(formData.get("price"))
        };

        try {
            let response = await fetch(baseUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(sneakerObj)
            });

            let data = await response.json();
            alert(`${data.name} created successfully`);
            displaySneaker(data); // Display the new sneaker on the page
        } catch (err) {
            console.error("Error creating sneaker:", err);
        }
    });
});

// Function to display a sneaker
function displaySneaker(sneaker) {
    let sneakersDiv = document.getElementById("sneakers");
    let sneakerDiv = document.createElement("div");
    sneakerDiv.classList.add("card");

          // Create image element
          const img = document.createElement('img');
          img.src = sneaker.image_url;
          img.alt = sneaker.name;

             // Create button to add to cart
      const button = document.createElement('button');
      button.classList.add('btn');
      button.innerHTML = `<i class="fa-solid fa-cart-plus"></i> Add to cart`;
      
      // When the button is clicked, add the product to the cart
      button.addEventListener('click', () => {
        addToCart(sneaker);
      });
      
       // Create article for product details
       const article = document.createElement('article');
       article.classList.add('item');
       article.innerHTML = `
         <strong>${sneaker.name}</strong>
         <p class="price">$${sneaker.price.toFixed(2)}</p>
       `;
       

    // sneakerDiv.innerHTML = `
    //     <img src="${sneaker.image_url}" alt="${sneaker.name}" />
    //     <p>Name: ${sneaker.name}</p>
    //     <p>Price: $${sneaker.price}</p>
    //     <form onsubmit="editSneaker(event, this, ${sneaker.id})">
    //         <label for="name-${sneaker.id}">Name: </label>
    //         <input type="text" id="name-${sneaker.id}" name="name" required value="${sneaker.name}"><br>
    //         <label for="price-${sneaker.id}">Price: </label>
    //         <input type="number" id="price-${sneaker.id}" name="price" required value="${sneaker.price}"><br>
    //         <button type="submit">Edit Sneaker</button>
    //     </form>
    //     <button onclick="deleteSneaker(${sneaker.id})">Delete</button>
    // `;
   // Append elements to the card
   sneakerDiv.appendChild(img);
   sneakerDiv.appendChild(button);
   sneakerDiv.appendChild(article);
   sneakersDiv.appendChild(sneakerDiv);
}

// Function to delete a sneaker
async function deleteSneaker(id) {
    try {
        await fetch(`${baseUrl}/${id}`, { method: "DELETE" });
        alert("Sneaker Deleted Successfully");
        removeSneakerFromDOM(id);
    } catch (err) {
        console.error("Error deleting sneaker:", err);
    }
}

// Remove sneaker element from DOM after delete
function removeSneakerFromDOM(id) {
    let sneakerDiv = document.querySelector(`.sneaker-div button[onclick='deleteSneaker(${id})']`).parentElement;
    sneakerDiv.remove();
}

// Function to edit a sneaker
async function editSneaker(e, form, id) {
    e.preventDefault();

    let formData = new FormData(form);
    let updatedSneaker = {
        name: formData.get("name"),
        image_url: formData.get("image"),
        price: parseInt(formData.get("price"))
    };

    try {
        let response = await fetch(`${baseUrl}/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updatedSneaker)
        });

        let data = await response.json();
        alert(`${data.name} updated successfully`);

        // Update the displayed sneaker with the new data
        updateSneakerInDOM(id, data);
    } catch (err) {
        console.error("Error updating sneaker:", err);
    }
}

function addToCart(sneaker) {
    cartItems.push(sneaker); // Add product to the cart array
    cartCount++; // Increase the count of items in the cart
    totalPrice += sneaker.price; // Add the product price to the total
    updateCartDisplay(); // Update the cart UI
  }

  // Function to update the cart display
  function updateCartDisplay() {
    const cartItemsDiv = document.getElementById('cart-items');
    const cartCountSpan = document.getElementById('cart-count');
    const cartTotalDiv = document.getElementById('cart-total');

    // Clear previous cart display
    cartItemsDiv.innerHTML = '';

    // Update the cart count
    cartCountSpan.textContent = `(${cartCount})`;

    // Loop through cart items and display them
    cartItems.forEach(item => {
      const cartItemDiv = document.createElement('div');
      cartItemDiv.classList.add('cart-item');

      // Display product name and price
      cartItemDiv.innerHTML = `
        <p>${item.name} - $${item.price.toFixed(2)}</p>
      `;

      // Add the cart item to the cart-items div
      cartItemsDiv.appendChild(cartItemDiv);
    });

    // Display the total price of items in the cart
    cartTotalDiv.textContent = `Total: $${totalPrice.toFixed(2)}`;

    // If cart is empty, show a message
    if (cartItems.length === 0) {
      cartItemsDiv.innerHTML = '<p>Your added items will appear here</p>';
      cartTotalDiv.textContent = 'Total: $0.00';
    }
  }


