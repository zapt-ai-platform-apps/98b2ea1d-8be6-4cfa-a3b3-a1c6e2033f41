import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthProvider from './modules/auth/components/AuthProvider';
import AuthGuard from './modules/auth/components/AuthGuard';
import LoginPage from './modules/auth/components/LoginPage';
import UnauthorizedPage from './modules/auth/components/UnauthorizedPage';
import NavBar from './shared/components/NavBar';
import Footer from './shared/components/Footer';
import DashboardSelector from './modules/dashboard/components/DashboardSelector';

export default function App() {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <AuthProvider>
                <Routes>
                    {/* Public routes */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/unauthorized" element={<UnauthorizedPage />} />
                    
                    {/* Protected routes - requires authentication */}
                    <Route element={<AuthGuard />}>
                        <Route
                            path="/"
                            element={<Navigate to="/dashboard" replace />}
                        />
                        
                        <Route
                            path="/dashboard"
                            element={
                                <div className="flex flex-col flex-grow">
                                    <NavBar />
                                    <main className="flex-grow py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
                                        <DashboardSelector />
                                    </main>
                                    <Footer />
                                </div>
                            }
                        />
                        
                        {/* Role-specific routes */}
                        <Route element={<AuthGuard requiredRoles={['assessor', 'admin']} />}>
                            <Route
                                path="/assessor"
                                element={
                                    <div className="flex flex-col flex-grow">
                                        <NavBar />
                                        <main className="flex-grow py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
                                            {/* Assessor-specific content would go here */}
                                            <Navigate to="/dashboard" replace />
                                        </main>
                                        <Footer />
                                    </div>
                                }
                            />
                        </Route>
                        
                        <Route element={<AuthGuard requiredRoles={['iqa', 'admin']} />}>
                            <Route
                                path="/iqa"
                                element={
                                    <div className="flex flex-col flex-grow">
                                        <NavBar />
                                        <main className="flex-grow py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
                                            {/* IQA-specific content would go here */}
                                            <Navigate to="/dashboard" replace />
                                        </main>
                                        <Footer />
                                    </div>
                                }
                            />
                        </Route>
                        
                        <Route element={<AuthGuard requiredRoles={['employer', 'admin']} />}>
                            <Route
                                path="/employer"
                                element={
                                    <div className="flex flex-col flex-grow">
                                        <NavBar />
                                        <main className="flex-grow py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
                                            {/* Employer-specific content would go here */}
                                            <Navigate to="/dashboard" replace />
                                        </main>
                                        <Footer />
                                    </div>
                                }
                            />
                        </Route>
                        
                        <Route element={<AuthGuard requiredRoles={['admin']} />}>
                            <Route
                                path="/admin"
                                element={
                                    <div className="flex flex-col flex-grow">
                                        <NavBar />
                                        <main className="flex-grow py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
                                            {/* Admin-specific content would go here */}
                                            <Navigate to="/dashboard" replace />
                                        </main>
                                        <Footer />
                                    </div>
                                }
                            />
                        </Route>
                    </Route>
                    
                    {/* Fallback route */}
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
            </AuthProvider>
        </div>
    );
}