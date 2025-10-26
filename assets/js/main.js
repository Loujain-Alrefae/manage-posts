let baseUrl = "https://vica-post-api.vercel.app/api/posts";

const tbody = document.querySelector("table #table-content")
// Get the add form and its input elements
const postModal = document.querySelector(".post-modal");
const form = document.querySelector(".post-modal form")
const postTitle = document.querySelector("form .input-box #nameInput")
const postDescription = document.querySelector("form .input-box #descInput")
const btnSavePost =document.querySelector(".post-modal .btn-primary")
// Get the edit form and its input elements
const postEdit = document.querySelector(".post-Edit")
const formEditPost = document.querySelector(".post-Edit form ")
const editTitle = document.querySelector(".post-Edit form #editNameInput")
const editDescription = document.querySelector(".post-Edit form #editDescInput")
const btnUpdatePost = document.querySelector(".post-Edit form .btn-secondry")

// show posts 
const read = async () => {
    let response = await fetch("https://vica-post-api.vercel.app/api/posts")
    response = await response.json()
    tbody.innerHTML = ""

    let postNumber = response.length
    // Show message if the table is empty
    if (postNumber == 0) {
        tbody.innerHTML = `
        <tr>
            <td colspan="4" style="
                            font-weight: bold;
                            font-size : 20px;
                            text-align: center;"> No posts found
            </td>
        </tr>
        `
    }
    response.forEach(post => {
        tbody.innerHTML += `
                    <tr>
                        <td>${postNumber--}</td>
                        <td>${post.title}</td>
                        <td>${post.description}</td>
                        <td class="table-actions">
                            <button  onclick="getPost(${post.id})">
                                <img src="./assets/img/edit.svg" alt="edit-icon" />
                            </button>
                            <button class="delete-btn" onclick = "deletePost(${post.id})">
                                <img src="./assets/img/trash.svg" alt="delete-icon" />
                            </button>
                        </td>
                    </tr>
                `
    });
}

// Toggle Modal
function togglePostModal() {
    postModal.classList.toggle("post-modal-active");
}

// Toggle Edit
function togglePostEdit() {
    postEdit.classList.toggle("post-Edit-active");
}

// Creat new post 
const addPost = async (event) => {
    // Get title and description from the user to create a new post
    event.preventDefault()
    let newPost ={
        title : postTitle.value , 
        description : postDescription.value
    }
    // Store the new post
    try {
        let response = await fetch("https://vica-post-api.vercel.app/api/posts" , {
            method : "POST",
            headers : {
                "Content-Type": "application/json"
            },
            body : JSON.stringify(newPost)
        })
        response = await response.json()
        read()
        postTitle.value = ""
        postDescription.value = ""
    } catch (error) {
        console.log(error);
    }
    postModal.classList.toggle("post-modal-active");
}

// Get post by their id
let idPost
const getPost = async (id) => {
    idPost = id
    postEdit.classList.toggle("post-Edit-active");
    let response = await fetch(`https://vica-post-api.vercel.app/api/posts/${id}`)
    response = await response.json()
    //Fill the input fields with the retrieved task information
    editTitle.value = response.title
    editDescription.value = response.description
}

// Update Post 
const updatePost = (event) => {
    event.preventDefault()
    // Get new data from user 
    let updateData = {
        title : editTitle.value , 
        description : editDescription.value
    }
    // Store the updated post
    fetch(`https://vica-post-api.vercel.app/api/posts/${idPost}`, {
        method : "PUT",
        headers : {
            "Content-Type": "application/json"
        },
        body : JSON.stringify(updateData)
    })
    .then(res => res.json())
    .then(res => read())
    .catch(err => console.log(err))
    postEdit.classList.toggle("post-Edit-active");
}

// Get the post by its id to delete it
const deletePost = (id) => {
    fetch(`https://vica-post-api.vercel.app/api/posts/${id}`,{
        method : "DELETE",
    })
    .then(res => res.json())
    .then(res => read())
    .catch(err => console.log(err))
}

// call function
form.addEventListener("submit" , addPost)

formEditPost.addEventListener("submit" , updatePost)

read()
