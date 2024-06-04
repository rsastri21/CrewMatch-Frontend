"use client";

import { GrGroup } from "react-icons/gr";
import { useState } from 'react';
import { User, useSession, useSessionUpdate } from "../SessionContext";
import { useRouter } from 'next/navigation';
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.js";
import posthog from "posthog-js";

interface SignUpData {
    name: string;
    username: string;
    password: string;
    // Optional field to validate password before sending register request
    confirmPassword?: string;
}


export default function Signup() {
    
    const router: AppRouterInstance = useRouter();
    const [data, setData] = useState<SignUpData>({
        name: "",
        username: "",
        password: "",
        confirmPassword: "",
    });

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    const changeUser = useSessionUpdate();
    const { name, username, password, confirmPassword } = data;

    const handleChange = (e: any) => {
        setData({ ...data, [e.target.name]: e.target.value });
    }

    const submitForm = (e: any) => {
        
        if (data.confirmPassword !== data.password) {
            setError("The passwords do not match.");
            return;
        }

        // Check fields are present before registering
        if (data.password.length === 0 || data.username.length === 0 || data.name.length === 0) {
            setError("Enter missing information.");
            return;
        }

        delete data.confirmPassword;

        // Trim username and name
        setData({
            ...data,
            username: data.username.trim(),
            name: data.name.trim()
        });

        setLoading(true);
    
        e.preventDefault();

        const user: User = {
            name: '',
            username: '',
            role: '',
            leads: '',
        };

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }
        fetch(process.env.API_URL + "/api/user/register", requestOptions)
            .then((res) => {
                if (res.status === 409) {
                    console.log("User is already registered. Please log in.");
                    setError("User is already registered. Please log in.");
                    return "error";
                } else if (res.status === 400) {
                    console.log("Login failed.");
                    setError("Username or password was not provided.");
                    return "error";
                } else if (res.ok) {
                    setError("");
                }
                return res.status;
            })
            .then((status) => {
                if (status === 201) {
                    user.name = name;
                    user.username = username;
                    user.role = 'user';
                    user.leads = null;
                }
            })
            .catch((err) => {
                console.error(err);
                posthog.capture('signup failed');
            }).finally(() => {
                setLoading(false);
                if (user.username.length !== 0) {
                    changeUser(user);
                    localStorage.setItem("user", JSON.stringify(user));
                    posthog.identify(
                        user.username,
                        { name: user.name, role: user.role }
                    );
                    posthog.capture('user signed up');
                    router.push("/");
                }
            });

    }
    
    return (
        <div className="min-h-screen w-screen grid grid-cols-1 xl:grid-cols-5">
            <section className="xl:col-span-3 xl:h-full h-full xl:pt-0 pt-8 w-full bg-gradient-to-b xl:bg-gradient-to-r from-emerald-200 to-teal-200 flex flex-col justify-center">
                <GrGroup className="w-28 h-28 xl:w-48 xl:h-48 mx-auto"/>
                <p className="p-4 xl:p-8 text-6xl xl:text-8xl text-gray-900 mx-auto font-semibold">
                    Crew Match
                </p>
                <p className="p-4 xl:p-8 xl:mt-16 text-gray-900 text-4xl xl:text-6xl mx-auto">
                    Welcome.
                </p>
            </section>
            <section className="xl:col-span-2 h-full w-full min-w-fit bg-gradient-to-b xl:bg-gradient-to-r from-teal-200 to-emerald-300
                                flex flex-col items-center justify-center">
                <div className="h-fit w-1/2 xl:w-2/3 m-8 min-h-fit min-w-fit bg-white shadow-md rounded-2xl box-border p-8 flex flex-col items-center">
                    <section className="h-24 w-full rounded-2xl bg-white shadow-md flex flex-col justify-center">
                        <p className="px-4 text-4xl text-gray-900 font-medium text-center">Sign Up</p>
                    </section>
                    <form onSubmit={submitForm} className={`mt-8 mb-6 w-full min-w-fit rounded-2xl shadow-md py-8 px-4 grid grid-cols-2 grid-rows-2 gap-8 hover:scale-[102%] transition-all
                                                            ${error.length > 0 ? "border border-red-400" : ""}`}>
                        <label className="w-full min-w-fit px-4 py-6 text-2xl font-medium">Name:</label>
                        <input onChange={handleChange} className="w-full min-w-fit px-4 py-4 text-xl font-normal border-2 rounded-xl" placeholder="First and last name" type="text" name="name" value={name}></input>
                        <label className="w-full min-w-fit px-4 py-6 text-2xl font-medium">Username:</label>
                        <input onChange={handleChange} className="w-full min-w-fit px-4 py-4 text-xl font-normal border-2 rounded-xl" placeholder="Enter a username" type="text" name="username" value={username}></input>
                        <label className="w-full min-w-fit px-4 py-6 text-2xl font-medium">Password:</label>
                        <input onChange={handleChange} className="w-full min-w-fit px-4 py-4 text-xl font-normal border-2 rounded-xl" placeholder="Enter a password" type="password" name="password" value={password}></input>
                        <label className="w-full min-w-fit px-4 py-6 text-2xl font-medium">Confirm Password:</label>
                        <input onChange={handleChange} className="w-full min-w-fit px-4 py-4 text-xl font-normal border-2 rounded-xl" placeholder="Confirm password" type="password" name="confirmPassword" value={confirmPassword}></input>
                    </form>
                    <button onClick={() => router.push('/login')} className="px-3 py-2 my-4 text-xl w-fit font-normal text-gray-900 rounded-lg shadow-md hover:scale-105
                                    hover:cursor-pointer hover:bg-slate-100 hover:shadow-lg active:scale-100 active:bg-slate-200 transition-all"><span className="font-medium">Already signed up?</span> Log in instead.</button>
                    <p className="px-4 text-lg text-red-500">{error}</p>
                    <button onClick={submitForm} className={`px-8 py-6 mt-8 mb-4 text-2xl font-medium shadow-md bg-gray-700 text-slate-100 rounded-lg
                                        hover:bg-gray-600 hover:shadow-lg hover:scale-105 transition-all active:bg-gray-800 active:scale-100
                                        ${loading ? "cursor-wait" : ""}`}>
                        Submit
                    </button>
                </div>
            </section>
        </div>
    );
}