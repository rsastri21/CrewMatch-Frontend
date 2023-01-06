import { GrGroup } from "react-icons/gr";

export default function NavBar() {
    return (
        <nav className="py-3 w-full max-h-min flex sticky shadow-md justify-between rounded-b-lg">
            <div className="flex mx-8 rounded-lg hover:bg-slate-200 hover:shadow-md">
                <GrGroup className="w-8 h-8 mx-2 mt-1"/>
                <a href="/" className="px-2 font-semibold text-3xl">
                    Crew Match
                </a>
            </div>
            
            <ul className="flex items-center mr-8 space-x-4">
                <a className="px-4 py-2 text-md font-medium bg-slate-100 rounded-md shadow-sm hover:bg-slate-200 hover:shadow-md">About</a>
                <a className="px-4 py-2 text-md font-medium bg-slate-100 rounded-md shadow-sm hover:bg-slate-200 hover:shadow-md">Candidates</a>
                <a className="px-4 py-2 text-md font-medium bg-slate-100 rounded-md shadow-sm hover:bg-slate-200 hover:shadow-md">Productions</a>
            </ul>
        </nav>
    );
}