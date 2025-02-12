'use client';

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import Image from "next/image";

const GraphDisplay: React.FC = () => {
    const [graphs, setGraphs] = useState<string[]>([]);

    const handleAddGraph = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files[0]) {
            const newGraph = URL.createObjectURL(files[0]);
            setGraphs((prevGraphs) => [...prevGraphs, newGraph]);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <header className="flex justify-between items-center bg-blue-400 p-4 rounded-xl shadow-md">
                <h1 className="text-3xl font-bold text-black">Graphs and Charts</h1>
                <label className="cursor-pointer">
                    <Button variant="outline" className="rounded-xl">Add Graph</Button>
                    <input type="file" accept="image/*" onChange={handleAddGraph} className="hidden" />
                </label>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                {graphs.length === 0 && (
                    <Card className="cursor-pointer shadow-sm rounded-xl">
                        <CardContent className="p-2">
                            {/* Wrap the Image component in an anchor tag to open in a new tab */}
                            <a href="/sample-graph1.jpg" target="_blank" rel="noopener noreferrer">
                                <Image src="/sample-graph1.jpg" alt="Sample Graph 1" width={300} height={200} className="rounded-md" />
                            </a>
                        </CardContent>
                    </Card>
                )}
                {graphs.map((graph, index) => (
                    graph && (
                        <Card key={index} className="cursor-pointer shadow-sm rounded-xl">
                            <CardContent className="p-2">
                                {/* Wrap the Image component in an anchor tag to open in a new tab */}
                                <a href={graph} target="_blank" rel="noopener noreferrer">
                                    <Image src={graph} alt={`Graph ${index + 1}`} width={300} height={200} className="rounded-md" />
                                </a>
                            </CardContent>
                        </Card>
                    )
                ))}
            </div>
        </div>
    );
};

export default GraphDisplay;
