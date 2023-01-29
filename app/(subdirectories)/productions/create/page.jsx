"use client";

import { useState, useEffect } from 'react';
import { BiPlusCircle, BiMinusCircle } from "react-icons/bi";

export default function CreateProductionForm() {
    
    const initialData = [
        { role: 'Director', member: '' },
        { role: 'Assistant Director', member: '' },
        { role: 'Producer', member: '' },
        { role: 'Director of Photography', member: '' },
        { role: 'Camera Operator', member: '' },
        { role: 'Boom Operator', member: '' },
        { role: 'Sound Recordist', member: '' },
        { role: 'Editor', member: '' },
        { role: 'Assistant Editor', member: '' },
        { role: 'Art Department', member: '' },
        { role: 'Makeup', member: '' },
        { role: 'Assistant Writer', member: '' },
        { role: 'Script Supervisor', member: '' },
        { role: 'Production Assistant', member: '' },
        { role: 'Soundtrack', member: '' }
    ];

    const [formFields, setFormFields] = useState([]);

    useEffect(() => {
        setFormFields([...initialData]);
    }, []);

    const handleFormChange = (event, index) => {
        let data = [...formFields];
        data[index][event.target.name] = event.target.value;
        setFormFields(data);
    }

    const removeFields = (event, index) => {
        event.preventDefault();
        let data = [...formFields];
        data.splice(index, 1)
        setFormFields(data);
    }

    const addFields = (event, index) => {
        event.preventDefault();

        if (formFields.length > 24) {
            alert("The maximum number of roles has been reached. Consider reprioritizing which roles are important" +
            " for the initial assignment.");
            return;
        }

        let newObject = {
            role: '',
            member: ''
        };
        let data = [...formFields];
        data.splice(index + 1, 0, newObject);
        setFormFields(data);
    }

    const submit = (e) => {
        e.preventDefault();
        console.log(formFields);
    }
    
    return (
        <div className="bg-gradient-to-r from-green-200 to-emerald-200 flex flex-col justify-center items-center h-fit min-h-screen w-screen p-16">
            <section className="min-w-fit h-auto overflow-y-scroll bg-white rounded-2xl box-border shadow-md">
                <div className="bg-white h-20 w-full rounded-t-2xl drop-shadow-md flex">
                    <h1 className="px-4 py-4 my-auto font-medium text-3xl">Create a New Production</h1>
                </div>
                <div className="box-border bg-white p-3 w-full max-w-fit h-auto shadow-md rounded-b-2xl flex flex-col items-center space-y-8">
                    <p className="p-2 max-w-4xl mx-auto text-lg text-gray-900 bg-slate-100 rounded-lg">
                        <span className="font-medium">Crew Match</span> provides a set of default roles to create a production. If you need to add
                        more roles or increase the quantity of a certain role, hit the plus button to add another row. If you would instead like to remove a role, hit the remove button. 
                        If you would like to revert to the original list of roles, refresh the page and the default list will be retrieved.
                        <br></br> <br></br>
                        <span className="font-medium"> Crew Match</span> will let you add up to 24 roles initially. If more roles are required for your
                        production, they may be added after the role assignment process is completed. When creating new roles, try to be general. If you have someone in mind
                        to perform a certain role, enter their name in the second column. 
                    </p>
                    <h1 className="px-3 py-3 text-2xl text-gray-900 font-medium rounded-lg shadow-md">Enter the crew roles and desired members below.</h1>

                    <form className="w-full max-w-fit h-full bg-white box-border p-4 space-y-4">
                        {formFields.map((form, index) => {
                            return (
                                <div key={index} className="min-w-fit w-full mx-auto overflow-x-scroll grid grid-cols-2 gap-2 border-2 border-slate-200 p-2 rounded-xl">
                                    <div className="flex spacing-x-4 min-w-fit ml-2 mr-4">
                                        <label className="px-3 py-3 text-xl font-medium min-w-fit">Role:</label>
                                        <input 
                                            className="p-2 text-lg rounded-lg bg-slate-50 min-w-fit"
                                            name="role"
                                            placeholder="Enter a role"
                                            onChange={event => handleFormChange(event, index)}
                                            value={form.role}
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
                    </form>

                </div>
            </section>
        </div>
    );
}