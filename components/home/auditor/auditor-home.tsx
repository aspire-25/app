'use client';

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
    AlertDialog, 
    AlertDialogTrigger, 
    AlertDialogContent, 
    AlertDialogHeader, 
    AlertDialogFooter, 
    AlertDialogTitle, 
    AlertDialogDescription, 
    AlertDialogCancel 
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";


const AuditorHome: React.FC = () => {
    const [activeYear, setActiveYear] = useState<string>("2024");
    const [years, setYears] = useState<string[]>(["2022", "2023", "2024"]);
    const [newYearName, setNewYearName] = useState<string>("");
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);  // State for delete confirmation
    const [yearToDelete, setYearToDelete] = useState<string | null>(null);  // Track the year to delete
    const router = useRouter();

    const handleAddNewYear = () => {
        if (newYearName && !years.includes(newYearName)) {
            setYears([...years, newYearName]);
            setActiveYear(newYearName);
            setNewYearName("");
            setIsDialogOpen(false);
        }
    };

    const handleDeleteYear = () => {
        if (yearToDelete) {
            const updatedYears = years.filter(year => year !== yearToDelete);
            setYears(updatedYears);

            // Handle active tab switching if the deleted year was active
            if (activeYear === yearToDelete && updatedYears.length > 0) {
                setActiveYear(updatedYears[updatedYears.length - 1]);
            }
            setIsDeleteDialogOpen(false);  // Close the delete confirmation dialog
            setYearToDelete(null);  // Clear the year to delete
        }
    };

    // Use redirect to navigate when clicking the "Edit Sheet" button
    const handleEditSheet = () => {
        console.log('Redirecting to edit-income-statements');
        router.push('/user/edit-income-statements');  // Use router.push instead of redirect
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <header className="flex justify-between items-center bg-blue-400 p-4 rounded-xl shadow-md">
                <h1 className="text-3xl font-bold text-black">spire</h1>
                <div className="flex items-center gap-4">
                    <Avatar>
                        <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div>
                        <h2 className="text-xl font-bold text-black">John Doe</h2>
                        <p className="text-sm text-gray-700">Auditor</p>
                    </div>
                </div>
            </header>

            <Tabs value={activeYear} onValueChange={(value) => setActiveYear(value)} className="mt-4">
                <TabsList className="flex gap-2 justify-start">
                    {years.map((year) => (
                        <TabsTrigger key={year} value={year} className="rounded-xl">
                            {year}
                        </TabsTrigger>
                    ))}

                    <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <AlertDialogTrigger asChild>
                            <Button variant="outline" className="rounded-xl" onClick={() => setIsDialogOpen(true)}>
                                Add New Year
                            </Button>
                        </AlertDialogTrigger>

                        <AlertDialogContent className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-xl shadow-xl max-w-sm w-full">
                            <AlertDialogCancel 
                                className="absolute top-2 right-2 text-gray-500 hover:text-black cursor-pointer bg-transparent border-none"
                            >
                                ✕
                            </AlertDialogCancel>

                            <AlertDialogHeader>
                                <AlertDialogTitle>Enter the name for the new year tab:</AlertDialogTitle>
                                <AlertDialogDescription>
                                    <Input 
                                        value={newYearName} 
                                        onChange={(e) => setNewYearName(e.target.value)} 
                                        placeholder="New Year Name" 
                                        className="mt-2"
                                    />
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <Button onClick={handleAddNewYear} disabled={!newYearName.trim()}>
                                    Add Year
                                </Button>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </TabsList>

                {years.map((year) => (
                    <TabsContent key={year} value={year}>
                        <div className="mt-4 space-y-4">
                            <Card className="shadow-sm rounded-xl">
                                <CardContent className="p-4 flex justify-between items-center">
                                    <div>
                                        <h3 className="text-2xl font-bold">Income Statement ({year})</h3>
                                        <p className="text-gray-600">30% drop in return rate of Investment</p>
                                    </div>
                                    <Button variant="outline" className="rounded-xl" onClick={handleEditSheet}>
                                        Edit Sheet
                                    </Button>
                                </CardContent>
                            </Card>

                            <Card className="shadow-sm rounded-xl">
                                <CardContent className="p-4 flex justify-between items-center">
                                    <h3 className="text-2xl font-bold">Graphs and Charts ({year})</h3>
                                    <div className="flex gap-2">
                                        <Button variant="outline" className="rounded-xl">Add</Button>
                                        <Button variant="outline" className="rounded-xl">View</Button>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Conditionally show the "Delete Year" button for the active year */}
                            {activeYear === year && (
                                <div className="flex justify-end mt-4">
                                    <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                                        <AlertDialogTrigger asChild>
                                            <Button
                                                variant="outline"
                                                onClick={() => {
                                                    setYearToDelete(year); // Set the year to delete
                                                    setIsDeleteDialogOpen(true); // Open the confirmation dialog
                                                }}
                                                className="text-black border-2 border-black px-4 py-2 rounded-xl"
                                            >
                                                Delete
                                            </Button>
                                        </AlertDialogTrigger>

                                        <AlertDialogContent className="bg-white p-6 rounded-xl shadow-xl">
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Are you sure you want to delete this year?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This action cannot be undone.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                                                    Cancel
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    className="text-red-600"
                                                    onClick={handleDeleteYear}
                                                >
                                                    Confirm Delete
                                                </Button>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            )}
                        </div>
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    );
};

export default AuditorHome;
