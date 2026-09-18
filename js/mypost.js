// Supabase 
const supabaseUrl = "https://oibwlgsbbjlaavbflglb.supabase.co";
const supabaseKey = "sb_publishable_rrGD9f3mmVMgFhFX1NuSqg_qMEqFjZk";

const { createClient } = supabase;

const client = createClient(supabaseUrl, supabaseKey);

console.log(client);

const myPostsContainer = document.querySelector("#myPostsContainer");

const noPostsMessage = document.querySelector("#noPostsMessage");


async function getMyPosts() {

    // Purane cards clear karna
    myPostsContainer.innerHTML = "";

    const { data: posts, error: postsError } = await client
        .from("post_data")
        .select("*");

    console.log("Posts:", posts);
    console.log("Posts Error:", postsError);


    // Agar query mein error ho
    if (postsError) {

        console.log("Error fetching posts:", postsError.message);

        return;
    }


    // Agar posts empty hon
    if (!posts || posts.length === 0) {

        noPostsMessage.classList.remove("d-none");

        return;

    } else {

        noPostsMessage.classList.add("d-none");

    }


    posts.forEach((post) => {

        console.log("Post Image:", post.image_url);

        const postCard = `
            <div class="col-md-6 col-lg-4">

                <div class="card h-100 shadow-sm border-0">

                    <img 
                        src="${post.image_url || './images/blog1.jpg'}"
                        class="card-img-top"
                        style="height:220px; object-fit:cover;"
                        alt="${post.title}"
                    >

                    <div class="card-body">

                        <span class="badge bg-warning text-dark mb-2">
                            ${post.category}
                        </span>

                        <h5 class="card-title fw-bold">
                            ${post.title}
                        </h5>

                        <p class="card-text text-muted small">
                            ${post.content}
                        </p>

                        <p class="text-muted small mb-3">
                            Published on 
                            ${new Date(post.created_at).toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric"
        })}
                        </p>

                        <!-- Buttons -->

                        <a 
                            href="single-post.html?id=${post.id}"
                            class="btn btn-outline-warning btn-sm"
                        >
                            Read More
                        </a>

                        <button 
                            class="btn btn-outline-primary btn-sm"
                            onclick="editPost(${post.id})"
                        >
                            Edit
                        </button>

                        <button 
                            class="btn btn-outline-danger btn-sm"
                            onclick="deletePost(${post.id})"
                        >
                            Delete
                        </button>

                    </div>

                </div>

            </div>
        `;

        myPostsContainer.innerHTML += postCard;

    });

}

getMyPosts();

// edit post
async function editPost(postId) {
    console.log("Edit Post ID:", postId);

    // Post find karna
    const { data: post, error } = await client
        .from("post_data")
        .select("*")
        .eq("id", postId)
        .single();

    console.log("Post:", post);
    console.log("Error:", error);

    if (error) {
        Swal.fire({
            icon: "error",
            title: "Error",
            text: error.message
        });

        return;
    }

    // SweetAlert Edit Form
    const { value: formValues } = await Swal.fire({

        title: "Edit Post",

        html: `
            <input 
                id="editTitle"
                class="swal2-input"
                placeholder="Post Title"
                value="${post.title}"
            >

            <select id="editCategory" class="swal2-select">

                <option value="Technology">Technology</option>
                <option value="Lifestyle">Lifestyle</option>
                <option value="Education">Education</option>
                <option value="Travel">Travel</option>
                <option value="Graphic Designing">Graphic Designing</option>

            </select>

            <textarea
                id="editContent"
                class="swal2-textarea"
                placeholder="Post Content"
            >${post.content}</textarea>
        `,

        showCancelButton: true,

        confirmButtonText: "Update Post",

        cancelButtonText: "Cancel",

        preConfirm: () => {

            const title = document.querySelector("#editTitle").value.trim();

            const category = document.querySelector("#editCategory").value;

            const content = document.querySelector("#editContent").value.trim();

            if (title === "" || category === "" || content === "") {

                Swal.showValidationMessage(
                    "Please fill all fields."
                );

                return false;
            }

            return {
                title,
                category,
                content
            };
        }

    });

    // Agar user Cancel kare
    if (!formValues) {
        return;
    }

    console.log("Updated Data:", formValues);

    // Supabase mein update
    const { data, error: updateError } = await client
        .from("post_data")
        .update({
            title: formValues.title,
            category: formValues.category,
            content: formValues.content
        })
        .eq("id", postId)
        .select();

    console.log("Updated Post:", data);
    console.log("Update Error:", updateError);

    if (updateError) {

        Swal.fire({
            icon: "error",
            title: "Update Failed",
            text: updateError.message
        });

        return;
    }

    Swal.fire({
        icon: "success",
        title: "Updated!",
        text: "Your post has been updated successfully."
    });

    // Updated posts dobara load
    getMyPosts();
}


// delt post 
async function deletePost(postId) {

    console.log("Delete Post ID:", postId);

    // Confirmation
    const result = await Swal.fire({

        title: "Are you sure?",

        text: "You won't be able to recover this post!",

        icon: "warning",

        showCancelButton: true,

        confirmButtonColor: "#d33",

        cancelButtonColor: "#6c757d",

        confirmButtonText: "Yes, delete it!",

        cancelButtonText: "Cancel"

    });


    // Agar Cancel kiya
    if (!result.isConfirmed) {
        return;
    }


    // Supabase se post delete
    const { data, error } = await client
        .from("post_data")
        .delete()
        .eq("id", postId)
        .select();


    console.log("Deleted Post:", data);
    console.log("Delete Error:", error);


    if (error) {

        Swal.fire({
            icon: "error",
            title: "Delete Failed",
            text: error.message
        });

        return;
    }


    // Success message
    Swal.fire({

        icon: "success",

        title: "Deleted!",

        text: "Your post has been deleted successfully.",

        timer: 1500,

        showConfirmButton: false

    });


    // Posts dobara load
    getMyPosts();

}