import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import { useKafka } from "./hooks/services/useKafka";

import { ThemeProvider } from "./store/theme.context";
import { KafkaProvider } from "./store/kafka.context";
import { UserProvider } from "./store/user.context";
import { ReportsProvider } from "./store/reports.context";
import { ChatProvider } from "./store/chat.context";

import NotFound from "./components/NotFound";
import ConnectingToServer from "./components/ConnectingToServer";
import ServerUnavailable from "./components/ServerUnavailable";
import { AuthLayout, AuthPages } from "./features/auth/index";
import { DashboardLayout, DashboardPages } from "./features/dashboard";

import "./assets/styles/App.css";

function PageProps({ title, children })
{
	const { isServiceUnavailable, isInitializing } = useKafka();

	useEffect(() => { document.title = `${title} | SaaS Dashboard`; }, [title]);

	if (isInitializing) { return <ConnectingToServer/>; }
	if (isServiceUnavailable()) { return <ServerUnavailable/>; }

	return children;
}

function App()
{
	return (
		<main className="app">
			<ThemeProvider>
				<KafkaProvider>
					<UserProvider>
						<ReportsProvider>
							<ChatProvider>
								<Routes>
									<Route path="/" element={<Navigate to="auth/login" replace/>}/>

									<Route path="auth" element={<AuthLayout/>}>
										<Route path="login" element={<PageProps title="Login"><AuthPages.Login/></PageProps>}/>
										<Route path="register" element={<PageProps title="Register"><AuthPages.Register/></PageProps>}/>
										<Route path="recovery" element={<PageProps title="Recovery"><AuthPages.Recovery/></PageProps>}/>
										<Route path="confirmation" element={<PageProps title="Confirmation"><AuthPages.Confirmation/></PageProps>}/>
										<Route path="new-password" element={<PageProps title="New Password"><AuthPages.NewPassword/></PageProps>}/>
										<Route path="supabase-link"/>
									</Route>

									<Route path="dashboard" element={<DashboardLayout/>}>
										<Route path="home" element={<DashboardPages.Home/>}/>
										<Route path="chat" element={<DashboardPages.Chat/>}/>
										<Route path="calendar" element={<div>Calendar Page</div>}/>
										<Route path="appointments" element={<div>Timelinechart Page</div>}/>
										<Route path="contacts" element={<DashboardPages.Contacts/>}/>
										<Route path="settings" element={<DashboardPages.Settings/>}/>
									</Route>
									
									<Route path="*" element={<NotFound/>}/>
								</Routes>
							</ChatProvider>
						</ReportsProvider>
					</UserProvider>
				</KafkaProvider>
			</ThemeProvider>
		</main>
	);
}

export default App;