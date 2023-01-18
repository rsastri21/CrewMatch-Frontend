import { GrStatusInfoSmall } from "react-icons/gr";

async function getProductionCount() {

    let productionCount = 0;

    const res = await fetch('http://localhost:8080/api/production/getCount', { cache: "no-store" })
                        .then(response => response.text())
                        .then(result => {
                            productionCount = parseInt(result);
                        });
    
    return productionCount;
}

async function getProductions() {
    
    let productions;

    const res = await fetch('http://localhost:8080/api/production/get', { cache: "no-store" })
                        .then(response => response.json())
                        .then(result => {
                            productions = result;
                        });
    
    const prodNames = [];
    for (let i = 0; i < productions.length; i++) {
        prodNames[i] = { name: productions[i].name, director: productions[i].members[0] };
    }
    return prodNames;
}

export default async function ProductionCard() {
    
    const productionsData = getProductions();
    const countData = getProductionCount();

    // Wait for promises to resolve
    const [productions, count] = await Promise.all([productionsData, countData]);
    
    return (
        <div className="box-border w-96 h-min min-w-fit mx-auto md:ml-4 bg-white rounded-2xl shadow-md">
            <div className="bg-white h-16 w-full rounded-t-2xl drop-shadow-md flex justify-between">
                <h1 className="px-3 py-4 font-md text-2xl">Productions</h1>
                <h1 className="fixed top-0 right-0 mr-2 mt-2 py-2 px-4 font-md text-2xl bg-gradient-to-r from-red-600 to-rose-500
                            rounded-lg text-slate-50 shadow-md">{count}</h1>
            </div>
            <div className="box-border p-2 w-full min-h-4 h-auto bg-white rounded-b-2xl flex flex-col items-left">
             {count === 0 ? <h1 className="px-3 py-4 font-md text-lg">No productions created.</h1> :
                productions.map(production => (
                    <h3 key={production.name} className="px-4 py-2 text-md">
                        <span className="italic font-medium">{production.name}</span>, directed by {production.director}
                    </h3>
             ))}
            </div>
        </div>
    );
}