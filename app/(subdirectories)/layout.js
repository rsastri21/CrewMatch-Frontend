import NavBar from "./components/NavBar";

export default function AppLayout({ children }) {
    return (
        <>
            <NavBar />
            {children}
        </>
    )
}