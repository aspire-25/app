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
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
    const [yearToDelete, setYearToDelete] = useState<string | null>(null);

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

            if (activeYear === yearToDelete && updatedYears.length > 0) {
                setActiveYear(updatedYears[updatedYears.length - 1]);
            }
            setIsDeleteDialogOpen(false);
            setYearToDelete(null);
        }
    };

    const handleEditSheet = () => {
        console.log('Redirecting to edit-income-statements');
        router.push('/user/edit-income-statements');
    };

    const handleEditGraphs = () => {
        console.log('Redirecting to edit-graphs');
        router.push('/user/edit-graphs');
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <Tabs value={activeYear} onValueChange={(value) => setActiveYear(value)} className="mt-4">
                <TabsList className="flex gap-2 justify-start">
                    {years.map((year) => (
                        <TabsTrigger key={year} value={year} className="rounded-xl hover:bg-blue-200 transition-all">
                            {year}
                        </TabsTrigger>
                    ))}

                    <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <AlertDialogTrigger asChild>
                            <Button 
                                variant="outline" 
                                className="rounded-xl hover:bg-blue-100 transition-all" 
                                onClick={() => setIsDialogOpen(true)}
                            >
                                Add New Year
                            </Button>
                        </AlertDialogTrigger>

                        <AlertDialogContent className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-xl shadow-xl max-w-sm w-full">
                            <AlertDialogCancel className="absolute top-2 right-2 text-gray-500 hover:text-black cursor-pointer bg-transparent border-none">
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
                                <Button 
                                    onClick={handleAddNewYear} 
                                    disabled={!newYearName.trim()} 
                                    className="hover:bg-blue-200 transition-all"
                                >
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
                                    <Button 
                                        variant="outline" 
                                        className="rounded-xl hover:bg-blue-100 transition-all" 
                                        onClick={handleEditSheet}
                                    >
                                        Edit Sheet
                                    </Button>
                                </CardContent>
                            </Card>

                            <Card className="shadow-sm rounded-xl">
                                <CardContent className="p-4 flex justify-between items-center">
                                    <h3 className="text-2xl font-bold">Graphs and Charts ({year})</h3>
                                    <div className="flex gap-2">
                                        <Button 
                                            variant="outline" 
                                            className="rounded-xl hover:bg-blue-100 transition-all" 
                                            onClick={handleEditGraphs}
                                        >
                                            View
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>

                            {activeYear === year && (
                                <div className="flex justify-end mt-4">
                                    <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                                        <AlertDialogTrigger asChild>
                                            <Button
                                                variant="outline"
                                                onClick={() => {
                                                    setYearToDelete(year);
                                                    setIsDeleteDialogOpen(true);
                                                }}
                                                className="text-black border-2 border-black px-4 py-2 rounded-xl hover:bg-gray-100 transition-all"
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
                                                <Button 
                                                    variant="outline" 
                                                    onClick={() => setIsDeleteDialogOpen(false)} 
                                                    className="hover:bg-gray-200 transition-all"
                                                >
                                                    Cancel
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    className="text-red-600 hover:bg-red-200 transition-all"
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
