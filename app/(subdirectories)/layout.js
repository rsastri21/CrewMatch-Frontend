import NavBar from "./components/NavBar";
import Loading from "./loading";
import { Suspense } from "react";

export default function AppLayout({ children }) {
    return (
        <>
            <NavBar />
            <Suspense fallback={<Loading />} >
                {children}
            </Suspense>
        </>
    )
}