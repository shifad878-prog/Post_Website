const supabaseUrl = "https://oibwlgsbbjlaavbflglb.supabase.co";
const supabaseKey = "sb_publishable_rrGD9f3mmVMgFhFX1NuSqg_qMEqFjZk";

const { createClient } = supabase

const client = createClient(supabaseUrl, supabaseKey);

console.log(client);

const loginForm = document.querySelector("#loginForm");

const email = document.querySelector("#email");
const password = document.querySelector("#password");

loginForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    // 1. Validation
    if (
        email.value === "" ||
        password.value === ""
    ) {
        alert("Please fill all fields");
        return;
    }


    // 2. Supabase Login
    try {

        const { data, error } = await client.auth.signInWithPassword({
            email: email.value,
            password: password.value
        });

        // 3. Error handling
        if (error) {
            alert(error.message);
            return;
        }

        // 4. Login successful
        console.log(data);

        alert("Login successful!");

        // 5. Redirect to dashboard
        window.location.href = "./dashboard.html";

    } catch (error) {

        console.log(error);
        alert("Something went wrong");

    }

});