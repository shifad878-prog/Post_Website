const supabaseUrl = "https://oibwlgsbbjlaavbflglb.supabase.co";
const supabaseKey = "sb_publishable_rrGD9f3mmVMgFhFX1NuSqg_qMEqFjZk";

const { createClient } = supabase

const client = createClient(supabaseUrl, supabaseKey);

console.log(client);

const logoutBtn = document.querySelector("#logoutBtn")

logoutBtn.addEventListener("click", async(event) => {
    event.preventDefault();
    const { error } = await client.auth.signOut()
    if(error) {
         console.log(error);
         alert("Logout Falied");
         return;
    }
    alert("Logout successful!")

    window.location.href = "./index.html";

})

// Profile elements
const profileBtn = document.querySelector("#profileBtn");
const profileMenu = document.querySelector("#profileMenu");

const navbarName = document.querySelector("#navbarName");
const dropdownName = document.querySelector("#dropdownNameText");
const dropdownEmail = document.querySelector("#dropdownEmail");

// Dropdown open / close
profileBtn.addEventListener("click", () => {
    profileMenu.classList.toggle("show");
});


// Get logged-in user
async function getUser() {

    const { data, error } = await client.auth.getUser();

    if (error) {
        console.log(error);
        return;
    }

    const user = data.user;

    if (user) {

        // Email
        dropdownEmail.textContent = user.email;

        // Username
        const username = user.user_metadata?.username || "User";

        navbarName.textContent = username;
        dropdownName.textContent = username;

        // First letter in circle
        document.querySelector("#dropdownName").textContent =
            username.charAt(0).toUpperCase();
    }
}

getUser();
