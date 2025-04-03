import React, { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/inertia-react';
import TextInput from '@/Components/TextInput';
import $ from 'jquery';
import Common from '@/Include/Common';
import { Search } from "lucide-react";

export default function TabelSearchBox({ s, o, ob, user_id, route, ldap = false }) {
    const { data, setData } = useForm({
        search: s || "",
    });

    const [isMobile, setIsMobile] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        var typingTimer;
        var doneTypingInterval = 1000;
        $('#search').keyup(function () {
            clearTimeout(typingTimer);
            if ($('#search').val) {
                typingTimer = setTimeout(function () {
                    var search = $("#search").val();
                    Common.makeUrlWithSearchAndOrder(route, search, o, ob, user_id, ldap);
                }, doneTypingInterval);
            }
        });
    }, [data.search]);

    return (
        <>
            {isMobile ? (
                <>
                    <button
                        onClick={() => setIsOpen(true)}
                        className="bg-white border p-2 rounded-md text-black mb-2"
                    >
                        <Search size={18} />
                    </button>

                    {isOpen && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
                            <div className="bg-white p-4 rounded-lg shadow-lg w-11/12 max-w-md">
                                <TextInput
                                    id="search"
                                    type="text"
                                    onChange={(e) => setData('search', e.target.value)}
                                    className="mt-1 block w-full form-control"
                                    autoComplete="current-name"
                                    placeholder="Search"
                                    value={data.search}
                                    autoFocus
                                />
                                <button
                                    className="mt-2 w-full bg-gray-400 p-2 rounded-md"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <div className="flex items-center justify-between mb-6 float-start">
                    <TextInput
                        id="search"
                        type="text"
                        onChange={(e) => setData('search', e.target.value)}
                        className="mt-1 block w-full form-control"
                        autoComplete="current-name"
                        placeholder="Search"
                        value={data.search}
                        autoFocus
                    />
                </div>
            )}
        </>
    );
}

