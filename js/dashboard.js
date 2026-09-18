const supabaseUrl = "https://oibwlgsbbjlaavbflglb.supabase.co";
const supabaseKey = "sb_publishable_rrGD9f3mmVMgFhFX1NuSqg_qMEqFjZk";

const { createClient } = supabase;

const client = createClient(supabaseUrl, supabaseKey);

console.log(client);


// ====================
// LOGOUT
// ====================

const logoutBtn = document.querySelector("#logoutBtn");

logoutBtn.addEventListener("click", async (event) => {

    event.preventDefault();

    const { error } = await client.auth.signOut();

    if (error) {
        console.log(error);
        alert("Logout Failed");
        return;
    }

    alert("Logout successful!");

    window.location.href = "./index.html";
});



const userName = document.querySelector("#userName");
const profileName = document.querySelector("#profileName");
const userEmail = document.querySelector("#userEmail");
const userInitial = document.querySelector("#userInitial");


async function getUser() {

    const { data: { user }, error: authError } = await client.auth.getUser();

    if (authError) {
        console.log("Auth Error:", authError);
        return;
    }

    console.log("Logged In User:", user);

    // Email directly Auth se
    userEmail.innerHTML = user.email;


    const { data, error } = await client
        .from("user_data")
        .select("name, email")
        .eq("email", user.email);

    console.log("DATA:", data);
    console.log("ERROR:", error);


    if (!data || data.length === 0) {
        console.log("User data not found");
        return;
    }


    userName.innerHTML = data[0].name;
    profileName.innerHTML = data[0].name;
    userInitial.innerHTML = data[0].name.charAt(0);

}

getUser();


// upload image 
const coverImage = document.querySelector("#coverImage");
const uploadImageBtn = document.querySelector("#uploadImageBtn");

const coverPreviewBox = document.querySelector("#coverPreviewBox");
const coverPreview = document.querySelector("#coverPreview");

let imageUrl = "";



uploadImageBtn.addEventListener("click", () => {
    coverImage.click();
});


coverImage.addEventListener("change", async (event) => {

    const selectedImage = event.target.files[0];

    console.log("Selected Image:", selectedImage);
    console.log("Image Name:", selectedImage?.name);
    console.log("Client:", client);

    if (!selectedImage) {
        console.log("No image selected");
        return;
    }

    // Image Preview
    coverPreview.src = URL.createObjectURL(selectedImage);
    coverPreviewBox.classList.remove("d-none");

    // File name
    const fileName = Date.now() + "-" + selectedImage.name;

    console.log("File Name:", fileName);


    // Supabase Storage
    const { data, error } = await client
        .storage
        .from("blog_post")
        .upload(fileName, selectedImage, {
            cacheControl: "3600",
            upsert: false
        });

    console.log("Upload Data:", data);
    console.log("Upload Error:", error);


    // Public URL
    const { data: publicUrlData } = client
        .storage
        .from("blog_post")
        .getPublicUrl(fileName);

    imageUrl = publicUrlData.publicUrl;

    console.log("Public URL:", publicUrlData.publicUrl);

});


// blog post data insert 

const title = document.querySelector("#postTitle");
const category = document.querySelector("#postCategory");
const content = document.querySelector("#postContent");
const createPostBtn = document.querySelector("#createPostBtn");

createPostBtn.addEventListener("click", async () => {

    // Values lena extra space remove 
    const postTitle = title.value.trim();
    const postCategory = category.value;
    const postContent = content.value.trim();

    // Validation sweet alert 
    if (postTitle === "" || postCategory === "Select Category" || postContent === "") {
        Swal.fire({
            icon: "warning",
            title: "Missing Data",
            text: "Please fill all fields."
        });
        return;
    }

    // Supabase insert
    const { data, error } = await client
        .from("post_data")
        .insert([
            {
                title: postTitle,
                category: postCategory,
                content: postContent,
                image_url: imageUrl
            }
        ])
        .select();

    if (error) {
        console.log("Insert Error:", error);

        Swal.fire({
            icon: "error",
            title: "Error",
            text: error.message
        });

        return;
    }

    console.log("Post Created:", data);

    Swal.fire({
        icon: "success",
        title: "Published!",
        text: "Your blog post has been published successfully."
    });

    // My Posts page par redirect
    window.location.href = "mypost.html";

    // Form clear
    title.value = "";
    category.value = "Select Category";
    content.value = "";
});