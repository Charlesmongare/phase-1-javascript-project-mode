const baseUrl = "http://localhost:3000/sneakers"
document.addEventListener("DOMContentLoaded",() =>{
    async function getData(){
        try {
            let response = await fetch(baseUrl)
            let data =  await response.json()
            data.forEach(sneaker => {
                displaySneaker(sneaker)
        })
        }catch(err){
            console.log(err)
        }
    }
    getData()
    // fetch(baseUrl)
    // .then(res => res.json())
    // .then(data => {
        
    //     data.forEach(sneaker => {
    //         displaySneaker(sneaker)
    //     })
    // })
    // .catch(err => console.log(err))

    let addForm = document.getElementById("add-form")
    addForm.addEventListener("submit",(e) =>{
        e.preventDefault()
        let formData = new FormData(e.target)
        let sneakerObj = {
            name:formData.get("name"),
            image_url: formData.get("image"),
            price: parseInt(formData.get("price"))
        }
       
        fetch(baseUrl,{
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(sneakerObj)
        })
        .then(res => res.json())
        .then(data => {
            alert(`${data.name} created successfully`)
        })
        .catch(err => console.log(err))
    })
})
function displaySneaker(sneaker){
    let sneakersDiv = document.getElementById("sneakers-div")
    let sneakerDiv = document.createElement("div")
    sneakerDiv.classList.add("sneaker-div")
    sneakerDiv.innerHTML = `
        <img id="image" src= "${sneaker.image_url}" />
        <p>Name: ${sneaker.name}</p>
        <p>Price: ${sneaker.price}</p>
        <form id="edit-form" onsubmit="editSneaker(event,this,${sneaker.id})">
            <label for="name">Name: </label>
            <input type="text" id="name" name="name" required><br>
            <label for="image">Image: </label>
            <input type="url" id="image" name="image" required><br>
            <label for="price">Price: </label>
            <input type="number" id="price" name="price"><br>
            <button>Edit Sneaker</button>
        </form>
        <button onclick="deleteSneaker(${sneaker.id})">Delete</button>
    `
    sneakersDiv.appendChild(sneakerDiv)
}

function deleteSneaker(id){
    fetch(`${baseUrl}/${id}`,{
        method: "DELETE",
    })
    .then(res => res.json())
    .then(() =>{
        alert("Sneaker Deleted Successfully")
    })
    .catch(err => console.log(err))
}
function editSneaker(e,form,id){
    e.preventDefault()
    let formData = new FormData(form)
        let sneakerObject = {
            name:formData.get("name"),
            image_url: formData.get("image"),
            price: parseInt(formData.get("price"))
        }
        fetch(`${baseUrl}/${id}`,{
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(sneakerObject)
        })
        .then(res => res.json())
        .then(data => {
            alert(`${data.name} updated successfully`)
        })
        .catch(err => console.log(err))
    
}