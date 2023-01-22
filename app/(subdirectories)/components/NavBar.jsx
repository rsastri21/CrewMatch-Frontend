import { GrGroup } from "react-icons/gr";
import Link from "next/link";

export default function NavBar() {
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
                <Link href="/candidates" className="px-4 py-2 text-md font-medium bg-slate-100 rounded-md shadow-sm hover:bg-slate-200 hover:shadow-md active:bg-slate-300">Candidates</Link>
                <Link href="/productions" className="px-4 py-2 text-md font-medium bg-slate-100 rounded-md shadow-sm hover:bg-slate-200 hover:shadow-md active:bg-slate-300">Productions</Link>
                <Link href="/login" className="px-4 py-2 text-md font-medium text-slate-100 bg-gray-700 rounded-md shadow-sm hover:bg-gray-600 hover:shadow-md active:bg-slate-800">Log In</Link>
            </ul>
        </nav>
    );
}