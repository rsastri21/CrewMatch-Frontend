"use client";

import { GrGroup } from "react-icons/gr";
import { useState } from 'react';

export default function Login() {
    
    const [data, setData] = useState({
        username: "",
        password: ""
    });

    const { username, password } = data;

    const handleChange = e => {
        setData({...data, [e.target.name]: e.target.value});
    }

    const submitForm = e => {
        e.preventDefault();
        console.log(data);
    }
    
    return (
        <div className="h-screen w-screen grid grid-cols-5">
            <section className="col-span-3 h-full w-full bg-gradient-to-r from-red-300 to-orange-200 flex flex-col justify-center">
                <GrGroup className="w-48 h-48 mx-auto"/>
                <p className="p-8 text-8xl text-gray-900 mx-auto font-semibold">
                    Crew Match
                </p>
                <p className="p-8 mt-16 text-gray-900 text-6xl mx-auto">
                    Welcome.
                </p>
            </section>
            <section className="col-span-2 h-full w-full min-w-fit bg-gradient-to-r from-orange-200 to-red-100
                                flex flex-col items-center justify-center">
                <div className="h-fit w-2/3 m-8 min-h-fit min-w-fit bg-white shadow-md rounded-2xl box-border p-8 flex flex-col items-center">
                    <section className="h-24 w-full rounded-2xl bg-white shadow-md flex flex-col justify-center">
                        <p className="px-4 text-4xl text-gray-900 font-medium text-center">Login</p>
                    </section>
                    <form onSubmit={submitForm} className="mt-12 mb-6 w-full min-w-fit rounded-2xl shadow-md py-8 px-4 grid grid-cols-2 grid-rows-2 gap-8 hover:scale-105 transition-all">
                        <label className="w-full min-w-fit px-4 py-6 text-2xl font-medium">Username:</label>
                        <input onChange={handleChange} className="w-full min-w-fit px-4 py-4 text-xl font-normal border-2 rounded-xl" placeholder="Enter a username" type="text" name="username" value={username}></input>
                        <label className="w-full min-w-fit px-4 py-6 text-2xl font-medium">Password:</label>
                        <input onChange={handleChange} className="w-full min-w-fit px-4 py-4 text-xl font-normal border-2 rounded-xl" placeholder="Enter a password" type="password" name="password" value={password}></input>
                    </form>
                    <button onClick={submitForm} className="px-8 py-6 mt-8 mb-4 text-2xl font-medium shadow-md bg-gray-700 text-slate-100 rounded-lg
                                        hover:bg-gray-600 hover:shadow-lg hover:scale-105 transition-all active:bg-gray-800 active:scale-100">
                        Submit
                    </button>
                </div>
            </section>
        </div>
    );
}