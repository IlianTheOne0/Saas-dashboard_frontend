import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import { useTheme } from "./hooks/useTheme";

import { ThemeProvider } from "./store/theme.context";
import { KafkaProvider } from "./store/kafka.context";

import NotFound from "./components/NotFound";
import { AuthLayout, AuthPages } from "./features/auth/index";

import "./assets/styles/App.css";
import { UserProvider } from "./store/user.context";

function ThemeToggleButton()
{
	const { toggleTheme } = useTheme();
	
	return (<button onClick={toggleTheme} style={{position: "absolute", top: "0", right: "0", zIndex: "1000"}}>Toggle</button>);
}

function PageProps({ title, children })
{
	useEffect(() => { document.title = `${title} | SaaS Dashboard`; }, [title]);
	return children;
}

function App()
{
	return (
		<main className="app">
			<ThemeProvider>
				<KafkaProvider>
					<UserProvider>
						<ThemeToggleButton/>

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

							<Route path="dashboard"/>

							<Route path="*" element={<NotFound/>}/>
						</Routes>
					</UserProvider>
				</KafkaProvider>
			</ThemeProvider>
		</main>
	);
}

export default App;