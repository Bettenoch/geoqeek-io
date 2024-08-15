"use client"
import { useState } from "react";
import Image from "next/image";
import { FaRegPaperPlane } from "react-icons/fa";
import Loader from "./Loader";
export default function Avatar() {


    const [value, setValue] = useState<string>("");
    const [firstName, setFirstName] = useState<string>("");
    const [lastName, setLastName] = useState<string>("");
    const [loading, setLoading] = useState<boolean | undefined>(false);
    const [url, setUrl] = useState<string>("");
    const [characters, setCharacters] = useState<string>("");
    const [copyStatus, setCopyStatus] = useState(false);

    const onCopyText = () => {
        setCopyStatus(true);
        setTimeout(() => setCopyStatus(false), 2000); // Reset status after 2 seconds
    }
    const handleCharacters = () => {
        const char = firstName + " " + lastName + " "
        setCharacters(char)
    }
    const handlePrompt = async (e: any) => {
        e.preventDefault()
        setLoading(true)
        try {
            const response = await fetch('/api/dalle3', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: value }), // send the string as a JSON object
            });
            // Handle success, such as updating UI or showing a success message
            if (response.ok) {
                const data = await response.json();
                setUrl(data.image_url)
                setValue("")
                handleCharacters()
            }
        } catch (error) {
            // Handle network errors or other exceptions
            console.error('Error uploading file:', error);
        }
    };
    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <h1 className="relative text-3xl font-semibold capitalize ">
                Avatar image manager
            </h1>



            {url &&
                <div className="flex flex-col items-center justify-center">
                    <div className="flex justify-center items-center gap-4">
                        <Image src={url} onLoadingComplete={() => setLoading(false)} width={192} height={192} alt="ai image" />
                        {!loading && <h1 className="text-4xl ">{characters}</h1>}
                    </div>
                </div>
            }
            {/* ... //input */}
            <div className="grid grid-cols-2 gap-2">
                <input type="text" placeholder="First Name" name="value" onChange={(e) => { setFirstName(e.target.value) }} className="bg-gray-100 placeholder:text-gray-400 disabled:cursor-not-allowed border border-gray-500 text-gray-900 text-sm rounded-lg block p-3.5 mr-2 w-[290px]" required />
                <input type="text" placeholder="Last Name" name="value" onChange={(e) => { setLastName(e.target.value) }} className="bg-gray-100 placeholder:text-gray-400 disabled:cursor-not-allowed border border-gray-500 text-gray-900 text-sm rounded-lg block p-3.5 mr-2 w-[290px]" required />
            </div>
            <div className="flex items-center justify-between">
                <input type="text" placeholder="Enter an image prompt" name="value" onChange={(e) => { setValue(e.target.value) }} className="bg-gray-100 placeholder:text-gray-400 disabled:cursor-not-allowed border border-gray-500 text-gray-900 text-sm rounded-lg block p-3.5 mr-2 w-[600px]" required />
                <button className="text-white bg-blue-700 font-medium rounded-lg text-sm transition-all sm:w-auto px-5 py-3 text-center" onClick={handlePrompt}>
                    {loading ? <Loader /> : "Send"}
                </button>
            </div>
        </main>
    )
}
