"use client";

import { GrGroup } from "react-icons/gr";
import { BiUserCircle, BiChevronDown } from "react-icons/bi";
import { FcSettings, FcUndo } from "react-icons/fc";
import Link from "next/link";
import { Menu, Transition } from "@headlessui/react";
import { useSession, useSessionUpdate } from "../../SessionContext.js";
import { Fragment } from "react";
import { useRouter } from "next/navigation";

export default function NavBar() {
    
    const user = useSession();
    const updateUser = useSessionUpdate();
    const router = useRouter();

    function handleSignOut() {
        updateUser({});
        localStorage.removeItem('user');
        router.push("/");
    }
    
    return (
        <nav className="py-3 w-full max-h-min flex relative shadow-md justify-between rounded-b-lg">
            <div className="flex mx-8 rounded-lg hover:bg-slate-200 hover:shadow-md active:bg-slate-300">
                <GrGroup className="w-8 h-8 mx-2 mt-1"/>
                <Link href="/" className="px-2 font-semibold text-3xl">
                    Crew Match
                </Link>
            </div>
            
            <ul className="flex items-center mr-8 space-x-4">
                <Link href="/about" className="px-4 py-2 text-md font-medium bg-slate-100 rounded-md shadow-sm hover:bg-slate-200 hover:shadow-md active:bg-slate-300">About</Link>
                {(user.role === "user" || Object.keys(user).length === 0) ? null :
                    <>
                        <Link href="/candidates" className="px-4 py-2 text-md font-medium bg-slate-100 rounded-md shadow-sm hover:bg-slate-200 hover:shadow-md active:bg-slate-300">Candidates</Link>
                        <Link href="/productions" className="px-4 py-2 text-md font-medium bg-slate-100 rounded-md shadow-sm hover:bg-slate-200 hover:shadow-md active:bg-slate-300">Productions</Link>
                    </>
                }
                {Object.keys(user).length === 0 ? 
                    <Link href="/login" className="px-4 py-2 text-md font-medium bg-slate-100 rounded-md shadow-sm hover:bg-slate-200 hover:shadow-md active:bg-slate-300">Log In</Link>
                    :
                    <UserOptions user={user} signOut={handleSignOut} />
                }
            </ul>
        </nav>
    );
}

function UserOptions({ user, signOut }) {
    
    const router = useRouter();

    return (
        <Menu as="div" className="relative">
            <div>
                <Menu.Button className="px-3 py-2 text-md justify-center items-center font-medium bg-slate-100 rounded-md shadow-sm hover:bg-slate-200 hover:shadow-md active:bg-slate-300 inline-flex">
                    <span className="mr-2"><BiUserCircle className="w-6 h-6 my-auto" /></span> {user.username} <span className="ml-2"><BiChevronDown className="w-6 h-6 my-auto" /></span>
                </Menu.Button>
            </div>
            <Transition 
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="px-1 py-1">
                        {user.role === "admin" ?
                            <Menu.Item>
                                {({ active }) => (
                                    <button 
                                        onClick={() => router.push("/admin")}
                                        className={`${
                                            active ? 'bg-slate-200' : ''
                                        } group flex w-full items-center rounded-lg px-2 py-2 text-md`}
                                    >
                                        <FcSettings className="mr-2 h-6 w-6" />
                                        <span className="font-medium">Admin Panel</span>
                                    </button>
                                )}
                            </Menu.Item>
                        : null}
                        {user.role === "production head" ? 
                            <Menu.Item>
                            {({ active }) => (
                                <button 
                                    className={`${
                                        active ? 'bg-slate-200' : ''
                                    } group flex w-full items-center rounded-lg px-2 py-2 text-md`}
                                >
                                    <FcSettings className="mr-2 h-6 w-6" />
                                    <span className="font-medium">Lead Panel</span>
                                </button>
                            )}
                        </Menu.Item>
                        : null}
                        <Menu.Item>
                            {({ active }) => (
                                <button 
                                    onClick={signOut}
                                    className={`${
                                        active ? 'bg-slate-200' : ''
                                    } group flex w-full items-center rounded-lg px-2 py-2 text-md`}
                                >
                                    <FcUndo className="mr-2 h-6 w-6" />
                                    <span className="font-medium">Sign Out</span>
                                </button>
                            )}
                        </Menu.Item>
                    </div>
                </Menu.Items>
            </Transition>
        </Menu>
    );
}