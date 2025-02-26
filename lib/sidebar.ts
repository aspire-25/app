import { LucideProps, NotebookPen } from "lucide-react";
import React from "react";

export type SidebarMenuItem = {
    title: string;
    name: string;
    url: string;
};

export type SidebarMenuSection = {
    role: string;
    title: string;
    url: string;
    icon: React.FC<LucideProps>;
    isActive: boolean;
    items: SidebarMenuItem[];
};

const SIDEBAR_SECTIONS: SidebarMenuSection[] = [
    {
        role: "disabled",
        title: "Home",
        url: "/user",
        icon: NotebookPen,
        isActive: false,
        items: [
            {
                title: "Home",
                name: 'home',
                url: '/user',
            }
        ]
    },
    {
        role: 'all',
        title: 'Auditor',
        url: '/user/financials',
        icon: NotebookPen,
        isActive: true,
        items: [
            {
                title: "Statement Editor",
                name: 'editor',
                url: "/user/financials",
            },
            {
                title: "Statement Visualizer",
                name: 'visualizer',
                url: "/user/visualizer",
            },
            {
                title: "Edit Income Statements",
                name: 'edit-income-statements',
                url: "/user/edit-income-statements",
            }
        ]
    },
    {
        role: 'admin',
        title: 'Test',
        url: '/user/input-data',
        icon: NotebookPen,
        isActive: true,
        items: [
            {
                title: "Input Data",
                name: 'input-data',
                url: "/user/input-data",
            },
            {
                title: "View Data",
                name: 'view-data',
                url: "/user/view-data",
            }
        ]
    }
];

export const getTab = (name: string): string => {
    for (const section of SIDEBAR_SECTIONS) {
        const item = section.items.find(item => item.name === name);
        if (item) {
            return item.title;
        }
    }
    return '';
};

export const getTabUrl = (name: string): string => {
    for (const section of SIDEBAR_SECTIONS) {
        const item = section.items.find(item => item.name === name);
        if (item) {
            return item.url;
        }
    }
    return '';
};

export const doesTabExist = (name: string): boolean => {
    return SIDEBAR_SECTIONS.some(section => 
        section.items.some(item => item.name === name)
    );
};

export const getFilteredSidebarSections = (role: string): SidebarMenuSection[] => {
    return SIDEBAR_SECTIONS.filter(
        (section) => section.role === "all" || section.role === role
    );
};
