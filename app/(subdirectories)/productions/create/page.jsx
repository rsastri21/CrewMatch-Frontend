"use client";

import { useState, useEffect } from 'react';
import { BiPlusCircle, BiMinusCircle } from "react-icons/bi";
import { GrLinkPrevious } from "react-icons/gr";
import { useRouter } from 'next/navigation';
import { useSession, useSessionUpdate } from '../../../SessionContext';
import Link from "next/link";

export default function CreateProductionForm() {
    
    const initialData = [
        { role: 'Director', weight: 1, member: '' },
        { role: 'Assistant Director', weight: 1, member: '' },
        { role: 'Producer', weight: 1, member: '' },
        { role: 'Director of Photography', weight: 1, member: '' },
        { role: 'Camera Operator', weight: 1, member: '' },
        { role: 'Boom Operator', weight: 1, member: '' },
        { role: 'Sound Recordist', weight: 1, member: '' },
        { role: 'Editor', weight: 1, member: '' },
        { role: 'Assistant Editor', weight: 1, member: '' },
        { role: 'Art Department', weight: 1, member: '' },
        { role: 'Makeup', weight: 1, member: '' },
        { role: 'Assistant Writer', weight: 1, member: '' },
        { role: 'Script Supervisor', weight: 1, member: '' },
        { role: 'Production Assistant', weight: 1, member: '' },
        { role: 'Soundtrack', weight: 1, member: '' }
    ];

    const [formFields, setFormFields] = useState([]);
    const [name, setName] = useState({ name: "" });
    const [error, setError] = useState(200);
    const [loading, setLoading] = useState(false);
    const [checked, setChecked] = useState(false);

    const router = useRouter();
    const user = useSession();
    const changeUser = useSessionUpdate();

    useEffect(() => {
        setFormFields([...initialData]);
    }, []);

    const handleFormChange = (event, index) => {
        let data = [...formFields];
        data[index][event.target.name] = event.target.value;
        setFormFields(data);
    }

    const handleNameChange = (event) => {
        let newName = {name: event.target.value }
        setName(newName);
    }

    const removeFields = (event, index) => {
        event.preventDefault();
        let data = [...formFields];
        data.splice(index, 1)
        setFormFields(data);
    }

    const addFields = (event, index) => {
        event.preventDefault();

        if (formFields.length > 50) {
            alert("The maximum number of roles has been reached. Consider reprioritizing which roles are important" +
            " for the initial assignment.");
            return;
        }

        let newObject = {
            role: '',
            weight: 1,
            member: ''
        };
        let data = [...formFields];
        data.splice(index + 1, 0, newObject);
        setFormFields(data);
    }

    const submit = (e) => {
        setLoading(true);
        e.preventDefault();

        const roles = [];
        const weights = [];
        const members = [];

        for (let i = 0; i < formFields.length; i++) {
            roles.push(formFields[i].role);
            weights.push(formFields[i].weight);
            members.push(formFields[i].member);
        }

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: name.name.trim(),
                roles: [...roles],
                roleWeights: [...weights],
                members: [...members]
            })
        };
        fetch(process.env.API_URL + "/api/production/create", requestOptions)
            .then((res) => {
                setError(res.status);
                res.text();
            })
            .then(res => {
                if (checked) {
                    fetch(process.env.API_URL + `/api/user/assign?username=${user.username}&production=${name.name}`, {
                        method: 'PUT'
                    }).then(res => setError(res.status));
                }
            })
            .catch(err => console.error(err))
            .finally((result) => {
                setLoading(false);
                if (error === 200) {
                    if (checked) {
                        const newUser = {
                            ...user,
                            leads: name.name
                        }
                        changeUser(newUser);
                        localStorage.setItem("user", JSON.stringify(newUser));
                    }
                    router.push("/productions");
                }
            });
    }
    
    return (
        <div className="bg-gradient-to-r from-green-200 to-emerald-200 flex flex-col justify-center items-center h-fit min-h-screen w-screen p-16">
            <section className="min-w-fit h-auto overflow-y-scroll bg-white rounded-2xl box-border shadow-md">
                <div className="bg-white h-20 w-full rounded-t-2xl drop-shadow-md flex justify-between z-10">
                    <h1 className="px-4 py-4 my-auto font-medium text-3xl">Create a New Production</h1>
                    <div className="h-full flex justify-center overflow-visible">
                        <Link href="/productions" className="my-auto w-fit bg-white mr-6 ml-auto rounded-full hover:shadow-lg hover:scale-105 active:scale-100 transition-all">
                            <GrLinkPrevious className="w-12 h-12 my-auto p-2 rounded-full" />
                        </Link>
                    </div>
                </div>
                <div className="box-border bg-white p-3 w-full max-w-fit h-auto shadow-md rounded-b-2xl flex flex-col items-center space-y-8">
                    <p className="p-2 max-w-4xl mx-auto text-lg text-gray-900 bg-slate-100 rounded-lg">
                        <span className="font-medium">Crew Match</span> provides a set of default roles to create a production. If you need to add
                        more roles or increase the quantity of a certain role, hit the plus button to add another row. If you would instead like to remove a role, hit the remove button. 
                        If you would like to revert to the original list of roles, refresh the page and the default list will be retrieved.
                        <br></br> <br></br>
                        <span className="font-medium"> Crew Match</span> will let you add up to 24 roles initially. If more roles are required for your
                        production, they may be added after the role assignment process is completed. When creating new roles, try to be general. If you have someone in mind
                        to perform a certain role, enter their name in the second column. <br></br><br></br>
                        Roles <span className="font-medium">CANNOT </span> be empty. If there is a row with an empty row, please remove it using the minus button.
                    </p>
                    <h1 className="px-3 py-3 text-2xl text-gray-900 font-medium rounded-lg shadow-md">Enter the crew roles and desired members below.</h1>

                    <form onSubmit={submit} className="w-full max-w-fit h-full bg-white box-border p-4 space-y-4">
                        
                        <div className="w-full box-border border-2 border-slate-200 rounded-xl flex justify-between p-2">
                            <label className="px-3 py-3 text-xl font-medium min-w-fit">Enter a name for the production:</label>
                            <input 
                                className="p-2 text-lg rounded-lg bg-slate-50 w-full"
                                name="name"
                                placeholder="Enter a production name"
                                onChange={event => handleNameChange(event)}
                                value={name.name}
                            />
                        </div>
                        
                        {formFields.map((form, index) => {
                            return (
                                <div key={index} className="min-w-fit w-full mx-auto overflow-x-scroll grid grid-cols-2 gap-2 border-2 border-slate-200 p-2 rounded-xl">
                                    <div className="flex gap-2 min-w-fit ml-2 mr-4">
                                        <label className="px-3 py-3 text-xl font-medium min-w-fit">Role:</label>
                                        <input 
                                            className="p-2 text-lg rounded-lg bg-slate-50 min-w-fit"
                                            name="role"
                                            placeholder="Enter a role"
                                            onChange={event => handleFormChange(event, index)}
                                            value={form.role}
                                        />
                                        <input 
                                            className="p-2 text-lg rounded-lg bg-slate-50 w-16"
                                            name="weight"
                                            placeholder="Role weight"
                                            type="number"
                                            min="0"
                                            onChange={event => handleFormChange(event, index)}
                                            value={form.weight}
                                        />
                                    </div>
                                    <div className="flex spacing-x-4 min-w-fit ml-4 mr-4">
                                        <label className="px-3 py-3 text-xl font-medium min-w-fit">Member:</label>
                                        <input 
                                            className="p-2 text-lg rounded-lg bg-slate-50 min-w-fit"
                                            name="member"
                                            placeholder="Enter a member"
                                            onChange={event => handleFormChange(event, index)}
                                            value={form.member}
                                        />
                                        <div className="flex spacing-x-4 ml-8 max-w-fit">
                                            <button onClick={(event) => addFields(event, index)} className="hover:scale-110 active:scale-100 transition-all">
                                                <span><BiPlusCircle className="w-8 h-8 my-auto mr-1 ml-auto" /></span>
                                            </button>
                                            <button onClick={(event) => removeFields(event, index)} className="hover:scale-110 active:scale-100 transition-all">
                                                <span><BiMinusCircle className="w-8 h-8 my-auto ml-1 mr-2" /></span>
                                            </button>
                                        </div> 
                                    </div>
                                </div>
                            )
                        })}
                        <div className="w-fit h-16 bg-white box-border p-2 border-2 border-slate-200 rounded-xl mx-auto flex space-x-4 justify-center">
                            <input
                                className="ml-2 w-4 h-4 my-auto"
                                type="checkbox"
                                checked={checked}
                                onChange={(e) => setChecked(e.target.checked)}
                            />
                            <label className="my-auto text-lg font-medium">
                                Make me the production lead for this production.
                            </label>
                        </div>
                    </form>

                    <label className={`font-medium text-lg text-red-400 ${(error === 200) ? "hidden" : ""}`}>The production could not be created.</label>

                    <footer className="flex justify-end p-4 space-x-4">
                        <button onClick={submit} disabled={loading} className={`p-4 w-42 font-medium text-lg text-gray-100 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg shadow-md 
                                            hover:shadow-lg hover:bg-gradient-to-r hover:from-green-600 hover:to-emerald-600 ${loading ? "cursor-wait" : ""}
                                            active:bg-gradient-to-r active:from-green-700 active:to-emerald-700`}>
                            Create
                        </button>
                        <Link href="/productions" className="p-4 w-32 font-medium text-lg text-center text-gray-100 bg-gradient-to-r from-red-500 to-rose-500 rounded-lg shadow-md 
                                            hover:shadow-lg hover:bg-gradient-to-r hover:from-red-600 hover:to-rose-600 
                                            active:bg-gradient-to-r active:from-red-700 active:to-rose-700">
                            Cancel
                        </Link>
                    </footer>

                </div>
            </section>
        </div>
    );
}