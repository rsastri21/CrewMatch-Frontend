export default function About() {
    return (
        <div className="w-screen min-h-screen bg-gradient-to-b from-cyan-200 to-sky-300 flex flex-col items-center gap-8 pb-16">
            <h1 className="px-3 py-4 mt-16 text-8xl text-gray-900">About Crew Match</h1>
            <section className="w-fit xl:h-256 px-4 grid sm:grid-cols-1 xl:grid-cols-2 xl:grid-rows-2 gap-6">
                <div className="box-border w-full p-4 h-fit bg-white xl:h-full overflow-y-scroll rounded-2xl shadow-md flex flex-col gap-4 xl:row-span-2">
                    <h1 className="px-3 py-2 text-3xl font-medium">Crew Match is...</h1>
                    <p className="px-3 py-2 text-xl text-gray-600">
                        ...a system to manage the crew of LUX Productions.
                        <br></br> Functionality is divided into 2 major components: Candidates and Productions.
                    </p>
                    <ul className="px-4 py-4 mb-2 text-xl font-medium list-disc shadow-md rounded-xl">The following functionality is available for candidates:
                        <li className="px-3 ml-8 py-2 text-lg font-normal">View information about all candidates. <span className="italic font-light">(Admin and Production Heads)</span></li>
                        <li className="px-3 ml-8 py-2 text-lg font-normal">Edit information about candidates. <span className="italic font-light">(Admin only)</span></li>
                        <li className="px-3 ml-8 py-2 text-lg font-normal">Update CSV Headers for LUX Role Interest Form processing. <span className="italic font-light">(Admin only)</span></li>
                        <li className="px-3 ml-8 py-2 text-lg font-normal">Uploading CSV results from a LUX Role Interest Form. <span className="italic font-light">(Admin only)</span></li>
                    </ul>
                    <ul className="px-4 py-4 text-xl font-medium list-disc shadow-md rounded-xl">The following functionality is available for productions:
                        <li className="px-3 ml-8 py-2 text-lg font-normal">View information about all productions. <span className="italic font-light">(Admin and Production Heads)</span></li>
                        <li className="px-3 ml-8 py-2 text-lg font-normal">Create new productions. <span className="italic font-light">(Admin and Production Heads)</span></li>
                        <li className="px-3 ml-8 py-2 text-lg font-normal">Editing crew/assignments on productions. <span className="italic font-light">(Admin and Production Heads)</span></li>
                        <li className="px-3 ml-16 py-2 text-lg font-normal">Assigning individual crew members.</li>
                        <li className="px-3 ml-16 py-2 text-lg font-normal">Removing individual crew members.</li>
                        <li className="px-3 ml-16 py-2 text-lg font-normal">Viewing members interested in auditioning.</li>
                        <li className="px-3 ml-8 py-2 text-lg font-normal">Obtaining all requested roles from defined productions. <span className="italic font-light">(Admin only)</span></li>
                        <li className="px-3 ml-8 py-2 text-lg font-normal">Executing candidate matching via Crew Match's two provided methods. <span className="italic font-light">(Admin only)</span></li>
                    </ul>
                    <ul className="px-4 py-4 text-xl font-medium list-disc shadow-md rounded-xl">Registered Admins also receive the following functionality:
                        <li className="px-3 ml-8 py-2 text-lg font-normal">Manage users of Crew Match.</li>
                        <li className="px-3 ml-16 py-2 text-lg font-normal">Change permissions levels or assign a user to be a production head.</li>
                        <li className="px-3 ml-8 py-2 text-lg font-normal">Swap members between productions via Swap Requests. <br></br><span className="italic font-light">(Also available to Production Heads)</span></li>
                        <li className="px-3 ml-8 py-2 text-lg font-normal">Export match data to a CSV file.</li>
                        <li className="px-3 ml-8 py-2 text-lg font-normal">Reset the system.</li>
                    </ul>
                </div>
                <div className="box-border px-2 pt-2 pb-4 bg-white w-full h-fit xl:h-full overflow-y-scroll rounded-2xl shadow-md flex flex-col gap-4">
                    <h1 className="px-3 py-2 text-3xl font-medium">Changelog</h1>
                    <div className="w-auto mx-2 h-fit shadow-md rounded-xl flex flex-col gap-2 bg-emerald-100">
                        <div className="flex w-full justify-between bg-emerald-200 rounded-t-xl">
                            <h1 className="px-2 py-2 text-2xl font-medium w-full h-fit">Latest Release: Version 1.1.2</h1>
                            <span className="px-2 py-1 my-auto mr-3 ml-auto rounded-xl bg-red-500 text-slate-100 text-center text-sm font-medium shadow-md">v1.1.2</span>
                        </div>
                        <ul className="px-4 py-2 text-xl list-disc list-inside">Production heads/Admins can add or remove roles after creating a production. Fixed an issue with whitespace in production naming. <br></br>
                        <span className="font-medium">Current known issues are:</span>
                            <li className="px-3 py-2 text-lg">Transitions being broken on some pop-ups.</li>
                            <li className="px-3 py-2 text-lg">Export CSV function occassionally requiring two attempts to initiate <br></br> &nbsp; &nbsp; &nbsp; non-null file download.</li>
                        </ul>
                    </div>
                    <div className="w-auto mx-2 h-fit shadow-md rounded-xl flex flex-col gap-2 bg-slate-100">
                        <div className="flex w-full justify-between bg-slate-200 rounded-t-xl">
                            <h1 className="px-2 py-2 text-2xl font-medium w-full h-fit">Version 1.1.1</h1>
                            <span className="px-2 py-1 my-auto mr-3 ml-auto rounded-xl bg-red-500 text-slate-100 text-center text-sm font-medium shadow-md">v1.1.1</span>
                        </div>
                        <ul className="px-4 py-2 text-xl list-disc list-inside">Production heads/Admins can self-assign as a production lead upon production creation. Fixed an issue with user modification.</ul>
                    </div>
                    <div className="w-auto mx-2 h-fit shadow-md rounded-xl flex flex-col gap-2 bg-slate-100">
                        <div className="flex w-full justify-between bg-slate-200 rounded-t-xl">
                            <h1 className="px-2 py-2 text-2xl font-medium w-full h-fit">Version 1.1.0</h1>
                            <span className="px-2 py-1 my-auto mr-3 ml-auto rounded-xl bg-red-500 text-slate-100 text-center text-sm font-medium shadow-md">v1.1.0</span>
                        </div>
                        <ul className="px-4 py-2 text-xl list-disc list-inside">Productions can now add/remove members that are not yet enrolled. Added missing window close buttons.</ul>
                    </div>
                    <div className="w-auto mx-2 h-fit shadow-md rounded-xl flex flex-col gap-2 bg-slate-100">
                        <div className="flex w-full justify-between bg-slate-200 rounded-t-xl">
                            <h1 className="px-2 py-2 text-2xl font-medium w-full h-fit">Version 1.0.1</h1>
                            <span className="px-2 py-1 my-auto mr-3 ml-auto rounded-xl bg-red-500 text-slate-100 text-center text-sm font-medium shadow-md">v1.0.1</span>
                        </div>
                        <ul className="px-4 py-2 text-xl list-disc list-inside">Bug fixes to improve responsiveness on smaller screens and better Safari compatibility.</ul>
                    </div>
                    <div className="w-auto mx-2 h-fit shadow-md rounded-xl flex flex-col gap-2 bg-slate-100">
                        <div className="flex w-full justify-between bg-slate-200 rounded-t-xl">
                            <h1 className="px-2 py-2 text-2xl font-medium w-full h-fit">Version 1.0.0</h1>
                            <span className="px-2 py-1 my-auto mr-3 ml-auto rounded-xl bg-red-500 text-slate-100 text-center text-sm font-medium shadow-md">v1.0.0</span>
                        </div>
                        <ul className="px-4 py-2 text-xl list-disc list-inside">The official launch of Crew Match! Explore the site and report any issues. <br></br>
                        </ul>
                    </div>
                </div>
                <div className="box-border px-2 pt-2 pb-4 bg-white w-full h-fit xl:h-full overflow-y-scroll rounded-2xl shadow-md flex flex-col gap-2">
                    <h1 className="px-3 py-2 text-3xl font-medium">Technology</h1>
                    <ul className="px-4 py-1 text-xl list-disc list-inside font-medium"> Crew Match makes use of the following technologies under the hood.
                            <li className="px-3 py-2 text-lg font-normal">Back End: A Spring Boot application written in Java hosted on Heroku with Heroku Postgres
                                as the database provider.
                            </li>
                            <li className="px-3 py-2 text-lg font-normal">Front End: A NextJS application built with React, JavaScript, and TailwindCSS hosted on Vercel.</li>
                    </ul>
                    <p className="px-3 py-2 text-xl font-medium">The source code is available at the following links:</p>
                    <div className="w-full justify-center space-x-4 flex">
                        <a href="https://github.com/rsastri21/CrewMatch-Frontend" className="px-3 py-3 text-xl bg-slate-100 font-medium shadow-md rounded-xl hover:scale-105 hover:shadow-lg hover:cursor-pointer
                         active:scale-100 transition-all">Front End GitHub</a>
                         <a href="https://github.com/rsastri21/CrewMatch" className="px-3 py-3 text-xl bg-slate-100 font-medium shadow-md rounded-xl hover:scale-105 hover:shadow-lg hover:cursor-pointer
                         active:scale-100 transition-all">Back End GitHub</a>
                    </div>
                </div>
                
            </section>
            
        </div>
    );
}