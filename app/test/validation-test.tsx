'use client';

import React, { useState } from 'react';
import { hasPermission, UserRole, getEditableFields } from '@/lib/access-control';

// Define types for stress test data
interface StressTestData {
  principal: number;
  interestRate: number;
  compoundingFrequency: number;
}

// Local validation functions for testing
const validateStressTestData = (data: StressTestData): { valid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};
  
  // Validate principal
  if (!data.principal || isNaN(data.principal)) {
    errors.principal = 'Principal is required and must be a number';
  } else if (data.principal <= 0) {
    errors.principal = 'Principal must be greater than 0';
  } else if (data.principal > 1000000000) {
    errors.principal = 'Principal is too large';
  }
  
  // Validate interest rate
  if (data.interestRate === undefined || isNaN(data.interestRate)) {
    errors.interestRate = 'Interest rate is required and must be a number';
  } else if (data.interestRate < 0) {
    errors.interestRate = 'Interest rate cannot be negative';
  } else if (data.interestRate > 100) {
    errors.interestRate = 'Interest rate cannot exceed 100%';
  }
  
  // Validate compounding frequency
  if (!data.compoundingFrequency || isNaN(data.compoundingFrequency)) {
    errors.compoundingFrequency = 'Compounding frequency is required and must be a number';
  } else if (data.compoundingFrequency <= 0) {
    errors.compoundingFrequency = 'Compounding frequency must be greater than 0';
  }
  
  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
};
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function ValidationTest() {
  // State for stress test validation
  const [stressTestData, setStressTestData] = useState({
    principal: 50000,
    interestRate: 4.2,
    compoundingFrequency: 1
  });
  const [stressTestErrors, setStressTestErrors] = useState<Record<string, string>>({});

  // State for user role testing
  const [selectedRole, setSelectedRole] = useState<UserRole>('analyst');
  const [permissionToCheck, setPermissionToCheck] = useState<string>('canRunStressTests');
  const [hasPermissionResult, setHasPermissionResult] = useState<boolean | null>(null);
  const [editableFields, setEditableFields] = useState<{ balance: string[], income: string[] }>({ balance: [], income: [] });

  // Handle stress test data change
  const handleStressTestChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = parseFloat(value);
    
    setStressTestData(prev => ({
      ...prev,
      [name]: numValue
    }));
  };

  // Validate stress test data
  const validateStressTest = () => {
    const result = validateStressTestData(stressTestData);
    setStressTestErrors(result.valid ? {} : result.errors);
  };

  // Define type for permission keys
  type PermissionKey = 'canManageUsers' | 'canEditFinancials' | 'canRunStressTests' | 'canViewReports' | 'canEditGreenFields';
  
  // Check permission for selected role
  const checkPermission = () => {
    const result = hasPermission(selectedRole, permissionToCheck as PermissionKey);
    setHasPermissionResult(result);
    
    // Also update editable fields
    setEditableFields(getEditableFields(selectedRole));
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Validation and Access Control Test</h1>
      
      <Tabs defaultValue="validation">
        <TabsList>
          <TabsTrigger value="validation">Form Validation</TabsTrigger>
          <TabsTrigger value="access">Access Control</TabsTrigger>
        </TabsList>
        
        <TabsContent value="validation" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Stress Test Validation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="principal">Principal Amount</Label>
                <Input
                  id="principal"
                  name="principal"
                  type="number"
                  value={stressTestData.principal}
                  onChange={handleStressTestChange}
                  className={stressTestErrors.principal ? 'border-red-500' : ''}
                />
                {stressTestErrors.principal && (
                  <p className="text-red-500 text-xs">{stressTestErrors.principal}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="interestRate">Interest Rate (%)</Label>
                <Input
                  id="interestRate"
                  name="interestRate"
                  type="number"
                  value={stressTestData.interestRate}
                  onChange={handleStressTestChange}
                  className={stressTestErrors.interestRate ? 'border-red-500' : ''}
                />
                {stressTestErrors.interestRate && (
                  <p className="text-red-500 text-xs">{stressTestErrors.interestRate}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="compoundingFrequency">Compounding Frequency</Label>
                <Input
                  id="compoundingFrequency"
                  name="compoundingFrequency"
                  type="number"
                  value={stressTestData.compoundingFrequency}
                  onChange={handleStressTestChange}
                  className={stressTestErrors.compoundingFrequency ? 'border-red-500' : ''}
                />
                {stressTestErrors.compoundingFrequency && (
                  <p className="text-red-500 text-xs">{stressTestErrors.compoundingFrequency}</p>
                )}
              </div>
              
              <Button onClick={validateStressTest}>Validate</Button>
              
              {Object.keys(stressTestErrors).length === 0 && (
                <div className="p-3 bg-green-100 text-green-800 rounded">
                  Validation passed! No errors found.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="access" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Role-Based Access Control</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="role">Select Role</Label>
                <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value as UserRole)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="analyst">Analyst</SelectItem>
                    <SelectItem value="auditor">Auditor</SelectItem>
                    <SelectItem value="executive">Executive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="permission">Permission to Check</Label>
                <Select value={permissionToCheck} onValueChange={setPermissionToCheck}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a permission" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="canManageUsers">Can Manage Users</SelectItem>
                    <SelectItem value="canEditFinancials">Can Edit Financials</SelectItem>
                    <SelectItem value="canRunStressTests">Can Run Stress Tests</SelectItem>
                    <SelectItem value="canViewReports">Can View Reports</SelectItem>
                    <SelectItem value="canEditGreenFields">Can Edit Green Fields</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button onClick={checkPermission}>Check Permission</Button>
              
              {hasPermissionResult !== null && (
                <div className={`p-3 rounded ${hasPermissionResult ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {hasPermissionResult 
                    ? `${selectedRole} has permission to ${permissionToCheck}` 
                    : `${selectedRole} does NOT have permission to ${permissionToCheck}`}
                </div>
              )}
              
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Editable Fields for {selectedRole}</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Balance Sheet Fields:</h4>
                    {editableFields.balance.length > 0 ? (
                      <ul className="list-disc pl-5">
                        {editableFields.balance.map(field => (
                          <li key={field} className="text-green-600">{field}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500 italic">No editable balance sheet fields</p>
                    )}
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Income Statement Fields:</h4>
                    {editableFields.income.length > 0 ? (
                      <ul className="list-disc pl-5">
                        {editableFields.income.map(field => (
                          <li key={field} className="text-green-600">{field}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500 italic">No editable income statement fields</p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
