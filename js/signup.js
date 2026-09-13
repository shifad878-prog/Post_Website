const supabaseUrl = "https://oibwlgsbbjlaavbflglb.supabase.co";
const supabaseKey = "sb_publishable_rrGD9f3mmVMgFhFX1NuSqg_qMEqFjZk";

const { createClient } = supabase

const client = createClient(supabaseUrl, supabaseKey);

console.log(client);

const signupForm = document.querySelector("#signupForm");

signupForm.addEventListener("submit", async(event) => {
    event.preventDefault();
    // 1. Validation 
    if (
        email.value === "" ||
        password.value === ""
    ) {
        alert("Please fill all fields");
        return;
    }

    // 2. Supabase Signup
    try {

        const { data, error } = await client.auth.signUp({
            email: email.value,
            password: password.value
        });

        if (error) {
            alert(error.message);
            return;
        }

        alert("Account created successfully!");

        console.log(data);

    } catch (error) {

        console.log(error);
        alert("Something went wrong");

    }
}); 