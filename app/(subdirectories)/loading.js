"use client";

export default function Loading() {
    return (
        <>
            <div className="w-screen h-screen bg-gradient-to-r from-slate-100 to-gray-200 flex flex-col items-center">
                <h1 className="text-8xl text-gray-900 animate-bounce my-24">Loading...</h1>
            </div>
        </>
    );
}