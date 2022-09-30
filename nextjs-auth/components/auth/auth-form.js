import { useState, useRef } from "react";
import classes from "./auth-form.module.css";
import { signIn } from "next-auth/client";

async function createUser(email, password) {
  const response = await fetch("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify({ email, password }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }
  return data;
}

function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const enteredEmailRef = useRef();
  const enteredPasswordRef = useRef();

  function switchAuthModeHandler() {
    setIsLogin((prevState) => !prevState);
  }

  async function submitHandler(event) {
    event.preventDefault();
    const emailInputValue = enteredEmailRef.current.value;
    const passwordInputValue = enteredPasswordRef.current.value;

    if (isLogin) {
      const result = await signIn("credentials", {
        redirect: false,
        email: emailInputValue,
        password: passwordInputValue,
      });
      // console.log(result);
      if (!result.error) {
      }
    } else {
      try {
        const result = await createUser(emailInputValue, passwordInputValue);
        console.log(result);
      } catch (error) {
        console.log(error);
      }
    }
  }

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? "Login" : "Sign Up"}</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor="email">Your Email</label>
          <input type="email" id="email" required ref={enteredEmailRef} />
        </div>
        <div className={classes.control}>
          <label htmlFor="password">Your Password</label>
          <input
            type="password"
            id="password"
            required
            ref={enteredPasswordRef}
          />
        </div>
        <div className={classes.actions}>
          <button>{isLogin ? "Login" : "Create Account"}</button>
          <button
            type="button"
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? "Create new account" : "Login with existing account"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default AuthForm;
