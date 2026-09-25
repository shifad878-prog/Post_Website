const supabaseUrl = "https://oibwlgsbbjlaavbflglb.supabase.co";
const supabaseKey = "sb_publishable_rrGD9f3mmVMgFhFX1NuSqg_qMEqFjZk";

const { createClient } = supabase

const client = createClient(supabaseUrl, supabaseKey);

console.log(client);

const signupForm = document.querySelector("#signupForm");
const firstName = document.querySelector("#name")

signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    // 1. Validation 
    if (
        firstName.value === "" ||
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

        const { data: database } = await client
            .from('user_data')
            .insert({ name: firstName.value,
                email: email.value
             })

        if (error) {
            alert(error.message);
            return;
        }

        alert("Account created successfully!");

        console.log(data);
        // 5. Redirect to dashboard
        window.location.href = "./dashboard.html";

    } catch (error) {

        console.log(error);
        alert("Something went wrong");

    }


}); 