"use client";

import { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { Transition } from '@headlessui/react';
import CandidateTable from '../../candidates/CandidateTable';
import { FcFilmReel } from "react-icons/fc";
import { BiEdit, BiPlusCircle, BiMinusCircle } from "react-icons/bi";
import { BsFillExclamationTriangleFill } from "react-icons/bs";
import { useSession } from '../../../SessionContext';
import Loading from '../../loading';

export default function ProductionUI({ params, }) {
    
    const user = useSession(); 
    
    const [production, setProduction] = useState({});
    const [tableVisible, setTableVisible] = useState(false);
    const [unassignVisible, setUnassignVisible] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [archiveModal, setArchiveModal] = useState(false);
    const [index, setIndex] = useState(0);
    const [removeIndex, setRemoveIndex] = useState(0);
    const [edit, setEdit] = useState(false);

    useEffect(() => {
        const get = async () => {
            const res = await fetch(process.env.API_URL + '/api/production/get/' + params.prod);
            const data = await res.json();

            setProduction({...data});
        }

        get().catch(console.error);
    }, [tableVisible, unassignVisible, edit]);

    const toggle = (index) => {
        setIndex(index);
        setTableVisible(!tableVisible);
    }

    const toggleDelete = () => {
        setDeleteModal(!deleteModal);
    }

    const toggleArchive = () => {
        setArchiveModal(!archiveModal);
    }

    const toggleRemove = (index) => {
        setRemoveIndex(index);
        setUnassignVisible(!unassignVisible);
    }

    const toggleRemoveModal = () => {
        setUnassignVisible(!unassignVisible);
    }

    const toggleEdit = () => {
        setEdit(!edit);
    }
    
    return (
        <Suspense fallback={<Loading />}>
            <div className="bg-gradient-to-r from-green-200 to-emerald-200 flex flex-col min-h-screen h-auto w-screen pb-16">
                <div className="w-1/2 h-min min-w-half mx-auto justify-center">
                    <FcFilmReel className="w-48 h-48 pt-12 mx-auto my-2"/>
                    <h1 className="py-4 px-8 mb-4 text-8xl text-center text-gray-800">
                        {production.name}
                    </h1>
                    {production.archived &&
                    <div className="w-fit h-16 mx-auto my-4 bg-orange-300 rounded-xl flex justify-center shadow-md">
                        <BsFillExclamationTriangleFill className="w-14 h-14 ml-1 my-auto py-2"/>
                        <p className="text-2xl font-medium text-center text-gray-800 px-2 py-2 my-auto">
                            This production is archived.
                        </p>
                    </div>
                    }
                    {production.prodLead && 
                    <p className="px-8 text-2xl text-center text-gray-800">
                        Production Lead: <span className="italic font-medium">{production.prodLead}</span>.
                    </p>
                    }
                    <p className="px-8 text-2xl text-center text-gray-800">
                        Manage the details of <span className="italic font-medium">{production.name}</span> here.
                    </p>
                    <hr className="h-px mt-8 mx-auto bg-gray-800 border-0 w-2/3 items-center"></hr>
                </div>
                <section className="w-1/2 min-w-fit h-min py-4 my-2 mx-auto flex flex-col space-y-4">
                    <h1 className="text-5xl px-8 py-4 font-medium text-center text-gray-800">
                        Crew Members
                    </h1>
                    {Object.keys(production).length !== 0 && <AvailableCandidateModal production={production.name} visible={tableVisible} toggleModal={toggle} role={production.roles[index]} index={index} prodID={production.id} />}
                    <CrewMembers production={production} toggle={toggle} toggleRemove={toggleRemove} />
                </section>
                <button onClick={() => toggleEdit()} className="bg-white flex rounded-xl w-fit mx-auto p-4 text-xl font-medium shadow-md hover:scale-105 hover:shadow-lg active:scale-100 active:bg-slate-200 transition-all">
                    <span className="ml-0 mr-2 my-auto"><BiEdit className="w-6 h-6"/></span>
                    Edit Roles
                </button>
                <section className="w-1/2 min-w-fit h-min py-4 my-2 mx-auto flex flex-col space-y-4">
                    <h1 className="text-5xl px-8 py-4 font-medium text-center text-gray-800">
                        Casting
                    </h1>
                    {production && <CandidateTable fetchURL={process.env.API_URL + `/api/candidate/search?assigned=false&actingInterest=true&production=${production.name}`} mode="actor" />}
                </section>
                <section className="w-1/2 min-w-fit mx-auto grid grid-cols-1 xl:grid-cols-2">
                    <ArchiveProductionBox prod={production} visible={archiveModal} setVisible={toggleArchive} />
                    <DeleteProductionBox visible={deleteModal} setVisible={toggleDelete} />
                </section>

                <Transition show={unassignVisible} >
                    <Transition.Child
                        enter="transition-opacity ease-out duration-200"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="transition-opacity ease-out duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                        className="fixed bottom-0 left-0 right-0 w-screen h-screen"
                    >
                        <BackgroundOverlay />
                    </Transition.Child>
                    
                    <Transition.Child
                        enter="transition-all ease-in-out duration-200"
                        enterFrom="translate-y-full scale-50"
                        enterTo="translate-y-0 scale-100"
                        leave="transition-all ease-in-out duration-200"
                        leaveFrom="translate-y-0 scale-100"
                        leaveTo="translate-y-full scale-50"
                        className="fixed bottom-0 left-0 right-0 w-screen h-screen"
                    >
                        <RemoveMemberModal index={removeIndex} visible={unassignVisible} toggleVisible={toggleRemoveModal} production={production} />
                    </Transition.Child>
                    
                </Transition>

                <Transition show={edit} >
                    <Transition.Child
                        enter="transition-opacity ease-out duration-200"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="transition-opacity ease-out duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                        className="fixed bottom-0 left-0 right-0 w-screen h-screen"
                    >
                        <BackgroundOverlay />
                    </Transition.Child>
                    
                    <Transition.Child
                        enter="transition-all ease-in-out duration-200"
                        enterFrom="translate-y-full scale-50"
                        enterTo="translate-y-0 scale-100"
                        leave="transition-all ease-in-out duration-200"
                        leaveFrom="translate-y-0 scale-100"
                        leaveTo="translate-y-full scale-50"
                        className="fixed bottom-0 left-0 right-0 w-screen h-screen"
                    >
                        <EditProduction visible={edit} setVisible={toggleEdit} production={production} />
                    </Transition.Child>
                    
                </Transition>
                
                <Transition show={deleteModal} >
                    <Transition.Child
                        enter="transition-opacity ease-out duration-200"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="transition-opacity ease-out duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                        className="fixed bottom-0 left-0 right-0 w-screen h-screen"
                    >
                        <BackgroundOverlay />
                    </Transition.Child>
                    
                    <Transition.Child
                        enter="transition-all ease-in-out duration-200"
                        enterFrom="translate-y-full scale-50"
                        enterTo="translate-y-0 scale-100"
                        leave="transition-all ease-in-out duration-200"
                        leaveFrom="translate-y-0 scale-100"
                        leaveTo="translate-y-full scale-50"
                        className="fixed bottom-0 left-0 right-0 w-screen h-screen"
                    >
                        <DeleteModal id={production.id} visible={deleteModal} setVisible={toggleDelete} />
                    </Transition.Child>
                    
                </Transition>

                <Transition show={archiveModal} >
                    <Transition.Child
                        enter="transition-opacity ease-out duration-200"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="transition-opacity ease-out duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                        className="fixed bottom-0 left-0 right-0 w-screen h-screen"
                    >
                        <BackgroundOverlay />
                    </Transition.Child>
                    
                    <Transition.Child
                        enter="transition-all ease-in-out duration-200"
                        enterFrom="translate-y-full scale-50"
                        enterTo="translate-y-0 scale-100"
                        leave="transition-all ease-in-out duration-200"
                        leaveFrom="translate-y-0 scale-100"
                        leaveTo="translate-y-full scale-50"
                        className="fixed bottom-0 left-0 right-0 w-screen h-screen"
                    >
                        <ArchiveModal prod={production} id={production.id} visible={archiveModal} setVisible={toggleArchive} />
                    </Transition.Child>
                    
                </Transition>

            </div>
        </Suspense>
    );
}

function EditProduction({ visible, setVisible, production }) {
    
    const [formFields, setFormFields] = useState([]);
    const [error, setError] = useState(200);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fields = [];
        for (let i = 0; i < production.members.length; i++) {
            fields[i] = { role: production.roles[i], weight: production.roleWeights[i], member: production.members[i] };
        }
        setFormFields([...fields]);
    }, [visible])
    
    useEffect(() => {
        // Event listener
        document.addEventListener('keydown', handleEscPress);

        // Remove event listener
        return () => {
            document.removeEventListener('keydown', handleEscPress);
        };
    }, [visible]);

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
            weight: 1,
            member: ''
        };
        let data = [...formFields];
        data.splice(index + 1, 0, newObject);
        setFormFields(data);
    }

    const handleEscPress = (event) => {
        if (visible && event.key === 'Escape') {
            setVisible();
        }
    };

    const handleFormChange = (event, index) => {
        let data = [...formFields];
        data[index][event.target.name] = event.target.value;
        setFormFields(data);
    }

    const submit = (e) => {
        setLoading(true);

        const roles = [];
        const weights = [];
        const members = [];

        for (let i = 0; i < formFields.length; i++) {
            if (formFields[i].role.length === 0) {
                setError(400);
                setLoading(false);
                return;
            }
            roles.push(formFields[i].role);
            weights.push(formFields[i].weight);
            members.push(formFields[i].member);
        }
        console.log(roles);
        console.log(weights);
        console.log(members);

        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                roles: [...roles],
                roleWeights: [...weights],
                members: [...members]
            })
        };
        fetch(process.env.API_URL + `/api/production/update/${production.id}`, requestOptions)
            .then((res) => {
                setError(res.status);
                res.text();
            })
            .catch(err => console.error(err))
            .finally((result) => {
                setLoading(false);
                if (error === 200) {
                    setVisible();
                }
            });
    }
    
    return (
        <div className="fixed bottom-0 left-0 right-0 z-10 w-screen h-screen p-4 flex flex-col justify-center items-center">
            <section className="w-fit max-h-[75vh] overflow-y-scroll bg-white rounded-2xl flex flex-col box-border shadow-2xl">
                <div className="bg-white h-fit w-full rounded-t-2xl drop-shadow-md flex justify-between z-10">
                    <h1 className="px-4 py-4 my-auto font-medium text-2xl mx-auto">Edit Roles of {production.name}</h1>
                </div>
                <div className="box-border bg-white p-3 w-full max-w-fit shadow-md rounded-b-2xl flex flex-col justify-center items-center space-y-4">
                    <p className="p-2 w-256 mx-auto text-lg text-gray-900 bg-slate-100 rounded-lg">
                        The names of roles can be edited here. This process should be done only to increase clarity and not to create roles that are 
                        not already available in <span className="font-medium">Crew Match</span>. For example, a role of "Camera Operator 2" can be renamed to "Camera Operator"
                        for simplification (although this practice of numbering should be avoided to begin with).
                        <br></br><br></br>A desired member can also be added to the production here. Their name can be entered in the second column next to 
                        the intended role. If the member is already enrolled, please ensure their name is spelled the same way. Otherwise,
                        a new candidate entity will be created. 
                        <br></br><br></br>
                        Roles <span className="font-medium">CANNOT </span> be empty. 
                    </p>
                    <h1 className="px-3 py-3 text-xl text-gray-900 font-medium rounded-lg shadow-md">Edit the crew roles and desired members below.</h1>

                    <form onSubmit={submit} className="w-fit bg-white box-border p-4 space-y-4">
                        
                        {formFields.map((form, index) => {
                            return (
                                <div key={index} className="w-fit mx-auto overflow-x-scroll grid grid-cols-2 gap-2 border-2 border-slate-200 p-2 rounded-xl">
                                    <div className="flex gap-2 min-w-fit ml-2 mr-4">
                                        <label className="px-3 py-3 text-xl font-medium min-w-fit">Role:</label>
                                        <input 
                                            className="p-2 text-lg rounded-lg bg-slate-50 w-fit"
                                            name="role"
                                            placeholder="Enter a role"
                                            onChange={event => handleFormChange(event, index)}
                                            value={form.role}
                                        />
                                        <input 
                                            className="p-2 text-lg rounded-lg bg-slate-50 w-20"
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
                                            className="p-2 text-lg rounded-lg bg-slate-50 w-fit"
                                            name="member"
                                            placeholder="Empty"
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

                    <label className={`font-medium text-lg text-red-400 ${(error === 200) ? "hidden" : ""}`}>The production could not be edited.</label>

                    <footer className="flex justify-end p-4 space-x-4">
                        <button onClick={submit} disabled={loading} className={`p-4 w-42 font-medium text-lg text-gray-100 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg shadow-md 
                                            hover:shadow-lg hover:bg-gradient-to-r hover:from-green-600 hover:to-emerald-600 ${loading ? "cursor-wait" : ""}
                                            active:bg-gradient-to-r active:from-green-700 active:to-emerald-700`}>
                            Save
                        </button>
                        <button onClick={setVisible} className="p-4 w-32 font-medium text-lg text-center text-gray-100 bg-gradient-to-r from-red-500 to-rose-500 rounded-lg shadow-md 
                                            hover:shadow-lg hover:bg-gradient-to-r hover:from-red-600 hover:to-rose-600 
                                            active:bg-gradient-to-r active:from-red-700 active:to-rose-700">
                            Cancel
                        </button>
                    </footer>

                </div>
            </section>
        </div>
    );
}

function BackgroundOverlay() {
    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 w-screen h-screen p-4 bg-gray-700 bg-opacity-50 flex flex-col justify-center"></div>
    );
}

function CrewMembers({ production, toggle, toggleRemove }) {
    
    const roles = production.roles;
    const members = production.members;
    
    return (
        <section className="box-border border-2 p-4 w-full min-w-fit mx-auto max-h-256 overflow-y-scroll border-white bg-white shadow-md rounded-2xl flex flex-col items-center space-y-4">
            <div className="flex w-full min-w-fit justify-between px-3 py-1 mx-2 rounded-xl">
                <p className="font-semibold text-xl xl:text-2xl">Role</p>
                <p className="font-semibold text-xl xl:text-2xl">Member</p>
            </div>
            {roles && roles.map((role, index) => (
                <div key={index} className="flex w-full min-w-fit justify-between box-border border-2 p-3 mx-2 rounded-lg">
                    <p className="p-2 font-semibold min-w-fit text-lg xl:text-xl">{role}</p>
                    <button onClick={members[index] === "" ? () => toggle(index) : () => toggleRemove(index)} className={`p-2 min-w-fit rounded-lg hover:shadow-md hover:scale-105 active:scale-100 transition-all cursor-pointer
                        ${members[index] === "" 
                        ? "italic font-light text-lg active:bg-slate-100"
                        : "hover:bg-red-100 text-lg lg:text-xl"} `}>{members[index] === "" ? "add member" : members[index]}
                     </button>
                </div>
            ))}
        </section>
    );
}

function RemoveMemberModal({ index, visible, toggleVisible, production }) {
    
    const members = production.members;
    const [loading, setLoading] = useState(false);
    const [candidate, setCandidate] = useState({});

    useEffect(() => {
        const getCandidate = async () => {
            
            let name = members[index];
            if (name.indexOf('(') !== -1) {
                name = name.substring(0, name.indexOf('(') - 1);
            }
            
            const res = await fetch(process.env.API_URL + `/api/candidate/getByName?name=${name}`);
            const data = await res.json();

            setCandidate(data);
        }
        getCandidate().catch(console.error);
    }, [visible]);

    const handleEscPress = (event) => {
        if (visible && event.key === 'Escape') {
            toggleVisible(0);
        }
    };

    const handleDeletePress = (event) => {
        
        setLoading(true);
        event.preventDefault();

        const requestOptions = {
            method: 'PUT'
        }
        fetch(process.env.API_URL + `/api/production/unassign/${production.id}/${candidate.id}/${index}`, requestOptions)
            .then((res) => res.text())
            .catch(err => console.error(err))
            .finally((result) => {
                setLoading(false);
                toggleVisible(0);
            });
    }

    useEffect(() => {
        // Event listener
        document.addEventListener('keydown', handleEscPress);

        // Remove event listener
        return () => {
            document.removeEventListener('keydown', handleEscPress);
        };
    }, [visible]);
    
    return (
        <div className="fixed bottom-0 left-0 right-0 z-10 w-screen h-screen p-4 flex flex-col justify-center items-center">
            <section className="w-128 h-auto bg-white rounded-2xl flex flex-col box-border p-4 shadow-2xl">
                <h1 className="px-3 py-4 font-medium text-2xl text-center">Are you sure you want to remove {members[index]} from this production?</h1>
                <p className="text-lg text-center font-normal px-3 py-2 ">This action cannot be undone.</p>
                <div className="w-full h-auto flex space-x-4 justify-center box-border p-4">
                    {candidate &&
                        <button onClick={(e) => handleDeletePress(e)} className={`p-4 w-fit font-medium text-lg text-gray-100 bg-gradient-to-r from-red-500 to-rose-500 rounded-lg shadow-md 
                                                        hover:shadow-lg hover:bg-gradient-to-r hover:from-red-600 hover:to-rose-600 
                                                        active:bg-gradient-to-r active:from-red-700 active:to-rose-700 ${loading ? 'cursor-wait' : ''}`}>
                            Confirm Deletion
                        </button>
                    }
                    <button onClick={toggleVisible} className="p-4 w-fit font-medium text-lg text-gray-100 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg shadow-md 
                                                    hover:shadow-lg hover:bg-gradient-to-r hover:from-green-600 hover:to-emerald-600 
                                                    active:bg-gradient-to-r active:from-green-700 active:to-emerald-700">
                        Return to Page
                    </button>
                </div>
            </section>
        </div>
    );
}

function AvailableCandidateModal({ production, visible, toggleModal, role, index, prodID }) {
    
    const handleEscPress = (event) => {
        if (visible && event.key === 'Escape') {
            toggleModal(0);
        }
    };

    useEffect(() => {
        // Event listener
        document.addEventListener('keydown', handleEscPress);

        // Remove event listener
        return () => {
            document.removeEventListener('keydown', handleEscPress);
        };
    }, [visible]);
    
    return (
        visible &&
        <div className="fixed bottom-0 left-0 right-0 z-10 w-screen h-screen p-4 bg-gray-700 bg-opacity-50 flex flex-col justify-center items-center">
            <section className="min-w-fit w-1/2 h-3/4 max-h-fit">
                <CandidateTable fetchURL={process.env.API_URL + `/api/candidate/search?assigned=false&actingInterest=false&production=${production}`} mode={'assign'} role={role} index={index} prod={prodID} visible={visible} toggleVisible={toggleModal} />
            </section>
        </div>
    );
}

function ArchiveProductionBox({ prod, visible, setVisible }) {
    return (
        <section className="w-fit min-w-min h-auto shadow-md mx-auto xl:mr-3 my-8 bg-white rounded-2xl flex flex-col">
            <div className="w-full min-w-min h-16 bg-orange-300 rounded-t-2xl shadow-md">
                <h1 className="px-3 py-4 text-gray-900 font-medium text-2xl min-w-fit">{prod.archived ? "Restore" : "Archive"} Production</h1>
            </div>
            <div className="box-border p-4 w-96 h-min rounded-b-2xl bg-orange-100 flex flex-col items-center space-y-6">
                {!prod.archived ?
                <p className="p-2 text-lg text-gray-900 bg-orange-50 rounded-lg">
                    If this is no longer an active production, it can be archived here. 
                    <br></br>
                    <span className="font-semibold">Warning:</span> Reverting this action may produce unexpected results if the candidate set changes, so please ensure that the archival of this production is intentional.
                </p>
                :
                <p className="p-2 text-lg text-gray-900 bg-orange-50 rounded-lg">
                    Restoring this production will bring it back into the list of active productions and remove it from the archive. 
                    <br></br>
                    <span className="font-semibold">Warning:</span> This action is treated as creating a new production. Candidates that do not exist but are listed as crew will be created. 
                </p>
                }
                <button onClick={() => setVisible()} className="p-4 w-fit font-medium text-lg text-gray-100 bg-gradient-to-r from-red-500 to-rose-500 rounded-lg shadow-md 
                                                hover:shadow-lg hover:bg-gradient-to-r hover:from-red-600 hover:to-rose-600 
                                                active:bg-gradient-to-r active:from-red-700 active:to-rose-700">
                    {prod.archived ? "Restore" : "Archive"} Production
                </button>
            </div>
        </section>
    )
}

function DeleteProductionBox({ visible, setVisible }) {
    return (
        <section className="w-fit min-w-min h-auto shadow-md mx-auto xl:ml-3 my-8 bg-white rounded-2xl flex flex-col">
            <div className="w-full min-w-min h-16 bg-red-300 rounded-t-2xl shadow-md">
                <h1 className="px-3 py-4 text-gray-900 font-medium text-2xl min-w-fit">Delete Production</h1>
            </div>
            <div className="box-border p-4 w-96 h-min rounded-b-2xl bg-red-100 flex flex-col items-center space-y-6">
                <p className="p-2 text-lg text-gray-900 bg-red-50 rounded-lg">
                    If this production was created accidentally, or it needs to be removed from the list of active productions, it can be deleted here.
                    <br></br>
                    <span className="font-semibold">Warning:</span> This action cannot be undone, so please ensure that the deletion of this production is intentional.
                </p>
                <button onClick={() => setVisible()} className="p-4 w-fit font-medium text-lg text-gray-100 bg-gradient-to-r from-red-500 to-rose-500 rounded-lg shadow-md 
                                                hover:shadow-lg hover:bg-gradient-to-r hover:from-red-600 hover:to-rose-600 
                                                active:bg-gradient-to-r active:from-red-700 active:to-rose-700">
                    Delete Production
                </button>
            </div>
        </section>
    )
}

function DeleteModal({ id, visible, setVisible }) {
    
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    
    const handleEscPress = (event) => {
        if (visible && event.key === 'Escape') {
            setVisible();
        }
    };

    useEffect(() => {
        // Event listener
        document.addEventListener('keydown', handleEscPress);

        // Remove event listener
        return () => {
            document.removeEventListener('keydown', handleEscPress);
        };
    }, [visible]);

    const handleDeletePress = (e) => {
        
        setLoading(true);
        e.preventDefault();

        const requestOptions = {
            method: 'DELETE'
        }
        fetch(process.env.API_URL + "/api/production/delete/" + id, requestOptions)
            .then((res) => res.text())
            .catch(err => console.error(err))
            .finally((result) => {
                setLoading(false);
                router.push("/productions");
            });
    }
    
    return (
        <div className="fixed bottom-0 left-0 right-0 z-10 w-screen h-screen p-4 flex flex-col justify-center items-center">
            <section className="w-1/4 min-w-min h-auto bg-white rounded-2xl flex flex-col box-border p-4 shadow-2xl">
                <h1 className="px-3 py-4 font-medium text-2xl text-center">Are you sure you want to delete this production?</h1>
                <p className="text-lg text-center font-normal px-3 py-2 ">This action cannot be undone.</p>
                <div className="w-full min-w-fit h-auto flex space-x-4 justify-center box-border p-4">
                    <button onClick={(e) => handleDeletePress(e)} className="p-4 w-fit font-medium text-lg text-gray-100 bg-gradient-to-r from-red-500 to-rose-500 rounded-lg shadow-md 
                                                    hover:shadow-lg hover:bg-gradient-to-r hover:from-red-600 hover:to-rose-600 
                                                    active:bg-gradient-to-r active:from-red-700 active:to-rose-700">
                        Confirm Deletion
                    </button>
                    <button onClick={() => setVisible()} className="p-4 w-fit font-medium text-lg text-gray-100 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg shadow-md 
                                                    hover:shadow-lg hover:bg-gradient-to-r hover:from-green-600 hover:to-emerald-600 
                                                    active:bg-gradient-to-r active:from-green-700 active:to-emerald-700">
                        Return to Page
                    </button>
                </div>
            </section>
        </div>
    );   
}

function ArchiveModal({ prod, id, visible, setVisible }) {
    
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    
    const handleEscPress = (event) => {
        if (visible && event.key === 'Escape') {
            setVisible();
        }
    };

    useEffect(() => {
        // Event listener
        document.addEventListener('keydown', handleEscPress);

        // Remove event listener
        return () => {
            document.removeEventListener('keydown', handleEscPress);
        };
    }, [visible]);

    const handleArchivePress = (e) => {
        
        setLoading(true);
        e.preventDefault();

        const requestOptions = {
            method: 'PUT'
        }
        fetch(process.env.API_URL + `/api/production/${prod.archived ? "restore" : "archive"}/` + id, requestOptions)
            .then((res) => res.text())
            .catch(err => console.error(err))
            .finally((result) => {
                setLoading(false);
                router.push("/productions")
            });
    }
    
    return (
        <div className="fixed bottom-0 left-0 right-0 z-10 w-screen h-screen p-4 flex flex-col justify-center items-center">
            <section className="w-1/4 min-w-min h-auto bg-white rounded-2xl flex flex-col box-border p-4 shadow-2xl">
                <h1 className="px-3 py-4 font-medium text-2xl text-center">Are you sure you want to {prod.archived ? "restore" : "archive"} this production?</h1>
                <p className="text-lg text-center font-normal px-3 py-2 ">This action can be reverted later.</p>
                <div className="w-full min-w-fit h-auto flex space-x-4 justify-center box-border p-4">
                    <button onClick={(e) => handleArchivePress(e)} className="p-4 w-fit font-medium text-lg text-gray-100 bg-gradient-to-r from-red-500 to-rose-500 rounded-lg shadow-md 
                                                    hover:shadow-lg hover:bg-gradient-to-r hover:from-red-600 hover:to-rose-600 
                                                    active:bg-gradient-to-r active:from-red-700 active:to-rose-700">
                        Confirm {prod.archived ? "Restore" : "Archive"}
                    </button>
                    <button onClick={() => setVisible()} className="p-4 w-fit font-medium text-lg text-gray-100 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg shadow-md 
                                                    hover:shadow-lg hover:bg-gradient-to-r hover:from-green-600 hover:to-emerald-600 
                                                    active:bg-gradient-to-r active:from-green-700 active:to-emerald-700">
                        Return to Page
                    </button>
                </div>
            </section>
        </div>
    );   
}