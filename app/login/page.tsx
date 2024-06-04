"use client";

import { GrGroup } from "react-icons/gr";
import { useState } from 'react';
import { useSession, useSessionUpdate, User } from "../SessionContext";
import { useRouter } from 'next/navigation';
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context";
import posthog from "posthog-js";

interface LoginData {
    username: string;
    password: string;
}

export default function Login() {
    
    const router: AppRouterInstance = useRouter();
    const [formData, setFormData] = useState<LoginData>({
        username: '',
        password: ''
    });

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState("");

    const changeUser = useSessionUpdate();
    const { username, password }: { username: string, password: string} = formData;

    const handleChange = (e: any) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    }

    const submitForm = (e: any) => {
        setLoading(true);
    
        e.preventDefault();

        const user: User = {
            username: "",
            name: "",
            role: "",
            leads: null
        };

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        }
        fetch(process.env.API_URL + "/api/user/login", requestOptions)
            .then((res) => {
                if (res.status === 400) {
                    console.log("User does not exist. Please sign up instead.");
                    setError("User does not exist. Please sign up instead.");
                    return "error";
                } else if (res.status === 401) {
                    console.log("The username and password do not match.");
                    setError("The username and password do not match.");
                    return "error";
                } else {
                    setError("");
                }
                return res.json();
            })
            .then((data) => {
                if (data !== "error") {
                    user.username = username;
                    user.name = data[0];
                    user.role = data[1];
                    user.leads = data[2]; 
                }
            })
            .catch((err) => {
                console.error(err);
                posthog.capture('login failed');
            }).finally(() => {
                setLoading(false);
                if (user.username.length !== 0) {
                    changeUser(user);
                    localStorage.setItem("user", JSON.stringify(user));
                    posthog.identify(
                        user.username,
                        { name: user.name, role: user.role }
                    );
                    posthog.capture('user logged in');
                    router.push("/");
                }
            });

    }
    
    return (
        <div className="min-h-screen w-screen grid grid-cols-1 xl:grid-cols-5">
            <section className="xl:col-span-3 xl:h-full h-fit xl:py-0 py-8 w-full bg-gradient-to-b xl:bg-gradient-to-r from-red-300 to-orange-200 flex flex-col justify-center">
                <GrGroup className="w-28 h-28 xl:w-48 xl:h-48 mx-auto"/>
                <p className="p-4 xl:p-8 text-6xl xl:text-8xl text-gray-900 mx-auto font-semibold">
                    Crew Match
                </p>
                <p className="p-4 xl:p-8 xl:mt-16 text-gray-900 text-4xl xl:text-6xl mx-auto">
                    Welcome back.
                </p>
            </section>
            <section className="xl:col-span-2 h-full w-full min-w-fit bg-gradient-to-b xl:bg-gradient-to-r from-orange-200 to-red-100
                                flex flex-col items-center justify-center">
                <div className="h-fit w-1/2 xl:w-2/3 m-8 min-h-fit min-w-fit bg-white shadow-md rounded-2xl box-border p-8 flex flex-col items-center">
                    <section className="h-24 w-full rounded-2xl bg-white shadow-md flex flex-col justify-center">
                        <p className="px-4 text-4xl text-gray-900 font-medium text-center">Login</p>
                    </section>
                    <form onSubmit={submitForm} className={`mt-8 mb-6 w-full min-w-fit rounded-2xl shadow-md py-8 px-4 grid grid-cols-2 grid-rows-2 gap-8 hover:scale-[102%] transition-all
                                                            ${error.length > 0 ? "border border-red-400" : ""}`}>
                        <label className="w-full min-w-fit px-4 py-6 text-2xl font-medium">Username:</label>
                        <input onChange={handleChange} className="w-full min-w-fit px-4 py-4 text-xl font-normal border-2 rounded-xl" placeholder="Enter a username" type="text" name="username" value={username}></input>
                        <label className="w-full min-w-fit px-4 py-6 text-2xl font-medium">Password:</label>
                        <input onChange={handleChange} className="w-full min-w-fit px-4 py-4 text-xl font-normal border-2 rounded-xl" placeholder="Enter a password" type="password" name="password" value={password}></input>
                    </form>
                    <button onClick={() => router.push('/signup')} className="px-3 py-2 my-b text-xl w-fit font-normal text-gray-900 rounded-lg shadow-md hover:scale-105
                                    hover:cursor-pointer hover:bg-slate-100 hover:shadow-lg active:scale-100 active:bg-slate-200 transition-all"><span className="font-medium">New here?</span> Click here to sign up instead.</button>
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